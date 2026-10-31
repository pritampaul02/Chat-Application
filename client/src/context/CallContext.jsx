import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useSocketContext } from "./socketContext";
import { notificationService } from "../utils/notification";

const CallContext = createContext(null);

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
    ],
    iceCandidatePoolSize: 10,
};

export const CallContextProvider = ({ children }) => {
    const { socket } = useSocketContext();

    // Call state: 'idle' | 'calling' | 'incoming' | 'connected'
    const [callState, setCallState] = useState("idle");
    const [callType, setCallType] = useState("voice"); // 'voice' | 'video'
    const [callPartner, setCallPartner] = useState(null); // { id, name, avatar }
    const [incomingSignal, setIncomingSignal] = useState(null);
    const [callDuration, setCallDuration] = useState(0);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Group Call State
    const [groupCallActive, setGroupCallActive] = useState(false);
    const [groupRoomId, setGroupRoomId] = useState(null);
    const [groupParticipants, setGroupParticipants] = useState([]);
    const [groupRemoteStreams, setGroupRemoteStreams] = useState({}); // { socketId: MediaStream }

    // Media streams
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const groupPeersRef = useRef({}); // { socketId: RTCPeerConnection }
    const durationIntervalRef = useRef(null);
    const screenStreamRef = useRef(null);
    // Queue candidates arriving before remoteDescription is ready
    const iceCandidatesQueueRef = useRef([]);

    // Update localStreamRef whenever localStream changes
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    // Timer for call duration
    useEffect(() => {
        if (callState === "connected") {
            setCallDuration(0);
            durationIntervalRef.current = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        } else {
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }
        }
        return () => {
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
            }
        };
    }, [callState]);

    // Helper: acquire user media stream
    const getMediaStream = async (type = "voice") => {
        try {
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
                video:
                    type === "video"
                        ? {
                              width: { ideal: 1280 },
                              height: { ideal: 720 },
                              facingMode: "user",
                          }
                        : false,
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setLocalStream(stream);
            return stream;
        } catch (err) {
            console.error("Failed to access media devices:", err);
            // Fallback: try audio only
            if (type === "video") {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
                    setLocalStream(audioStream);
                    return audioStream;
                } catch (e) {
                    console.error("Audio fallback failed:", e);
                }
            }
            return null;
        }
    };

    // Clean up streams and peer connection
    const cleanupCall = useCallback(() => {
        notificationService.stopRingtone();
        iceCandidatesQueueRef.current = [];
        if (pcRef.current) {
            try {
                pcRef.current.onicecandidate = null;
                pcRef.current.ontrack = null;
                pcRef.current.onconnectionstatechange = null;
                pcRef.current.oniceconnectionstatechange = null;
                pcRef.current.close();
            } catch (e) {
                console.debug("PC close error:", e);
            }
            pcRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((track) => track.stop());
            screenStreamRef.current = null;
        }
        setRemoteStream(null);
        setCallState("idle");
        setCallPartner(null);
        setIncomingSignal(null);
        setIsMuted(false);
        setIsVideoOff(false);
        setIsScreenSharing(false);
    }, []);

    // Helper to drain queued ICE candidates
    const drainQueuedCandidates = async (pc) => {
        if (!pc || !pc.remoteDescription) return;
        const queue = [...iceCandidatesQueueRef.current];
        iceCandidatesQueueRef.current = [];
        for (const candidate of queue) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.warn("Error adding queued ICE candidate:", err);
            }
        }
    };

    // Helper to configure common RTCPeerConnection event handlers
    const setupPeerConnectionEvents = (pc, targetUserId) => {
        // When remote stream tracks arrive
        pc.ontrack = (event) => {
            console.log("Remote track received:", event.streams[0]);
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };

        // ICE candidate generation
        pc.onicecandidate = (event) => {
            if (event.candidate && targetUserId) {
                socket?.emit("call:ice-candidate", {
                    to: targetUserId,
                    candidate: event.candidate,
                });
            }
        };

        // Connection state tracking
        pc.onconnectionstatechange = () => {
            console.log("WebRTC connectionState:", pc.connectionState);
            if (pc.connectionState === "connected") {
                setCallState("connected");
            } else if (pc.connectionState === "failed") {
                console.warn("Connection failed, attempting ICE restart...");
                if (typeof pc.restartIce === "function") {
                    pc.restartIce();
                } else {
                    cleanupCall();
                }
            } else if (
                pc.connectionState === "disconnected" ||
                pc.connectionState === "closed"
            ) {
                cleanupCall();
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log("WebRTC iceConnectionState:", pc.iceConnectionState);
            if (
                pc.iceConnectionState === "connected" ||
                pc.iceConnectionState === "completed"
            ) {
                setCallState("connected");
            } else if (pc.iceConnectionState === "failed") {
                if (typeof pc.restartIce === "function") {
                    pc.restartIce();
                }
            }
        };
    };

    // Clean up group call
    const cleanupGroupCall = useCallback(() => {
        Object.values(groupPeersRef.current).forEach((peer) => peer.close());
        groupPeersRef.current = {};
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }
        setGroupCallActive(false);
        setGroupRoomId(null);
        setGroupParticipants([]);
        setGroupRemoteStreams({});
    }, []);

    // 1-on-1 Call: Start Call
    const startCall = async ({
        userToCall,
        userName,
        userAvatar,
        type = "voice",
    }) => {
        if (!socket) return;
        iceCandidatesQueueRef.current = [];
        setCallType(type);
        setCallPartner({ id: userToCall, name: userName, avatar: userAvatar });
        setCallState("calling");

        const stream = await getMediaStream(type);
        if (!stream) {
            alert(
                "Could not access camera/microphone. Please allow browser permissions."
            );
            setCallState("idle");
            return;
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Configure event handlers
        setupPeerConnectionEvents(pc, userToCall);

        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            let myUser = {};
            try {
                myUser =
                    JSON.parse(sessionStorage.getItem("myUser")) ||
                    JSON.parse(localStorage.getItem("myUser")) ||
                    {};
            } catch (e) {
                console.debug(e);
            }

            socket.emit("call:initiate", {
                userToCall,
                signalData: offer,
                callType: type,
                callerName: myUser?.name || "Friend",
                callerAvatar: myUser?.profile_pic?.url || null,
            });
        } catch (err) {
            console.error("Create offer error:", err);
            cleanupCall();
        }
    };

    // 1-on-1 Call: Accept incoming call
    const acceptCall = async () => {
        if (!socket || !incomingSignal || !callPartner) return;
        notificationService.stopRingtone();

        const stream = await getMediaStream(callType);
        if (!stream) {
            alert("Could not access camera/microphone.");
            rejectCall();
            return;
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setupPeerConnectionEvents(pc, callPartner.id);

        try {
            await pc.setRemoteDescription(
                new RTCSessionDescription(incomingSignal)
            );
            // Drain any candidates received while phone was ringing
            await drainQueuedCandidates(pc);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("call:accept", {
                to: callPartner.id,
                signal: answer,
            });
            setCallState("connected");
        } catch (err) {
            console.error("Accept call error:", err);
            cleanupCall();
        }
    };

    // 1-on-1 Call: Reject call
    const rejectCall = () => {
        if (socket && callPartner) {
            socket.emit("call:reject", { to: callPartner.id });
        }
        cleanupCall();
    };

    // 1-on-1 Call: End ongoing call
    const endCall = () => {
        if (socket && callPartner) {
            socket.emit("call:end", { to: callPartner.id });
        }
        cleanupCall();
    };

    // Toggle Mute Audio
    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    // Toggle Camera Video
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    // Toggle Screen Sharing
    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream =
                    await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                    });
                screenStreamRef.current = screenStream;
                const screenTrack = screenStream.getVideoTracks()[0];

                if (pcRef.current) {
                    const senders = pcRef.current.getSenders();
                    const videoSender = senders.find(
                        (s) => s.track && s.track.kind === "video"
                    );
                    if (videoSender) {
                        videoSender.replaceTrack(screenTrack);
                    } else {
                        pcRef.current.addTrack(screenTrack, screenStream);
                    }
                }

                screenTrack.onended = () => {
                    stopScreenSharing();
                };

                setIsScreenSharing(true);
            } catch (err) {
                console.error("Screen share error:", err);
            }
        } else {
            stopScreenSharing();
        }
    };

    const stopScreenSharing = () => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((track) => track.stop());
            screenStreamRef.current = null;
        }
        if (localStreamRef.current && pcRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            const senders = pcRef.current.getSenders();
            const videoSender = senders.find(
                (s) => s.track && s.track.kind === "video"
            );
            if (videoSender && videoTrack) {
                videoSender.replaceTrack(videoTrack);
            }
        }
        setIsScreenSharing(false);
    };

    // ===============================================
    // Group Call Methods
    // ===============================================
    const joinGroupCall = async (roomId, user) => {
        if (!socket) return;
        setGroupRoomId(roomId);
        setGroupCallActive(true);

        const stream = await getMediaStream("video");
        if (!stream) {
            alert("Could not access camera/microphone for group call.");
            return;
        }

        socket.emit("group-call:join", { roomId, user });
    };

    const leaveGroupCall = () => {
        if (socket && groupRoomId) {
            socket.emit("group-call:leave", { roomId: groupRoomId });
        }
        cleanupGroupCall();
    };

    // Socket listeners for 1-on-1 and Group Calls
    useEffect(() => {
        if (!socket) return;

        // Incoming call received
        const handleIncomingCall = ({
            signal,
            from,
            callerName,
            callerAvatar,
            callType,
        }) => {
            console.log(`Incoming ${callType} call from ${callerName} (${from})`);
            setCallPartner({ id: from, name: callerName, avatar: callerAvatar });
            setIncomingSignal(signal);
            setCallType(callType || "voice");
            setCallState("incoming");
            notificationService.startRingtone();

            notificationService.showCallNotification({
                callerName,
                callerAvatar,
                callType,
                from,
                onAccept: () => {
                    acceptCall();
                },
                onReject: () => {
                    rejectCall();
                },
            });
        };

        // Call accepted by peer
        const handleCallAccepted = async ({ signal }) => {
            console.log("Call accepted by peer!");
            if (pcRef.current && signal) {
                try {
                    await pcRef.current.setRemoteDescription(
                        new RTCSessionDescription(signal)
                    );
                    setCallState("connected");
                    // Drain candidates that arrived before remoteDescription was accepted
                    await drainQueuedCandidates(pcRef.current);
                } catch (err) {
                    console.error("Set remote description on accepted error:", err);
                }
            }
        };

        // ICE candidate received
        const handleIceCandidate = async ({ candidate }) => {
            if (!candidate) return;
            const pc = pcRef.current;
            if (pc && pc.remoteDescription && pc.remoteDescription.type) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.warn("Add ICE candidate error:", err);
                }
            } else {
                // Queue until remoteDescription is set!
                iceCandidatesQueueRef.current.push(candidate);
            }
        };

        // Call rejected, ended, or unavailable
        const handleCallRejected = () => {
            alert("Call declined.");
            cleanupCall();
        };

        const handleCallEnded = () => {
            cleanupCall();
        };

        const handleCallUnavailable = ({ reason }) => {
            alert(reason || "User is currently unavailable.");
            cleanupCall();
        };

        const handleCallBusy = ({ reason }) => {
            alert(reason || "User is currently busy on another call.");
            cleanupCall();
        };

        // Group calling listeners
        const handleAllParticipants = (participants) => {
            setGroupParticipants(participants);
        };

        const handleUserJoined = (newParticipant) => {
            setGroupParticipants((prev) => {
                if (prev.find((p) => p.socketId === newParticipant.socketId))
                    return prev;
                return [...prev, newParticipant];
            });
        };

        const handleUserLeft = ({ socketId }) => {
            setGroupParticipants((prev) =>
                prev.filter((p) => p.socketId !== socketId)
            );
            setGroupRemoteStreams((prev) => {
                const next = { ...prev };
                delete next[socketId];
                return next;
            });
            if (groupPeersRef.current[socketId]) {
                groupPeersRef.current[socketId].close();
                delete groupPeersRef.current[socketId];
            }
        };

        socket.on("call:incoming", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("call:ice-candidate", handleIceCandidate);
        socket.on("call:rejected", handleCallRejected);
        socket.on("call:ended", handleCallEnded);
        socket.on("call:unavailable", handleCallUnavailable);
        socket.on("call:busy", handleCallBusy);

        socket.on("group-call:all-participants", handleAllParticipants);
        socket.on("group-call:user-joined", handleUserJoined);
        socket.on("group-call:user-left", handleUserLeft);

        return () => {
            socket.off("call:incoming", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("call:ice-candidate", handleIceCandidate);
            socket.off("call:rejected", handleCallRejected);
            socket.off("call:ended", handleCallEnded);
            socket.off("call:unavailable", handleCallUnavailable);
            socket.off("call:busy", handleCallBusy);

            socket.off("group-call:all-participants", handleAllParticipants);
            socket.off("group-call:user-joined", handleUserJoined);
            socket.off("group-call:user-left", handleUserLeft);
        };
    }, [socket, cleanupCall]);

    // Handle incoming notification actions (Accept / Reject) from Service Worker
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        const handleSwMessage = (event) => {
            const { type, data } = event.data || {};
            if (type === "CALL_ACCEPTED_FROM_NOTIFICATION") {
                if (callState === "incoming") {
                    acceptCall();
                } else if (data?.from) {
                    startCall({
                        userToCall: data.from,
                        userName: data.callerName || "Friend",
                        userAvatar: data.callerAvatar,
                        type: data.callType || "voice",
                    });
                }
            } else if (type === "CALL_REJECTED_FROM_NOTIFICATION") {
                rejectCall();
            }
        };

        navigator.serviceWorker.addEventListener("message", handleSwMessage);
        return () => {
            navigator.serviceWorker.removeEventListener("message", handleSwMessage);
        };
    }, [callState, acceptCall, rejectCall, startCall]);

    // Handle deep-link / URL query parameters from notification click (?acceptCall=true)
    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("acceptCall") === "true") {
                const type = urlParams.get("type") || "voice";
                const pathParts = window.location.pathname.split("/chat/");
                const targetUserId = pathParts[1];

                // Remove the query param from URL without reloading
                window.history.replaceState({}, document.title, window.location.pathname);

                if (targetUserId) {
                    const timer = setTimeout(() => {
                        if (callState === "incoming") {
                            acceptCall();
                        } else {
                            startCall({
                                userToCall: targetUserId,
                                userName: "Friend",
                                type,
                            });
                        }
                    }, 800);
                    return () => clearTimeout(timer);
                }
            }
        } catch (e) {
            console.debug("acceptCall URL handler error:", e);
        }
    }, [socket, callState, acceptCall, startCall]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <CallContext.Provider
            value={{
                callState,
                callType,
                callPartner,
                callDuration: formatDuration(callDuration),
                localStream,
                remoteStream,
                isMuted,
                isVideoOff,
                isScreenSharing,
                startCall,
                acceptCall,
                rejectCall,
                endCall,
                toggleMute,
                toggleVideo,
                toggleScreenShare,
                // Group calling
                groupCallActive,
                groupRoomId,
                groupParticipants,
                groupRemoteStreams,
                joinGroupCall,
                leaveGroupCall,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCall must be used within a CallContextProvider");
    }
    return context;
};

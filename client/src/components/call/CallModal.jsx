import React, { useEffect, useRef } from "react";
import { useCall } from "../../context/CallContext";
import {
    Phone,
    PhoneOff,
    Video,
    VideoOff,
    Mic,
    MicOff,
    Monitor,
    Maximize2,
    Minimize2,
    Users,
} from "lucide-react";

const CallModal = () => {
    const {
        callState,
        callType,
        callPartner,
        callDuration,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        isScreenSharing,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
    } = useCall();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Bind local stream to local video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, callState]);

    // Bind remote stream to remote video element
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, callState]);

    if (callState === "idle") return null;

    // 1. Incoming Call Dialog
    if (callState === "incoming") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn">
                <div className="relative bg-slate-900/90 border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl flex flex-col items-center">
                    {/* Ringing ambient pulse */}
                    <div className="relative mb-6">
                        <div className="absolute -inset-4 rounded-full bg-[#00A1FF]/30 animate-ping" />
                        <div className="absolute -inset-2 rounded-full bg-[#00A1FF]/50 animate-pulse" />
                        <img
                            src={callPartner?.avatar || "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"}
                            alt={callPartner?.name}
                            className="relative w-28 h-28 rounded-full object-cover border-4 border-[#00A1FF] shadow-xl"
                        />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1">{callPartner?.name || "Friend"}</h3>
                    <p className="text-sm text-[#00A1FF] font-medium mb-8">
                        Incoming {callType === "video" ? "Video" : "Voice"} Call...
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-center gap-8 w-full">
                        <button
                            onClick={rejectCall}
                            title="Decline Call"
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition-transform group-hover:scale-110 active:scale-95">
                                <PhoneOff size={28} />
                            </div>
                            <span className="text-xs text-slate-300 font-medium">Decline</span>
                        </button>

                        <button
                            onClick={acceptCall}
                            title="Accept Call"
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#00A1FF] hover:bg-[#008fe6] flex items-center justify-center text-white shadow-lg shadow-[#00A1FF]/30 transition-transform group-hover:scale-110 active:scale-95 animate-bounce">
                                <Phone size={28} />
                            </div>
                            <span className="text-xs text-slate-300 font-medium">Accept</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Outgoing (Calling) or Connected Call View
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden animate-fadeIn">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={callPartner?.avatar || "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"}
                            alt={callPartner?.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-600"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-white text-base leading-tight">{callPartner?.name}</h4>
                        <p className="text-xs text-[#00A1FF] font-mono">
                            {callState === "calling" ? "Ringing..." : callDuration}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur px-3 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>End-to-End P2P</span>
                </div>
            </div>

            {/* Video Streams Container */}
            <div className="flex-1 relative w-full h-full flex items-center justify-center bg-slate-950">
                {callType === "video" ? (
                    <>
                        {/* Remote Stream (Full Screen) */}
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="relative">
                                    <div className="absolute -inset-4 rounded-full bg-[#00A1FF]/20 animate-pulse" />
                                    <img
                                        src={callPartner?.avatar || "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"}
                                        alt={callPartner?.name}
                                        className="relative w-32 h-32 rounded-full object-cover border-4 border-[#00A1FF]/40"
                                    />
                                </div>
                                <p className="text-slate-400 text-sm">
                                    {callState === "calling" ? "Calling..." : "Connecting video stream..."}
                                </p>
                            </div>
                        )}

                        {/* Local Stream (Picture-in-Picture) */}
                        <div className="absolute bottom-24 right-6 w-36 h-48 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-slate-700/70 shadow-2xl bg-slate-900 z-10 transition-all">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                            />
                            {isVideoOff && (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 text-xs">
                                    <VideoOff size={24} className="mb-1" />
                                    <span>Camera Off</span>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Voice Call Interface */
                    <div className="flex flex-col items-center justify-center gap-6">
                        {/* Audio Wave Concentric Rings */}
                        <div className="relative">
                            <div className="absolute -inset-8 rounded-full bg-[#00A1FF]/15 animate-ping" />
                            <div className="absolute -inset-4 rounded-full bg-[#00A1FF]/25 animate-pulse" />
                            <img
                                src={callPartner?.avatar || "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"}
                                alt={callPartner?.name}
                                className="relative w-36 h-36 rounded-full object-cover border-4 border-[#00A1FF] shadow-2xl"
                            />
                        </div>

                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">{callPartner?.name}</h2>
                            <p className="text-lg text-[#00A1FF] font-mono tracking-wider">
                                {callState === "calling" ? "Connecting..." : callDuration}
                            </p>
                        </div>

                        {/* Hidden audio element for remote stream in voice call */}
                        <audio ref={remoteVideoRef} autoPlay playsInline />
                    </div>
                )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 sm:gap-6 py-6 px-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                {/* Toggle Microphone */}
                <button
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                    className={`p-4 rounded-full transition-transform active:scale-95 shadow-lg cursor-pointer ${
                        isMuted
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : "bg-slate-800/80 text-white hover:bg-slate-700/80 border border-slate-700/50"
                    }`}
                >
                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                {/* Toggle Camera (if video call) */}
                {callType === "video" && (
                    <button
                        onClick={toggleVideo}
                        title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                        className={`p-4 rounded-full transition-transform active:scale-95 shadow-lg cursor-pointer ${
                            isVideoOff
                                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                : "bg-slate-800/80 text-white hover:bg-slate-700/80 border border-slate-700/50"
                        }`}
                    >
                        {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                    </button>
                )}

                {/* Toggle Screen Share (video calls) */}
                {callType === "video" && (
                    <button
                        onClick={toggleScreenShare}
                        title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
                        className={`p-4 rounded-full transition-transform active:scale-95 shadow-lg cursor-pointer ${
                            isScreenSharing
                                ? "bg-[#00A1FF] text-white shadow-[#00A1FF]/40"
                                : "bg-slate-800/80 text-white hover:bg-slate-700/80 border border-slate-700/50"
                        }`}
                    >
                        <Monitor size={22} />
                    </button>
                )}

                {/* End Call */}
                <button
                    onClick={endCall}
                    title="End Call"
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-red-600/40 cursor-pointer"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

export default CallModal;

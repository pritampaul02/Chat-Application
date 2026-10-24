import React, { useRef, useEffect } from "react";
import { useCall } from "../../context/CallContext";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Users, Monitor } from "lucide-react";

const GroupCallModal = () => {
    const {
        groupCallActive,
        groupRoomId,
        groupParticipants,
        localStream,
        isMuted,
        isVideoOff,
        toggleMute,
        toggleVideo,
        leaveGroupCall,
    } = useCall();

    const localVideoRef = useRef(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, groupCallActive]);

    if (!groupCallActive) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#00A1FF]/20 text-[#00A1FF]">
                        <Users size={22} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-white">Group Call Room</h3>
                        <p className="text-xs text-slate-400">
                            {groupParticipants.length + 1} participant{groupParticipants.length > 0 ? "s" : ""}
                        </p>
                    </div>
                </div>

                <div className="bg-[#00A1FF]/10 border border-[#00A1FF]/30 px-3 py-1 rounded-full text-xs text-[#00A1FF] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00A1FF] animate-pulse" />
                    <span>Live WebRTC Mesh</span>
                </div>
            </div>

            {/* Grid of video / participant tiles */}
            <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {/* Local user tile */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center min-h-[220px]">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                    />
                    {isVideoOff && (
                        <div className="flex flex-col items-center justify-center text-slate-500">
                            <Users size={48} className="mb-2" />
                            <span className="text-sm font-medium">You (Camera Off)</span>
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
                        <span>You</span>
                        {isMuted && <MicOff size={12} className="text-red-400" />}
                    </div>
                </div>

                {/* Other participants */}
                {groupParticipants.map((p) => (
                    <div
                        key={p.socketId}
                        className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center min-h-[220px]"
                    >
                        <img
                            src={p.profile_pic?.url || "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"}
                            alt={p.name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-[#00A1FF]/40 mb-3 shadow-lg"
                        />
                        <span className="text-base font-semibold text-white">{p.name}</span>
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-medium text-white">
                            {p.name}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-center gap-6 py-5 px-6 bg-slate-900 border-t border-slate-800">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-transform active:scale-95 shadow-lg cursor-pointer ${
                        isMuted
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                    }`}
                >
                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-transform active:scale-95 shadow-lg cursor-pointer ${
                        isVideoOff
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                    }`}
                >
                    {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                </button>

                <button
                    onClick={leaveGroupCall}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <PhoneOff size={22} />
                </button>
            </div>
        </div>
    );
};

export default GroupCallModal;

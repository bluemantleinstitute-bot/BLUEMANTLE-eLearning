"use client";

import { useState, useEffect } from "react";
import { Video, ExternalLink, AlertCircle, CheckCircle2, Users, Clock, Shield, Wifi } from "lucide-react";

interface ZoomMeetingProps {
  meetingNumber: string;
  password?: string;
  userName: string;
  userEmail: string;
  role: number; // 0 for student, 1 for teacher
  leaveUrl: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  topic?: string;
  duration?: number;
}

export default function ZoomMeetingSDK({
  meetingNumber,
  password,
  userName,
  userEmail,
  role,
  leaveUrl,
  zoomJoinUrl,
  zoomStartUrl,
  topic,
  duration,
}: ZoomMeetingProps) {
  const [launched, setLaunched] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const isHost = role === 1;
  const zoomUrl = isHost ? (zoomStartUrl || zoomJoinUrl) : zoomJoinUrl;

  const handleLaunch = () => {
    if (!zoomUrl) return;
    window.open(zoomUrl, "_blank", "noopener,noreferrer");
    setLaunched(true);
    // Start a 3-second countdown then mark as active
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown(c => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (!zoomUrl) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#0a0a0f]">
        <div className="p-10 text-center max-w-md bg-red-950/30 border border-red-500/20 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Meeting Link Available</h2>
          <p className="text-gray-400 text-sm mb-6">
            The Zoom meeting link for this session has not been generated yet. Please contact your administrator.
          </p>
          <a href={leaveUrl} className="inline-block px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors text-sm font-bold">
            ← Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className={`w-2 h-2 rounded-full ${launched ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
            {isHost ? "Host Session" : "Student Session"} · {launched ? "Meeting Active" : "Ready to Launch"}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          {/* Top colored bar */}
          <div className={`h-1.5 w-full ${isHost ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"}`} />

          <div className="p-10">
            {/* Icon */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto ${
              launched
                ? "bg-green-500/20 border border-green-500/30"
                : isHost
                ? "bg-blue-500/20 border border-blue-500/30"
                : "bg-emerald-500/20 border border-emerald-500/30"
            }`}>
              {launched
                ? <CheckCircle2 className={`w-10 h-10 ${isHost ? "text-green-400" : "text-green-400"}`} />
                : <Video className={`w-10 h-10 ${isHost ? "text-blue-400" : "text-emerald-400"}`} />
              }
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight">
              {launched ? "Meeting Launched!" : isHost ? "Start Your Class" : "Join Live Class"}
            </h1>
            {topic && (
              <p className="text-center text-gray-400 text-sm mb-8">{topic}</p>
            )}
            {!topic && (
              <p className="text-center text-gray-500 text-sm mb-8">
                {launched
                  ? "Your Zoom meeting is open in a new tab."
                  : isHost
                  ? "You are the host. Click below to open Zoom and begin the session."
                  : "Click below to open Zoom and join your live class."}
              </p>
            )}

            {/* Info pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" />
                {isHost ? "Host" : "Participant"}
              </div>
              {meetingNumber && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Wifi className="w-3.5 h-3.5" />
                  Meeting {meetingNumber}
                </div>
              )}
              {duration && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {duration} mins
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                Encrypted
              </div>
            </div>

            {/* User info */}
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{userName}</p>
                <p className="text-gray-500 text-xs">{userEmail}</p>
              </div>
              <div className="ml-auto">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${
                  isHost ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {isHost ? "Host" : "Student"}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            {!launched ? (
              <button
                onClick={handleLaunch}
                className={`w-full py-5 rounded-2xl font-black text-lg tracking-tight flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl ${
                  isHost
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/50"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/50"
                }`}
              >
                <ExternalLink className="w-5 h-5" />
                {isHost ? "Launch Meeting Room" : "Join Meeting Room"}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="w-full py-5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 bg-green-500/20 border border-green-500/30 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Zoom is open in a new tab
                </div>
                <button
                  onClick={handleLaunch}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Re-open Zoom
                </button>
              </div>
            )}

            {/* Back link */}
            <div className="text-center mt-6">
              <a href={leaveUrl} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                ← Return to Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-700 mt-6">
          Zoom opens in a separate window. Keep this tab open for the Mission Control dashboard.
        </p>
      </div>
    </div>
  );
}

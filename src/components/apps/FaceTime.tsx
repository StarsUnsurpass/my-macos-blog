import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: "Online" | "Offline" | "Busy";
}

const CONTACTS: Contact[] = [
  { id: "vanessa", name: "Vanessa", avatar: "V", color: "bg-pink-500", status: "Online" },
  { id: "jake", name: "Jake", avatar: "J", color: "bg-blue-500", status: "Online" },
  { id: "kathleen", name: "Kathleen", avatar: "K", color: "bg-purple-500", status: "Offline" },
];

export default function FaceTime() {
  const [activeCall, setActiveCall] = useState<Contact | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const startCall = (contact: Contact) => {
    if (contact.status === "Offline") return;
    setActiveCall(contact);
  };

  return (
    <div className="flex h-full text-white select-none overflow-hidden font-sans bg-[#1a1a1b]">
      {/* Sidebar */}
      <div className="w-72 bg-white/2 backdrop-blur-3xl border-r border-black/30 flex flex-col py-6 shrink-0 z-10">
        <div className="px-6 mb-8 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">FaceTime</div>
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <span className="i-material-symbols:add text-xl" />
          </button>
        </div>

        <div className="px-3 space-y-4">
           {/* Create Link button */}
           <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center space-x-3 hover:bg-white/10 transition-all cursor-default group shadow-sm">
              <div className="size-10 rounded-full bg-green-600/20 flex items-center justify-center text-green-500">
                <span className="i-material-symbols:link text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-bold">Create Link</span>
                <span className="text-[11px] opacity-40">Share with anyone</span>
              </div>
           </div>

           <div className="space-y-1">
             <div className="px-3 text-[10px] font-bold opacity-30 uppercase tracking-widest mb-2">Recents</div>
             {CONTACTS.map(contact => (
               <div 
                 key={contact.id} 
                 onClick={() => startCall(contact)}
                 className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-150 cursor-default group ${
                   activeCall?.id === contact.id ? "bg-white/10 ring-1 ring-white/10" : "hover:bg-white/5"
                 }`}
               >
                 <div className={`size-10 rounded-full ${contact.color} flex items-center justify-center text-sm font-bold shadow-md ring-1 ring-white/10 relative`}>
                    {contact.avatar}
                    {contact.status === "Online" && (
                      <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-[#1a1a1b]" />
                    )}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[14px] font-bold">{contact.name}</span>
                    <span className="text-[11px] opacity-40 uppercase tracking-tight">{contact.status} · FaceTime</span>
                 </div>
                 <span className="i-material-symbols:videocam text-xl opacity-0 group-hover:opacity-40 ml-auto transition-opacity" />
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Main Content (Camera / Call View) */}
      <div className="flex-1 relative flex flex-col bg-black overflow-hidden shadow-inner">
        <AnimatePresence mode="wait">
          {!activeCall ? (
            <motion.div 
              key="camera-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="size-full flex flex-col"
            >
              <div className="flex-1 relative">
                {!isCamOff ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    mirrored={true}
                    screenshotFormat="image/jpeg"
                    className="size-full object-cover opacity-80"
                  />
                 ) : (
                  <div className="size-full bg-black flex items-center justify-center">
                    <span className="i-material-symbols:videocam-off-outline text-8xl opacity-10" />
                  </div>
                 )}
                {/* Overlay Text */}
                <div className="absolute inset-x-0 bottom-24 flex flex-col items-center text-center px-12 pointer-events-none">
                   <h2 className="text-xl font-bold text-white/90">Your Camera is Ready</h2>
                   <p className="text-sm text-white/40 mt-1 max-w-sm">Connect with friends and family using HD video and High Fidelity audio.</p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="absolute bottom-6 inset-x-0 flex items-center justify-center">
                 <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl flex items-center space-x-2 shadow-2xl ring-1 ring-white/5">
                    <button 
                      onClick={() => setIsCamOff(!isCamOff)}
                      className={`p-3 rounded-xl transition-all ${isCamOff ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/60"}`}
                    >
                      <span className={`${isCamOff ? "i-material-symbols:videocam-off-outline" : "i-material-symbols:videocam-outline"} text-2xl`} />
                    </button>
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-xl transition-all ${isMuted ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/60"}`}
                    >
                      <span className={`${isMuted ? "i-material-symbols:mic-off-outline" : "i-material-symbols:mic-outline"} text-2xl`} />
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-1" />
                    <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-600/20 transition-all flex items-center space-x-2">
                       <span className="i-material-symbols:add-call text-lg" />
                       <span>New FaceTime</span>
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="active-call"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="size-full bg-[#1a1a1b] flex flex-col items-center justify-center"
            >
               {/* Caller ID Card */}
               <div className="flex flex-col items-center space-y-6">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`size-32 rounded-full ${activeCall.color} flex items-center justify-center text-5xl font-bold shadow-2xl ring-4 ring-white/10`}
                  >
                    {activeCall.avatar}
                  </motion.div>
                  <div className="text-center">
                     <h2 className="text-3xl font-bold tracking-tight">{activeCall.name}</h2>
                     <p className="text-blue-400 font-medium mt-1 animate-pulse italic">Calling...</p>
                  </div>
               </div>

               {/* In-Call Controls */}
               <div className="absolute bottom-10 flex items-center space-x-6">
                  <div className="flex flex-col items-center space-y-2 group">
                    <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-xl">
                       <span className="i-material-symbols:mic-outline text-2xl text-white/80" />
                    </button>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-40 transition-opacity">Mute</span>
                  </div>
                  <button 
                    onClick={() => setActiveCall(null)}
                    className="p-6 rounded-full bg-red-600 hover:bg-red-500 transition-all shadow-2xl shadow-red-600/40"
                  >
                     <span className="i-material-symbols:call-end text-3xl" />
                  </button>
                  <div className="flex flex-col items-center space-y-2 group">
                    <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-xl">
                       <span className="i-material-symbols:videocam-outline text-2xl text-white/80" />
                    </button>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-40 transition-opacity">Cam</span>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

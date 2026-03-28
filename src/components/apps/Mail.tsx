import React, { useState } from "react";
import { useStore } from "~/stores";
import { motion, AnimatePresence } from "framer-motion";

interface Email {
  id: string;
  sender: string;
  avatar: string;
  color: string;
  subject: string;
  date: string;
  content: string;
  read: boolean;
  folder: "inbox" | "sent" | "trash" | "archive";
  flagged?: boolean;
}

const INITIAL_EMAILS: Email[] = [
  { 
    id: "apple-1",
    sender: "Apple", 
    avatar: "A",
    color: "bg-blue-500",
    subject: "Welcome to your new Mac", 
    date: "9:41 AM", 
    content: "We're glad you're here. Explore the new features of macOS Sequoia. From Stage Manager to the new Dock effects, there's so much to discover.\n\nBest,\nApple Support", 
    read: false,
    folder: "inbox"
  },
  { 
    id: "jake-1",
    sender: "Jake", 
    avatar: "J",
    color: "bg-orange-500",
    subject: "Project Update", 
    date: "Yesterday", 
    content: "The new icons look amazing! I really love the glassmorphism effect we added to the tooltips. Let's sync tomorrow at 10 AM to discuss the next steps.\n\n- Jake", 
    read: true,
    folder: "inbox",
    flagged: true
  },
  { 
    id: "github-1",
    sender: "GitHub", 
    avatar: "G",
    color: "bg-gray-800",
    subject: "Security Alert", 
    date: "Monday", 
    content: "A new sign-in was detected on your account from a new device in San Francisco, CA. If this was you, you can ignore this email. Otherwise, please reset your password immediately.", 
    read: true,
    folder: "inbox"
  }
];

export default function Mail() {
  const dark = useStore((state) => state.dark);
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [selectedId, setSelectedId] = useState(INITIAL_EMAILS[0]?.id || "");
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "trash" | "archive" | "flagged">("inbox");
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredEmails = emails.filter(e => {
    const matchesFolder = activeFolder === "flagged" ? e.flagged : e.folder === activeFolder;
    const matchesSearch = e.sender.toLowerCase().includes(search.toLowerCase()) || 
                         e.subject.toLowerCase().includes(search.toLowerCase()) || 
                         e.content.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });
  
  // Safer selection logic
  const selectedEmail = emails.find(e => e.id === selectedId) || filteredEmails[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const toggleFlag = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEmails(prev => prev.map(mail => mail.id === id ? { ...mail, flagged: !mail.flagged } : mail));
  };

  const deleteEmail = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: "trash" } : e));
    if (selectedId === id) setSelectedId("");
  };

  const handleSend = () => {
    if (!composeData.to || !composeData.subject) return;
    const newMail: Email = {
      id: Math.random().toString(),
      sender: "Me",
      avatar: "M",
      color: "bg-green-500",
      subject: composeData.subject,
      date: "Just Now",
      content: composeData.body,
      read: true,
      folder: "sent"
    };
    setEmails([newMail, ...emails]);
    setIsComposing(false);
    setComposeData({ to: "", subject: "", body: "" });
  };

  const unreadCount = emails.filter(e => e.folder === "inbox" && !e.read).length;
  const flaggedCount = emails.filter(e => e.flagged).length;

  const sidebarItems = [
    { id: "inbox", label: "Inbox", icon: "i-material-symbols:inbox-outline", count: unreadCount },
    { id: "flagged", label: "Flagged", icon: "i-material-symbols:flag-outline", count: flaggedCount, color: "text-orange-500" },
    { id: "sent", label: "Sent", icon: "i-material-symbols:send-outline" },
    { id: "trash", label: "Trash", icon: "i-material-symbols:delete-outline" },
  ];

  return (
    <div className={`flex h-full select-none overflow-hidden font-sans transition-colors duration-300 ${dark ? "bg-[#1e1e1f] text-white" : "bg-[#f5f5f7] text-black"}`}>
      {/* Sidebar */}
      <div className={`w-52 border-r flex flex-col py-6 shrink-0 ${dark ? "bg-black/20 border-black/30" : "bg-white/50 border-black/5"}`}>
        <div className="px-5 mb-8 flex items-center justify-between">
          <div className="text-[11px] font-bold opacity-30 uppercase tracking-widest px-2">Mailboxes</div>
          <button 
            onClick={() => setIsComposing(true)}
            className="p-1.5 rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all outline-none"
          >
             <span className="i-material-symbols:edit-outline text-lg" />
          </button>
        </div>
        <div className="px-2 space-y-1">
          {sidebarItems.map(item => (
            <div 
              key={item.id}
              onClick={() => {
                setActiveFolder(item.id as any);
                // Reset selection if new folder is empty or current selection not in it
                const folderMails = emails.filter(e => item.id === "flagged" ? e.flagged : e.folder === item.id);
                if (folderMails.length > 0 && !folderMails.some(m => m.id === selectedId)) {
                  setSelectedId(folderMails[0].id);
                }
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-default transition-all ${
                activeFolder === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "hover:bg-black/5 dark:hover:bg-white/5 opacity-70"
              }`}
            >
              <div className="flex items-center space-x-3 text-[14px]">
                <span className={`${item.icon} text-lg ${(item as any).color || ""}`} />
                <span className="font-bold tracking-tight">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[11px] font-bold px-2 rounded-full ${activeFolder === item.id ? "bg-white/20" : "bg-black/10 dark:bg-white/10"}`}>{item.count}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className={`w-80 border-r flex flex-col shrink-0 ${dark ? "bg-black/10 border-black/30" : "bg-white border-black/5"}`}>
        <div className={`h-14 border-b flex items-center px-5 shrink-0 justify-between ${dark ? "border-black/20" : "border-black/5"}`}>
           <div className="flex items-center space-x-2">
              <span className="font-extrabold text-[18px] capitalize tracking-tight">{activeFolder}</span>
              {isRefreshing && <span className="i-svg-spinners:ring-resize text-xs opacity-40 animate-spin" />}
           </div>
           <button 
             onClick={handleRefresh}
             className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-all active:scale-95"
           >
              <span className={`i-material-symbols:refresh text-lg opacity-40 ${isRefreshing ? "animate-spin" : ""}`} />
           </button>
        </div>
        
        {/* Search Bar */}
        <div className={`px-4 py-2 border-b ${dark ? "border-black/10" : "border-black/5"}`}>
           <div className={`flex items-center px-3 py-1.5 rounded-lg border transition-all ${dark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"} focus-within:ring-2 ring-blue-500/50`}>
              <span className="i-material-symbols:search text-lg opacity-30 mr-2" />
              <input 
                type="text" 
                placeholder="Search" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full font-bold placeholder:opacity-40"
              />
              {search && (
                <button onClick={() => setSearch("")} className="opacity-40 hover:opacity-100">
                   <span className="i-material-symbols:close text-xs" />
                </button>
              )}
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
           {filteredEmails.length > 0 ? filteredEmails.map((mail) => (
             <div 
                key={mail.id} 
                onClick={() => handleSelect(mail.id)}
                className={`p-5 border-b flex flex-col cursor-default transition-all relative ${
                   dark ? "border-black/10" : "border-black/5"
                } ${
                  selectedId === mail.id 
                    ? "bg-blue-600/10 dark:bg-blue-600/20 shadow-[inset_3px_0_0_rgba(59,130,246,0.8)]" 
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
             >
                <div className="flex justify-between items-start mb-1">
                   <div className="flex items-center space-x-2">
                      {!mail.read && <div className="size-2 bg-blue-500 rounded-full shadow-lg" />}
                      <span className="font-extrabold text-[15px] truncate max-w-[140px] tracking-tight">{mail.sender}</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      {mail.flagged && <span className="i-material-symbols:flag text-xs text-orange-500" />}
                      <span className="text-[11px] opacity-40 font-bold">{mail.date}</span>
                   </div>
                </div>
                <div className="text-[13.5px] font-extrabold mb-1 truncate line-clamp-1 opacity-90">{mail.subject}</div>
                <div className="text-[13px] line-clamp-2 leading-relaxed opacity-40 font-bold tracking-tight">{mail.content}</div>
                
                <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => toggleFlag(e, mail.id)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md">
                      <span className={`i-material-symbols:flag-outline text-xs ${mail.flagged ? "text-orange-500" : ""}`} />
                   </button>
                </div>
             </div>
           )) : (
             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-10">
                <span className="text-sm font-bold italic">No Messages</span>
             </div>
           )}
        </div>
      </div>

      {/* Content View */}
      <div className={`flex-1 flex flex-col overflow-hidden ${dark ? "bg-[#1a1a1b]" : "bg-white"}`}>
         <AnimatePresence mode="wait">
            {isComposing ? (
               <motion.div 
                 key="compose"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0 }}
                 className="flex-1 flex flex-col"
               >
                  <div className={`h-14 border-b flex items-center justify-between px-6 shrink-0 ${dark ? "bg-[#2d2d2e]/50 border-black/20" : "bg-[#f6f6f6] border-black/5"}`}>
                     <span className="font-bold text-sm opacity-60">New Message</span>
                     <div className="flex items-center space-x-4">
                        <button onClick={() => setIsComposing(false)} className="text-sm font-bold opacity-40 hover:opacity-100">Cancel</button>
                        <button 
                          onClick={handleSend}
                          className="px-6 py-1.5 bg-blue-500 text-white rounded-full text-sm font-black shadow-xl shadow-blue-500/30 disabled:opacity-30 active:scale-95 transition-all"
                          disabled={!composeData.to || !composeData.subject}
                        >
                           Send
                        </button>
                     </div>
                  </div>
                  <div className="flex-1 p-8 space-y-6">
                     <div className="flex items-center border-b dark:border-white/5 border-black/5 pb-3">
                        <span className="w-16 text-sm font-bold opacity-30">To:</span>
                        <input 
                           type="text" 
                           value={composeData.to}
                           onChange={e => setComposeData({...composeData, to: e.target.value})}
                           className="flex-1 bg-transparent outline-none font-bold"
                        />
                     </div>
                     <div className="flex items-center border-b dark:border-white/5 border-black/5 pb-3">
                        <span className="w-16 text-sm font-bold opacity-30">Subject:</span>
                        <input 
                           type="text" 
                           value={composeData.subject}
                           onChange={e => setComposeData({...composeData, subject: e.target.value})}
                           className="flex-1 bg-transparent outline-none font-bold"
                        />
                     </div>
                     <textarea 
                        value={composeData.body}
                        onChange={e => setComposeData({...composeData, body: e.target.value})}
                        className="w-full h-full bg-transparent outline-none font-medium leading-relaxed resize-none"
                        placeholder="Message Body"
                     />
                  </div>
               </motion.div>
            ) : selectedEmail ? (
               <motion.div 
                 key={selectedEmail.id}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex-1 flex flex-col"
               >
                  <div className={`h-14 border-b flex items-center justify-between px-6 shrink-0 ${dark ? "bg-[#2d2d2e]/50 border-black/20" : "bg-[#f6f6f6] border-black/5"}`}>
                    <div className="flex items-center space-x-10 text-xl opacity-60">
                       <span className="i-material-symbols:reply text-xl cursor-default hover:opacity-100 transition-opacity" />
                       <span className="i-material-symbols:reply-all text-xl cursor-default hover:opacity-100 transition-opacity" />
                       <span className="i-material-symbols:forward text-xl cursor-default hover:opacity-100 transition-opacity" />
                       <button onClick={() => deleteEmail(selectedEmail.id)} className="text-red-500 hover:opacity-100 transition-opacity">
                         <span className="i-material-symbols:delete-outline" />
                       </button>
                    </div>
                  </div>
                  <div className="flex-1 p-12 overflow-y-auto no-scrollbar">
                     <div className="mb-12">
                       <h1 className="text-3xl font-black mb-10 tracking-tight">{selectedEmail.subject}</h1>
                       <div className="flex items-center justify-between border-b pb-8 dark:border-white/5 border-black/5">
                          <div className="flex items-center space-x-5">
                             <div className={`size-12 rounded-2xl ${selectedEmail.color} flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
                               {selectedEmail.avatar}
                             </div>
                             <div>
                               <div className="font-extrabold text-[17px] tracking-tight">{selectedEmail.sender}</div>
                               <div className="text-[12px] opacity-40 font-bold">To: Me &lt;ace@example.com&gt;</div>
                             </div>
                          </div>
                          <div className="text-[12px] opacity-30 font-black uppercase tracking-widest">{selectedEmail.date}</div>
                       </div>
                     </div>
                     <div className="text-[16px] leading-[1.8] opacity-80 whitespace-pre-wrap font-bold max-w-2xl">
                       {selectedEmail.content}
                     </div>
                  </div>
               </motion.div>
            ) : (
               <div className="flex-1 flex items-center justify-center text-center">
                  <div className="opacity-10 flex flex-col items-center">
                    <span className="i-material-symbols:mail-outline text-9xl mb-6" />
                    <span className="text-2xl font-black italic">Select a Message</span>
                  </div>
               </div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}

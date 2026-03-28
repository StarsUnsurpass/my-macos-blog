import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "me" | "them";
  content: string;
  time: string;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  color: string;
  history: Message[];
}

const INITIAL_CHATS: Chat[] = [
  {
    id: "vanessa",
    name: "Vanessa",
    avatar: "V",
    color: "bg-pink-500",
    history: [
      { sender: "them", content: "Hey! Are we still on for dinner?", time: "2:45 PM" },
      { sender: "me", content: "Yes! See you at 7? ❤️", time: "2:46 PM" },
      { sender: "them", content: "Great! Can't wait.", time: "2:47 PM" },
    ]
  },
  {
    id: "jake",
    name: "Jake",
    avatar: "J",
    color: "bg-blue-500",
    history: [
      { sender: "them", content: "Spaces are better than tabs.", time: "Yesterday" },
      { sender: "me", content: "You're wrong and you know it.", time: "Yesterday" },
    ]
  },
  {
    id: "kathleen",
    name: "Kathleen",
    avatar: "K",
    color: "bg-purple-500",
    history: [
      { sender: "them", content: "He's so cute! 😍", time: "Monday" },
      { sender: "me", content: "Show me the pic!", time: "Monday" },
    ]
  }
];

export default function Messages() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeId, setActiveId] = useState("vanessa");
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeId) || chats[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat.history]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      sender: "me",
      content: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(chat => 
      chat.id === activeId 
        ? { ...chat, history: [...chat.history, newMessage] }
        : chat
    ));
    setInputText("");
  };

  return (
    <div className="flex h-full text-white select-none overflow-hidden bg-[#1e1e1f]">
      {/* Sidebar */}
      <div className="w-72 bg-white/5 backdrop-blur-3xl border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 flex flex-col space-y-3">
           <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold opacity-30 uppercase tracking-widest">Messages</span>
              <span className="i-material-symbols:edit-square-outline-rounded text-lg opacity-60 hover:opacity-100 cursor-default" />
           </div>
           <div className="flex items-center space-x-2 bg-black/30 border border-white/5 rounded-lg px-2.5 py-1.5 focus-within:ring-1 ring-blue-500/50 transition-all">
             <span className="i-bx:search text-white/30" />
             <input 
               className="bg-transparent border-none outline-none text-[13px] w-full placeholder-white/30" 
               placeholder="Search" 
             />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
          {chats.map((chat) => {
            const lastMsg = chat.history[chat.history.length - 1];
            return (
              <div 
                key={chat.id} 
                onClick={() => setActiveId(chat.id)}
                className={`mx-2 p-3 flex space-x-3 rounded-xl transition-all duration-150 cursor-default relative group ${
                  activeId === chat.id ? "bg-blue-600 shadow-lg shadow-blue-900/20" : "hover:bg-white/5"
                }`}
              >
                <div className={`size-12 rounded-full ${chat.color} flex items-center justify-center text-lg font-bold shadow-md ring-1 ring-white/10 shrink-0`}>
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={`font-bold text-[14px] ${activeId === chat.id ? "text-white" : "text-white/90"}`}>
                      {chat.name}
                    </span>
                    <span className={`text-[11px] ${activeId === chat.id ? "text-white/70" : "opacity-40"}`}>
                      {lastMsg.time}
                    </span>
                  </div>
                  <div className={`text-[12.5px] truncate ${activeId === chat.id ? "text-white/90" : "opacity-50"}`}>
                    {lastMsg.sender === "me" ? "You: " : ""}{lastMsg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col relative bg-transparent shadow-[inset_1px_0_0_0_rgba(255,255,255,0.05)]">
        <div className="h-14 border-b border-white/5 flex items-center px-6 bg-white/2 backdrop-blur-md sticky top-0 z-10">
           <div className="flex items-center space-x-3">
              <div className={`size-8 rounded-full ${activeChat.color} flex items-center justify-center text-xs font-bold ring-1 ring-white/10`}>
                {activeChat.avatar}
              </div>
              <div className="font-bold text-[14px] text-white/90">{activeChat.name}</div>
           </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-6 space-y-4 overflow-y-auto scroll-smooth no-scrollbar pb-24"
        >
          {activeChat.history.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
               <div className={`px-4 py-2.5 rounded-[1.2rem] max-w-[75%] text-[14.5px] leading-snug shadow-sm ${
                 msg.sender === "me" 
                   ? "bg-blue-600 text-white rounded-br-md" 
                   : "bg-white/10 text-white rounded-bl-md border border-white/5"
               }`}>
                 {msg.content}
               </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#1e1e1f] via-[#1e1e1f]/95 to-transparent">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-1.5 flex items-center space-x-2 focus-within:ring-2 ring-blue-500/40 transition-all shadow-xl backdrop-blur-xl">
            <span className="i-material-symbols:add-circle text-2xl text-blue-500/80 hover:text-blue-400 cursor-default ml-1" />
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="bg-transparent border-none outline-none text-[14.5px] w-full px-2 text-white/90 placeholder-white/20" 
              placeholder="iMessage" 
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`p-1 rounded-full transition-all flex items-center justify-center ${
                inputText.trim() ? "bg-blue-600 text-white scale-110 shadow-lg" : "text-white/20"
              }`}
            >
              <span className="i-material-symbols:arrow-upward-rounded text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "~/stores";

const DEEPSEEK_API_KEY = "sk-1e78f4f7154248db8bdb97e06fffe88a";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

interface Message {
  id: string;
  sender: "me" | "them";
  content: string;
  time: string;
  isStreaming?: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  color: string;
  persona: string;
  history: Message[];
}

const INITIAL_CHATS: Chat[] = [
  {
    id: "tech-bot",
    name: "TechBot",
    avatar: "TB",
    color: "bg-blue-600",
    persona:
      "You are TechBot, a rigorous and professional system expert for macOS. You provide precise, technical answers and use emojis like 💻, ⚙️, 🔧 sparingly but effectively. You are helpful but maintain a serious tone.",
    history: [
      {
        id: "1",
        sender: "them",
        content: "Hello! TechBot here. Need help with your system configuration?",
        time: "9:41 AM"
      }
    ]
  },
  {
    id: "creative-ally",
    name: "CreativeAlly",
    avatar: "CA",
    color: "bg-orange-500",
    persona:
      "You are CreativeAlly, a lively, humorous, and creative assistant. You love to use many emojis like ✨, 🎨, 🚀, 😂. You are very friendly and always look for the fun side of things. Your answers are energetic and inspiring.",
    history: [
      {
        id: "2",
        sender: "them",
        content: "Hey there! Ready to build something amazing today? ✨🎨",
        time: "10:15 AM"
      }
    ]
  },
  {
    id: "help-guru",
    name: "HelpGuru",
    avatar: "HG",
    color: "bg-green-500",
    persona:
      "You are HelpGuru, a gentle, patient, and wise guide. You provide calm and comforting advice. You use warm emojis like 🌿, ☀️, 🙏. You are here to help the user find peace and clarity in their digital life.",
    history: [
      {
        id: "3",
        sender: "them",
        content: "Take a deep breath. How can I assist you today? 🌿",
        time: "11:20 AM"
      }
    ]
  }
];

export default function Messages() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeId, setActiveId] = useState("tech-bot");
  const [inputText, setInputText] = useState("");
  const [typingIds, setTypingIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const dark = useStore((state) => state.dark);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId) || chats[0],
    [chats, activeId]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat.history, typingIds]);

  const streamFromDeepSeek = async (
    chatId: string,
    userMessage: string,
    currentHistory: Message[]
  ) => {
    setTypingIds((prev) => new Set(prev).add(chatId));

    const streamMsgId = `stream-${Date.now()}`;

    // Add initial placeholder for streaming
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              history: [
                ...c.history,
                {
                  id: streamMsgId,
                  sender: "them",
                  content: "",
                  time: "Now",
                  isStreaming: true
                }
              ]
            }
          : c
      )
    );

    try {
      const persona = INITIAL_CHATS.find((c) => c.id === chatId)?.persona || "";

      const response = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: persona },
            ...currentHistory.map((m) => ({
              role: m.sender === "me" ? "user" : "assistant",
              content: m.content
            })),
            { role: "user", content: userMessage }
          ],
          stream: true
        })
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      if (!reader) return;

      let accumulatedContent = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            if (line.includes("[DONE]")) break;
            try {
              const json = JSON.parse(line.replace("data: ", ""));
              const content = json.choices[0].delta.content || "";
              accumulatedContent += content;

              setChats((prev) =>
                prev.map((c) =>
                  c.id === chatId
                    ? {
                        ...c,
                        history: c.history.map((m) =>
                          m.id === streamMsgId ? { ...m, content: accumulatedContent } : m
                        )
                      }
                    : c
                )
              );
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error("DeepSeek Error:", error);
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                history: c.history.map((m) =>
                  m.id === streamMsgId
                    ? {
                        ...m,
                        content: "Sorry, I encountered an error. Please try again.",
                        isStreaming: false
                      }
                    : m
                )
              }
            : c
        )
      );
    } finally {
      setTypingIds((prev) => {
        const next = new Set(prev);
        next.delete(chatId);
        return next;
      });
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                history: c.history.map((m) =>
                  m.id === streamMsgId ? { ...m, isStreaming: false } : m
                )
              }
            : c
        )
      );
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || typingIds.has(activeId)) return;

    const text = inputText.trim();
    const newMessage: Message = {
      id: `me-${Date.now()}`,
      sender: "me",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedHistory = [...activeChat.history, newMessage];

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeId ? { ...chat, history: updatedHistory } : chat
      )
    );
    setInputText("");

    streamFromDeepSeek(activeId, text, updatedHistory);
  };

  return (
    <div
      className={`flex h-full select-none overflow-hidden ${dark ? "bg-[#1e1e1f] text-white" : "bg-white text-black"}`}
    >
      {/* Sidebar */}
      <div
        className={`w-80 flex flex-col shrink-0 border-r ${dark ? "bg-[#1e1e1f]/60 border-black/30" : "bg-[#f6f6f6] border-gray-200"}`}
      >
        <div className="p-4 pt-6 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[20px] font-bold tracking-tight">Messages</span>
            <span className="i-material-symbols:edit-square-outline-rounded text-xl opacity-60 hover:opacity-100 cursor-default text-blue-500" />
          </div>
          <div
            className={`flex items-center space-x-2 rounded-lg px-2.5 py-1.5 transition-all ${dark ? "bg-black/20 border border-white/5" : "bg-black/5 border border-black/5"}`}
          >
            <span className="i-bx:search opacity-30 text-sm" />
            <input
              className="bg-transparent border-none outline-none text-[13px] w-full placeholder-current opacity-30"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
          {chats.map((chat) => {
            const lastMsg = chat.history[chat.history.length - 1];
            const isActive = activeId === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => setActiveId(chat.id)}
                className={`mx-2 p-3 flex space-x-3 rounded-xl transition-all duration-150 cursor-default relative group ${
                  isActive
                    ? "bg-blue-600 shadow-lg"
                    : `hover:${dark ? "bg-white/5" : "bg-black/5"}`
                }`}
              >
                <div
                  className={`size-12 rounded-full ${chat.color} flex items-center justify-center text-lg font-bold shadow-sm shrink-0 text-white`}
                >
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span
                      className={`font-bold text-[14px] ${isActive ? "text-white" : "opacity-90"}`}
                    >
                      {chat.name}
                    </span>
                    <span
                      className={`text-[11px] ${isActive ? "text-white/70" : "opacity-40"}`}
                    >
                      {lastMsg?.time || ""}
                    </span>
                  </div>
                  <div
                    className={`text-[12.5px] truncate ${isActive ? "text-white/90" : "opacity-50"}`}
                  >
                    {typingIds.has(chat.id)
                      ? "Typing..."
                      : lastMsg
                        ? (lastMsg.sender === "me" ? "You: " : "") + lastMsg.content
                        : "No messages"}
                  </div>
                </div>
                {isActive && (
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-transparent">
        <div
          className={`h-14 border-b flex items-center px-6 sticky top-0 z-10 ${dark ? "bg-[#1e1e1f]/80 border-black/30" : "bg-white/80 border-gray-200"} backdrop-blur-md`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`size-8 rounded-full ${activeChat.color} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
            >
              {activeChat.avatar}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[14px] opacity-90">{activeChat.name}</span>
              <span className="text-[10px] text-blue-500 font-medium">Messages</span>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 p-6 space-y-4 overflow-y-auto scroll-smooth no-scrollbar pb-28"
        >
          {activeChat.history.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} items-end`}
              >
                <div
                  className={`px-4 py-2 rounded-[1.2rem] max-w-[75%] text-[14.5px] leading-tight shadow-sm whitespace-pre-wrap ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-md"
                      : `${dark ? "bg-white/10" : "bg-black/5"} rounded-bl-md`
                  }`}
                >
                  {msg.content}
                  {msg.isStreaming && (
                    <span className="inline-block w-1 h-4 bg-current ml-1 align-middle animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
          {typingIds.has(activeId) &&
            activeChat.history[activeChat.history.length - 1]?.sender === "me" && (
              <div className="flex justify-start">
                <div
                  className={`px-4 py-3 rounded-[1.2rem] rounded-bl-md ${dark ? "bg-white/10" : "bg-black/5"}`}
                >
                  <div className="flex space-x-1">
                    <div className="size-1.5 bg-current opacity-40 rounded-full animate-bounce" />
                    <div className="size-1.5 bg-current opacity-40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="size-1.5 bg-current opacity-40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Input Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 p-4 ${dark ? "bg-gradient-to-t from-[#1e1e1f] via-[#1e1e1f]" : "bg-gradient-to-t from-white via-white"}`}
        >
          <div
            className={`border rounded-[1.5rem] p-1 flex items-center space-x-2 transition-all shadow-sm focus-within:shadow-md ${dark ? "bg-white/5 border-white/10 focus-within:ring-1 ring-blue-500/50" : "bg-white border-gray-200 focus-within:ring-1 ring-blue-500/30"}`}
          >
            <button className="p-1.5 text-blue-500 hover:scale-110 transition-transform">
              <span className="i-material-symbols:add-circle text-2xl" />
            </button>
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="bg-transparent border-none outline-none text-[14.5px] w-full px-2 placeholder-current opacity-20"
              placeholder="iMessage"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || typingIds.has(activeId)}
              className={`size-8 rounded-full transition-all flex-center shrink-0 ${inputText.trim() && !typingIds.has(activeId) ? "bg-blue-600 text-white shadow-md active:scale-90" : "opacity-20"}`}
            >
              <span className="i-material-symbols:arrow-upward-rounded text-xl" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] opacity-30 font-medium">
              Text Message • DeepSeek AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

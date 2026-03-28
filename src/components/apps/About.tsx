import React from "react";

export default function About() {
  return (
    <div className="size-full bg-[#1e1e1f] text-white flex flex-col items-center p-8 select-none">
      <div className="size-40 mb-6 drop-shadow-2xl">
        <img 
          src="img/ui/wallpaper-day.jpg" 
          className="size-full object-cover rounded-3xl border-4 border-white/20 shadow-2xl" 
          alt="macOS Sequoia"
        />
      </div>
      
      <div className="text-4xl font-bold tracking-tight mb-1">macOS Sequoia</div>
      <div className="text-sm text-white/50 mb-8 font-medium">Version 15.1</div>
      
      <div className="w-full max-w-sm space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-xs font-bold text-white/80">Model</span>
          <span className="text-xs text-white/50">MacBook Pro 16-inch</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-xs font-bold text-white/80">Chip</span>
          <span className="text-xs text-white/50">Apple M3 Max</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-xs font-bold text-white/80">Memory</span>
          <span className="text-xs text-white/50">128 GB</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-xs font-bold text-white/80">Serial Number</span>
          <span className="text-xs text-white/50">ANTIGRAVITY42</span>
        </div>
      </div>
      
      <button className="mt-12 px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-full text-xs font-medium border border-white/10 transition-colors">
        System Report...
      </button>
      
      <div className="mt-auto text-[10px] text-white/30 text-center leading-relaxed">
        ™ and © 1983-2024 Apple Inc.<br />
        All Rights Reserved. License Agreement
        <div className="mt-2">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            冀ICP备2026007988号
          </a>
          <div className="mt-0.5 opacity-60">审核通过日期: 2026-03-17</div>
        </div>
      </div>
    </div>
  );
}

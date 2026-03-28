import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { apps, launchpadApps } from "~/configs";
import type { LaunchpadData, AppsData } from "~/types";

const APPS: { [key: string]: (LaunchpadData | AppsData)[] } = {
  app: apps,
  portfolio: launchpadApps
};

const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface SpotlightProps {
  toggleSpotlight: () => void;
  openApp: (id: string) => void;
  toggleLaunchpad: (target: boolean) => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function Spotlight({
  toggleSpotlight,
  openApp,
  toggleLaunchpad,
  btnRef
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchText, setSearchText] = useState("");
  const [curDetails, setCurDetails] = useState<any>(null);
  const [appList, setAppList] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useClickOutside(spotlightRef, toggleSpotlight, [btnRef]);

  useEffect(() => {
    const filtered = apps.filter(app => 
      app.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setAppList(filtered);
    setSelectedIndex(0);
    setCurDetails(filtered[0] || null);
  }, [searchText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && curDetails) {
      if (curDetails.id === "launchpad") toggleLaunchpad(true);
      else openApp(curDetails.id);
      toggleSpotlight();
    }
    if (e.key === "ArrowDown") setSelectedIndex(s => Math.min(s + 1, appList.length - 1));
    if (e.key === "ArrowUp") setSelectedIndex(s => Math.max(s - 1, 0));
  };

  useEffect(() => {
    setCurDetails(appList[selectedIndex] || null);
  }, [selectedIndex]);

  return (
    <div
      ref={spotlightRef}
      className="fixed left-1/2 top-[15%] -translate-x-1/2 w-[600px] macos-v2-panel overflow-hidden shadow-2xl z-50 text-white"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center p-4 border-b border-white/10">
        <span className="i-bx:search text-2xl mr-3 opacity-60" />
        <input
          ref={inputRef}
          autoFocus
          className="bg-transparent border-none outline-none text-xl w-full placeholder-white/40"
          placeholder="Spotlight Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      
      {searchText && (
        <div className="flex h-80">
          <div className="w-1/2 border-r border-white/10 p-2 overflow-y-auto">
             <div className="text-[11px] font-bold opacity-40 px-3 py-1 uppercase tracking-wider">Applications</div>
             {appList.map((app, i) => (
               <div
                 key={app.id}
                 className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-default ${i === selectedIndex ? "bg-[#006AFF]" : "hover:bg-white/5"}`}
                 onClick={() => setSelectedIndex(i)}
                 onDoubleClick={() => {
                   if (app.id === "launchpad") toggleLaunchpad(true);
                   else openApp(app.id);
                   toggleSpotlight();
                 }}
               >
                 <img 
                   src={app.img} 
                   className="size-6" 
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/Renovamen/playground-macos/public/img/icons/finder.png";
                   }}
                 />
                 <span className="text-[14px]">{app.title}</span>
               </div>
             ))}
          </div>
          {curDetails && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
               <img 
                 src={curDetails.img} 
                 className="size-24" 
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/Renovamen/playground-macos/public/img/icons/finder.png";
                 }}
               />
               <div className="text-xl font-bold">{curDetails.title}</div>
               <div className="text-[12px] opacity-60">Version {getRandom(1, 15)}.{getRandom(0, 9)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { apps } from "~/configs";

interface StageManagerProps {
  show: boolean;
  showApps: { [key: string]: boolean };
  appsZ: { [key: string]: number };
  maxZ: number;
  openApp: (id: string) => void;
}

export default function StageManager({ show, showApps, appsZ, maxZ, openApp }: StageManagerProps) {
  if (!show) return null;

  // Get apps that are open but NOT the current foreground app
  // Foreground app is the one with maxZ
  const openAppIds = Object.keys(showApps).filter(id => showApps[id]);
  
  // For simplicity, we'll show groups of apps. 
  // In a real macOS, it groups windows from the same app.
  // Here we just show the icons of open apps on the left.
  
  const sortedAppIds = openAppIds.sort((a, b) => appsZ[b] - appsZ[a]);
  const foregroundAppId = sortedAppIds[0];
  const backgroundApps = sortedAppIds.slice(1, 6); // Show up to 5 background apps

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="fixed left-2 top-12 bottom-20 w-32 z-10 flex flex-col justify-center gap-6 p-2 pointer-events-none"
    >
      {backgroundApps.map((id) => {
        const app = apps.find(a => a.id === id);
        if (!app) return null;

        return (
          <motion.div
            key={`stage-${id}`}
            whileHover={{ x: 10, scale: 1.05 }}
            className="group pointer-events-auto cursor-pointer"
            onClick={() => openApp(id)}
          >
            <div className="relative w-20 h-14 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg overflow-hidden transition-all duration-300 group-hover:border-white/40 group-hover:shadow-2xl">
              <img 
                src={app.img} 
                alt={app.title} 
                className="size-full object-contain p-2 opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/gh/Renovamen/playground-macos/public/img/icons/finder.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

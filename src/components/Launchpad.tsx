import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "~/stores";
import { wallpapers, launchpadApps, apps } from "~/configs";

interface LaunchpadProps {
  show: boolean;
  toggleLaunchpad: (target: boolean) => void;
  openApp: (id: string) => void;
}

const placeholderText = "Search";

export default function Launchpad({ show, toggleLaunchpad, openApp }: LaunchpadProps) {
  const dark = useStore((state) => state.dark);

  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);

  const search = () => {
    const allApps = [
      ...apps.filter(a => a.id !== "finder" && a.id !== "launchpad"),
      ...launchpadApps
    ];
    if (searchText === "") return allApps;
    const text = searchText.toLowerCase();
    return allApps.filter((item) => {
      return (
        item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
      );
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="z-30 size-full fixed overflow-hidden bg-center bg-cover"
          id="launchpad"
          style={{
            backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`
          }}
          onClick={() => toggleLaunchpad(false)}
        >
          <div className="size-full absolute bg-gray-900/20 backdrop-blur-3xl flex flex-col items-center">
            {/* Search Bar */}
            <div
              className="mt-12 mb-10 h-7 w-64 bg-white/10 rounded-md border border-white/20 flex items-center px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="i-bx:search text-white/50 mr-2" />
              <input
                className="flex-1 min-w-0 no-outline bg-transparent text-sm text-white placeholder-white/30"
                placeholder={placeholderText}
                autoFocus
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Apps Grid */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.015
                  }
                }
              }}
              className="max-w-[1200px] w-full px-10 grid grid-cols-4 sm:grid-cols-7 gap-y-10"
            >
              {search().map((app) => (
                <motion.div
                  key={`launchpad-${app.id}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    show: { opacity: 1, scale: 1 }
                  }}
                  className="flex flex-col items-center group cursor-default"
                  onClick={(e) => {
                     e.stopPropagation();
                     if (app.id && apps.find(a => a.id === app.id)) {
                        openApp(app.id);
                        toggleLaunchpad(false);
                     } else if (app.link) {
                        window.open(app.link, "_blank");
                     }
                  }}
                >
                  <div className="w-16 sm:w-20 transition-transform duration-200 active:scale-90 active:brightness-75">
                    <img 
                      src={app.img} 
                      alt={app.title} 
                      className="size-full object-contain filter drop-shadow-xl group-hover:brightness-110" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "img/icons/finder.png";
                      }}
                    />
                  </div>
                  <span className="mt-2 text-white text-xs sm:text-sm font-medium tracking-wide drop-shadow-md">
                    {app.title}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

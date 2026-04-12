import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "~/stores";
import { wallpapers, launchpadApps, apps as desktopApps } from "~/configs";

interface LaunchpadProps {
  show: boolean;
  toggleLaunchpad: (target: boolean) => void;
  openApp: (id: string) => void;
}

const ITEMS_PER_PAGE = 28; // 7x4

export default function Launchpad({ show, toggleLaunchpad, openApp }: LaunchpadProps) {
  const dark = useStore((state) => state.dark);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const allApps = useMemo(() => {
    return [
      ...desktopApps.filter((a) => a.id !== "finder" && a.id !== "launchpad"),
      ...launchpadApps
    ];
  }, []);

  const filteredApps = useMemo(() => {
    if (!searchText) return allApps;
    const t = searchText.toLowerCase();
    return allApps.filter(
      (a) => a.title.toLowerCase().includes(t) || a.id.toLowerCase().includes(t)
    );
  }, [searchText, allApps]);

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / ITEMS_PER_PAGE));

  const pages = useMemo(() => {
    const res = [];
    for (let i = 0; i < totalPages; i++) {
      res.push(filteredApps.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE));
    }
    return res;
  }, [filteredApps, totalPages]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    const velocityThreshold = 500;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="z-50 size-full fixed overflow-hidden inset-0 select-none"
          id="launchpad"
          style={{
            backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Overlay & Background Click-to-Close */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[30px]"
            onClick={() => toggleLaunchpad(false)}
          />

          <div className="relative size-full flex flex-col items-center pt-10 pointer-events-none">
            {/* Search Bar */}
            <div
              className="relative w-full flex justify-center mb-10 z-10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`flex items-center h-7 w-64 rounded-md border border-white/20 bg-black/10 backdrop-blur-md px-2 transition-all ${isFocused ? "ring-2 ring-blue-500/50" : ""}`}
              >
                <div
                  className={`flex items-center w-full ${!isFocused && !searchText ? "justify-center" : "justify-start"}`}
                >
                  <span className="i-bx:search text-white/50 text-sm mr-1.5" />
                  <input
                    className="bg-transparent no-outline text-[13px] text-white placeholder-white/40 w-full"
                    placeholder="Search"
                    autoFocus
                    value={searchText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Apps Content - Stable Filmstrip Container */}
            <div className="flex-1 w-full overflow-hidden pointer-events-auto">
              <motion.div
                className="h-full flex"
                animate={{ x: `-${currentPage * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                drag="x"
                dragConstraints={{ left: -(totalPages - 1) * 100, right: 0 }}
                onDragEnd={handleDragEnd}
                style={{ width: `${totalPages * 100}%` }}
              >
                {pages.map((page, pIdx) => (
                  <div
                    key={`page-${pIdx}`}
                    className="w-screen h-full grid grid-cols-7 grid-rows-4 gap-x-4 gap-y-10 px-[10vw] pb-24 content-start"
                  >
                    {page.map((app, index) => (
                      <motion.div
                        key={`app-${app.id}-${pIdx}-${index}`}
                        className="flex flex-col items-center group cursor-default"
                        onTap={(e) => {
                          e.stopPropagation();
                          if (app.id && desktopApps.find((a) => a.id === app.id)) {
                            openApp(app.id);
                          } else if (app.link) {
                            window.open(app.link, "_blank");
                          }
                          toggleLaunchpad(false);
                        }}
                      >
                        <div className="w-16 sm:w-20 aspect-square group-active:scale-90 transition-transform duration-200">
                          <img
                            src={app.img}
                            alt={app.title}
                            className="size-full object-contain filter drop-shadow-2xl"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "img/icons/finder.png";
                            }}
                          />
                        </div>
                        <span className="mt-2.5 text-white text-[12px] font-medium drop-shadow-md px-2 text-center line-clamp-2 max-w-full">
                          {app.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && !searchText && (
              <div className="absolute bottom-16 flex space-x-4 pointer-events-auto">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPage(i);
                    }}
                    className={`size-2 rounded-full transition-all duration-300 ${currentPage === i ? "bg-white scale-125 shadow-lg" : "bg-white/30 hover:bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

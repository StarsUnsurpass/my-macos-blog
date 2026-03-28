import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "~/stores";

export default function Maps() {
  const dark = useStore((state) => state.dark);
  const [activePlace, setActivePlace] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [mapMode, setMapMode] = useState("Standard");
  const [showSidebar, setShowSidebar] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const places = [
    { id: "1", name: "Home", address: "1 Infinite Loop, Cupertino", icon: "i-material-symbols:home-rounded", color: "bg-blue-500" },
    { id: "2", name: "Apple Park", address: "One Apple Park Way, Cupertino", icon: "i-material-symbols:work-rounded", color: "bg-orange-500" },
  ];

  const handleMyLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setActivePlace({
            id: "current",
            name: "Current Location",
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            icon: "i-material-symbols:my-location",
            color: "bg-blue-600",
            isLive: true
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Location error:", error);
          setActivePlace({
            id: "apple",
            name: "Apple Park",
            address: "Cupertino, California",
            icon: "i-material-symbols:location-on",
            color: "bg-blue-500"
          });
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  return (
    <div className={`flex h-full overflow-hidden font-sans select-none ${dark ? "bg-[#1e1e1f] text-white" : "bg-[#f5f5f7] text-black"}`}>
      {showSidebar && (
        <div className={`w-64 h-full border-r shrink-0 flex flex-col ${dark ? "bg-[#252526] border-black/20" : "bg-white border-black/5"}`}>
          <div className="p-4">
             <div className="flex items-center px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 focus-within:ring-2 ring-blue-500/50">
                <span className="i-material-symbols:search-rounded text-lg opacity-30 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search Maps" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] w-full font-medium"
                />
             </div>
          </div>
          <div className="flex-1 px-3 space-y-4 overflow-y-auto no-scrollbar">
             <div className="px-3 text-[10px] font-bold uppercase opacity-30 tracking-widest">Favorites</div>
             {places.map(p => (
               <div 
                 key={p.id}
                 onClick={() => setActivePlace(p)}
                 className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all cursor-default ${activePlace?.id === p.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
               >
                  <div className={`size-8 rounded-full flex items-center justify-center ${activePlace?.id === p.id ? "bg-white/20 text-white" : p.color + " text-white"}`}>
                    <span className={p.icon} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold truncate">{p.name}</span>
                    <span className={`text-[11px] truncate ${activePlace?.id === p.id ? "text-white/60" : "opacity-40"}`}>{p.address}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      <div className="flex-1 relative bg-[#242424] overflow-hidden">
         <div 
           className="size-full bg-cover bg-center transition-all duration-700"
           style={{
             backgroundImage: `url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i14!2i${activePlace?.id === 'current' ? 2610 : (activePlace ? 2605 : 2500)}!3i${activePlace?.id === 'current' ? 6110 : (activePlace ? 6105 : 6000)}!2m3!1e0!2sm!3i600!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')`,
             filter: mapMode === "Satellite" ? "brightness(0.8) contrast(1.2)" : "none"
           }}
         />

         <div className="absolute top-4 left-4 flex space-x-2">
            <button onClick={() => setShowSidebar(!showSidebar)} className={`size-10 rounded-xl flex items-center justify-center transition-all shadow-2xl active:scale-95 border ${dark ? "bg-black/40 border-white/10 text-white" : "bg-white/80 border-black/5 text-black"} backdrop-blur-2xl`}>
               <span className="i-bi:layout-sidebar text-xl opacity-70" />
            </button>
         </div>

         <div className={`absolute top-4 right-4 flex p-1 rounded-xl transition-all shadow-2xl border ${dark ? "bg-black/40 border-white/10" : "bg-white/80 border-black/5"} backdrop-blur-2xl`}>
            {["Standard", "Satellite"].map(m => (
              <button key={m} onClick={() => setMapMode(m)} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${mapMode === m ? (dark ? "bg-white/10 text-white shadow-sm" : "bg-white text-black shadow-sm") : "text-black/40 dark:text-white/40 hover:text-white"}`}>
                {m}
              </button>
            ))}
         </div>

         <div className="absolute bottom-6 right-6 flex flex-col space-y-3">
            <button 
              onClick={handleMyLocation}
              className={`size-12 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-95 border ${dark ? "bg-black/40 border-white/10 text-blue-400" : "bg-white/80 border-black/5 text-blue-600"} backdrop-blur-2xl`}
            >
               <span className={`i-material-symbols:my-location text-2xl ${loadingLocation ? "animate-pulse" : ""}`} />
            </button>
         </div>

         <AnimatePresence>
           {activePlace && (
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -20, opacity: 0 }}
               className={`absolute bottom-6 left-6 w-80 p-5 rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border ${dark ? "bg-black/40 border-white/10 text-white" : "bg-white/90 border-black/5 text-black"} backdrop-blur-2xl`}
             >
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center space-x-3">
                      <div className={`size-12 rounded-full ${activePlace.color} text-white flex items-center justify-center shadow-lg`}>
                         <span className={`${activePlace.icon} text-2xl`} />
                      </div>
                      <div className="min-w-0 pr-2">
                        <h3 className="font-extrabold text-lg tracking-tight truncate">{activePlace.name}</h3>
                        <p className="text-[11px] opacity-40 uppercase font-bold tracking-widest truncate">{activePlace.address}</p>
                      </div>
                   </div>
                   <button onClick={() => setActivePlace(null)} className="i-material-symbols:close text-xl opacity-30 hover:opacity-100 transition-opacity" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 bg-blue-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all">
                     Directions
                  </button>
                  <button className={`py-2.5 rounded-xl text-[13px] font-bold border transition-all hover:bg-black/5 dark:hover:bg-white/5 ${dark ? "border-white/10" : "border-black/5"}`}>
                     Share
                  </button>
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}

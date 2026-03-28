import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
  id: string;
  url: string;
  date: string;
  isFavorite: boolean;
  location: string;
}

const INITIAL_PHOTOS: Photo[] = [
  { id: "p1", url: "bg-gradient-to-br from-orange-400 to-rose-400", date: "Today", location: "San Francisco", isFavorite: true },
  { id: "p2", url: "bg-gradient-to-br from-blue-400 to-indigo-500", date: "Today", location: "San Francisco", isFavorite: false },
  { id: "p3", url: "bg-gradient-to-br from-emerald-400 to-cyan-500", date: "Yesterday", location: "Cupterino", isFavorite: true },
  { id: "p4", url: "bg-gradient-to-br from-amber-400 to-orange-500", date: "Yesterday", location: "San Jose", isFavorite: false },
  { id: "p5", url: "bg-gradient-to-br from-violet-400 to-purple-600", date: "Last Week", location: "Mountain View", isFavorite: false },
  { id: "p6", url: "bg-gradient-to-br from-fuchsia-400 to-pink-600", date: "Last Week", location: "Palo Alto", isFavorite: false },
  { id: "p7", url: "bg-gradient-to-br from-lime-400 to-green-600", date: "Last Week", location: "Menlo Park", isFavorite: false },
  { id: "p8", url: "bg-gradient-to-br from-yellow-400 to-amber-600", date: "April 2024", location: "Home", isFavorite: true },
];

export default function Photos() {
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Library");

  const sidebarItems = [
    { name: "Library", icon: "i-material-symbols:photo-library-rounded" },
    { name: "Memories", icon: "i-material-symbols:auto-awesome-rounded" },
    { name: "People", icon: "i-material-symbols:group-rounded" },
    { name: "Places", icon: "i-material-symbols:location-on-rounded" },
    { name: "Favorites", icon: "i-material-symbols:star-rounded" },
    { name: "Recents", icon: "i-material-symbols:schedule" },
  ];

  const filteredPhotos = activeTab === "Favorites" 
    ? photos.filter(p => p.isFavorite) 
    : photos;

  const selectedPhoto = photos.find(p => p.id === selectedId);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  return (
    <div className="flex h-full text-white select-none overflow-hidden font-sans bg-[#1e1e1f]">
      {/* Sidebar */}
      <div className="w-56 bg-white/2 backdrop-blur-3xl border-r border-black/30 flex flex-col py-4 shrink-0">
        <div className="px-4 mb-6">
          <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-3 px-3">Photos</div>
          <div className="space-y-0.5">
            {sidebarItems.map((item) => (
              <div
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[13.5px] transition-all duration-100 cursor-default group ${
                  activeTab === item.name ? "bg-white/10 text-white shadow-sm ring-1 ring-white/5" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`${item.icon} text-lg ${activeTab === item.name ? "text-blue-400" : "opacity-60 group-hover:opacity-100"}`} />
                <span className={activeTab === item.name ? "font-semibold" : ""}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-[#1a1a1b] overflow-hidden relative shadow-inner">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-6 border-b border-black/30 bg-[#2d2d2e]/50 backdrop-blur-md z-10">
          <div className="flex items-center space-x-4">
             <div className="flex space-x-4">
                <span className="i-material-symbols:chevron-left text-2xl opacity-40 hover:opacity-100 cursor-default p-0.5 hover:bg-white/5 rounded" />
                <span className="i-material-symbols:chevron-right text-2xl opacity-40 hover:opacity-100 cursor-default p-0.5 hover:bg-white/5 rounded" />
             </div>
             <span className="font-bold text-[14.5px] tracking-tight">{activeTab}</span>
          </div>
          <div className="flex items-center space-x-4 text-white/60">
             <span className="i-material-symbols:add-circle-outline text-[20px] hover:text-white transition-colors" />
             <span className="i-material-symbols:ios-share text-[20px] hover:text-white transition-colors" />
             <div className="w-48 bg-black/30 border border-white/5 rounded-md px-2.5 py-1 flex items-center space-x-2 focus-within:ring-1 ring-blue-500/50">
                <span className="i-bx:search text-white/20" />
                <span className="text-[12px] opacity-25">Search</span>
             </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {filteredPhotos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
               <span className="i-material-symbols:photo-library text-8xl" />
               <p className="italic text-lg text-center">No Photos Found</p>
            </div>
          ) : (
            <div className="space-y-10">
              {["Today", "Yesterday", "Last Week", "April 2024"].map(date => {
                const datePhotos = filteredPhotos.filter(p => p.date === date);
                if (datePhotos.length === 0) return null;
                return (
                  <div key={date}>
                    <div className="flex items-baseline space-x-2 mb-4">
                      <h2 className="text-[15px] font-bold text-white/90">{date}</h2>
                      <span className="text-[12px] opacity-40 font-medium">{datePhotos[0].location}</span>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-1.5">
                      {datePhotos.map((photo) => (
                        <motion.div 
                          key={photo.id} 
                          layoutId={photo.id}
                          onClick={() => setSelectedId(photo.id)}
                          className="aspect-square rounded-sm overflow-hidden group relative cursor-default hover:ring-2 hover:ring-blue-500 transition-all shadow-sm"
                        >
                          <div className={`size-full ${photo.url} flex items-center justify-center`}>
                            <span className="i-material-symbols:image-outline text-4xl opacity-0 group-hover:opacity-30 transition-opacity" />
                          </div>
                          <div className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity ${photo.isFavorite ? "opacity-100" : ""}`}
                               onClick={(e) => toggleFavorite(e, photo.id)}>
                            <span className={`${photo.isFavorite ? "i-material-symbols:favorite text-rose-500" : "i-material-symbols:favorite-outline text-white"} text-sm`} />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Preview Overlay */}
        <AnimatePresence>
          {selectedId && selectedPhoto && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#1a1a1b] flex flex-col"
            >
               <div className="h-12 flex items-center justify-between px-6 bg-transparent">
                  <button 
                    onClick={() => setSelectedId(null)}
                    className="flex items-center space-x-1 hover:bg-white/5 pr-3 py-1 rounded-md transition-colors"
                  >
                    <span className="i-material-symbols:chevron-left text-2xl opacity-60" />
                    <span className="text-sm font-medium">Back</span>
                  </button>
                  <div className="flex items-center space-x-6">
                    <span 
                      onClick={(e) => toggleFavorite(e, selectedPhoto.id)}
                      className={`${selectedPhoto.isFavorite ? "i-material-symbols:favorite text-rose-500" : "i-material-symbols:favorite-outline text-white/40"} text-xl cursor-default`} 
                    />
                    <span className="i-material-symbols:info-outline text-xl text-white/40" />
                    <span className="i-material-symbols:delete-outline text-xl text-white/40" />
                  </div>
               </div>
               <div className="flex-1 flex items-center justify-center p-12">
                  <motion.div 
                    layoutId={selectedPhoto.id}
                    className={`size-full max-w-4xl max-h-[80%] rounded-xl shadow-2xl ${selectedPhoto.url}`} 
                  />
               </div>
               <div className="h-16 flex flex-col items-center justify-center pb-4 opacity-40">
                  <span className="text-[13px] font-bold">{selectedPhoto.date}</span>
                  <span className="text-[11px] font-medium">{selectedPhoto.location}</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

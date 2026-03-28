import React, { useState, useEffect } from "react";
import { websites, wallpapers } from "~/configs";
import { useStore } from "~/stores";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  title: string;
  url: string;
}

export default function Safari() {
  const dark = useStore((state) => state.dark);
  
  // Initial tabs - Start Page and Apple
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", title: "Start Page", url: "" },
    { id: "2", title: "Apple", url: "https://www.apple.com" }
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || { id: "0", title: "New Tab", url: "" };

  useEffect(() => {
    setUrlInput(activeTab.url);
  }, [activeTabId, activeTab.url]);

  const updateTab = (id: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addTab = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setTabs(prev => [...prev, { id: newId, title: "New Tab", url: "" }]);
    setActiveTabId(newId);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      updateTab(id, { url: "", title: "New Tab" });
      return;
    }
    const filtered = tabs.filter(t => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id) {
      const idx = tabs.findIndex(t => t.id === id);
      const nextTab = filtered[idx] || filtered[idx - 1];
      if (nextTab) setActiveTabId(nextTab.id);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    
    let targetUrl = urlInput.trim();
    if (targetUrl === "") return;

    const isUrl = targetUrl.includes(".") && !targetUrl.includes(" ");
    
    let finalUrl = "";
    if (isUrl) {
      finalUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
    } else {
      finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(targetUrl)}`;
    }
    
    updateTab(activeTabId, { url: finalUrl, title: isUrl ? targetUrl : "Search" });
  };

  const refresh = () => {
    setIsRefreshing(true);
    const current = activeTab.url;
    updateTab(activeTabId, { url: "" });
    setTimeout(() => {
      updateTab(activeTabId, { url: current });
      setIsRefreshing(false);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] dark:bg-[#1a1a1b] text-black dark:text-white font-sans overflow-hidden">
      {/* Search Toolbar */}
      <div className="flex flex-col shrink-0 z-20">
        {/* Tab Bar */}
        <div className="h-10 flex bg-[#dbdbdb] dark:bg-[#121212] px-2 pt-1.5 space-x-1 overflow-x-auto no-scrollbar border-b border-black/10 dark:border-white/5">
           {tabs.map(tab => (
             <div 
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex-1 min-w-[120px] max-w-[200px] h-8 rounded-t-lg flex items-center px-3 space-x-2 cursor-default relative transition-all group ${
                  activeTabId === tab.id 
                  ? "bg-[#f6f6f6] dark:bg-[#2d2d2e] shadow-[0_-1px_3px_rgba(0,0,0,0.1)]" 
                  : "hover:bg-black/5 dark:hover:bg-white/5 opacity-60"
                }`}
             >
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${tab.url || "apple.com"}&sz=32`} 
                  className="size-3.5 shrink-0 rounded-sm opacity-80" 
                  alt="" 
                />
                <span className="text-[11px] font-medium truncate flex-1">{tab.title || "New Tab"}</span>
                <button 
                  onClick={(e) => closeTab(e, tab.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-all"
                >
                   <span className="i-material-symbols:close text-[10px]" />
                </button>
             </div>
           ))}
           <button 
             onClick={addTab}
             className="size-8 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
           >
              <span className="i-material-symbols:add text-xl opacity-60" />
           </button>
        </div>

        {/* Main Toolbar */}
        <div className="h-12 flex items-center px-4 bg-[#f6f6f6] dark:bg-[#2d2d2e] border-b border-black/5 dark:border-white/5">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-1.5 rounded-lg transition-colors ${showSidebar ? "bg-black/10 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <span className="i-material-symbols:menu-open text-lg opacity-70" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => updateTab(activeTabId, { url: "" })}
                disabled={!activeTab.url}
                className={`p-1.5 rounded-lg transition-all ${!activeTab.url ? "opacity-20" : "hover:bg-black/5 dark:hover:bg-white/5 opacity-60 active:scale-95"}`}
              >
                <span className="i-material-symbols:chevron-left text-2xl" />
              </button>
              <button className="p-1.5 rounded-lg opacity-20 cursor-default">
                 <span className="i-material-symbols:chevron-right text-2xl" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto px-6 group">
             <div className="w-full bg-[#e3e3e3] dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl h-8 flex items-center px-4 space-x-3 focus-within:ring-4 ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-[#1e1e1e] transition-all">
                <span className="i-fa-solid:shield-alt text-[10px] opacity-20 shrink-0" />
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="URL or Search" 
                  className="bg-transparent border-none outline-none text-[13px] w-full text-center placeholder:text-black/30 dark:placeholder:text-white/30 font-bold tracking-tight"
                />
                <button 
                  type="button"
                  onClick={refresh}
                  className={`transition-transform duration-700 ${isRefreshing ? "rotate-180" : ""}`}
                >
                  <span className="i-material-symbols:refresh text-xl opacity-30 shrink-0 hover:opacity-100" />
                </button>
             </div>
          </form>

          <div className="flex items-center space-x-6 pr-2">
            <span className="i-material-symbols:ios-share text-xl opacity-60 hover:opacity-100 transition-opacity cursor-default" />
            <span className="i-material-symbols:add text-2xl opacity-60 hover:opacity-100 cursor-default" />
            <span className="i-material-symbols:content-copy text-xl opacity-60 hover:opacity-100 transition-opacity cursor-default" />
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#f1f1f2] dark:bg-[#1e1e1f] border-r border-black/10 dark:border-white/5 overflow-y-auto no-scrollbar shrink-0"
            >
              <div className="p-6">
                 <h3 className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-6 px-1">Bookmarks</h3>
                 <div className="space-y-1">
                    {websites.favorites.sites.map(site => (
                      <div 
                        key={site.id} 
                        onClick={() => updateTab(activeTabId, { url: site.link, title: site.title })}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-default group"
                      >
                         <div className="size-6 bg-white dark:bg-[#2d2d2e] rounded-md shadow-sm border border-black/5 flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
                            {site.img ? (
                              <img src={site.img} className="size-full object-contain" alt="" />
                            ) : (
                              <span className="text-[10px] font-bold text-blue-500">{site.title[0]}</span>
                            )}
                         </div>
                         <span className="text-[13px] font-bold opacity-70 group-hover:opacity-100 line-clamp-1">{site.title}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Browser View */}
        <div className="flex-1 relative overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {!activeTab.url ? (
              <motion.div 
                key="homepage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="size-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})` }}
              >
                <div className="absolute inset-0 bg-white/30 dark:bg-black/50 backdrop-blur-3xl px-8 py-14 overflow-y-auto no-scrollbar shadow-inner">
                   <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-extrabold mb-10 tracking-tight">Favorites</h2>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-10 gap-x-8 mb-20">
                        {websites.favorites.sites.map(site => (
                          <div 
                            key={site.id} 
                            onClick={() => updateTab(activeTabId, { url: site.link, title: site.title })}
                            className="flex flex-col items-center space-y-3 group cursor-default"
                          >
                             <div className="size-16 bg-white dark:bg-[#1e1e1f] rounded-2xl shadow-xl border border-black/5 dark:border-white/5 flex items-center justify-center p-4 group-hover:scale-110 transition-all duration-300 ring-1 ring-black/5">
                                {site.img ? (
                                  <img src={site.img} alt={site.title} className="size-full object-contain" />
                                ) : (
                                  <span className="text-xl font-bold text-blue-500">{site.title[0]}</span>
                                )}
                             </div>
                             <span className="text-[11px] font-bold opacity-60 group-hover:opacity-100 truncate w-full text-center transition-opacity px-1">{site.title}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/10 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl p-8 flex items-center space-x-8 backdrop-blur-xl shadow-2xl">
                         <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shadow-inner">
                            <span className="i-material-symbols:shield text-3xl" />
                         </div>
                         <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">Privacy Report</h3>
                            <p className="text-[15px] opacity-60 leading-snug">In the last seven days, Safari has prevented <span className="font-bold">142</span> trackers from profiling you.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab.id + activeTab.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="size-full bg-white relative flex flex-col"
              >
                <iframe
                  src={activeTab.url}
                  className="size-full border-none"
                  title="Safari Browser"
                />
                
                {/* Connection Help Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
                  <div className="mx-auto max-w-lg bg-white/90 dark:bg-[#1e1e1f]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center space-x-4">
                        <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                           <span className="i-material-symbols:info-outline text-2xl" />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold">Connection Issue?</h4>
                           <p className="text-[11px] opacity-60 max-w-[240px]">Some sites block embedding for security. If the page is blank, try opening it directly.</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => window.open(activeTab.url, "_blank")}
                       className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                     >
                        Open Site
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";

type Section = "AirDrop" | "Recents" | "Applications" | "Desktop" | "Documents" | "Downloads";

interface FileItem {
  id: string;
  name: string;
  icon: string;
  type: "folder" | "file" | "app";
  color: string;
  parentId?: string;
}

const ALL_FILES: FileItem[] = [
  // Documents Subfolders
  { id: "work", name: "Work", icon: "i-material-symbols:folder", type: "folder", color: "text-blue-400", parentId: "Documents" },
  { id: "personal", name: "Personal", icon: "i-material-symbols:folder", type: "folder", color: "text-blue-400", parentId: "Documents" },
  { id: "notes", name: "Notes.pdf", icon: "i-material-symbols:picture-as-pdf", type: "file", color: "text-red-400", parentId: "Documents" },
  
  // Work Subfolders
  { id: "project-ace", name: "Project-Ace", icon: "i-material-symbols:folder", type: "folder", color: "text-blue-400", parentId: "work" },
  { id: "report", name: "Q1-Report.docx", icon: "i-material-symbols:description", type: "file", color: "text-blue-500", parentId: "work" },

  // Applications
  { id: "safari", name: "Safari", icon: "i-logos:safari", type: "app", color: "", parentId: "Applications" },
  { id: "terminal", name: "Terminal", icon: "i-material-symbols:terminal", type: "app", color: "text-gray-200", parentId: "Applications" },
  { id: "vscode", name: "VS Code", icon: "i-logos:visual-studio-code", type: "app", color: "", parentId: "Applications" },

  // Downloads
  { id: "web-zip", name: "macos-web.zip", icon: "i-material-symbols:archive", type: "file", color: "text-yellow-600", parentId: "Downloads" },
  { id: "avatar", name: "Avatar.jpg", icon: "i-material-symbols:image", type: "file", color: "text-orange-400", parentId: "Downloads" },

  // Desktop
  { id: "todo", name: "To-Do List.txt", icon: "i-material-symbols:description", type: "file", color: "text-gray-400", parentId: "Desktop" },
];

const ROOT_SECTIONS: Section[] = ["AirDrop", "Recents", "Applications", "Desktop", "Documents", "Downloads"];

export default function Finder({ openApp }: { openApp?: (id: string) => void }) {
  const [currentPath, setCurrentPath] = useState<string>("Documents");
  const [history, setHistory] = useState<string[]>(["Documents"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  const navigateTo = (path: string, isNew = true) => {
    if (isNew) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(path);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    setCurrentPath(path);
    setSelectedId(null);
    
    // Add to recents if it's a folder/section
    if (path !== "Recents" && path !== "AirDrop") {
      setRecents(prev => [path, ...prev.filter(p => p !== path)].slice(0, 10));
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedId(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedId(null);
    }
  };

  const getFiles = () => {
    if (currentPath === "Recents") {
      return ALL_FILES.filter(f => recents.includes(f.id) || recents.includes(f.parentId || ""));
    }
    return ALL_FILES.filter(f => f.parentId === currentPath);
  };

  const currentFiles = getFiles();

  const favorites = [
    { name: "AirDrop", icon: "i-material-symbols:rss-feed-rounded", color: "text-blue-400" },
    { name: "Recents", icon: "i-material-symbols:schedule", color: "text-blue-400" },
    { name: "Applications", icon: "i-material-symbols:apps", color: "text-blue-400" },
    { name: "Desktop", icon: "i-material-symbols:desktop-windows", color: "text-blue-400" },
    { name: "Documents", icon: "i-material-symbols:folder", color: "text-blue-400" },
    { name: "Downloads", icon: "i-material-symbols:download", color: "text-blue-400" },
  ] as const;

  return (
    <div className="flex flex-col h-full text-white select-none bg-[#1e1e1f] rounded-lg overflow-hidden font-sans border border-white/5 shadow-2xl">
      {/* Toolbar */}
      <div className="h-12 border-b border-black/30 flex items-center px-4 space-x-4 bg-[#2d2d2e] backdrop-blur-xl shrink-0">
        <div className="flex space-x-4">
          <button 
            onClick={goBack} 
            disabled={historyIndex === 0}
            className="disabled:opacity-20 opacity-80 hover:opacity-100 transition-opacity p-0.5 hover:bg-white/5 rounded"
          >
            <span className="i-material-symbols:chevron-left text-2xl" />
          </button>
          <button 
            onClick={goForward} 
            disabled={historyIndex >= history.length - 1}
            className="disabled:opacity-20 opacity-80 hover:opacity-100 transition-opacity p-0.5 hover:bg-white/5 rounded"
          >
            <span className="i-material-symbols:chevron-right text-2xl" />
          </button>
        </div>
        
        <div className="font-bold text-[14px] flex-1 text-white/90">
          {currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}
        </div>

        <div className="flex space-x-3 items-center">
          <div className="flex bg-white/5 rounded-md p-0.5 border border-white/5 h-7">
            <div className="px-2.5 flex items-center bg-white/10 rounded-sm shadow-sm ring-1 ring-white/10">
              <span className="i-material-symbols:grid-view text-xs" />
            </div>
            <div className="px-2.5 flex items-center hover:bg-white/5 rounded-sm transition-colors text-white/40">
              <span className="i-material-symbols:format-list-bulleted text-xs" />
            </div>
          </div>
          
          <button className="opacity-60 hover:opacity-100 p-1 hover:bg-white/5 rounded">
            <span className="i-material-symbols:share text-lg" />
          </button>
          
          <div className="w-44 bg-black/20 border border-white/10 rounded-md px-2 py-0.5 flex items-center space-x-1.5 h-7 group shadow-inner focus-within:ring-1 ring-blue-500/50">
            <span className="i-bx:search text-white/30 group-focus-within:text-white/60" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent text-[12px] outline-none w-full placeholder-white/25"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#1e1e1f]/40 backdrop-blur-2xl border-r border-black/30 p-2.5 flex flex-col space-y-0.5 shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] font-bold opacity-30 px-3 py-2 uppercase tracking-tight">Favorites</div>
          {favorites.map((item) => (
            <div
              key={item.name}
              onClick={() => navigateTo(item.name)}
              className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-md text-[13.5px] group transition-all duration-100 cursor-default ${
                currentPath === item.name 
                  ? "bg-white/10 text-white shadow-sm shadow-black/20" 
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              <span className={`${item.icon} text-[19px] ${currentPath === item.name ? "text-blue-400" : "text-blue-500/80 group-hover:text-blue-400"}`} />
              <span className={currentPath === item.name ? "font-medium" : ""}>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div 
          className="flex-1 p-6 overflow-y-auto bg-[#1a1a1b] shadow-inner"
          onClick={() => setSelectedId(null)}
        >
          {currentPath === "AirDrop" ? (
             <div className="size-full flex flex-col items-center justify-center space-y-5">
                <div className="relative size-44 flex items-center justify-center">
                   <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[ping_4s_infinite]" />
                   <div className="absolute inset-4 rounded-full border border-blue-400/20 animate-[ping_3s_infinite]" />
                   <div className="size-32 rounded-full border-2 border-white/10 flex items-center justify-center">
                      <span className="i-material-symbols:rss-feed-rounded text-6xl text-blue-400/50" />
                   </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[15px] font-semibold text-white/90">AirDrop</p>
                  <p className="text-xs text-white/40 max-w-[200px]">AirDrop lets you share instantly with people nearby.</p>
                </div>
             </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-x-6 gap-y-8 content-start">
              {currentFiles.map((item) => (
                <div 
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(item.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (item.type === "folder") navigateTo(item.id);
                    if (item.type === "app" && openApp) openApp(item.id);
                  }}
                  className="flex flex-col items-center group cursor-default"
                >
                  <div className={`size-20 flex items-center justify-center mb-2 rounded-xl transition-all duration-200 relative ${
                    selectedId === item.id 
                      ? "bg-blue-500/30 ring-1 ring-blue-400/40" 
                      : "group-hover:bg-white/5 active:scale-95"
                  }`}>
                    {item.type === "app" ? (
                      <span className={`${item.icon} text-[56px] drop-shadow-2xl`} />
                    ) : (
                      <span className={`${item.icon} text-[72px] ${item.color} drop-shadow-xl`} />
                    )}
                  </div>
                  <span className={`text-[12px] text-center px-2 py-0.5 rounded-sm transition-colors break-all leading-tight max-w-full font-medium ${
                    selectedId === item.id 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-white/80 group-hover:text-white"
                  }`}>
                    {item.name}
                  </span>
                </div>
              ))}
              {currentFiles.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-10 space-y-4">
                   <span className="i-material-symbols:folder-open text-8xl" />
                   <p className="italic text-lg">Folder is Empty</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb / Path Bar */}
      <div className="h-7 border-t border-black/30 flex items-center px-4 bg-[#2d2d2e] shrink-0 overflow-x-auto no-scrollbar shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center space-x-1.5 opacity-60 text-[11px] font-medium whitespace-nowrap">
          <span className="i-material-symbols:desktop-windows-outline text-sm mr-1" />
          <span>Macintosh HD</span>
          <span className="i-material-symbols:chevron-right text-sm opacity-40 px-0.5" />
          <span>Users</span>
          <span className="i-material-symbols:chevron-right text-sm opacity-40 px-0.5" />
          <span>Ace</span>
          <span className="i-material-symbols:chevron-right text-sm opacity-40 px-0.5" />
          <span className="text-white opacity-90">{currentPath}</span>
        </div>
      </div>
    </div>
  );
}

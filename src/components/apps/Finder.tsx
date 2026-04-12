import React, { useState, useEffect, useRef, useCallback } from "react";
import { terminal } from "~/configs";
import type { TerminalData } from "~/types";
import { useStore } from "~/stores";
import MarkdownViewer from "../MarkdownViewer";
import { AnimatePresence, motion } from "framer-motion";

type ViewMode = "icon" | "list" | "column";

interface FileItem {
  id: string;
  name: string;
  icon: string;
  type: "folder" | "file" | "app";
  color: string;
  parentId?: string;
  content?: string;
  size?: string;
  date?: string;
}

const STATIC_FILES: FileItem[] = [
  // Documents Subfolders
  {
    id: "work",
    name: "Work",
    icon: "i-material-symbols:folder",
    type: "folder",
    color: "text-blue-400",
    parentId: "Documents",
    size: "--",
    date: "Apr 12, 2026"
  },
  {
    id: "personal",
    name: "Personal",
    icon: "i-material-symbols:folder",
    type: "folder",
    color: "text-blue-400",
    parentId: "Documents",
    size: "--",
    date: "Apr 10, 2026"
  },
  {
    id: "notes",
    name: "Notes.pdf",
    icon: "i-material-symbols:picture-as-pdf",
    type: "file",
    color: "text-red-400",
    parentId: "Documents",
    size: "1.2 MB",
    date: "Apr 11, 2026"
  },
  {
    id: "project-ace",
    name: "Project-Ace",
    icon: "i-material-symbols:folder",
    type: "folder",
    color: "text-blue-400",
    parentId: "work",
    size: "--",
    date: "Mar 20, 2026"
  },
  {
    id: "report",
    name: "Q1-Report.docx",
    icon: "i-material-symbols:description",
    type: "file",
    color: "text-blue-500",
    parentId: "work",
    size: "450 KB",
    date: "Apr 1, 2026"
  },
  {
    id: "safari",
    name: "Safari",
    icon: "i-logos:safari",
    type: "app",
    color: "",
    parentId: "Applications",
    size: "128 MB",
    date: "Jan 1, 2026"
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "i-material-symbols:terminal",
    type: "app",
    color: "text-gray-200",
    parentId: "Applications",
    size: "45 MB",
    date: "Jan 1, 2026"
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: "i-logos:visual-studio-code",
    type: "app",
    color: "",
    parentId: "Applications",
    size: "320 MB",
    date: "Feb 15, 2026"
  },
  {
    id: "web-zip",
    name: "macos-web.zip",
    icon: "i-material-symbols:archive",
    type: "file",
    color: "text-yellow-600",
    parentId: "Downloads",
    size: "15.4 MB",
    date: "Apr 5, 2026"
  },
  {
    id: "avatar",
    name: "Avatar.jpg",
    icon: "i-material-symbols:image",
    type: "file",
    color: "text-orange-400",
    parentId: "Downloads",
    size: "2.1 MB",
    date: "Apr 9, 2026"
  },
  {
    id: "todo",
    name: "To-Do List.txt",
    icon: "i-material-symbols:description",
    type: "file",
    color: "text-gray-400",
    parentId: "Desktop",
    size: "12 KB",
    date: "Apr 12, 2026"
  }
];

const generateKnowledgeFiles = (data: TerminalData[], parentId: string): FileItem[] => {
  const files: FileItem[] = [];
  data.forEach((item) => {
    files.push({
      id: item.id,
      name: item.title,
      icon:
        item.type === "folder"
          ? "i-material-symbols:folder"
          : "i-material-symbols:description",
      type: item.type as any,
      color: item.type === "folder" ? "text-blue-400" : "text-gray-400",
      parentId: parentId,
      content: typeof item.content === "string" ? item.content : undefined,
      size: item.type === "folder" ? "--" : "8 KB",
      date: "Apr 12, 2026"
    });
    if (item.children) {
      files.push(...generateKnowledgeFiles(item.children, item.id));
    }
  });
  return files;
};

const FAVORITES = [
  {
    id: "AirDrop",
    name: "AirDrop",
    icon: "i-material-symbols:rss-feed-rounded",
    color: "text-blue-400"
  },
  {
    id: "Recents",
    name: "Recents",
    icon: "i-material-symbols:schedule",
    color: "text-blue-400"
  },
  {
    id: "Applications",
    name: "Applications",
    icon: "i-material-symbols:apps",
    color: "text-blue-400"
  },
  {
    id: "Desktop",
    name: "Desktop",
    icon: "i-material-symbols:desktop-windows",
    color: "text-blue-400"
  },
  {
    id: "Documents",
    name: "Documents",
    icon: "i-material-symbols:folder",
    color: "text-blue-400"
  },
  {
    id: "Downloads",
    name: "Downloads",
    icon: "i-material-symbols:download",
    color: "text-blue-400"
  },
  {
    id: "Knowledge",
    name: "Knowledge",
    icon: "i-material-symbols:local-library",
    color: "text-blue-400"
  }
] as const;

export default function Finder({ openApp }: { openApp?: (id: string) => void }) {
  const [currentPath, setCurrentPath] = useState<string>("Documents");
  const [allFiles, setAllFiles] = useState<FileItem[]>(STATIC_FILES);
  const [history, setHistory] = useState<string[]>(["Documents"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("icon");
  const [sidebarWidth, setSidebarWidth] = useState(180);
  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickLook, setShowQuickLook] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
    targetId: string | null;
  }>({ x: 0, y: 0, visible: false, targetId: null });

  const dark = useStore((state) => state.dark);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const response = await fetch("/knowledge.json");
        if (!response.ok) return;
        const knowledge = await response.json();
        const knowledgeFiles = generateKnowledgeFiles([knowledge], "Knowledge");
        setAllFiles([...STATIC_FILES, ...knowledgeFiles]);
      } catch (e) {
        console.error("Failed to load knowledge in Finder:", e);
      }
    };
    fetchKnowledge();
  }, []);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const windowEl = document.querySelector(".macos-v2-window");
      if (!windowEl) return;
      const rect = windowEl.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      if (newWidth > 120 && newWidth < 400) setSidebarWidth(newWidth);
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", () => setIsResizing(false));
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
    };
  }, [isResizing, handleResize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && selectedId) {
        e.preventDefault();
        setShowQuickLook((prev) => !prev);
      }
      if (e.code === "Escape") {
        setShowQuickLook(false);
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const navigateTo = (path: string, isNew = true) => {
    if (isNew) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(path);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    setCurrentPath(path);
    setSelectedId(null);
    setViewingFile(null);
    setShowQuickLook(false);

    if (path !== "Recents" && path !== "AirDrop") {
      setRecents((prev) => [path, ...prev.filter((p) => p !== path)].slice(0, 10));
    }
  };

  const goBack = () => {
    if (viewingFile) {
      setViewingFile(null);
      return;
    }
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

  const getFiles = (path: string) => {
    if (path === "Recents") {
      return allFiles.filter(
        (f) => recents.includes(f.id) || recents.includes(f.parentId || "")
      );
    }
    let files = allFiles.filter((f) => f.parentId === path);
    if (searchQuery) {
      files = allFiles.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return files;
  };

  const currentFiles = getFiles(currentPath);
  const selectedFile = allFiles.find((f) => f.id === selectedId);

  // Path Calculation
  const getPathArray = (id: string): string[] => {
    const arr: string[] = [];
    let curr = allFiles.find((f) => f.id === id);
    while (curr) {
      arr.unshift(curr.id);
      curr = allFiles.find((f) => f.id === curr?.parentId);
    }
    // Add root sections if not already in
    if (FAVORITES.some((f) => f.id === currentPath) && !arr.includes(currentPath)) {
      arr.unshift(currentPath);
    }
    return arr;
  };

  const pathArray = getPathArray(selectedId || currentPath);

  const handleContextMenu = (e: React.MouseEvent, id: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true, targetId: id });
    if (id) setSelectedId(id);
  };

  return (
    <div
      className={`flex flex-col h-full text-white select-none ${dark ? "bg-[#1e1e1f]" : "bg-[#f6f6f6] text-black"} rounded-lg overflow-hidden font-sans border border-white/5 shadow-2xl relative`}
      onContextMenu={(e) => handleContextMenu(e, null)}
      onClick={() => {
        setSelectedId(null);
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }}
    >
      {/* Toolbar */}
      <div
        className={`h-12 border-b ${dark ? "border-black/30 bg-[#2d2d2e]" : "border-gray-300 bg-[#efeff0]"} flex items-center px-4 space-x-2 shrink-0`}
      >
        <div className="flex space-x-1 mr-4">
          <button
            onClick={goBack}
            disabled={!viewingFile && historyIndex === 0}
            className={`disabled:opacity-20 opacity-80 hover:opacity-100 p-1 rounded transition-colors ${dark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
          >
            <span className="i-material-symbols:chevron-left text-2xl" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className={`disabled:opacity-20 opacity-80 hover:opacity-100 p-1 rounded transition-colors ${dark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
          >
            <span className="i-material-symbols:chevron-right text-2xl" />
          </button>
        </div>
        <div
          className={`font-semibold text-[13.5px] truncate max-w-[150px] ${dark ? "text-white/90" : "text-black/80"}`}
        >
          {viewingFile ? viewingFile.name : currentPath}
        </div>
        <div className="flex-1" />
        <div className="flex space-x-4 items-center">
          <div
            className={`flex rounded-md p-0.5 border ${dark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/10"}`}
          >
            {(["icon", "list", "column"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 py-0.5 rounded-sm transition-all ${viewMode === mode ? (dark ? "bg-white/10 shadow-sm" : "bg-white shadow-sm") : "opacity-40"}`}
              >
                <span
                  className={`i-material-symbols:${mode === "icon" ? "grid-view" : mode === "list" ? "format-list-bulleted" : "view-column"} text-[14px]`}
                />
              </button>
            ))}
          </div>
          <button
            className={`opacity-60 hover:opacity-100 p-1 rounded ${dark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
          >
            <span className="i-material-symbols:share text-[18px]" />
          </button>
          <div
            className={`w-40 border rounded-md px-2 py-0.5 flex items-center space-x-1.5 h-7 focus-within:ring-1 ring-blue-500/50 transition-all ${dark ? "bg-black/20 border-white/10" : "bg-white border-black/10 text-black"}`}
          >
            <span className="i-bx:search opacity-30" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[12px] outline-none w-full placeholder-current opacity-40"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          style={{ width: sidebarWidth }}
          className={`flex flex-col h-full shrink-0 border-r ${dark ? "bg-[#1e1e1f]/60 border-black/30 shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.05)]" : "bg-[#ebebeb] border-gray-300"} p-2 overflow-y-auto no-scrollbar`}
        >
          <div
            className={`text-[10px] font-bold opacity-40 px-3 py-1.5 uppercase tracking-wider ${dark ? "" : "text-black"}`}
          >
            Favorites
          </div>
          {FAVORITES.map((item) => (
            <div
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex items-center space-x-2.5 px-3 py-1 rounded-md text-[13px] group transition-all duration-100 cursor-default ${currentPath === item.id ? (dark ? "bg-white/10 text-white shadow-sm" : "bg-black/10 text-black shadow-sm") : `hover:${dark ? "bg-white/5" : "bg-black/5"} ${dark ? "text-white/70" : "text-black/70"} hover:text-current`}`}
            >
              <span
                className={`${item.icon} text-[18px] ${currentPath === item.id ? "text-blue-400" : "text-blue-500/80 group-hover:text-blue-400"}`}
              />
              <span className={currentPath === item.id ? "font-medium" : ""}>
                {item.name}
              </span>
            </div>
          ))}
          {/* Tags ... */}
        </div>

        {/* Resize Handle */}
        <div
          className="absolute h-full w-1 cursor-col-resize z-10"
          style={{ left: sidebarWidth - 1 }}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        />

        {/* Main Content */}
        <div
          className={`flex-1 overflow-x-auto overflow-y-hidden flex ${dark ? "bg-[#1a1a1b]" : "bg-white"}`}
        >
          {viewingFile ? (
            <div className="size-full overflow-y-auto">
              <MarkdownViewer content={viewingFile.content || ""} />
            </div>
          ) : currentPath === "AirDrop" ? (
            <div className="size-full flex-center flex-col space-y-5">
              <div className="relative size-44 flex-center">
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[ping_4s_infinite]" />
                <div className="size-32 rounded-full border-2 border-white/10 flex-center">
                  <span className="i-material-symbols:rss-feed-rounded text-6xl text-blue-400/50" />
                </div>
              </div>
              <div className="text-center">
                <p
                  className={`text-[15px] font-semibold ${dark ? "text-white/90" : "text-black/90"}`}
                >
                  AirDrop
                </p>
              </div>
            </div>
          ) : (
            <div className="size-full overflow-y-auto">
              {viewMode === "icon" && (
                <div className="p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-x-4 gap-y-6 content-start">
                  {currentFiles.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(item.id);
                        setContextMenu((prev) => ({ ...prev, visible: false }));
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (item.type === "folder") navigateTo(item.id);
                        else if (item.type === "app" && openApp) openApp(item.id);
                        else if (item.type === "file") setViewingFile(item);
                      }}
                      onContextMenu={(e) => handleContextMenu(e, item.id)}
                      className="flex flex-col items-center group cursor-default"
                    >
                      <div
                        className={`size-16 flex-center mb-1 rounded-lg transition-all duration-200 relative ${selectedId === item.id ? "bg-blue-500/25 ring-1 ring-blue-400/30" : "group-hover:bg-white/5"}`}
                      >
                        <span
                          className={`${item.icon} ${item.type === "app" ? "text-[44px] drop-shadow-lg" : `text-[56px] ${item.color} drop-shadow-md`}`}
                        />
                      </div>
                      <span
                        className={`text-[11px] text-center px-1.5 py-0.5 rounded-sm break-all leading-tight max-w-full ${selectedId === item.id ? "bg-blue-600 text-white" : `${dark ? "text-white/90" : "text-black/90"}`}`}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {viewMode === "list" && (
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr
                      className={`sticky top-0 ${dark ? "bg-[#1a1a1b] text-white/40" : "bg-white text-black/40"} border-b ${dark ? "border-white/5" : "border-black/5"}`}
                    >
                      <th className="px-4 py-1 font-medium border-r border-current/5">
                        Name
                      </th>
                      <th className="px-4 py-1 font-medium border-r border-current/5">
                        Date Modified
                      </th>
                      <th className="px-4 py-1 font-medium">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFiles.map((item) => (
                      <tr
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                        }}
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                        className={`${selectedId === item.id ? (dark ? "bg-blue-600/30" : "bg-blue-100") : "odd:bg-black/2"} cursor-default`}
                      >
                        <td className="px-4 py-0.5 flex items-center space-x-2">
                          <span className={`${item.icon} ${item.color} text-[18px]`} />
                          <span>{item.name}</span>
                        </td>
                        <td className="px-4 py-0.5 opacity-40">{item.date}</td>
                        <td className="px-4 py-0.5 opacity-40">{item.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {viewMode === "column" && (
                <div className="flex h-full divide-x divide-current/5 overflow-x-auto overflow-y-hidden">
                  <div className="w-64 flex-shrink-0 overflow-y-auto p-1">
                    {currentFiles.map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                        }}
                        onDoubleClick={() =>
                          item.type === "folder" && navigateTo(item.id)
                        }
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                        className={`flex items-center space-x-2 px-2 py-1 rounded-md cursor-default text-[13px] ${selectedId === item.id ? (dark ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : `hover:${dark ? "bg-white/5" : "bg-black/5"}`}`}
                      >
                        <span
                          className={`${item.icon} ${selectedId === item.id ? "text-white" : item.color} text-[18px]`}
                        />
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.type === "folder" && (
                          <span className="i-material-symbols:chevron-right opacity-40" />
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedFile && (
                    <div className="w-80 flex-shrink-0 flex flex-col items-center p-8 space-y-6 overflow-y-auto">
                      <span
                        className={`${selectedFile.icon} text-[100px] ${selectedFile.color} drop-shadow-2xl`}
                      />
                      <div className="text-center">
                        <h3 className="text-lg font-bold">{selectedFile.name}</h3>
                        <p className="text-xs opacity-40">
                          {selectedFile.type.toUpperCase()} — {selectedFile.size}
                        </p>
                      </div>
                      <div className="w-full space-y-3 pt-4 border-t border-current/10 text-[11px]">
                        <div className="flex justify-between">
                          <span className="opacity-40">Modified</span>
                          <span>{selectedFile.date}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Path Bar & Status Bar Container */}
      <div
        className={`shrink-0 border-t ${dark ? "border-black/30 bg-[#2d2d2e]" : "border-gray-300 bg-[#efeff0]"}`}
      >
        {/* Path Bar */}
        <div className="h-7 px-4 flex items-center space-x-1 overflow-x-auto no-scrollbar border-b border-black/10">
          <span className="i-material-symbols:hard-drive text-sm opacity-50" />
          <span className="text-[11px] opacity-50">Macintosh HD</span>
          {pathArray.map((id, index) => {
            const file = allFiles.find((f) => f.id === id) || { name: id };
            return (
              <React.Fragment key={id}>
                <span className="i-material-symbols:chevron-right text-[10px] opacity-30" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (file.type === "folder" || FAVORITES.some((f) => f.id === id))
                      navigateTo(id);
                  }}
                  className={`text-[11px] hover:underline whitespace-nowrap ${index === pathArray.length - 1 ? "font-bold opacity-100" : "opacity-60"}`}
                >
                  {file.name}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        {/* Status Bar */}
        <div className="h-6 flex-center text-[10px] opacity-40 font-medium">
          {currentFiles.length} items, 42.5 GB available
        </div>
      </div>

      {/* Local Context Menu */}
      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className={`fixed z-[1000] w-52 p-1.5 rounded-lg border shadow-2xl backdrop-blur-2xl ${dark ? "bg-[#2d2d2e]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-black"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-3 py-1 text-[13px] rounded hover:bg-blue-600 hover:text-white cursor-default flex justify-between items-center`}
            >
              Open <span className="opacity-40 text-[10px]">⌘O</span>
            </div>
            <div
              className={`px-3 py-1 text-[13px] rounded hover:bg-blue-600 hover:text-white cursor-default`}
            >
              Get Info
            </div>
            <div className="h-px bg-current/10 my-1 mx-1" />
            <div
              className={`px-3 py-1 text-[13px] rounded hover:bg-blue-600 hover:text-white cursor-default`}
            >
              Move to Trash
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Look Overlay */}
      <AnimatePresence>
        {showQuickLook && selectedFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex-center pointer-events-none"
          >
            <div
              className={`w-[500px] h-[400px] ${dark ? "bg-[#1e1e1f]/95" : "bg-white/95"} backdrop-blur-3xl rounded-xl shadow-2xl border border-white/10 flex-center flex-col p-10 pointer-events-auto`}
            >
              <button
                onClick={() => setShowQuickLook(false)}
                className="absolute top-3 right-3 size-6 flex-center rounded-full hover:bg-black/10"
              >
                <span className="i-material-symbols:close text-sm" />
              </button>
              <span
                className={`${selectedFile.icon} text-[150px] ${selectedFile.color} drop-shadow-2xl mb-8`}
              />
              <div className="text-center">
                <h2 className="text-2xl font-bold">{selectedFile.name}</h2>
                <p className="opacity-50 text-sm mt-2">
                  {selectedFile.size} • {selectedFile.date}
                </p>
              </div>
              {selectedFile.content && (
                <button
                  onClick={() => {
                    setViewingFile(selectedFile);
                    setShowQuickLook(false);
                  }}
                  className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                >
                  Open with Markdown Viewer
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

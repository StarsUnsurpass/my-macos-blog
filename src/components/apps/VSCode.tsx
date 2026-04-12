import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VSCode() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Using github1s as it's more friendly for iframe embedding than vscode.dev
  const repoUrl = "https://github1s.com/Renovamen/playground-macos";

  return (
    <div className="size-full bg-[#1e1e1e] relative overflow-hidden">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1e1e1e]"
          >
            <div className="size-16 mb-6">
              <img
                src="img/icons/vscode.png"
                alt="VSCode Logo"
                className="size-full animate-pulse"
              />
            </div>

            {!error ? (
              <>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="size-full bg-blue-500"
                  />
                </div>
                <span className="mt-4 text-[11px] text-white/30 font-medium tracking-wider uppercase">
                  Connecting to Web Editor...
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center animate-in fade-in duration-500">
                <span className="text-white/50 text-sm mb-4">
                  Embedding might be blocked by your browser.
                </span>
                <button
                  onClick={() => window.open(repoUrl, "_blank")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors"
                >
                  Open in New Tab
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        className="size-full border-none"
        src={repoUrl}
        title="VSCode"
        onLoad={() => {
          // A small delay to ensure internal assets are ready
          setTimeout(() => setLoading(false), 500);
        }}
        onError={() => {
          setError(true);
          setLoading(true);
        }}
      />
    </div>
  );
}

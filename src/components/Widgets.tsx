import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WidgetsProps {
  show: boolean;
  toggleWidgets: () => void;
}

const WidgetCard = ({ title, children, className = "" }: { title?: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-xl overflow-hidden ${className}`}>
    {title && <div className="text-[11px] font-bold text-white/50 mb-2 uppercase tracking-wider">{title}</div>}
    {children}
  </div>
);

export default function Widgets({ show, toggleWidgets }: WidgetsProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleWidgets}
            className="fixed inset-0 z-[100] bg-black/10"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-2 top-9 bottom-2 w-[350px] z-[101] flex flex-col gap-4 p-4 overflow-y-auto no-scrollbar"
          >
            {/* Weather Widget */}
            <WidgetCard className="h-40 bg-gradient-to-br from-blue-500/40 to-blue-600/40">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl font-medium text-white">Shanghai</div>
                  <div className="text-5xl font-light text-white mt-1">18°</div>
                </div>
                <div className="text-right">
                  <span className="i-material-symbols:partly-cloudy-day text-5xl text-yellow-400 shadow-yellow-500/50" />
                  <div className="text-sm text-white/80 mt-2 font-medium">Mostly Sunny</div>
                </div>
              </div>
              <div className="mt-auto flex justify-between text-xs text-white/70 font-medium">
                <span>H:22° L:14°</span>
                <span>Air Quality: 42</span>
              </div>
            </WidgetCard>

            <div className="grid grid-cols-2 gap-4">
              {/* Calendar Widget */}
              <WidgetCard className="aspect-square flex flex-col items-center justify-center text-center">
                <div className="text-red-500 font-bold text-xs mb-1 uppercase tracking-tighter">SATURDAY</div>
                <div className="text-5xl font-light text-white">14</div>
                <div className="mt-2 text-[10px] text-white/50 font-medium">NO EVENTS TODAY</div>
              </WidgetCard>

              {/* Stocks Widget */}
              <WidgetCard className="aspect-square">
                <div className="text-[11px] font-bold text-white/50 mb-2">STOCKS</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">AAPL</span>
                    <span className="bg-green-500/80 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">+1.24%</span>
                  </div>
                  <div className="flex justify-between items-center text-white/40">
                    <span className="text-[10px] font-medium">NVDA</span>
                    <span className="bg-green-500/80 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">+2.15%</span>
                  </div>
                  <div className="flex justify-between items-center text-white/40">
                    <span className="text-[10px] font-medium">MSFT</span>
                    <span className="bg-red-500/80 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">-0.45%</span>
                  </div>
                </div>
              </WidgetCard>
            </div>

            {/* Photos Widget */}
            <WidgetCard title="Photos" className="h-48 group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400" 
                alt="Photos" 
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-4">
                <div className="mt-auto">
                  <div className="text-white text-sm font-medium">On This Day</div>
                  <div className="text-white/60 text-xs">2 years ago</div>
                </div>
              </div>
            </WidgetCard>

            {/* Screen Time Widget */}
            <WidgetCard title="Screen Time" className="h-32">
              <div className="text-2xl font-medium text-white">2h 45m</div>
              <div className="text-xs text-white/50 mb-3 mt-1 underline decoration-white/20 underline-offset-4 cursor-pointer hover:text-white/70 transition-colors inline-block">Daily Average: 3h 12m</div>
              <div className="flex items-end gap-1 h-12">
                {[30, 60, 45, 90, 40, 75, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-green-500/60 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </WidgetCard>

             {/* Find My Widget */}
             <WidgetCard title="Find My" className="h-40">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-blue-500/30 flex-center">
                    <span className="i-material-symbols:laptop-mac-rounded text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">MacBook Pro</div>
                    <div className="text-[10px] text-white/40">With you</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-green-500/30 flex-center">
                    <span className="i-material-symbols:smartphone-rounded text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">iPhone 15 Pro</div>
                    <div className="text-[10px] text-white/40">Home</div>
                  </div>
                </div>
              </div>
            </WidgetCard>

            <button className="mx-auto mt-4 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs font-medium backdrop-blur-md transition-colors border border-white/10 uppercase tracking-widest">
              Edit Widgets
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

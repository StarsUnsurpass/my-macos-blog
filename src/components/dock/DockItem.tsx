import React, { useRef, useState } from "react";
import useRaf from "@rooks/use-raf";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useWindowSize } from "~/hooks";

const useDockHoverAnimation = (
  mouseX: MotionValue,
  ref: React.RefObject<any>,
  dockSize: number,
  dockMag: number
) => {
  const distanceLimit = dockSize * 6;
  const distanceInput = [
    -distanceLimit,
    -distanceLimit / (dockMag * 0.65),
    -distanceLimit / (dockMag * 0.85),
    0,
    distanceLimit / (dockMag * 0.85),
    distanceLimit / (dockMag * 0.65),
    distanceLimit
  ];
  const widthOutput = [
    dockSize,
    dockSize * (dockMag * 0.55),
    dockSize * (dockMag * 0.75),
    dockSize * dockMag,
    dockSize * (dockMag * 0.75),
    dockSize * (dockMag * 0.55),
    dockSize
  ];
  const beyondTheDistanceLimit = distanceLimit + 1;

  const distance = useMotionValue(beyondTheDistanceLimit);
  const widthPX = useSpring(useTransform(distance, distanceInput, widthOutput), {
    stiffness: 1700,
    damping: 90
  });

  useRaf(() => {
    const el = ref.current;
    const mouseXVal = mouseX.get();
    if (el && mouseXVal !== null) {
      const rect = el.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;
      const distanceDelta = mouseXVal - imgCenterX;
      distance.set(distanceDelta);
      return;
    }
    distance.set(beyondTheDistanceLimit);
  }, true);

  return widthPX;
};

interface DockItemProps {
  id: string;
  title: string;
  img: string;
  mouseX: MotionValue;
  desktop: boolean;
  openApp: (id: string) => void;
  isOpen: boolean;
  link?: string;
  dockSize: number;
  dockMag: number;
}

export default function DockItem({
  id,
  title,
  img,
  mouseX,
  desktop,
  openApp,
  isOpen,
  link,
  dockSize,
  dockMag
}: DockItemProps) {
  const liRef = useRef<HTMLLIElement>(null);
  const widthPX = useDockHoverAnimation(mouseX, liRef, dockSize, dockMag);
  const { winWidth } = useWindowSize();

  const renderIconContent = () => {
    // 1. 动态日历
    if (id === "calendar") {
      const now = new Date();
      const dayName = now.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
      const day = now.getDate();
      return (
        <div className="size-full bg-white flex flex-col items-center overflow-hidden border border-black/5 shadow-sm rounded-[18%] scale-[0.85] origin-center">
          <div className="bg-[#ff3b30] w-full h-[32%] flex items-center justify-center text-white font-bold text-[6px] sm:text-[8px] pt-1 uppercase tracking-wider leading-none">
            {dayName}
          </div>
          <div className="flex-1 flex items-center justify-center text-[#1a1a1b] font-medium text-[20px] sm:text-[24px] -mt-1 tracking-tighter">
            {day}
          </div>
        </div>
      );
    }

    const vectorMap: Record<string, { icon: string; color: string; bg: string }> = {
      messages: { icon: "i-material-symbols:chat-bubble-rounded", color: "text-white", bg: "bg-green-500" },
      maps: { icon: "i-material-symbols:map-rounded", color: "text-white", bg: "bg-blue-500" },
      photos: { icon: "i-material-symbols:image-rounded", color: "text-white", bg: "bg-orange-500" },
      finder: { icon: "i-material-symbols:face-outline", color: "text-white", bg: "bg-blue-500" },
      settings: { icon: "i-material-symbols:settings-rounded", color: "text-white", bg: "bg-gray-500" }
    };

    const isHovered = false; // Just to make sure logic is clean
    
    let finalImg = img;

    // 2. 矢量图标前缀处理
    if (finalImg.startsWith("vector:")) {
      const vectorId = finalImg.split(":")[1];
      if (vectorMap[vectorId] || vectorMap[id]) {
        const { icon, color, bg } = vectorMap[vectorId] || vectorMap[id];
        return (
          <div className={`${bg} size-full rounded-[inherit] flex items-center justify-center p-2 shadow-inner border border-white/10`}>
            <span className={`${icon} ${color} text-2xl sm:text-3xl drop-shadow-md`} />
          </div>
        );
      }
    }

    // 3. 默认尝试加载图片
    return (
      <div className="size-full rounded-[inherit] overflow-hidden flex items-center justify-center">
        <img
          src={finalImg}
          alt={title}
          draggable={false}
          className="size-full rounded-[inherit] object-contain pointer-events-none select-none drop-shadow-lg"
          onError={(e) => {
            // 当图片加载失败时，显示矢量降级图标
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent && (vectorMap[id])) {
              const { icon, color, bg } = vectorMap[id];
              parent.className = `${bg} size-full rounded-[inherit] flex items-center justify-center p-2 shadow-inner`;
              // Clear previous content and add span
              parent.innerHTML = "";
              const span = document.createElement("span");
              span.className = `${icon} ${color} text-2xl sm:text-3xl drop-shadow-md`;
              parent.appendChild(span);
            } else {
              // Final fallback to a generic stable icon
              target.src = "https://raw.githubusercontent.com/PiyushSuthar17/macOS-CSS/master/assets/icons/Finder.png";
              target.style.display = "block";
            }
          }}
        />
      </div>
    );
  };

  return (
    <li
      id={`dock-${id}`}
      ref={liRef}
      className="relative flex flex-col items-center justify-center group cursor-default"
      onClick={() => (link ? window.open(link, "_blank") : openApp(id))}
    >
      <p
        className="tooltip absolute inset-x-0 mx-auto w-max rounded-lg bg-black/60 backdrop-blur-2xl text-[12px] text-white px-3 py-1 mb-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] shadow-xl border border-white/5"
        style={{ bottom: "110%" }}
      >
        {title}
      </p>
      
      <motion.div
        className="relative rounded-[13.5%] flex items-center justify-center will-change-[width,height] flex-shrink-0 origin-bottom"
        whileTap={{ scale: 0.9 }}
        animate={{
          y: isOpen ? [0, -10, 0] : 0
        }}
        transition={{
          y: {
            duration: 0.4,
            ease: "easeInOut",
            repeat: isOpen ? Infinity : 0,
            repeatDelay: 2
          }
        }}
        style={winWidth < 640 
          ? { width: "3.2rem", height: "3.2rem" } 
          : { width: widthPX, height: widthPX, aspectRatio: "1/1" }
        }
      >
        {renderIconContent()}
      </motion.div>

      <div
        className={`w-1 h-1 absolute -bottom-1 mx-auto rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
      />
    </li>
  );
}

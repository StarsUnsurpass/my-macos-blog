import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "~/stores";
import { useWindowSize } from "~/hooks";
import { minMarginX, minMarginY, appBarHeight } from "~/utils";

const FullIcon = ({ size }: { size: number }) => (
  <svg
    className="icon"
    viewBox="0 0 13 13"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
  >
    <path d="M9.26 12.03L.006 2.73v9.3H9.26zM2.735.012l9.3 9.3v-9.3h-9.3z" />
  </svg>
);

const ExitFullIcon = ({ size }: { size: number }) => (
  <svg
    className="icon"
    viewBox="0 0 19 19"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
  >
    <path d="M18.373 9.23L9.75.606V9.23h8.624zM.6 9.742l8.623 8.624V9.742H.599z" />
  </svg>
);

interface TrafficProps {
  id: string;
  max: boolean;
  aspectRatio?: number;
  setMax: (id: string, target?: boolean) => void;
  setMin: (id: string) => void;
  close: (id: string) => void;
}

interface WindowProps extends TrafficProps {
  title: string;
  min: boolean;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  x?: number;
  y?: number;
  z: number;
  focus: (id: string) => void;
  stageManager: boolean;
  isForeground: boolean;
  dockCenter?: { x: number; y: number };
  children: React.ReactNode;
}

interface WindowState {
  width: number;
  height: number;
  x: number;
  y: number;
}

const TrafficLights = ({ id, close, aspectRatio, max, setMax, setMin }: TrafficProps) => {
  const disableMax = aspectRatio !== undefined;

  const closeWindow = (e: React.MouseEvent | React.TouchEvent): void => {
    e.stopPropagation();
    close(id);
  };

  return (
    <div 
      className="macos-v2-controls absolute left-0 pl-3 mt-2 z-10"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        className="macos-v2-control macos-v2-control-close group flex items-center justify-center"
        onClick={closeWindow}
        onTouchEnd={closeWindow}
      >
        <span className="icon i-gg:close text-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-black/50" />
      </button>
      <button
        className={`macos-v2-control macos-v2-control-minimize group flex items-center justify-center ${max ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={(e) => { e.stopPropagation(); !max && setMin(id); }}
        onTouchEnd={(e) => { e.stopPropagation(); !max && setMin(id); }}
        disabled={max}
      >
        <span className={`icon i-fe:minus text-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-black/50 ${max ? "invisible" : ""}`} />
      </button>
      <button
        className={`macos-v2-control macos-v2-control-maximize group flex items-center justify-center ${
          disableMax ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={(e) => { e.stopPropagation(); !disableMax && setMax(id); }}
        onTouchEnd={(e) => { e.stopPropagation(); !disableMax && setMax(id); }}
        disabled={disableMax}
      >
        {!disableMax && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-black/50">
             {max ? <ExitFullIcon size={8} /> : <FullIcon size={5} />}
          </div>
        )}
      </button>
    </div>
  );
};

const Window = (props: WindowProps) => {
  const dockSize = useStore((state) => state.dockSize);
  const { winWidth, winHeight } = useWindowSize();

  const initWidth = Math.min(winWidth, props.width || 640);
  const initHeight = Math.min(winHeight, props.height || 400);

  const [state, setState] = useState<WindowState>({
    width: initWidth,
    height: initHeight,
    x: (window.innerWidth - initWidth) / 2,
    y: (window.innerHeight - initHeight - dockSize - minMarginY) / 2
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      width: Math.min(winWidth, prev.width),
      height: Math.min(winHeight, prev.height)
    }));
  }, [winWidth, winHeight]);

  const round = props.max ? "rounded-none" : "rounded-lg";
  
  const width = props.max ? winWidth : state.width;
  const height = props.max ? winHeight : state.height;
  const disableMax = props.aspectRatio !== undefined;

  const children = React.cloneElement(props.children as React.ReactElement, {
    width: width
  });

  const stageStyle = props.stageManager && !props.max ? {
    transform: props.isForeground 
      ? "translateX(60px) scale(0.95)" 
      : "translateX(-200px) scale(0.8)",
    transition: "transform 0.4s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.4s",
    opacity: props.isForeground ? 1 : 0,
    pointerEvents: props.isForeground ? ("auto" as const) : ("none" as const)
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: props.min ? 0 : 1,
        scale: props.min ? 0.05 : 1,
        x: props.min ? (props.dockCenter?.x || 0) - (state.x + width / 2) : 0,
        y: props.min ? (props.dockCenter?.y || window.innerHeight) - (state.y + height / 2) : 0,
        filter: props.min ? "blur(10px) brightness(1.2)" : "blur(0px) brightness(1)",
        rotateX: props.min ? 10 : 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.1,
        x: (props.dockCenter?.x || 0) - (state.x + width / 2),
        y: (props.dockCenter?.y || window.innerHeight) - (state.y + height / 2),
        filter: "blur(20px)",
      }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] // Custom snappy ease
      }}
      className={`absolute inset-0 ${props.min ? "pointer-events-none invisible" : "pointer-events-auto visible"}`}
      style={{
        zIndex: props.z,
        perspective: "1000px"
      }}
    >
      <Rnd
        bounds="parent"
        size={{ width, height }}
        position={{
          x: props.max ? 0 : state.x,
          y: props.max ? -minMarginY : state.y
        }}
        onDragStop={(e, d) => {
          setState((prev) => ({ ...prev, x: d.x, y: d.y }));
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setState((prev) => ({
            ...prev,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            ...position
          }));
        }}
        minWidth={props.minWidth || 200}
        minHeight={props.minHeight || 150}
        dragHandleClassName="window-bar"
        disableDragging={props.max || (props.stageManager && !props.isForeground)}
        enableResizing={!props.max && !(props.stageManager && !props.isForeground)}
        lockAspectRatio={props.aspectRatio}
        lockAspectRatioExtraHeight={props.aspectRatio ? appBarHeight : undefined}
        style={{ ...stageStyle, pointerEvents: "auto" }}
        onMouseDown={() => props.focus(props.id)}
        className={`macos-v2-window ${round} ${props.isForeground ? "focused" : ""}`}
        id={`window-${props.id}`}
      >
        <div
          className="window-bar macos-v2-window-header relative text-center flex items-center justify-center"
          onDoubleClick={() => !disableMax && props.setMax(props.id)}
        >
          <TrafficLights
            id={props.id}
            max={props.max}
            aspectRatio={props.aspectRatio}
            setMax={props.setMax}
            setMin={props.setMin}
            close={props.close}
          />
          <span className="font-bold text-white/60 text-[13px] pointer-events-none">{props.title}</span>
        </div>
        <div className="inner-window w-full h-[calc(100%-28px)] overflow-y-hidden">{children}</div>
      </Rnd>
    </motion.div>
  );
};

export default Window;

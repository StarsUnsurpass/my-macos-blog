import React from "react";
import { useMotionValue } from "framer-motion";
import { useStore } from "~/stores";
import { apps } from "~/configs";
import DockItem from "./DockItem";

interface DockProps {
  open: (id: string) => void;
  showApps: {
    [key: string]: boolean;
  };
  showLaunchpad: boolean;
  toggleLaunchpad: (target: boolean) => void;
  hide: boolean;
}

export default function Dock({
  open,
  showApps,
  showLaunchpad,
  toggleLaunchpad,
  hide
}: DockProps) {
  const { dockSize, dockMag } = useStore((state) => ({
    dockSize: state.dockSize,
    dockMag: state.dockMag
  }));

  const openApp = (id: string) => {
    if (id === "launchpad") toggleLaunchpad(!showLaunchpad);
    else {
      toggleLaunchpad(false);
      open(id);
    }
  };

  const mouseX = useMotionValue<number | null>(null);

  return (
    <div
      className={`dock fixed inset-x-0 mx-auto bottom-3 ${hide ? "z-0" : "z-50"}`}
      style={{ width: "max-content", overflowX: "visible" }}
    >
      <ul
        className="flex space-x-2 px-2 macos-v2-dock"
        onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(null)}
        style={{
          height: `${(dockSize + 15) / 16}rem`
        }}
      >
        {apps.map((app, index) => (
          <React.Fragment key={`dock-fragment-${app.id}`}>
            {index === apps.length - 2 && (
              <div className="w-[1px] h-3/5 bg-white/20 self-center mx-1" />
            )}
            <DockItem
              id={app.id}
              title={app.title}
              img={app.img}
              mouseX={mouseX}
              desktop={app.desktop}
              openApp={openApp}
              isOpen={app.desktop && showApps[app.id]}
              link={app.link}
              dockSize={dockSize}
              dockMag={dockMag}
            />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

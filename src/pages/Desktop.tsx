import React, { useState, useEffect } from "react";
import { apps, wallpapers } from "~/configs";
import { minMarginY } from "~/utils";
import { useStore } from "~/stores";
import { useWindowSize } from "~/hooks";
import { AnimatePresence } from "framer-motion";
import type { MacActions } from "~/types";
import ContextMenu from "~/components/ContextMenu";
import AppWindow from "~/components/AppWindow";
import Spotlight from "~/components/Spotlight";
import Launchpad from "~/components/Launchpad";
import Dock from "~/components/dock/Dock";
import TopBar from "~/components/menus/TopBar";
import Widgets from "~/components/Widgets";
import StageManager from "~/components/StageManager";

interface DesktopState {
  showApps: { [key: string]: boolean };
  appsZ: { [key: string]: number };
  maxApps: { [key: string]: boolean };
  minApps: { [key: string]: boolean };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
  widgets: boolean;
  dockCenters: { [key: string]: { x: number; y: number } };
}

export default function Desktop(props: MacActions) {
  const [state, setState] = useState<DesktopState>({
    showApps: {},
    appsZ: {},
    maxApps: {},
    minApps: {},
    maxZ: 10,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false,
    widgets: false,
    dockCenters: {}
  });

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  const dark = useStore((state) => state.dark);
  const brightness = useStore((state) => state.brightness);
  const stageManager = useStore((state) => state.stageManager);

  useEffect(() => {
    const showApps: { [key: string]: boolean } = {};
    const appsZ: { [key: string]: number } = {};
    const maxApps: { [key: string]: boolean } = {};
    const minApps: { [key: string]: boolean } = {};
    const dockCenters: { [key: string]: { x: number; y: number } } = {};

    apps.forEach((app) => {
      showApps[app.id] = !!app.show;
      appsZ[app.id] = 2;
      maxApps[app.id] = false;
      minApps[app.id] = false;
      dockCenters[app.id] = { x: window.innerWidth / 2, y: window.innerHeight };
    });

    setState((s) => ({ ...s, showApps, appsZ, maxApps, minApps, dockCenters }));
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const toggleLaunchpad = (target: boolean): void => {
    setState((s) => ({ ...s, showLaunchpad: target }));
  };

  const toggleSpotlight = (): void => {
    setState((s) => ({ ...s, spotlight: !s.spotlight }));
  };

  const toggleWidgets = (): void => {
    setState((s) => ({ ...s, widgets: !s.widgets }));
  };

  const getDockCenter = (id: string): { x: number; y: number } => {
    const rIcon = document.querySelector(`#dock-${id}`) as HTMLElement;
    if (rIcon) {
      const rect = rIcon.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight };
  };

  const setAppMax = (id: string, target?: boolean): void => {
    setState((s) => {
      const newMaxApps = { ...s.maxApps };
      newMaxApps[id] = target !== undefined ? target : !newMaxApps[id];
      return { ...s, maxApps: newMaxApps, hideDockAndTopbar: newMaxApps[id] };
    });
  };

  const minimizeApp = (id: string): void => {
    const center = getDockCenter(id);
    setState((s) => {
      const newMinApps = { ...s.minApps };
      newMinApps[id] = true;
      const newDockCenters = { ...s.dockCenters };
      newDockCenters[id] = center;
      return { ...s, minApps: newMinApps, dockCenters: newDockCenters };
    });
  };

  const closeApp = (id: string): void => {
    setState((s) => {
      const newShowApps = { ...s.showApps };
      newShowApps[id] = false;
      const newMaxApps = { ...s.maxApps };
      newMaxApps[id] = false;
      return {
        ...s,
        showApps: newShowApps,
        maxApps: newMaxApps,
        hideDockAndTopbar: false
      };
    });
  };

  const openApp = (id: string): void => {
    setState((s) => {
      const newShowApps = { ...s.showApps };
      newShowApps[id] = true;
      const newAppsZ = { ...s.appsZ };
      const newMaxZ = s.maxZ + 1;
      newAppsZ[id] = newMaxZ;
      const newMinApps = { ...s.minApps };
      newMinApps[id] = false;
      const currentApp = apps.find((app) => app.id === id);

      return {
        ...s,
        showApps: newShowApps,
        appsZ: newAppsZ,
        maxZ: newMaxZ,
        minApps: newMinApps,
        currentTitle: currentApp ? currentApp.title : s.currentTitle
      };
    });
  };

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover bg-[#1e1e1f]"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
        filter: `brightness( ${brightness * 0.7 + 50}% )`
      }}
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <TopBar
        title={state.currentTitle}
        setLogin={props.setLogin}
        shutMac={props.shutMac}
        sleepMac={props.sleepMac}
        restartMac={props.restartMac}
        toggleSpotlight={toggleSpotlight}
        toggleWidgets={toggleWidgets}
        openApp={openApp}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
      />

      <div
        id="window-container"
        className="z-10 fixed"
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          marginTop: minMarginY,
          pointerEvents: "none"
        }}
      >
        <AnimatePresence>
          {apps.map((app) =>
            app.desktop && state.showApps[app.id] ? (
              <AppWindow
                key={`desktop-app-${app.id}`}
                id={app.id}
                title={app.title}
                width={app.width}
                height={app.height}
                minWidth={app.minWidth}
                minHeight={app.minHeight}
                aspectRatio={app.aspectRatio}
                x={app.x}
                y={app.y}
                z={state.appsZ[app.id]}
                max={state.maxApps[app.id]}
                min={state.minApps[app.id]}
                close={closeApp}
                setMax={setAppMax}
                setMin={minimizeApp}
                focus={openApp}
                stageManager={stageManager}
                isForeground={state.appsZ[app.id] === state.maxZ}
                dockCenter={state.dockCenters[app.id]}
              >
                {React.cloneElement(app.content as React.ReactElement, { openApp })}
              </AppWindow>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}

      <Launchpad
        show={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        openApp={openApp}
      />

      <StageManager
        show={stageManager}
        showApps={state.showApps}
        appsZ={state.appsZ}
        maxZ={state.maxZ}
        openApp={openApp}
      />

      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />

      <Widgets show={state.widgets} toggleWidgets={toggleWidgets} />

      <ContextMenu {...contextMenu} onClose={closeContextMenu} />

      {/* ICP Filing - Subtle at bottom */}
      <div className="absolute bottom-2 w-full text-center pointer-events-none z-0">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-white/20 hover:text-white/60 transition-colors pointer-events-auto"
        >
          冀ICP备2026007988号
        </a>
      </div>
    </div>
  );
}

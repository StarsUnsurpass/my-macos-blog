import React from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { music } from "~/configs";
import { useStore } from "~/stores";
import { useRef } from "react";
import { useClickOutside } from "~/hooks";

interface SliderProps {
  icon: string;
  value: number;
  setValue: (value: number) => void;
}

const SliderComponent = ({ icon, value, setValue }: SliderProps) => (
  <div className="slider flex items-center relative w-full h-7">
    <Slider
      min={1}
      max={100}
      value={value}
      tooltip={false}
      orientation="horizontal"
      onChange={(v: number) => setValue(v)}
    />
    <div className="absolute left-2 pointer-events-none flex items-center">
      <span className={`${icon} text-black/50 text-[14px]`} />
    </div>
  </div>
);

interface CCMProps {
  toggleControlCenter: () => void;
  toggleAudio: (target: boolean) => void;
  setBrightness: (value: number) => void;
  setVolume: (value: number) => void;
  playing: boolean;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function ControlCenterMenu({
  toggleControlCenter,
  toggleAudio,
  setBrightness,
  setVolume,
  playing,
  btnRef
}: CCMProps) {
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const { dark, wifi, brightness, bluetooth, airdrop, fullscreen, volume, stageManager } = useStore(
    (state) => ({
      dark: state.dark,
      wifi: state.wifi,
      brightness: state.brightness,
      bluetooth: state.bluetooth,
      airdrop: state.airdrop,
      fullscreen: state.fullscreen,
      volume: state.volume,
      stageManager: state.stageManager
    })
  );
  const { toggleWIFI, toggleBluetooth, toggleAirdrop, toggleDark, toggleFullScreen, toggleStageManager } =
    useStore((state) => ({
      toggleWIFI: state.toggleWIFI,
      toggleBluetooth: state.toggleBluetooth,
      toggleAirdrop: state.toggleAirdrop,
      toggleDark: state.toggleDark,
      toggleFullScreen: state.toggleFullScreen,
      toggleStageManager: state.toggleStageManager
    }));

  useClickOutside(controlCenterRef, toggleControlCenter, [btnRef]);

  return (
    <div
      className="w-[320px] shadow-2xl p-3 macos-v2-panel text-c-black"
      pos="fixed top-9.5 right-0 sm:right-1.5"
      grid="~ cols-4 rows-5 gap-3"
      ref={controlCenterRef}
      style={{ zIndex: 100 }}
    >
      <div className="macos-v2-cc-grid row-span-2 col-span-2 p-3 flex flex-col justify-around">
        <div className="hstack space-x-3 cursor-pointer group" onClick={toggleWIFI}>
          <div className={`${wifi ? "cc-btn" : "cc-btn-active"}`}>
            <span className="i-material-symbols:wifi-rounded text-base" />
          </div>
          <div>
            <div className="font-bold text-[13px] leading-tight">Wi-Fi</div>
            <div className="cc-text text-[11px] opacity-70 group-hover:opacity-100 transition-opacity">{wifi ? "Home" : "Off"}</div>
          </div>
        </div>
        <div className="hstack space-x-3 cursor-pointer group" onClick={toggleBluetooth}>
          <div
            className={`${bluetooth ? "cc-btn" : "cc-btn-active"}`}
          >
            <span className="i-material-symbols:bluetooth-rounded text-base" />
          </div>
          <div>
            <div className="font-bold text-[13px] leading-tight">Bluetooth</div>
            <div className="cc-text text-[11px] opacity-70 group-hover:opacity-100 transition-opacity">{bluetooth ? "On" : "Off"}</div>
          </div>
        </div>
        <div className="hstack space-x-3 cursor-pointer group" onClick={toggleAirdrop}>
          <div
            className={`${airdrop ? "cc-btn" : "cc-btn-active"}`}
          >
            <span className="i-material-symbols:rss-feed-rounded text-base" />
          </div>
          <div>
            <div className="font-bold text-[13px] leading-tight">AirDrop</div>
            <div className="cc-text text-[11px] opacity-70 group-hover:opacity-100 transition-opacity">{airdrop ? "Contacts Only" : "Off"}</div>
          </div>
        </div>
      </div>
      <div className="macos-v2-cc-grid col-span-2 p-3 hstack space-x-3 cursor-pointer active:opacity-70 transition-opacity" onClick={toggleDark}>
        <div className={`${dark ? "cc-btn" : "cc-btn-active"}`}>
          {dark ? (
            <span className="i-ion:moon text-base" />
          ) : (
            <span className="i-material-symbols:sunny-rounded text-base" />
          )}
        </div>
        <div className="font-bold text-[13px]">{dark ? "Dark Mode" : "Light Mode"}</div>
      </div>
      <div 
        className={`macos-v2-cc-grid flex-center flex-col p-2 cursor-pointer active:opacity-70 transition-opacity ${stageManager ? "bg-blue-500 text-white" : ""}`}
        onClick={toggleStageManager}
      >
        <span className={`i-material-symbols:grid-view text-xl mb-1 ${stageManager ? "text-white" : ""}`} />
        <span className="text-[10px] text-center font-bold leading-tight">
          Stage Manager
        </span>
      </div>
      <div
        className="macos-v2-cc-grid flex-center flex-col cursor-pointer active:opacity-70 transition-opacity p-2"
        onClick={() => toggleFullScreen(!fullscreen)}
      >
        {fullscreen ? (
          <span className="i-material-symbols:fullscreen-exit-rounded text-xl mb-1" />
        ) : (
          <span className="i-material-symbols:fullscreen-rounded text-xl mb-1" />
        )}
        <span className="text-[10px] text-center font-bold leading-tight">
          {fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </span>
      </div>
      <div className="macos-v2-cc-grid col-span-4 px-3 py-2 flex flex-col justify-center">
        <span className="font-bold text-[12px] mb-1">Display</span>
        <SliderComponent icon="i-material-symbols:sunny-rounded" value={brightness} setValue={setBrightness} />
      </div>
      <div className="macos-v2-cc-grid col-span-4 px-3 py-2 flex flex-col justify-center">
        <span className="font-bold text-[12px] mb-1">Sound</span>
        <SliderComponent icon="i-material-symbols:volume-up-rounded" value={volume} setValue={setVolume} />
      </div>
      <div className="macos-v2-cc-grid col-span-4 hstack space-x-3 p-3">
        <img className="w-12 h-12 rounded-lg shadow-md" src={music.cover} alt="cover art" />
        <div className="flex-1 overflow-hidden">
          <div className="font-bold text-[13px] truncate">{music.title}</div>
          <div className="text-[11px] opacity-70 truncate">{music.artist}</div>
        </div>
        {playing ? (
          <span className="i-material-symbols:pause-circle-rounded text-2xl cursor-pointer hover:scale-110 transition-transform" onClick={() => toggleAudio(false)} />
        ) : (
          <span className="i-material-symbols:play-circle-rounded text-2xl cursor-pointer hover:scale-110 transition-transform" onClick={() => toggleAudio(true)} />
        )}
      </div>
    </div>
  );
}

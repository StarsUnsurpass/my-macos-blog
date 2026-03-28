import type { StateCreator } from "zustand";
import { enterFullScreen, exitFullScreen } from "~/utils";

export interface SystemSlice {
  dark: boolean;
  volume: number;
  brightness: number;
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;
  fullscreen: boolean;
  stageManager: boolean;
  toggleDark: () => void;
  toggleWIFI: () => void;
  toggleBluetooth: () => void;
  toggleAirdrop: () => void;
  toggleFullScreen: (v: boolean) => void;
  toggleStageManager: () => void;
  setDark: (v: boolean) => void;
  setVolume: (v: number) => void;
  setBrightness: (v: number) => void;
  checkAutoDark: () => void;
}

export const createSystemSlice: StateCreator<SystemSlice> = (set) => ({
  dark: false,
  volume: 100,
  brightness: 80,
  wifi: true,
  bluetooth: true,
  airdrop: true,
  fullscreen: false,
  stageManager: false,
  toggleDark: () =>
    set((state) => {
      if (!state.dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return { dark: !state.dark };
    }),
  checkAutoDark: () => {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;
    set((state) => {
      if (state.dark !== isNight) {
        if (isNight) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        return { dark: isNight };
      }
      return {};
    });
  },
  toggleWIFI: () => set((state) => ({ wifi: !state.wifi })),
  toggleBluetooth: () => set((state) => ({ bluetooth: !state.bluetooth })),
  toggleAirdrop: () => set((state) => ({ airdrop: !state.airdrop })),
  toggleFullScreen: (v) =>
    set(() => {
      v ? enterFullScreen() : exitFullScreen();
      return { fullscreen: v };
    }),
  toggleStageManager: () => set((state) => ({ stageManager: !state.stageManager })),
  setDark: (v) => set(() => {
    if (v) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    return { dark: v };
  }),
  setVolume: (v) => set(() => ({ volume: v })),
  setBrightness: (v) => set(() => ({ brightness: v }))
});

import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import { AnimatePresence, motion } from "framer-motion";

import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";

export default function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [booting, setBooting] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);
  const [sleep, setSleep] = useState<boolean>(false);
  const [shutdown, setShutdown] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0.8);

  const shutMac = (e: React.MouseEvent): void => {
    if (e) e.stopPropagation();
    setDuration(1.2);
    setRestart(false);
    setSleep(false);
    setLogin(false);
    setBooting(true);
    setShutdown(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    if (e) e.stopPropagation();
    setDuration(1.2);
    setRestart(true);
    setSleep(false);
    setLogin(false);
    setBooting(true);
    setShutdown(false);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    if (e) e.stopPropagation();
    setDuration(0.3);
    setRestart(false);
    setSleep(true);
    setLogin(false);
    setBooting(true);
    setShutdown(false);
  };

  return (
    <div className="size-full bg-black overflow-hidden">
      <AnimatePresence>
        {booting ? (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "brightness(0.5) blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="size-full"
          >
            <Boot 
              restart={restart} 
              sleep={sleep} 
              shutdown={shutdown}
              setBooting={setBooting} 
              setShutdown={setShutdown}
            />
          </motion.div>
        ) : login ? (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="size-full"
          >
            <Desktop
              setLogin={setLogin}
              shutMac={shutMac}
              sleepMac={sleepMac}
              restartMac={restartMac}
            />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
            className="size-full"
          >
            <Login
              setLogin={setLogin}
              shutMac={shutMac}
              sleepMac={sleepMac}
              restartMac={restartMac}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

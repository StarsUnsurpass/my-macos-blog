import React, { useState, useEffect } from "react";
import { useInterval } from "~/hooks";
import { motion } from "framer-motion";

interface BootProps {
  restart: boolean;
  sleep: boolean;
  shutdown: boolean;
  setBooting: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  setShutdown: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const loadingInterval = 1;
const bootingInterval = 500;

export default function Boot({ restart, sleep, shutdown, setBooting, setShutdown }: BootProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    if (restart && !sleep) setLoading(true);
  }, [restart, sleep]);

  useInterval(
    () => {
      const newPercent = percent + 0.15;
      if (newPercent >= 100) {
        setTimeout(() => {
          setBooting(false);
          setLoading(false);
        }, bootingInterval);
      } else setPercent(newPercent);
    },
    loading ? loadingInterval : null
  );

  const handleClick = () => {
    if (sleep) setBooting(false);
    else if (restart || loading) return;
    else if (shutdown) {
      setShutdown(false);
      setLoading(true);
    } else setLoading(true);
  };

  return (
    <div className="size-full bg-black flex flex-col items-center justify-center" onClick={handleClick}>
      {(!shutdown || loading) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="i-fa-brands:apple text-white -mt-10 size-20 sm:size-24" 
        />
      )}
      
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute top-1/2 inset-x-0 w-56 h-[4px] sm:h-[5px] bg-[#333] rounded-full overflow-hidden"
          m="t-16 sm:t-24 x-auto"
        >
          <motion.span
            className="absolute top-0 left-0 bg-white h-full rounded-full"
            style={{ width: `${percent}%` }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          />
        </motion.div>
      )}
      
      {(!restart && !loading) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute top-1/2 inset-x-0"
          m="t-16 sm:t-20 x-auto"
          text="sm gray-400 center"
        >
          {shutdown ? "Touch ID or press power button to start" : (sleep ? "Click to wake up" : "Click to boot")}
        </motion.div>
      )}
    </div>
  );
}

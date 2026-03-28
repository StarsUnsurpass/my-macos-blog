import React, { useState } from "react";
import { wallpapers, user } from "~/configs";
import { useStore } from "~/stores";
import { sha256 } from "~/utils";
import type { MacActions } from "~/types";

export default function Login(props: MacActions) {
  const [password, setPassword] = useState("");
  const [sign, setSign] = useState("Click to enter");
  const dark = useStore((state) => state.dark);

  const keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    if (keyCode === "Enter") loginHandle();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const loginHandle = async () => {
    // 防御性检查
    if (!user) {
      props.setLogin(true);
      return;
    }
    
    // Hash the input password if it's not empty
    const inputHash = password ? await sha256(password) : "";
    
    // Decode stored hash (Base64 obfuscated)
    const storedHash = user.password ? atob(user.password) : "";
    
    if (storedHash === "" || storedHash === inputHash) {
      // not set password or password correct
      if (storedHash !== "" && password === "") {
        setSign("Password required");
        return;
      }
      props.setLogin(true);
    } else {
      // password incorrect
      setSign("Incorrect password");
    }
  };

  const bgUrl = dark ? wallpapers.night : wallpapers.day;

  return (
    <div
      className="size-full login text-center flex flex-col items-center justify-center relative"
      style={{
        backgroundColor: "#000",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      onClick={() => loginHandle()}
    >
      <div className="flex flex-col items-center -mt-20">
        {/* Avatar */}
        <div className="size-24 rounded-full overflow-hidden shadow-2xl mb-4 border-2 border-white/20 bg-gray-800">
          {user.avatar && <img className="size-full object-cover" src={user.avatar} alt="img" />}
        </div>
        <div className="font-bold text-2xl text-white mb-6 tracking-tight">{user.name}</div>

        {/* Password Input Area */}
        <div className="flex flex-col items-center space-y-4">
          <input
            className="macos-v2-login-input w-48 text-center text-[13px] placeholder-white/60 shadow-lg"
            type="password"
            placeholder="Enter Password"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={keyPress}
            value={password}
            onChange={handleInputChange}
            autoFocus
          />
          
          <div className="text-[13px] text-white/80 cursor-pointer hover:text-white transition-colors">
            {sign}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-16 flex space-x-12">
        <div
          className="flex flex-col items-center space-y-2 group cursor-pointer"
          onClick={(e) => { e.stopPropagation(); props.sleepMac(e); }}
        >
          <div className="macos-v2-login-button shadow-lg">
            <span className="i-gg:sleep text-2xl text-white" />
          </div>
          <span className="text-[11px] text-white font-medium opacity-80 group-hover:opacity-100">Sleep</span>
        </div>
        
        <div
          className="flex flex-col items-center space-y-2 group cursor-pointer"
          onClick={(e) => { e.stopPropagation(); props.restartMac(e); }}
        >
          <div className="macos-v2-login-button shadow-lg">
            <span className="i-ri:restart-line text-2xl text-white" />
          </div>
          <span className="text-[11px] text-white font-medium opacity-80 group-hover:opacity-100">Restart</span>
        </div>

        <div
          className="flex flex-col items-center space-y-2 group cursor-pointer"
          onClick={(e) => { e.stopPropagation(); props.shutMac(e); }}
        >
          <div className="macos-v2-login-button shadow-lg">
            <span className="i-ri:shut-down-line text-2xl text-white" />
          </div>
          <span className="text-[11px] text-white font-medium opacity-80 group-hover:opacity-100">Shut Down</span>
        </div>
      </div>
      {/* ICP Filing */}
      <div className="absolute bottom-6 w-full text-center">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-white/40 hover:text-white/80 transition-colors"
        >
          冀ICP备2026007988号
        </a>
      </div>
    </div>
  );
}

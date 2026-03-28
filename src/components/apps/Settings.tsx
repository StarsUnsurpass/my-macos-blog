import React, { useState } from "react";
import { useStore } from "~/stores";
import { motion, AnimatePresence } from "framer-motion";

type SettingSection = 
  | "Wi-Fi"
  | "Bluetooth"
  | "Network"
  | "Appearance" 
  | "General" 
  | "Desktop & Dock" 
  | "Accessibility" 
  | "Control Center"
  | "Wallpaper"
  | "Displays"
  | "Sound"
  | "Battery";

interface NavState {
  section: SettingSection;
  sub?: string;
}

interface SettingRowProps {
  label: string;
  icon?: string;
  iconBg?: string;
  children?: React.ReactNode;
  hint?: string;
  onClick?: () => void;
  border?: boolean;
}

const SettingRow = ({ label, icon, iconBg, children, hint, onClick, border = true }: SettingRowProps) => {
  const dark = useStore(s => s.dark);
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 transition-colors ${onClick ? "cursor-default hover:bg-black/5 dark:hover:bg-white/5" : ""} ${border ? "border-b border-black/5 dark:border-white/5" : ""}`}
    >
      <div className="flex items-center space-x-3">
        {icon && (
          <div className={`size-7 rounded-md ${iconBg} flex-center text-white shadow-sm ring-1 ring-black/5`}>
            <span className={`${icon} text-lg`} />
          </div>
        )}
        <span className={`text-[13.5px] font-medium ${dark ? "text-white" : "text-black"}`}>{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {hint && <span className="text-[12px] opacity-40">{hint}</span>}
        {children}
        {onClick && !children && <span className="i-material-symbols:chevron-right text-xl opacity-20" />}
      </div>
    </div>
  );
};

const Group = ({ title, children }: { title?: string, children: React.ReactNode }) => {
  const dark = useStore(s => s.dark);
  return (
    <div className="mb-6">
      {title && <h2 className="text-[11px] font-bold opacity-40 uppercase tracking-widest mb-2 px-1">{title}</h2>}
      <div className={`rounded-xl border overflow-hidden ${dark ? "bg-white/5 border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
        {children}
      </div>
    </div>
  );
};

const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`w-10 h-5.5 rounded-full relative p-0.5 transition-all duration-200 cursor-default ring-1 ring-black/5 shadow-inner ${active ? "bg-blue-600" : "bg-gray-300 dark:bg-white/10"}`}
  >
    <motion.div 
      animate={{ x: active ? 18 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="size-4.5 bg-white rounded-full shadow-lg"
    />
  </div>
);

const Slider = ({ value, min, max, onChange, iconStart, iconEnd }: any) => (
  <div className="flex items-center space-x-3 w-48">
    {iconStart && <span className={`${iconStart} text-lg opacity-40`} />}
    <input 
      type="range" min={min} max={max} 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="flex-1 accent-blue-500 h-1.5 rounded-full bg-black/10 dark:bg-white/10"
    />
    {iconEnd && <span className={`${iconEnd} text-xl opacity-60`} />}
  </div>
);

export default function Settings() {
  const [nav, setNav] = useState<NavState>({ section: "Appearance" });
  const [search, setSearch] = useState("");
  
  const activeSection = nav.section;
  const subSection = nav.sub;

  const setSection = (section: SettingSection) => setNav({ section });
  const pushSub = (sub: string) => setNav({ ...nav, sub });
  const popSub = () => setNav({ section: nav.section });
  const { 
    dockSize, setDockSize, 
    dockMag, setDockMag, 
    dark, setDark,
    brightness, setBrightness,
    volume, setVolume,
    wifi, toggleWIFI,
    bluetooth, toggleBluetooth,
    stageManager, toggleStageManager,
    airdrop, toggleAirdrop
  } = useStore();

  const sidebarItems = [
    { name: "Wi-Fi", icon: "i-material-symbols:wifi-rounded", color: "bg-blue-500" },
    { name: "Bluetooth", icon: "i-material-symbols:bluetooth-rounded", color: "bg-blue-600" },
    { name: "Network", icon: "i-material-symbols:globe-rounded", color: "bg-blue-500" },
    { type: "divider" },
    { name: "General", icon: "i-material-symbols:settings-rounded", color: "bg-gray-500" },
    { name: "Appearance", icon: "i-material-symbols:palette-rounded", color: "bg-blue-500" },
    { name: "Accessibility", icon: "i-material-symbols:accessibility-new-rounded", color: "bg-blue-400" },
    { name: "Control Center", icon: "i-material-symbols:tune-rounded", color: "bg-blue-600" },
    { name: "Desktop & Dock", icon: "i-material-symbols:desktop-windows-rounded", color: "bg-blue-700" },
    { type: "divider" },
    { name: "Displays", icon: "i-material-symbols:display-settings-rounded", color: "bg-blue-500" },
    { name: "Wallpaper", icon: "i-material-symbols:wallpaper-rounded", color: "bg-cyan-500" },
    { name: "Sound", icon: "i-material-symbols:volume-up-rounded", color: "bg-red-500" },
    { name: "Battery", icon: "i-material-symbols:battery-full-rounded", color: "bg-green-500" },
  ];

  return (
    <div className={`flex h-full select-none font-sans overflow-hidden ${dark ? "bg-[#1e1e1f] text-white/90" : "bg-[#f5f5f7] text-black"}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r flex flex-col pt-10 shrink-0 ${dark ? "bg-white/5 border-black/30" : "bg-black/5 border-black/10"}`}>
        <div className="px-5 mb-4 relative">
          <span className="absolute left-7.5 top-2 i-material-symbols:search opacity-40 text-lg" />
          <input 
            type="text" 
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full py-1.5 pl-9 pr-3 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-500/50 ${dark ? "bg-white/10" : "bg-white shadow-sm"}`}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 no-scrollbar">
          <div 
            onClick={() => setSection("General")}
            className={`flex items-center space-x-3 p-2 rounded-lg mb-2 transition-all cursor-default ${dark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
          >
             <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-center text-white text-lg font-bold shadow-lg">A</div>
             <div className="min-w-0">
               <div className="font-bold text-[14px] truncate leading-tight">Ace</div>
               <div className="text-[11px] opacity-40 truncate leading-tight">Apple ID, iCloud, Media & App Store</div>
             </div>
             <span className="i-material-symbols:chevron-right text-lg opacity-20" />
          </div>

          {sidebarItems.map((item, i) => (
            item.type === "divider" ? (
              <div key={`div-${i}`} className="h-4" />
            ) : (
              <div 
                key={item.name} 
                onClick={() => setSection(item.name as SettingSection)}
                className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg transition-all cursor-default ${
                  activeSection === item.name 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : (dark ? "hover:bg-white/5" : "hover:bg-black/5")
                }`}
              >
                <div className={`size-6 rounded-md ${item.color} flex-center text-white shadow-sm`}>
                  <span className={`${item.icon} text-sm`} />
                </div>
                <span className="text-[13.5px] font-medium">{item.name}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative pt-10">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div 
            key={subSection ? `${activeSection}-${subSection}` : activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="px-10 pb-20 max-w-3xl"
          >
            {!subSection && (
              <div className="flex items-center space-x-4 mb-8">
                 <div className={`size-12 rounded-xl flex-center text-white bg-gradient-to-br transition-all shadow-lg ${
                   (sidebarItems.find(s => s.name === activeSection) as any)?.color?.replace("bg-", "from-") || "from-blue-500"
                 } to-current`}>
                     <span className={`${(sidebarItems.find(s => s.name === activeSection) as any)?.icon || "i-material-symbols:settings-outline"} text-3xl`} />
                 </div>
                 <h1 className="text-3xl font-extrabold tracking-tight">{activeSection}</h1>
              </div>
            )}

            {subSection && (
              <div className="flex items-center space-x-4 mb-8">
                 <button 
                   onClick={popSub}
                   className={`size-8 rounded-lg flex-center transition-all ${dark ? "hover:bg-white/10" : "hover:bg-black/10"}`}
                 >
                   <span className="i-material-symbols:chevron-left text-xl" />
                 </button>
                 <h1 className="text-2xl font-bold tracking-tight">{subSection}</h1>
              </div>
            )}
            
            {activeSection === "Wi-Fi" && !subSection && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Wi-Fi" icon="i-material-symbols:wifi-rounded" iconBg="bg-blue-500" border={false}>
                    <Toggle active={wifi} onClick={toggleWIFI} />
                  </SettingRow>
                </Group>
                
                {wifi && (
                  <Group title="Known Networks">
                    <SettingRow label="TP-Link_Guest" icon="i-material-symbols:wifi-rounded" iconBg="bg-blue-500" hint="Connected" />
                    <SettingRow label="iPhone_Pro" icon="i-material-symbols:smartphone-rounded" iconBg="bg-gray-400" />
                    <SettingRow label="Starbucks_Free" icon="i-material-symbols:wifi-rounded" iconBg="bg-gray-400" border={false} />
                  </Group>
                )}
              </div>
            )}

            {activeSection === "Bluetooth" && !subSection && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Bluetooth" icon="i-material-symbols:bluetooth" iconBg="bg-blue-600" border={false}>
                    <Toggle active={bluetooth} onClick={toggleBluetooth} />
                  </SettingRow>
                </Group>
                
                {bluetooth && (
                  <Group title="My Devices">
                    <SettingRow label="Magic Keyboard" icon="i-material-symbols:keyboard-rounded" iconBg="bg-gray-500" hint="Connected" />
                    <SettingRow label="Magic Mouse" icon="i-material-symbols:mouse-rounded" iconBg="bg-gray-500" hint="Connected" />
                    <SettingRow label="AirPods Pro" icon="i-material-symbols:headphones-rounded" iconBg="bg-gray-500" hint="Not Connected" />
                    <SettingRow label="Sony WH-1000XM4" icon="i-material-symbols:headphones-rounded" iconBg="bg-gray-500" hint="Not Connected" border={false} />
                  </Group>
                )}
              </div>
            )}

            {activeSection === "Network" && !subSection && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="VPN" icon="i-material-symbols:vpn-lock-rounded" iconBg="bg-blue-500" hint="Not Configured" onClick={() => pushSub("VPN")} />
                  <SettingRow label="Filters" icon="i-material-symbols:filter-alt-rounded" iconBg="bg-gray-500" border={false} />
                </Group>
                <Group title="Firewall">
                  <SettingRow label="Firewall" border={false}>
                    <Toggle active={true} onClick={() => {}} />
                  </SettingRow>
                </Group>
              </div>
            )}

            {(activeSection === "Network") && subSection === "VPN" && (
              <div className="space-y-6">
                <Group title="VPN Configuration">
                   <div className="p-8 text-center opacity-40">
                      <span className="i-material-symbols:shield-slash-rounded text-5xl mb-4" />
                      <p>No VPN configurations found.</p>
                   </div>
                </Group>
              </div>
            )}

            {activeSection === "General" && !subSection && (
              <div className="space-y-2">
                <Group>
                  <SettingRow label="About" icon="i-material-symbols:info-rounded" iconBg="bg-gray-500" onClick={() => pushSub("About")} />
                  <SettingRow label="Software Update" icon="i-material-symbols:sync-rounded" iconBg="bg-gray-500" hint="Up to Date" onClick={() => pushSub("Software Update")} />
                  <SettingRow label="Storage" icon="i-material-symbols:database-rounded" iconBg="bg-gray-500" onClick={() => pushSub("Storage")} />
                  <SettingRow label="AirDrop" icon="i-material-symbols:wifi-tethering-rounded" iconBg="bg-blue-500" onClick={() => pushSub("AirDrop")} border={false} />
                </Group>
                <Group>
                  <SettingRow label="Date & Time" icon="i-material-symbols:schedule-rounded" iconBg="bg-gray-500" onClick={() => pushSub("Date & Time")} />
                  <SettingRow label="Language & Region" icon="i-material-symbols:language-rounded" iconBg="bg-gray-500" onClick={() => pushSub("Language & Region")} border={false} />
                </Group>
              </div>
            )}

            {activeSection === "General" && subSection === "Storage" && (
              <div className="space-y-6">
                <Group title="Macintosh HD">
                  <div className="p-6">
                    <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden flex mb-4">
                       <div className="h-full bg-blue-500 w-[40%]" />
                       <div className="h-full bg-orange-400 w-[20%]" />
                       <div className="h-full bg-green-400 w-[10%]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs opacity-60">
                       <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-blue-500" /> macOS (120 GB)</div>
                       <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-orange-400" /> Apps (60 GB)</div>
                       <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-green-400" /> Documents (30 GB)</div>
                       <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-gray-300" /> Free (290 GB)</div>
                    </div>
                  </div>
                </Group>
              </div>
            )}

            {activeSection === "General" && subSection === "Date & Time" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Set date and time automatically" border={true}>
                    <Toggle active={true} onClick={() => {}} />
                  </SettingRow>
                  <SettingRow label="Source" hint="Apple (time.apple.com)" border={false} />
                </Group>
                <Group title="Time Zone">
                   <SettingRow label="Set time zone automatically" border={false}>
                      <Toggle active={true} onClick={() => {}} />
                   </SettingRow>
                </Group>
              </div>
            )}

            {activeSection === "General" && subSection === "About" && (
              <div className="space-y-6">
                <Group>
                  <div className="p-10 flex flex-col items-center">
                    <div className="i-material-symbols:laptop-chromebook text-7xl mb-4" />
                    <h2 className="text-xl font-bold">MacBook Pro</h2>
                    <p className="text-sm opacity-50 mb-8">14-inch, Nov 2023</p>
                    
                    <div className="w-full space-y-3">
                       <div className="flex justify-between text-sm">
                          <span className="font-bold">Processor</span>
                          <span className="opacity-60 text-right">Apple M3 Max</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="font-bold">Memory</span>
                          <span className="opacity-60 text-right">36 GB</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="font-bold">Serial Number</span>
                          <span className="opacity-60 text-right">G6VK0X7...</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="font-bold">macOS</span>
                          <span className="opacity-60 text-right">Sonoma 14.2.1</span>
                       </div>
                    </div>
                  </div>
                </Group>
              </div>
            )}

            {activeSection === "General" && subSection === "Software Update" && (
              <div className="space-y-6">
                <Group>
                   <div className="p-12 flex flex-col items-center text-center">
                      <div className="size-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex-center shadow-xl mb-6">
                         <span className="i-material-symbols:sync text-white text-4xl animate-spin-slow" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">Checking for updates...</h3>
                      <p className="text-sm opacity-40">Your Mac is currently checking for latest software improvements.</p>
                   </div>
                </Group>
              </div>
            )}

            {activeSection === "General" && subSection === "AirDrop" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="AirDrop" border={false}>
                    <Toggle active={airdrop} onClick={toggleAirdrop} />
                  </SettingRow>
                </Group>
                <Group title="Allow me to be discovered by">
                  <SettingRow label="Contacts Only" border={true} />
                  <SettingRow label="Everyone" border={false} />
                </Group>
              </div>
            )}

            {activeSection === "Appearance" && !subSection && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Group title="Appearance Mode">
                  <div className="p-6 grid grid-cols-3 gap-8">
                    {[
                      { id: "light", label: "Light", value: false },
                      { id: "dark", label: "Dark", value: true }
                    ].map(mode => (
                      <div 
                        key={mode.id}
                        onClick={() => setDark(mode.value)}
                        className="flex flex-col items-center space-y-3 cursor-default group"
                      >
                        <div className={`w-full aspect-[4/3] rounded-xl border-2 transition-all overflow-hidden relative ${
                          dark === mode.value ? "border-blue-500 ring-4 ring-blue-500/10 shadow-xl" : "border-transparent opacity-60 hover:opacity-100"
                        }`}>
                           <div className={`w-full h-full p-2 flex flex-col ${mode.value ? "bg-[#1e1e1f]" : "bg-gray-100"}`}>
                              <div className={`w-full h-2 rounded-sm mb-2 ${mode.value ? "bg-white/10" : "bg-white border border-black/5"}`} />
                              <div className="flex-1 flex space-x-2 overflow-hidden">
                                 <div className={`w-1/4 h-full rounded-sm ${mode.value ? "bg-blue-500/20" : "bg-blue-500/10"}`} />
                                 <div className={`flex-1 h-full rounded-sm ${mode.value ? "bg-white/5" : "bg-white border border-black/5"}`} />
                              </div>
                           </div>
                        </div>
                        <span className={`text-[12px] font-bold ${dark === mode.value ? "text-blue-500" : "opacity-40"}`}>{mode.label}</span>
                      </div>
                    ))}
                  </div>
                </Group>

                <Group title="Accent Color">
                   <div className="p-4 flex justify-between items-center">
                      <div className="flex space-x-2">
                        {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-gray-500"].map(c => (
                          <div key={c} className={`size-5 rounded-full ${c} ring-2 ring-white ring-inset shadow-sm ${c === "bg-blue-500" ? "ring-offset-2 ring-offset-blue-500/50 scale-110" : "opacity-80 hover:opacity-100 cursor-pointer"}`} />
                        ))}
                      </div>
                   </div>
                </Group>
              </div>
            )}

            {activeSection === "Desktop & Dock" && (
              <div className="space-y-6">
                <Group title="Dock">
                  <SettingRow label="Icon Size">
                    <Slider value={dockSize} min={32} max={64} onChange={setDockSize} />
                  </SettingRow>
                  <SettingRow label="Magnification" border={false}>
                    <Slider value={dockMag} min={1} max={1.5} step={0.05} onChange={setDockMag} />
                  </SettingRow>
                </Group>

                <Group title="Window Management">
                   <SettingRow label="Stage Manager" border={false}>
                      <Toggle active={stageManager} onClick={toggleStageManager} />
                   </SettingRow>
                </Group>
              </div>
            )}

            {activeSection === "Accessibility" && !subSection && (
              <div className="space-y-6">
                <Group title="Vision">
                  <SettingRow label="VoiceOver" icon="i-material-symbols:settings-voice-rounded" iconBg="bg-blue-500" hint="Off" onClick={() => pushSub("VoiceOver")} />
                  <SettingRow label="Zoom" icon="i-material-symbols:zoom-in-rounded" iconBg="bg-blue-500" hint="Off" onClick={() => pushSub("Zoom")} />
                  <SettingRow label="Display" icon="i-material-symbols:screenshot-rounded" iconBg="bg-blue-500" border={false} onClick={() => pushSub("Display")} />
                </Group>
                <Group title="Hearing">
                  <SettingRow label="Audio" icon="i-material-symbols:volume-up-rounded" iconBg="bg-blue-500" onClick={() => pushSub("Audio")} />
                  <SettingRow label="RTM" icon="i-material-symbols:text-to-speech-rounded" iconBg="bg-blue-500" border={false} onClick={() => pushSub("RTM")} />
                </Group>
              </div>
            )}

            {(activeSection === "Accessibility") && subSection === "VoiceOver" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="VoiceOver" border={false}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                </Group>
                <p className="px-1 text-xs opacity-40">VoiceOver provides spoken and braille descriptions of items on the computer.</p>
              </div>
            )}

            {(activeSection === "Accessibility") && subSection === "Zoom" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Use keyboard shortcuts to zoom" border={true}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                  <SettingRow label="Use scroll gesture with modifier keys to zoom" border={false}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                </Group>
              </div>
            )}

            {(activeSection === "Accessibility") && subSection === "Display" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Invert colors" border={true}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                  <SettingRow label="Reduce transparency" border={false}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                </Group>
              </div>
            )}

            {(activeSection === "Accessibility") && subSection === "Audio" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Flash the screen when an alert sound occurs" border={false}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                </Group>
              </div>
            )}

            {(activeSection === "Accessibility") && subSection === "RTM" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Enable RTM" border={false}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                </Group>
                <p className="px-1 text-xs opacity-40">Real-time text (RTT) allows you to send text messages as you type them.</p>
              </div>
            )}

            {activeSection === "Control Center" && (
              <div className="space-y-6">
                <Group title="Menu Bar Modules">
                  <SettingRow label="Wi-Fi" border={true}>
                    <span className="text-[12px] opacity-40">Show in Menu Bar</span>
                  </SettingRow>
                  <SettingRow label="Bluetooth" border={true}>
                    <span className="text-[12px] opacity-40">Show in Menu Bar</span>
                  </SettingRow>
                  <SettingRow label="Sound" border={false}>
                    <span className="text-[12px] opacity-40">Always Show in Menu Bar</span>
                  </SettingRow>
                </Group>
              </div>
            )}

            {activeSection === "Wallpaper" && (
              <div className="space-y-6">
                <Group title="Dynamic Wallpapers">
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm border border-white/10 ring-2 ring-transparent hover:ring-blue-500 transition-all cursor-pointer overflow-hidden">
                        <div className="size-full bg-black/20 flex-center">
                          <span className="i-material-symbols:image text-white/20 text-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Group>
                <Group title="Pictures">
                   <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[9, 10, 11, 12].map(i => (
                      <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm border border-white/10 ring-2 ring-transparent hover:ring-blue-500 transition-all cursor-pointer flex-center">
                         <span className="i-material-symbols:photo-library text-white/20 text-xl" />
                      </div>
                    ))}
                  </div>
                </Group>
              </div>
            )}

            {activeSection === "Displays" && !subSection && (
              <div className="space-y-6">
                <div className={`rounded-xl overflow-hidden border mb-6 ${dark ? "bg-white/5 border-white/5" : "bg-white border-black/5 shadow-md"}`}>
                   <div className="aspect-video bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex-center p-8">
                      <div className="w-1/2 aspect-[16/10] bg-black rounded-lg border-2 border-white/20 shadow-2xl flex-center flex-col scale-110">
                         <div className="i-material-symbols:laptop-mac-rounded text-white/20 text-4xl" />
                      </div>
                   </div>
                   <div className={`p-5 flex justify-between items-center ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                      <div>
                        <span className="text-sm font-bold">Built-in Display</span>
                        <p className="text-[11px] opacity-40">Default scaling • 1440 × 932</p>
                      </div>
                      <button className={`px-3 py-1 rounded text-xs font-medium border ${dark ? "bg-white/10 border-white/10" : "bg-white border-black/10 shadow-sm"}`}>Presets...</button>
                   </div>
                </div>

                <Group title="Brightness">
                   <SettingRow label="Brightness" border={false}>
                      <Slider 
                        value={brightness} min={20} max={100} 
                        onChange={setBrightness} 
                        iconStart="i-material-symbols:sunny-rounded" 
                        iconEnd="i-material-symbols:sunny-rounded" 
                      />
                   </SettingRow>
                </Group>
              </div>
            )}

            {activeSection === "Sound" && (
              <div className="space-y-6">
                <Group title="Output">
                   <SettingRow label="Internal Speakers" hint="Built-in" border={false}>
                      <span className="i-material-symbols:check text-blue-500" />
                   </SettingRow>
                </Group>
                <Group title="Volume">
                  <SettingRow label="Output Volume" border={false}>
                    <Slider 
                      value={volume} min={0} max={100} 
                      onChange={setVolume} 
                      iconStart="i-material-symbols:volume-mute" 
                      iconEnd="i-material-symbols:volume-up" 
                    />
                  </SettingRow>
                </Group>
              </div>
            )}

            {activeSection === "Battery" && !subSection && (
              <div className="space-y-6">
                <Group>
                   <div className="p-8 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-4">
                         <span className="i-material-symbols:battery-full text-7xl text-green-500" />
                         <span className="absolute inset-0 flex-center font-black text-xs text-white">100%</span>
                      </div>
                      <span className="text-sm font-bold opacity-60">Power Source: Power Adapter</span>
                   </div>
                </Group>
                <Group>
                  <SettingRow label="Low Power Mode" hint="Only on battery" border={true}>
                    <Toggle active={false} onClick={() => {}} />
                  </SettingRow>
                  <SettingRow label="Battery Health" hint="Normal" onClick={() => pushSub("Battery Health")} border={false} />
                </Group>
              </div>
            )}

            {(activeSection === "Battery") && subSection === "Battery Health" && (
              <div className="space-y-6">
                <Group>
                  <SettingRow label="Maximum Capacity" hint="100%" border={true} />
                  <SettingRow label="Peak Performance" hint="Normal" border={false} />
                </Group>
                <p className="px-1 text-xs opacity-40">This is a measure of battery capacity relative to when it was new.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import React from "react";
import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";
import Bear from "~/components/apps/Bear";
import Typora from "~/components/apps/Typora";
import Safari from "~/components/apps/Safari";
import VSCode from "~/components/apps/VSCode";
import FaceTime from "~/components/apps/FaceTime";
import Terminal from "~/components/apps/Terminal";
import Finder from "~/components/apps/Finder";
import Messages from "~/components/apps/Messages";
import Calendar from "~/components/apps/Calendar";
import Settings from "~/components/apps/Settings";
import About from "~/components/apps/About";
import Maps from "~/components/apps/Maps";
import Mail from "~/components/apps/Mail";
import Github from "~/components/apps/Github";
import Photos from "~/components/apps/Photos";

const LOCAL_ICON = "img/icons";

const apps: AppsData[] = [
  {
    id: "finder",
    title: "Finder",
    desktop: true,
    width: 800,
    height: 500,
    show: false,
    img: `${LOCAL_ICON}/finder.png`,
    content: <Finder />
  },
  {
    id: "launchpad",
    title: "Launchpad",
    desktop: false,
    img: "img/icons/launchpad.png"
  },
  {
    id: "messages",
    title: "Messages",
    desktop: true,
    width: 800,
    height: 550,
    img: `${LOCAL_ICON}/messages.png`,
    content: <Messages />
  },
  {
    id: "mail",
    title: "Mail",
    desktop: true,
    width: 900,
    height: 600,
    img: `${LOCAL_ICON}/mail.png`,
    content: <Mail />
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    width: 800,
    height: 500,
    img: `${LOCAL_ICON}/facetime.png`,
    content: <FaceTime />
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    height: 768,
    minWidth: 375,
    minHeight: 200,
    img: "img/icons/safari.png",
    content: <Safari />
  },
  {
    id: "maps",
    title: "Maps",
    desktop: true,
    width: 900,
    height: 600,
    img: `${LOCAL_ICON}/maps.png`,
    content: <Maps />
  },
  {
    id: "photos",
    title: "Photos",
    desktop: true,
    width: 900,
    height: 600,
    img: `${LOCAL_ICON}/photos.png`,
    content: <Photos />
  },
  {
    id: "calendar",
    title: "Calendar",
    desktop: true,
    width: 600,
    height: 500,
    img: "img/icons/safari.png", // Calendar logic handles its own icon anyway
    content: <Calendar />
  },
  {
    id: "bear",
    title: "Bear",
    desktop: true,
    width: 860,
    height: 500,
    img: "img/icons/bear.png",
    content: <Bear />
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    img: "img/icons/vscode.png",
    content: <VSCode />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    width: 700,
    height: 450,
    img: "img/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "settings",
    title: "System Settings",
    desktop: true,
    width: 850,
    height: 600,
    img: `${LOCAL_ICON}/settings.png`,
    content: <Settings />
  },
  {
    id: "github",
    title: "Github",
    desktop: true,
    width: 1024,
    height: 768,
    img: "img/icons/github.png",
    content: <Github />
  },
  {
    id: "about",
    title: "About This Mac",
    desktop: true,
    width: 450,
    height: 600,
    img: `${LOCAL_ICON}/finder.png`,
    content: <About />
  },
];

export default apps;

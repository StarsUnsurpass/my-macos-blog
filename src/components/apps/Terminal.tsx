import React, { useState, useEffect, useRef } from "react";
import { terminal } from "~/configs";
import { useInterval } from "~/hooks";
import type { TerminalData } from "~/types";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789落霞与孤鹜齐飞秋水共长天一色";
const EMOJIS = ["\\(o_o)/", "(˚Δ˚)b", "(^-^*)", "(╯‵□′)╯", "\\(°ˊДˋ°)/", "╰(‵□′)╯"];

const getEmoji = () => {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};

interface TerminalState {
  rmrf: boolean;
  content: JSX.Element[];
}

// rain animation is adopted from: https://codepen.io/P3R0/pen/MwgoKv
const HowDare = ({ setRMRF }: { setRMRF: (value: boolean) => void }) => {
  const FONT_SIZE = 12;

  const [emoji, setEmoji] = useState("");
  const [drops, setDrops] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    canvas.height = container.offsetHeight;
    canvas.width = container.offsetWidth;

    const columns = Math.floor(canvas.width / FONT_SIZE);
    setDrops(Array(columns).fill(1));

    setEmoji(getEmoji());
  }, []);

  const rain = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2e9244";
    ctx.font = `${FONT_SIZE}px arial`;

    drops.forEach((y, x) => {
      const text = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      ctx.fillText(text, x * FONT_SIZE, y * FONT_SIZE);
    });

    setDrops(
      drops.map((y) => {
        // sends the drop back to the top randomly after it has crossed the screen
        // adding randomness to the reset to make the drops scattered on the Y axis
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) return 1;
        // increments Y coordinate
        else return y + 1;
      })
    );
  };

  useInterval(rain, 33);

  return (
    <div
      ref={containerRef}
      className="fixed size-full bg-black text-white"
      onClick={() => setRMRF(false)}
    >
      <canvas ref={canvasRef}></canvas>
      <div className="font-avenir absolute h-28 text-center space-y-4 m-auto inset-0">
        <div text-4xl>{emoji}</div>
        <div text-3xl>HOW DARE YOU!</div>
        <div>Click to go back</div>
      </div>
    </div>
  );
};

export default class Terminal extends React.Component<{}, TerminalState> {
  private history = [] as string[];
  private curHistory = 0;
  private curInputTimes = 0;
  private curDirPath = [] as any;
  private curChildren = terminal as any;
  private commands: {
    [key: string]: { (): void } | { (arg?: string): void };
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      content: [],
      rmrf: false
    };
    this.commands = {
      cd: this.cd,
      ls: this.ls,
      cat: this.cat,
      clear: this.clear,
      help: this.help,
      pwd: this.pwd,
      whoami: this.whoami,
      mkdir: this.mkdir,
      touch: this.touch,
      echo: this.echo,
      date: this.date,
      uname: this.uname,
      hostname: this.hostname,
      who: this.who,
      uptime: this.uptime,
      history: this.showHistory,
      ps: this.ps,
      top: this.top,
      sudo: this.sudo
    };
  }

  pwd = () => {
    this.generateResultRow(this.curInputTimes, <span>/{this.curDirPath.join("/")}</span>);
  };

  whoami = () => {
    this.generateResultRow(this.curInputTimes, <span>ace</span>);
  };

  mkdir = (args?: string) => {
    if (!args) return;
    this.generateResultRow(this.curInputTimes, <span>mkdir: created directory '{args}'</span>);
  };

  touch = (args?: string) => {
    if (!args) return;
    this.generateResultRow(this.curInputTimes, <span>touch: created file '{args}'</span>);
  };

  echo = (args?: string) => {
    this.generateResultRow(this.curInputTimes, <span>{args || ""}</span>);
  };

  date = () => {
    this.generateResultRow(this.curInputTimes, <span>{new Date().toString()}</span>);
  };

  uname = (args?: string) => {
    if (args === "-a") {
      this.generateResultRow(this.curInputTimes, <span>Darwin MacBook-Pro.local 23.2.0 Darwin Kernel Version 23.2.0: Wed Nov 15 21:28:44 PST 2023; root:xnu-10002.61.3~2/RELEASE_ARM64_T6030 arm64</span>);
    } else {
      this.generateResultRow(this.curInputTimes, <span>Darwin</span>);
    }
  };

  hostname = () => {
    this.generateResultRow(this.curInputTimes, <span>MacBook-Pro.local</span>);
  };

  who = () => {
    this.generateResultRow(this.curInputTimes, <span>ace      console  Jan  1 00:00</span>);
  };

  uptime = () => {
    this.generateResultRow(this.curInputTimes, <span>{`up ${Math.floor(Math.random() * 5 + 1)} days, 14:23, 2 users, load averages: 2.14 1.98 2.05`}</span>);
  };

  showHistory = () => {
    const result = this.history.map((cmd, i) => (
      <div key={`history-${i}`} className="space-x-4">
        <span className="opacity-40">{i + 1}</span>
        <span>{cmd}</span>
      </div>
    ));
    this.generateResultRow(this.curInputTimes, <div>{result}</div>);
  };

  ps = () => {
    const rows = [
      ["PID", "TTY", "TIME", "CMD"],
      ["612", "ttys000", "0:00.04", "-zsh"],
      ["841", "ttys000", "0:00.01", "ps"],
      ["102", "??", "1:24.05", "WindowServer"]
    ];
    this.generateResultRow(this.curInputTimes, (
      <div className="space-y-1">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-4 w-full">
            {row.map((cell, j) => <span key={j} className={i === 0 ? "font-bold opacity-60" : ""}>{cell}</span>)}
          </div>
        ))}
      </div>
    ));
  };

  top = () => {
    this.generateResultRow(this.curInputTimes, (
      <div className="space-y-1 opacity-80">
        <div>Processes: 421 total, 2 running, 419 sleeping...</div>
        <div>CPU usage: 12.4% user, 8.2% sys, 79.4% idle</div>
        <div>PhysMem: 16G used (2.4G wired), 19G unused.</div>
        <div className="pt-2 font-bold underline">PID    COMMAND      %CPU  TIME     MEM</div>
        <div>102    WindowServer 8.4   01:24:05 412M</div>
        <div>612    Terminal     2.1   00:00:15 84M</div>
        <div>42     Kernel       1.2   12:10:42 1.2G</div>
      </div>
    ));
  };

  sudo = (args?: string) => {
    this.generateResultRow(this.curInputTimes, (
      <div className="text-red-400 font-bold italic">
        "With great power comes great responsibility." — Uncle Ben
        <br />
        [sudo] password for ace: **********
        <br />
        Sorry, try again.
      </div>
    ));
  };

  componentDidMount() {
    this.reset();
    this.generateInputRow(this.curInputTimes);
  }

  reset = () => {
    const terminal = document.querySelector("#terminal-content") as HTMLElement;
    terminal.innerHTML = "";
  };

  addRow = (row: JSX.Element) => {
    if (this.state.content.find((item) => item.key === row.key)) return;

    const content = this.state.content;
    content.push(row);
    this.setState({ content });
  };

  getCurDirName = () => {
    if (this.curDirPath.length === 0) return "~";
    else return this.curDirPath[this.curDirPath.length - 1];
  };

  getCurChildren = () => {
    let children = terminal as any;
    for (const name of this.curDirPath) {
      children = children.find((item: TerminalData) => {
        return item.title === name && item.type === "folder";
      }).children;
    }
    return children;
  };

  // move into a specified folder
  cd = (args?: string) => {
    if (args === undefined || args === "~") {
      // move to root
      this.curDirPath = [];
      this.curChildren = terminal;
    } else if (args === ".") {
      // stay in the current folder
      return;
    } else if (args === "..") {
      // move to parent folder
      if (this.curDirPath.length === 0) return;
      this.curDirPath.pop();
      this.curChildren = this.getCurChildren();
    } else {
      // move to certain child folder
      const target = this.curChildren.find((item: TerminalData) => {
        return item.title === args && item.type === "folder";
      });
      if (target === undefined) {
        this.generateResultRow(
          this.curInputTimes,
          <span>{`cd: no such file or directory: ${args}`}</span>
        );
      } else {
        this.curChildren = target.children;
        this.curDirPath.push(target.title);
      }
    }
  };

  // display content of a specified folder
  ls = () => {
    const result = [];
    for (const item of this.curChildren) {
      result.push(
        <span
          key={`terminal-result-ls-${this.curInputTimes}-${item.id}`}
          className={`${item.type === "file" ? "text-white" : "text-purple-300"}`}
        >
          {item.title}
        </span>
      );
    }
    this.generateResultRow(
      this.curInputTimes,
      <div className="grid grid-cols-4 w-full">{result}</div>
    );
  };

  // display content of a specified file
  cat = (args?: string) => {
    const file = this.curChildren.find((item: TerminalData) => {
      return item.title === args && item.type === "file";
    });

    if (file === undefined) {
      this.generateResultRow(
        this.curInputTimes,
        <span>{`cat: ${args}: No such file or directory`}</span>
      );
    } else {
      const content =
        typeof file.content === "string" ? (
          <div className="whitespace-pre-wrap">{file.content}</div>
        ) : (
          file.content
        );
      this.generateResultRow(this.curInputTimes, <span>{content}</span>);
    }
  };

  // clear terminal
  clear = () => {
    this.curInputTimes += 1;
    this.reset();
  };

  help = () => {
    const help = (
      <ul className="list-disc ml-6 pb-1.5 opacity-80">
        <li><span className="text-blue-400">ls</span> - List directory contents</li>
        <li><span className="text-blue-400">cd {"<dir>"}</span> - Change directory</li>
        <li><span className="text-blue-400">cat {"<file>"}</span> - Display file content</li>
        <li><span className="text-blue-400">echo {"<text>"}</span> - Print text</li>
        <li><span className="text-blue-400">date</span> - Show date/time</li>
        <li><span className="text-blue-400">uname -a</span> - System info</li>
        <li><span className="text-blue-400">uptime</span> - Show uptime</li>
        <li><span className="text-blue-400">ps / top</span> - Process status</li>
        <li><span className="text-blue-400">history</span> - Command history</li>
        <li><span className="text-blue-400">clear</span> - Clear screen</li>
        <li><span className="text-blue-400">help</span> - Show this help</li>
      </ul>
    );
    this.generateResultRow(this.curInputTimes, help);
  };

  autoComplete = (text: string) => {
    if (text === "") return text;

    const input = text.split(" ");
    const cmd = input[0];
    const args = input[1];

    let result = text;

    if (args === undefined) {
      const guess = Object.keys(this.commands).find((item) => {
        return item.substring(0, cmd.length) === cmd;
      });
      if (guess !== undefined) result = guess;
    } else if (cmd === "cd" || cmd === "cat") {
      const type = cmd === "cd" ? "folder" : "file";
      const guess = this.curChildren.find((item: TerminalData) => {
        return item.type === type && item.title.substring(0, args.length) === args;
      });
      if (guess !== undefined) result = cmd + " " + guess.title;
    }
    return result;
  };

  keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    const inputElement = document.querySelector(
      `#terminal-input-${this.curInputTimes}`
    ) as HTMLInputElement;
    const inputText = inputElement.value.trim();
    const input = inputText.split(" ");

    if (keyCode === "Enter") {
      // ----------- run command -----------
      this.history.push(inputText);

      const cmd = input[0];
      const args = input[1];

      // we can't edit the past input
      inputElement.setAttribute("readonly", "true");

      if (inputText.substring(0, 6) === "rm -rf") this.setState({ rmrf: true });
      else if (cmd && Object.keys(this.commands).includes(cmd)) {
        this.commands[cmd](args);
      } else {
        this.generateResultRow(
          this.curInputTimes,
          <span>{`zsh: command not found: ${cmd}`}</span>
        );
      }

      // point to the last history command
      this.curHistory = this.history.length;

      // generate new input row
      this.curInputTimes += 1;
      this.generateInputRow(this.curInputTimes);
    } else if (keyCode === "ArrowUp") {
      // ----------- previous history command -----------
      if (this.history.length > 0) {
        if (this.curHistory > 0) this.curHistory--;
        const historyCommand = this.history[this.curHistory];
        inputElement.value = historyCommand;
      }
    } else if (keyCode === "ArrowDown") {
      // ----------- next history command -----------
      if (this.history.length > 0) {
        if (this.curHistory < this.history.length) this.curHistory++;
        if (this.curHistory === this.history.length) inputElement.value = "";
        else {
          const historyCommand = this.history[this.curHistory];
          inputElement.value = historyCommand;
        }
      }
    } else if (keyCode === "Tab") {
      // ----------- auto complete -----------
      inputElement.value = this.autoComplete(inputText);
      // prevent tab outside the terminal
      e.preventDefault();
    }
  };

  focusOnInput = (id: number) => {
    const input = document.querySelector(`#terminal-input-${id}`) as HTMLInputElement;
    input.focus();
  };

  generateInputRow = (id: number) => {
    const newRow = (
      <div key={`terminal-input-row-${id}`} className="flex flex-wrap items-center">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-emerald-400 font-bold">ace@macbook-pro</span>
          <span className="text-blue-400">{this.getCurDirName()}</span>
          <span className="text-white/50">%</span>
        </div>
        <input
          id={`terminal-input-${id}`}
          className="flex-1 px-2 text-white outline-none bg-transparent caret-blue-500"
          onKeyDown={this.keyPress}
          autoFocus={true}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    );
    this.addRow(newRow);
  };

  generateResultRow = (id: number, result: JSX.Element) => {
    const newRow = (
      <div key={`terminal-result-row-${id}`} break-all>
        {result}
      </div>
    );
    this.addRow(newRow);
  };

  render() {
    return (
      <div
        className="terminal font-mono font-normal relative h-full bg-[#1e1e1f] overflow-y-auto"
        style={{ fontSize: "13px", color: "#f8f8f2" }}
        onClick={() => this.focusOnInput(this.curInputTimes)}
      >
        {this.state.rmrf && (
          <HowDare setRMRF={(value: boolean) => this.setState({ rmrf: value })} />
        )}
        <div className="p-4 opacity-70">
          Last login: {new Date().toUTCString()} on ttys000
        </div>
        <div id="terminal-content" className="px-4 pb-4 space-y-1">
          {this.state.content}
        </div>
      </div>
    );
  }
}

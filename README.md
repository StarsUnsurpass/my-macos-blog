# Ace's macOS Blog

这是一个基于 Web 技术构建的个人组合网站，旨在模拟经典的 macOS 桌面交互体验。通过现代前端技术栈，本项目在浏览器中还原了高度真实的操作系统 UI 界面、多任务窗口管理以及各类系统组件。

## 项目亮点

- **高度还原的 UI 体验**：模拟 macOS Monterey/Catalina 的视觉风格，包含顶部菜单栏、底栏（Dock）、启动台（Launchpad）和控制中心。
- **窗口管理系统**：支持多窗口开启、最小化、全屏切换以及层级管理，带来原生系统般的多任务处理感。
- **内置应用生态**：
  - **Safari**: 内置浏览器视图。
  - **Terminal**: 模拟终端交互。
  - **Typora**: 基于 Milkdown 的 Markdown 编辑器体验。
  - **FaceTime/Photos/Maps**: 多个模拟原生应用组件。
- **系统状态同步**：利用 Battery API 实时显示设备电量，支持深色/浅色模式切换。
- **响应式设计**：适配不同尺寸的屏幕显示。

## 技术栈

本项目采用了当前主流的开发工具和框架：

- **核心框架**: [React](https://reactjs.org/) (Functional Components & Hooks)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/) (轻量级且高效的状态分发)
- **样式引擎**: [UnoCSS](https://uno.antfu.me/) (按需生成的原子化 CSS)
- **开发语言**: [TypeScript](https://www.typescriptlang.org/) (类型安全保障)
- **构建工具**: [Vite](https://vitejs.dev/) (极速的热更新与构建体验)

## 快速开始

### 1. 克隆并安装依赖

```bash
git clone https://github.com/StarsUnsurpass/my-macos-blog.git
cd my-macos-blog
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 构建生产版本

```bash
pnpm build
```

## 更新日志

- **2023.06.26**: 优化 FaceTime 组件交互。
- **2023.06.25**: 新增 Typora 应用，集成 Milkdown 编辑器。
- **2021.12.05**: 引入 Battery API 实时监测设备电量。
- **2021.12.05**: 完成代码重构，全面转向函数式组件与 Hooks 架构。

## 致谢

- 视觉灵感：Apple macOS (Monterey & Catalina)
- 图标来源：[macOS Icon Gallery](https://www.macosicongallery.com/)
- 开源参考：感谢 [sindresorhus](https://github.com/sindresorhus) 及 [vivek9patel](https://github.com/vivek9patel) 的启发。

## 许可证

本项目基于 [MIT](LICENSE) 协议开源。

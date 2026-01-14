# ✈️ 机长飞行日志 (Captain's Flight Log)

<div align="center">

一个使用航空术语隐喻的个人健康追踪应用，支持多 AI 厂商分析，提供智能健康建议。

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![LangChain](https://img.shields.io/badge/LangChain.js-Latest-00A67E?style=flat)](https://js.langchain.com/)

</div>

## 📖 项目简介

这是一个创新的个人健康追踪应用，使用航空术语作为隐喻，帮助用户以专业、不评判的方式记录和分析个人健康数据。应用集成了多个 AI 厂商（OpenAI、Anthropic、Google），提供智能化的数据分析和健康建议。

### 🎯 核心特性

- **📊 智能仪表盘** - 可视化数据分析，包括趋势图表和统计卡片
- **🤖 多 AI 厂商支持** - 集成 OpenAI、Anthropic (Claude)、Google (Gemini)
- **🎨 明暗主题切换** - 5 种航空主题配色 + 明暗模式
- **📝 完整记录管理** - 支持新增、编辑、删除记录
- **⏰ 精确时间记录** - 年月日时分秒完整时间选择
- **💾 数据导入导出** - CSV 报表导出、JSON 备份与恢复
- **🔄 实时数据同步** - LocalStorage 持久化存储
- **✨ 自定义 Alert** - 美观的提示组件，替代原生对话框

## 🚀 快速开始

### 前置要求

- **Node.js** (推荐 v18+)
- **包管理器**: npm、yarn 或 pnpm

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd fly-log
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   pnpm install
   # 或
   yarn install
   ```

3. **配置 AI API Key**
   
   在项目根目录创建 `.env.local` 文件，添加你选择的 AI 厂商 API Key：
   
   ```env
   # OpenAI (可选)
   OPENAI_API_KEY=sk-...
   
   # Anthropic Claude (可选)
   ANTHROPIC_API_KEY=sk-ant-...
   
   # Google Gemini (可选)
   GOOGLE_API_KEY=AIza...
   ```
   
   **注意**: 你也可以在应用的设置页面中直接配置 API Key，无需设置环境变量。

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 `http://localhost:5173`

## 🏗️ 项目结构

```
fly-log/
├── components/              # React 组件
│   ├── Alert.tsx           # 自定义提示组件
│   ├── AIInsightPanel.tsx  # AI 智能分析面板
│   ├── Dashboard.tsx       # 仪表盘整合组件
│   ├── FlightChart.tsx     # 数据可视化图表
│   ├── FlightLogModal.tsx  # 记录编辑模态框
│   ├── Header.tsx          # 页面头部
│   ├── LogsTable.tsx       # 记录列表表格
│   ├── SettingsPanel.tsx   # 系统设置面板
│   └── TabNavigation.tsx   # 标签页导航
├── hooks/                   # 自定义 Hooks
│   ├── useAlert.ts         # Alert 状态管理
│   ├── useFlightData.ts    # 飞行数据管理
│   └── useLocalStorage.ts  # LocalStorage 封装
├── contexts/                # React Context
│   └── ThemeContext.tsx    # 主题状态管理
├── services/                # 业务逻辑服务
│   └── aiService.ts        # AI 服务 (LangChain.js)
├── App.tsx                  # 主应用组件
├── types.ts                 # TypeScript 类型定义
├── constants.tsx            # 常量配置
└── index.html               # HTML 入口
```

## 🎨 技术栈

### 核心框架
- **React 19.2** - UI 框架
- **TypeScript 5.0** - 类型安全
- **Vite** - 构建工具

### UI & 样式
- **Tailwind CSS** - 原子化 CSS 框架
- **Recharts** - 数据可视化图表库
- **自定义 Glassmorphism** - 毛玻璃效果

### AI 集成
- **LangChain.js** - AI 编排框架
- **@langchain/openai** - OpenAI 集成
- **@langchain/anthropic** - Claude 集成
- **@langchain/google-genai** - Gemini 集成

### 状态管理
- **React Context API** - 全局状态管理
- **LocalStorage** - 数据持久化

## 🤖 AI 配置说明

应用支持以下 AI 厂商：

### 1. OpenAI
- **模型推荐**: `gpt-4o-mini`（性价比）、`gpt-4o`（高性能）
- **获取 API Key**: [OpenAI Platform](https://platform.openai.com/api-keys)

### 2. Anthropic Claude
- **模型推荐**: `claude-3-5-sonnet-20241022`（最新）
- **获取 API Key**: [Anthropic Console](https://console.anthropic.com/)

### 3. Google Gemini
- **模型推荐**: `gemini-2.0-flash-exp`（快速）、`gemini-1.5-pro`（强力）
- **获取 API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. 自定义 API
- 支持任何 OpenAI 兼容的 API 端点
- 需要配置 Base URL 和 API Key

## 📱 功能说明

### 仪表盘
- **统计卡片**: 总计起飞、平均航程、本周飞行、最近起飞
- **趋势图表**: 最近 7 天的飞行强度分析
- **AI 智能情报**: 实时分析飞行数据，提供健康建议

### 飞行日志
- **完整记录**: 时间、时长、天气（心情）、推力（强度）、过程描述
- **操作支持**: 编辑、删除记录
- **时间精确**: 支持年月日时分秒完整时间选择

### 系统设置
- **主题配置**: 5 种航空主题配色 + 明暗模式切换
- **AI 配置**: 选择 AI 厂商、配置 API Key、自定义系统指令
- **数据管理**: CSV 导出、JSON 备份、数据恢复、系统重置

## 🔒 隐私说明

- ✅ 所有数据存储在浏览器本地 (LocalStorage)
- ✅ 不上传任何数据到服务器
- ✅ AI API Key 存储在本地，仅用于直接调用 AI 服务
- ✅ 可随时导出、备份、删除所有数据

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check
```

## 📝 自定义系统指令

在设置页面的"AI 核心引擎配置"中，你可以自定义 AI 的回复风格。例如：

```
你是一位严厉的空军教官，请用命令式语气分析我的飞行记录。
当我飞行过于频繁时，要严肃批评；当我保持良好节奏时，要给予肯定。
```

这将改变 AI 的语气和建议风格，让分析更符合你的个人偏好。

## 🐛 问题反馈

如遇到问题或有功能建议，欢迎提交 Issue。

## License

fly-log  
Copyright (C) 2026 magicyan418

This project is licensed under the GNU General Public License v3.0
(or any later version).

<div align="center">
Made with ❤️ and ✈️
</div>

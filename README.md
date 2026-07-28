# 生活随记 (Life Log)

> 一站式个人数字化生活记录与智能管理应用。融合**今日概览**、**代办事项**、**情绪日记**与**理财账本**四大核心模块，支持 AI 智能文本与自然语言解析，全量数据自动本地存储与备份恢复。

---

## ✨ 核心功能亮点 (Features)

1. **今日概览 (Daily Overview)**
   - 天气与日期展示、灵感金句推荐。
   - 个人生活与财务核心指标可视化数据卡片。
   - AI 每日智能总结与情绪/行动建议。

2. **代办事项 (Task Management)**
   - 极简自律代办清单，支持分类（生活、工作、学习、健康、兴趣）、优先级与截止日期设置。
   - 灵活的状态筛选与进度监控。

3. **情绪日记 (Mood Journal)**
   - 丰富的表情符号与情绪等级评分（1-5星）。
   - 心情趋势统计图表，直观反映近期心理状态变化。
   - 日记随笔记录与 AI 情绪洞察反馈。

4. **理财账本 (Financial Budgeting)**
   - 收支分类账本，支持月度预算上限设置与超支风险提醒。
   - **AI 智能自然语言记账**：例如直接输入“中午打车花费32，下午喝咖啡48，微信支付”，自动智能解析金额、类别与支付方式。
   - 支出结构饼图与收支概览分析。

5. **快速记录 (Quick Entry)**
   - 随时随地唤起快捷速记模组，一条文本自动由 AI 拆解分流至代办、日记或账本。

6. **本地存储与数据安全 (Data & Persistence)**
   - 所有数据实时保存在浏览器 `localStorage` 中，无需注册登录，离线可用。
   - 支持 JSON 格式的数据一键导出与还原导入，方便数据迁移与备份。

---

## 🛠️ 技术栈 (Tech Stack)

- **前端框架**: React 19 + TypeScript + Vite
- **样式工具**: Tailwind CSS v4 + Lucide React (图标库) + Motion (动画库)
- **数据图表**: Recharts
- **后端 API**: Express.js (Node.js)
- **AI 智能模型**: Google Gemini SDK (`@google/genai`)

---

## 🚀 本地开发与运行 (Getting Started)

### 1. 克隆项目 (Clone Repository)

```bash
git clone https://github.com/your-username/life-log.git
cd life-log
```

### 2. 安装依赖 (Install Dependencies)

```bash
npm install
```

### 3. 配置环境变量 (Environment Variables)

复制 `.env.example` 为 `.env` 并填写您的 Google Gemini API Key：

```bash
cp .env.example .env
```

在 `.env` 文件中配置：

```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

> *注：如果没有配置 `GEMINI_API_KEY`，智能对话与 AI 自动解析功能将受到限制，但基础的代办、日记与记账功能依然可以正常正常运行。*

### 4. 启动开发服务器 (Development)

```bash
npm run dev
```

启动后在浏览器打开：`http://localhost:3000`

### 5. 构建与生产部署 (Build & Production)

构建应用：

```bash
npm run build
```

启动生产环境服务：

```bash
npm start
```

---

## 🌐 部署至 GitHub Pages (GitHub Pages Deployment)

项目已内置 GitHub Actions 自动化部署工作流 (`.github/workflows/deploy.yml`) 以及相对路径配置 (`vite.config.ts`)。

### 为什么会出现 `404 /src/main.tsx` 错误？
因为 GitHub Pages 是静态文件托管服务，浏览器**无法直接运行源码中的 `.tsx` TypeScript 文件**。如果直接将 GitHub Pages 选项设置为从 `main` 分支根目录读取，浏览器请求 `/src/main.tsx` 就会报 404 错误。必须将项目构建编译为 `dist/` 中的 HTML/JS 静态资源后进行部署。

### 开启 GitHub Actions 自动部署步骤：

1. 将更新后的代码（包含 `.github/workflows/deploy.yml` 和 `vite.config.ts`）推送至 GitHub 仓库：
   ```bash
   git add .
   git commit -m "Configure GitHub Actions deployment for Pages"
   git push origin main
   ```
2. 打开 GitHub 仓库页面，点击顶部 **Settings** 标签。
3. 在左侧菜单中找到 **Pages**（Build and deployment）。
4. 在 **Source** 下拉菜单中，将 **Deploy from a branch** 切换为 **GitHub Actions**。
5. 提交后，前往 **Actions** 标签页即可看到 Deploy 工作流正在运行，完成后即可直接访问 GitHub Pages 站点！

---

## 📄 开源协议 (License)

MIT License

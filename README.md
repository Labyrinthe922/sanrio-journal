# SANRIO JOURNAL

一个以三丽鸥角色文化为主题的个人课程展示网站，采用时尚杂志、角色档案与轻量数字手账的视觉方向。网站是独立粉丝课程项目，不隶属于三丽鸥，也未获得三丽鸥认可。

## 技术栈

- React、Vite、原生 CSS
- React Router HashRouter 风格路由（`HashRouter`），刷新子页面不会触发静态主机 404
- localStorage 保存本地故事与评分；无需后端、账号或数据库

## 文件结构

```text
public/images/characters/  可替换的角色图片
public/images/editorial/   编辑配图预留目录
public/images/hero/        首页配图预留目录
public/icons/              图标资源目录
src/components/            导航、页脚、卡片、弹窗、评分与视觉素材
src/data/                  角色、示例故事、品牌时间线数据
src/pages/                 Home、Characters、Planet、About、Share
src/styles/global.css      全站样式与响应式布局
src/App.jsx                页面路由
src/main.jsx               应用入口
vite.config.js             Vite 配置
```

## 本地运行

需要安装 Node.js 和 npm。在项目目录执行：

```bash
npm install
npm run dev
```

Vite 会显示本地访问地址。

## 生产构建

```bash
npm run build
```

产物位于 `dist/`。可以用 `npm run preview` 本地预览构建版本。

## 修改角色文案与颜色

所有角色资料统一放在 `src/data/characters.js`。可以编辑英文名、中文名、关键词、简短与完整介绍、`color`、`colorName` 和 `motif`。角色图鉴的风格分类由 `style` 字段控制（Sweet、Comforting、Bold、Energetic、Dreamy）。星球节点、详情弹窗和卡片都读取同一份资料。

品牌时间线来源位于 `src/data/timeline.js`，页面会展示每项事实的可点击来源。

## 如何替换角色图片

1. 将具有合法使用权限的图片放入 `public/images/characters/`。
2. 推荐按角色 ID 命名，例如 `hello-kitty.png`、`my-melody.jpg`、`little-twin-stars.webp`。支持浏览器常见的 PNG、JPG/JPEG、WebP、GIF、SVG 格式。
3. 在 `src/data/characters.js` 对应角色的 `image` 字段修改为 `/images/characters/文件名.扩展名`。图片路径集中在这份配置里，卡片与弹窗无需单独调整。
4. 运行 `npm run dev` 检查图鉴卡片和角色详情。也可运行 `npm run build` 验证生产构建。

当前仓库不包含角色图片。未找到文件或图片加载失败时，页面会自动展示角色独立的 CSS 主题视觉，不会显示破损图片。代码生成视觉使用 `BASE_URL` 处理仓库子路径。

## localStorage 的作用与限制

故事墙的示例留言保存在静态数据文件中，始终可见。用户自行提交的故事和本地评分使用浏览器 `localStorage`，数据仅保存在当前浏览器，不会发送到服务器或同步给其他访问者。清理浏览器数据会删除这些本地内容；无可用存储空间或浏览器禁用存储时，页面会提示并尽量保持可操作。

## 后续部署到 GitHub Pages

本项目尚未创建 GitHub 仓库，也未上传或发布。准备发布时，创建仓库并推送代码，然后在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。`.github/workflows/pages.yml` 会在 `main` 分支有新提交时自动构建部署，也可以从 **Actions** 页面手动运行。若仓库默认分支不是 `main`，请将工作流中的分支名称改为实际分支。

工作流会读取 GitHub Pages 的站点路径并传给 Vite，因此仓库站点（`https://用户名.github.io/仓库名/`）会自动使用仓库子路径；`用户名.github.io` 用户站点会使用根路径。项目通过 HashRouter 使用 `/#/characters` 等片段路由，静态部署刷新页面也能正常进入。

## 版权与素材说明

三丽鸥及其角色名称、商标和相关知识产权归其各自权利人所有。本项目使用原创编辑文字和 CSS/SVG 抽象装饰，不内嵌、下载、复制或热链三丽鸥角色图片。外部官方链接用于资料核查。本网站仅为独立粉丝课程项目，不代表官方授权或背书。替换图片前，请自行确认拥有相应使用权限。

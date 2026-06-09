# Ken | Personal Profile

这是 Ken 的个人主页项目，用于展示个人背景、教育经历、实习经历、项目研究、专业技能、兴趣爱好与联系方式。

网站采用静态 HTML/CSS/JavaScript 构建，保留轻量部署方式，同时加入动态矩阵背景、滚动 reveal 动画、交互式卡片、高级暗色玻璃质感，以及横向滑动的兴趣爱好卡片。

## 在线访问

已部署到 GitHub Pages：

[https://shijielu222.github.io/Personal-Profile/](https://shijielu222.github.io/Personal-Profile/)

如果刚完成部署后页面暂时没有更新，可以等待几分钟或强制刷新浏览器缓存。

## 页面内容

- 关于我：个人背景、研究兴趣和发展方向
- 教育经历：香港大学与布里斯托大学学习经历
- 实习经历：中国移动前端开发实习、上海宏朴国际物流产品经理实习
- 项目与研究：语义分割研究、公益组织 App/Web 平台、运营管理系统模块
- 专业技能：React、Vue 2/3、TypeScript、JavaScript、React Native、Figma、draw.io、Vibe Coding 等
- 兴趣爱好：以彩色横向滑动卡片展示篮球、足球、游泳、台球、棋牌等兴趣
- 联系方式：WeChat、Email、GitHub

## 交互特色

- 动态矩阵背景
- 鼠标跟随光圈
- 页面滚动进入动画
- 导航栏当前区块高亮
- Style/Sharp 视觉风格切换
- 经历与项目卡片的鼠标 3D 倾斜效果
- 兴趣爱好卡片自动横向滑动，支持暂停、加速、减速、拖拽和滚轮滑动

## 技术栈

- HTML5
- CSS3
- JavaScript
- GitHub Pages

## 本地预览

直接打开 `index.html`，或在仓库目录运行一个本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 项目结构

```text
.
├── assets/
│   └── profile.jpg
├── index.html
├── script.js
├── styles.css
├── README.md
├── LICENSE
└── .nojekyll
```

## 部署说明

当前网站通过 GitHub Pages 发布，线上内容来自 `gh-pages` 分支。更新流程通常是：

1. 在 `main` 分支修改网站源码。
2. 本地预览并确认效果。
3. 将更新同步到 `gh-pages` 分支。
4. 推送到 GitHub 后等待 GitHub Pages 刷新。

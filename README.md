<div align="center">
  <h1 align="center">GPTLink Web</h1>
  <p> 只需简单几步，即可基于 GPTLink 快速搭建你的 ChatGPT 站点。</p>

[体验地址](https://gptlink-web.vercel.app) · [反馈](https://github.com/gptlink/gptlink-web/issues) · [微信加群](./docs/qrcode.png)

  <img src="./docs/banner.png" />
</div>

## 🎉 特性

`GPTLink Web` 为 [gptlink](https://github.com/gptlink/gptlink) 项目用户端源码。可将此源码编译后后，替换 `gptlink/gptweb` 目录重新构建镜像，重新构建属于你的专属应用。

- 接入 [GPTLink](https://gpt-link.com/) 接口, 内置丰富功能
- 采用 `vite` + `react`, 开箱即用的极速开发体验
- 基于 [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) 生态，轻松定制 `UI`

## 📦 环境准备

1. `node` 建议使用 `^16 || ^18 || ^19` 版本

2. 安装 pnpm 包管理工具

```shell
npm install pnpm -g
```

## 🔨使用

- 获取项目代码

```shell
git clone https://github.com/gptlink/gptlink-web

cd gptlink-web

* 安装依赖
pnpm install

# 本地调试，构建命令 pnpm run build
pnpm run dev
```

## ✅ 版本计划

- [x] 导出聊天分享图片
- [x] 移动端适配

## 项目

### 项目配置

项目配置文件位于根目录 `.env` ，如若不存在此文件，将 `.env.example` 复制一份更名为 `.env` 作为配置项进行使用，详细配置如下：

| 变量名称              | 示例                        | 说明             |
| --------------------- | --------------------------- | ---------------- |
| VITE_APP_API_BASE_URL | `http://127.0.0.1` | 接口基础请求地址 |

## 参与贡献

贡献之前请先阅读 [贡献指南](https://github.com/gptlink/gptlink/blob/master/CONTRIBUTING.md)

我们深知这不是一个完美的产品，但是它只是一个开始，欢迎加入我们一起完善！

## License

[MIT](./LICENSE)

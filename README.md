<div align="center">
  <h1 align="center">GPTLink Web</h1>
  <p> 只需简单几步，即可快速搭建可商用的 ChatGPT 站点。</p>


  [体验地址](https://gpt-link.com/?shareOpenId=pju30J3gnz4T8H7M) · [演示图片](./docs/show/README.md) · [反馈](https://github.com/gptlink/gptlink/issues) · [微信加群](./docs/images/qrcode.png)

  [商务合作](./docs/images/qrcode.png) · [打赏开发者](./docs/images/payment.jpeg)

  <img src="./docs/images/banner.png" />
</div>

## 简介

GPTLink Web 为 [gptlink](https://github.com/gptlink/gptlink) 项目用户端源码。可将此源码编译后后，替换 `gptlink/gptweb` 目录重新构建镜像，重新构建属于你的专属应用。

## 环境准备

1. `node` 建议使用 `^16 || ^18 || ^19` 版本

2. 安装yarn包管理工具
```shell
npm install yarn -g
```

## 使用

* 获取项目代码

```shell
git clone https://github.com/gptlink/gptlink-web

cd gptlink-web

* 安装依赖
yarn

# 本地调试，构建命令 yarn build
yarn dev

```

## 项目配置

项目配置文件位于根目录 `.env` ，如若不存在此文件，将 `.env.example` 复制一份更名为 `.env` 作为配置项进行使用，详细配置如下：

| 变量名称  | 示例                         | 说明 |
|----|----------------------------|----|
| VITE_APP_API_BASE_URL | `/api/`, `http://127.0.0.1` | 接口基础请求地址 |


## 参与贡献

贡献之前请先阅读 [贡献指南](https://github.com/gptlink/gptlink/blob/master/CONTRIBUTING.md)

我们深知这不是一个完美的产品，但是它只是一个开始，欢迎加入我们一起完善！

<a href="https://github.com/gptlink/gptlink-web/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=gptlink/gptlink-web" />
</a>

## License

[MIT](./LICENSE)

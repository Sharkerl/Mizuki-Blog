---
title: Image Hosting by Github and PicGo
Description: Image Hosting Service
tags: ["Convenient, Personal"]
category: "Code"
date: 2026-07-02
published: 2026-07-03
draft: false
---

## 使用 $Github$ 和 $PicGo$ 搭建个人图床

### $Github$ 部分

- $$New \ Repository \rightarrow 个人主页 \ Settings \rightarrow Developer \ settings \rightarrow Personal \ Access \ Tokens \rightarrow Tokens \  (classic) \rightarrow Generate \ new \ token \rightarrow 选择 \ repo \ 权限 \rightarrow Generate \ \bf{并保存密匙}$$ <br>
- 转到仓库 -> Settings -> Secrets and variables -> Actions -> New repository secret -> 填写 `GITHUB_TOKEN` 和 `GITHUB_USERNAME` -> Add secret
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/Sharkerl/Cloud-Images-Manage/Images_01/ImageHosting_Actions_Token.webp" alt="填写Token" style="width:100%;height:100%;" />
</p>


### $PicGo$ 部分

Download [PicGo][PicGoGithub] <-点击此处跳转

[PicGoGithub]: https://github.com/Molunerfinn/PicGo/releases "PicGoGithub"

 -> Providers -> Github -> Create Config -> 参照下图 -> Confirm -> Upload 

<img src="https://cdn.jsdelivr.net/gh/Sharkerl/Cloud-Images-Manage/Images_01/ImageHosting_PicGo_Providers.webp"/>

:::tip
`jsdelivr` 是一个免费的 CDN 服务，能够将 Github 上的静态资源加速访问. 官网: [https://www.jsdelivr.com/](https://www.jsdelivr.com/)
:::
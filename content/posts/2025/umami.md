---
title: "为网站添加统计和分析并展示出来"
description: "使用 Umami 来统计网站数据并使用 API 展示"
date: 2025-05-12
updated: 2025-05-12
type: story
categories: [博客]
tags: ["Umami", "统计", "分析", "API"]
---

## Umami 介绍和部署

### 什么是 Umami

Umami 是一个开源的、注重隐私的网站分析工具，作为 Google Analytics 的替代品。它提供了对网站流量、用户行为和性能的基本洞察，同时优先考虑数据隐私。

用户可以查看时间段内的浏览量、访问数、访客数、跳出率、使用的操作系统和浏览器等数据，最主要的是支持自托管。

### 部署

Umami 的部署可以通过 Docker 容器来实现，具体操作方法可以参考文档 [Umami Docs](https://umami.is/docs/install).

如果你是 1Panel 面板用户，可以直接在面板中搜索 Umami 一键部署，添加反代配置数据库什么的就不赘述了。部署后可在管理界面添加网站，然后插入给出的 `<script>` 跟踪代码到网页 `<head>` 中即可开始统计。

## 使用 API 展示数据

详细文档 [Umami API Docs](https://umami.is/docs/api).

### 获取 Token

要通过 API 获取数据，首先要认证用户身份，获取授权令牌（Token）

得先向 /api/auth/login 发送一个 POST 请求，如下

```js
fetch('https://你的部署域名/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: '你的用户名',
    password: '你的密码',
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log('Token:', data.token);
  })
  .catch((error) => console.error('登录失败:', error));
```

返回的 JSON 中包含 **token** 字段，即为后续所有请求的身份认证令牌（Bearer Token）。

### 获取统计数据

获取数据除了需要 Token 以外，我们还需要提供两个参数，分别是网站 ID 和时间范围。

```js
const token = '上一步获取的token';
const websiteId = '你的网站ID';
const startAt = 0; // 从网站创建之初开始
const endAt = Date.now(); // 当前时间

fetch(`https://你的部署域名/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log('统计数据:', data);
  })
  .catch((error) => console.error('获取数据失败:', error));
```

### 展示数据

上面的代码会返回一个 JSON 数据，如下

```json
{
  "pageViews": 1000,
  "visits": 500,
  "visitors": 300,
  "bounceRate": 0.2,
  "avgTimeOnPage": 120
}
```

- pageViews：页面浏览量
- visits：访问量
- visitors：访客数
- bounceRate：跳出率
- avgTimeOnPage：平均停留时间

你可以将数据展示到网页上，比如 HTML + JS

```html
<div id="stats"></div>

<script>
  // 假设 data 是上一步获取的对象
  function renderStats(data) {
    document.getElementById('stats').innerHTML = `
      <p>页面浏览量: ${data.pageviews}</p>
      <p>访问量: ${data.visits}</p>
      <p>访客数: ${data.visitors}</p>
      <p>跳出率: ${data.bounceRate.toFixed(2)}%</p>
      <p>平均停留时间: ${data.avgTimeOnPage.toFixed(2)} 秒</p>
    `;
  }
</script>
```

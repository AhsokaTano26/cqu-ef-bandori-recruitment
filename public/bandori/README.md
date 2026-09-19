# BanG Dream! 素材

官方角色立绘与乐队 logo，供同好会招新页面使用。

- **235 张角色立绘**，12 个乐队，60 个角色
- **12 个乐队 logo**
- 全部为 WebP，共约 **27 MB**

> 从官方站点抓取的 PNG / SVG 原档**不在此仓库**，存放在仓库外部的
> `../cqu-ef-bandori-recruitment-assets/`（不提交、不部署）。
> 本目录只保留可直接部署的 WebP。

---

## 目录结构

```
public/bandori/
├── characters/{乐队}/{角色}_{季节}_{序号}.webp
└── logos/{乐队}.webp
```

### 引用示例

```tsx
// 单一立绘
<img src="/bandori/characters/roselia/minato-yukina_s2_1.webp" alt="湊友希那" />

// 某乐队全部立绘
const band = "mygo";
const art = `/bandori/characters/${band}/`;

// 乐队 logo
<img src="/bandori/logos/roselia.webp" alt="Roselia" />
```

### 文件名说明

| 站点 | 命名 | 说明 |
|---|---|---|
| 旧官网 | `{角色}_s{1,2,3}_{n}.webp` | `s` 是季节造型，`n` 是同一季内的第几张 |
| 新官网 | `{角色}_{n}.webp` | 无季节区分，每角色 2 张 |

角色名用官方罗马字，如 `toyama-kasumi`、`minato-yukina`、`takamatsu-tomori`。

---

## 覆盖范围

| 乐队 | 角色数 | 立绘数 |
|---|---|---|
| Poppin'Party | 5 | 30 |
| Afterglow | 5 | 30 |
| Hello, Happy World! | 5 | 30 |
| Pastel＊Palettes | 5 | 30 |
| Roselia | 5 | 30 |
| Morfonica | 5 | 15 |
| RAISE A SUILEN | 5 | 15 |
| MyGO!!!!! | 5 | 15 |
| Ave Mujica | 5 | 10 |
| 夢限大みゅーたいぷ | 5 | 10 |
| millsage | 5 | 10 |
| いっかさん | 5 | 10 |

**未收录**：经纪人、配角等非乐队成员；官方未放出立绘的角色。

---

## 规格

- 旧官网来源：1100×1400，无损 WebP，保留透明通道
- 新官网来源：1800×2160，官方原始 WebP 直接使用
- 单张最大 184 KB —— 远低于 Cloudflare Workers 单文件 25 MiB 上限
- 文件数 247，占 free plan 20,000 上限的 1.2%

---

## 版权

角色立绘与乐队 logo 版权归 **Bushiroad / Craft Egg** 所有。
本目录是官方公开素材的本地存档，用于重庆大学 EF 邦多利同好会的非营利招新页面。

使用前请阅读官方二次创作指引：<https://bang-dream.com/bdp-guideline/>

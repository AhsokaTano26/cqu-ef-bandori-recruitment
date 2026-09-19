# 官方人物横排核查

核查日期：2026-09-20。范围：`/show` 的 12 支乐队、60 名角色。

## 采用的顺序

采用与本站立绘来源对应的官方角色页**桌面五人横排，从左到右**。不把 HTML 资料顺序当成站位，不根据主唱身份猜测其余四人的位置。本站手机端也是五人横排，因此沿用这一顺序；官网手机端换行后的阅读顺序不适用于本站。

| 乐队及官方来源 | 从左到右（第三位居中） |
| --- | --- |
| [Poppin’Party](https://bang-dream.bushimo.jp/character/poppinparty/) | 牛込りみ → 山吹沙綾 → **戸山香澄** → 市ヶ谷有咲 → 花園たえ |
| [Afterglow](https://bang-dream.bushimo.jp/character/afterglow/) | 上原ひまり → 羽沢つぐみ → **美竹蘭** → 宇田川巴 → 青葉モカ |
| [Hello, Happy World!](https://bang-dream.bushimo.jp/character/hello-happy-world/) | 北沢はぐみ → ミッシェル → **弦巻こころ** → 瀬田薫 → 松原花音 |
| [Pastel＊Palettes](https://bang-dream.bushimo.jp/character/pastel-palettes/) | 白鷺千聖 → 若宮イヴ → **丸山彩** → 大和麻弥 → 氷川日菜 |
| [Roselia](https://bang-dream.bushimo.jp/character/roselia/) | 氷川紗夜 → 宇田川あこ → **湊友希那** → 白金燐子 → 今井リサ |
| [Morfonica](https://bang-dream.bushimo.jp/character/morfonica/) | 八潮瑠唯 → 広町七深 → **倉田ましろ** → 二葉つくし → 桐ヶ谷透子 |
| [RAISE A SUILEN](https://bang-dream.bushimo.jp/character/raise-a-suilen/) | パレオ → マスキング → **レイヤ** → チュチュ → ロック |
| [MyGO!!!!!](https://bang-dream.bushimo.jp/character/mygo/) | 千早愛音 → 長崎そよ → **高松燈** → 椎名立希 → 要楽奈 |
| [Ave Mujica](https://bang-dream-on.bushimo.jp/character/avemujica/) | 豊川祥子 → 八幡海鈴 → **三角初華** → 祐天寺にゃむ → 若葉睦 |
| [夢限大みゅーたいぷ](https://bang-dream-on.bushimo.jp/character/yumemita/) | 峰月律 → 千石ユノ → **仲町あられ** → 藤都子 → 宮永ののか |
| [millsage](https://bang-dream-on.bushimo.jp/character/millsage/) | 琴平凪 → 浜崎まほろ → **汐見蛍** → 和泉朋花 → 伊沢なつめ |
| [一家Dumb Rock!](https://bang-dream-on.bushimo.jp/character/ikka-dumb-rock/) | 矢倉蓬咲 → 梅里ちえり → **須賀蕾叶** → 四宮寧月 → 馬橋心玖 |

## 核查依据与容易混淆的地方

- 前八队：[Girls Band Party 官方 CSS](https://bang-dream.bushimo.jp/wordpress/wp-content/themes/bang-dream_gbp_v2/assets/css/character/style.css) 的 `.character-Index_Member.{band} .member li.{character}` 桌面 `order`。容器为正向 flex，非 `row-reverse`。移动端媒体查询中的 `order` 另用于换行布局，不混用。
- MyGO 的官方 CSS 把燈、立希都写成 `order:3`；官方 HTML 中燈先于立希。同序号保持 DOM 次序，因此燈居中、立希第四。
- 后四队：官方角色页 `.member` 中的 `is-first / is-second / is-middle / is-second-last / is-last`，结合 [Our Notes 官方 CSS](https://bang-dream-on.bushimo.jp/wordpress/wp-content/themes/bang-dream-on_prod/assets/css/app.css) 的桌面 `order:1 / 2 / 3 / 4 / 5`。
- 这是特定官方页面的展示顺序，不声称所有宣传图、演唱会或动画分镜都有唯一站位。
- `band-choreography.ts` 的 `order` 是本站原创动画的延迟序号，只控制先后出现，不改变左右站位。本次核查没有将原创动画时序标称为官方时序。
- 12 队原排列均有至少一处左右位置不一致；已只移动完整角色对象，保留人物名称、颜色、舞台名和立绘地址的对应关系。

## 回归检查

运行 `node --experimental-strip-types --test tests/bandori-roster.test.mjs`。

检查 12 队与上述来源对应的完整左右顺序、60 名角色无重复、立绘和 Logo 均存在、每队动画延迟索引为 0–4 的排列。日后官方换版时，应重新核查来源后同时更新阵容和这份记录。

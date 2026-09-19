export type Character = {
  /** 文件名前缀，对应 public/bandori/characters/{band}/{slug}_s3_1.webp */
  slug: string;
  /** 官方日文名，取自官方角色页 */
  name: string;
  /** 官方角色专属色。缺省时回退到所属乐队的 accent */
  color?: string;
  /** Ave Mujica 五人的舞台名 */
  stage?: string;
};

export type Band = {
  /** 目录名，也是 public/bandori/logos/{slug}.webp 的文件名 */
  slug: string;
  name: string;
  nameJp: string;
  /** 舞台灯光主题色 */
  accent: string;
  /**
   * 立绘文件名后缀（不含扩展名）。
   * 旧官网（8 队）为 "s3_1"，新官网（4 队）为 "1"。缺省视为 "s3_1"。
   */
  artSuffix?: string;
  /** 官网桌面横排从左到右；来源与核查记录见 docs/official-roster-order.md。 */
  characters: Character[];
};

export const BANDS: Band[] = [
  {
    slug: "poppinparty", name: "Poppin'Party", nameJp: "Poppin'Party", accent: "#FF5522",
    characters: [
      { slug: "ushigome-rimi", name: "牛込 りみ", color: "#FF55BB" },
      { slug: "yamabuki-saya", name: "山吹 沙綾", color: "#FFCC11" },
      { slug: "toyama-kasumi", name: "戸山 香澄" },
      { slug: "ichigaya-arisa", name: "市ヶ谷 有咲", color: "#AA66DD" },
      { slug: "hanazono-tae", name: "花園 たえ", color: "#0077DD" },
    ],
  },
  {
    slug: "afterglow", name: "Afterglow", nameJp: "Afterglow", accent: "#EE0022",
    characters: [
      { slug: "uehara-himari", name: "上原 ひまり", color: "#FF9999" },
      { slug: "hazawa-tsugumi", name: "羽沢 つぐみ", color: "#FFEE88" },
      { slug: "mitake-ran", name: "美竹 蘭" },
      { slug: "udagawa-tomoe", name: "宇田川 巴", color: "#BB0033" },
      { slug: "aoba-moca", name: "青葉 モカ", color: "#00CCAA" },
    ],
  },
  {
    slug: "hello-happy-world", name: "Hello, Happy World!", nameJp: "ハロー、ハッピーワールド！", accent: "#FFEE22",
    characters: [
      { slug: "kitazawa-hagumi", name: "北沢 はぐみ", color: "#FF9922" },
      { slug: "michelle", name: "ミッシェル", color: "#006699" },
      { slug: "tsurumaki-kokoro", name: "弦巻 こころ" },
      { slug: "seta-kaoru", name: "瀬田 薫", color: "#AA33CC" },
      { slug: "matsubara-kanon", name: "松原 花音", color: "#44DDFF" },
    ],
  },
  {
    slug: "pastel-palettes", name: "Pastel＊Palettes", nameJp: "Pastel＊Palettes", accent: "#55DDEE",
    characters: [
      { slug: "shirasagi-chisato", name: "白鷺 千聖", color: "#FFEEAA" },
      { slug: "wakamiya-eve", name: "若宮 イヴ", color: "#DDBBFF" },
      { slug: "maruyama-aya", name: "丸山 彩", color: "#FF88BB" },
      { slug: "yamato-maya", name: "大和 麻弥", color: "#99DD88" },
      { slug: "hikawa-hina", name: "氷川 日菜" },
    ],
  },
  {
    slug: "roselia", name: "Roselia", nameJp: "Roselia", accent: "#2A5FD6",
    characters: [
      { slug: "hikawa-sayo", name: "氷川 紗夜", color: "#00AABB" },
      { slug: "udagawa-ako", name: "宇田川 あこ", color: "#DD0088" },
      { slug: "minato-yukina", name: "湊 友希那", color: "#881188" },
      { slug: "shirokane-rinko", name: "白金 燐子", color: "#BBBBBB" },
      { slug: "imai-lisa", name: "今井 リサ", color: "#DD2200" },
    ],
  },
  {
    slug: "morfonica", name: "Morfonica", nameJp: "Morfonica", accent: "#37A9E0",
    characters: [
      { slug: "yashio-rui", name: "八潮 瑠唯", color: "#669988" },
      { slug: "hiromachi-nanami", name: "広町 七深", color: "#EE7744" },
      { slug: "kurata-mashiro", name: "倉田 ましろ", color: "#6677CC" },
      { slug: "futaba-tsukushi", name: "二葉 つくし", color: "#EE7788" },
      { slug: "kirigaya-toko", name: "桐ヶ谷 透子", color: "#EE6666" },
    ],
  },
  {
    slug: "raise-a-suilen", name: "RAISE A SUILEN", nameJp: "RAISE A SUILEN", accent: "#4D76CB",
    characters: [
      { slug: "pareo", name: "パレオ" },
      { slug: "masking", name: "マスキング" },
      { slug: "layer", name: "レイヤ" },
      { slug: "chu2", name: "チュチュ" },
      { slug: "lock", name: "ロック" },
    ],
  },
  {
    slug: "mygo", name: "MyGO!!!!!", nameJp: "MyGO!!!!!", accent: "#38B1DF",
    characters: [
      { slug: "chihaya-anon", name: "千早 愛音", color: "#FF8899" },
      { slug: "nagasaki-soyo", name: "長崎 そよ", color: "#FFDD88" },
      { slug: "takamatsu-tomori", name: "高松 燈", color: "#77BBDD" },
      { slug: "shiina-taki", name: "椎名 立希", color: "#7777AA" },
      { slug: "kaname-rana", name: "要 楽奈", color: "#77DD77" },
    ],
  },
  {
    slug: "avemujica", name: "Ave Mujica", nameJp: "Ave Mujica", accent: "#EE298B", artSuffix: "1",
    characters: [
      { slug: "togawa-sakiko", name: "豊川 祥子", stage: "オブリビオニス" },
      { slug: "yahata-umiri", name: "八幡 海鈴", stage: "ティモリス" },
      { slug: "misumi-uika", name: "三角 初華", stage: "ドロリス" },
      { slug: "yutenji-nyamu", name: "祐天寺 にゃむ", stage: "アモーリス" },
      { slug: "wakaba-mutsumi", name: "若葉 睦", stage: "モーティス" },
    ],
  },
  {
    slug: "yumemita", name: "Yumemita", nameJp: "夢限大みゅーたいぷ", accent: "#CB4D7D", artSuffix: "1",
    characters: [
      { slug: "minetsuki-ritsu", name: "峰月 律" },
      { slug: "sengoku-yuno", name: "千石 ユノ" },
      { slug: "nakamachi-arale", name: "仲町 あられ" },
      { slug: "fuji-miyako", name: "藤 都子" },
      { slug: "miyanaga-nonoka", name: "宮永 ののか" },
    ],
  },
  {
    slug: "millsage", name: "millsage", nameJp: "millsage", accent: "#7B4DCB", artSuffix: "1",
    characters: [
      { slug: "kotohira-nagi", name: "琴平 凪" },
      { slug: "hamasaki-mahoro", name: "浜崎 まほろ" },
      { slug: "shiomi-hotaru", name: "汐見 蛍" },
      { slug: "izumi-houka", name: "和泉 朋花" },
      { slug: "izawa-natsume", name: "伊沢 なつめ" },
    ],
  },
  {
    slug: "ikka-dumb-rock", name: "Ikka Dumb Rock", nameJp: "いっかさん", accent: "#4DCB56", artSuffix: "1",
    characters: [
      { slug: "yakura-yomogi", name: "矢倉 蓬咲" },
      { slug: "umezato-chieri", name: "梅里 ちえり" },
      { slug: "suga-raika", name: "須賀 蕾叶" },
      { slug: "shinomiya-shizuku", name: "四宮 寧月" },
      { slug: "mahashi-miku", name: "馬橋 心玖" },
    ],
  },
];

/** 立绘地址。60 个角色全部命中首选文件，无缺图分支。 */
export function artUrl(band: Band, character: Character): string {
  return `/bandori/characters/${band.slug}/${character.slug}_${band.artSuffix ?? "s3_1"}.webp`;
}

export function logoUrl(band: Band): string {
  return `/bandori/logos/${band.slug}.webp`;
}

/** 名条颜色：优先角色官方色，缺省回退乐队主题色。 */
export function plaqueColor(band: Band, character: Character): string {
  return character.color ?? band.accent;
}

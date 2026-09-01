"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  AudioLines,
  CalendarClock,
  Check,
  Coffee,
  Copy,
  ExternalLink,
  Flower2,
  Gamepad2,
  GalleryHorizontal,
  MapPinned,
  MessageCircleMore,
  MicVocal,
  MonitorPlay,
  Palette,
  PencilRuler,
  QrCode,
  Sparkles,
  TicketCheck,
  Trophy,
  UsersRound,
  Video,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";

type IconItem = { icon: LucideIcon; title: string; text: string };

const crew: IconItem[] = [
  { icon: Gamepad2, title: "音游高手", text: "魔王曲也能从容应对的勇士" },
  { icon: MapPinned, title: "现地大师", text: "线下活动永远出现在第一排的存在" },
  { icon: MicVocal, title: "声优痴情种", text: "阅生肉、切片、生放无数，每日实时更新女声优在社交媒体上发布的照片" },
  { icon: WalletCards, title: "二偶企划永动机", text: "或是究极单推人，或是疯狂 CDD，给纸片人花钱的速度快过光速" },
  { icon: Palette, title: "绘画领域大神", text: "大笔一挥，让鲜活的角色跃然纸上" },
  { icon: Sparkles, title: "Cosplay 玩家", text: "想和你心仪的角色一起唱 K 吗" },
];

const daily = [
  { icon: Gamepad2, text: "在协力房表演花式翻车三连" },
  { icon: MonitorPlay, text: "与群友连麦围观某近期热播动画" },
  { icon: PencilRuler, text: "在你画我猜中创作全新的群精华消息" },
  { icon: AudioLines, text: "在 KTV 嚎歌大赛用破音致敬 Roselia" },
];

const highlights = [
  { icon: Coffee, title: "冬日茶话会之“谁才是二偶领域高手”抢答大赛", label: "冬日聚会" },
  { icon: Video, title: "跨年纪念手元视频里扮演 AP 大神", label: "跨年企划", link: "https://bilibili.com/BV1ww6aYPEDE" },
  { icon: Flower2, title: "1.18 大冢纱英见面会引领重庆各校冲刺女声优学科评级（高校联合应援花篮成功送出）", label: "线下应援" },
  { icon: TicketCheck, title: "重庆邦多利 only 上人均长枪短炮（指应援棒）", label: "Only 现场" },
  { icon: CalendarClock, title: "正在憋大招准备给 PPP 十周年整点好活（5.26 高校联合花篮正在疯狂爆肝中）", label: "进行中" },
];

const originalCards = [
  { icon: MessageCircleMore, title: "EF 世界线闲聊", text: "角色、设定、剧情与那些突然想起的细节。" },
  { icon: Sparkles, title: "同好安利交换", text: "动画、漫画、游戏与线下展会情报，互相种草。" },
  { icon: MapPinned, title: "校园不定期面基", text: "约饭、桌游、观影或在校园里慢慢散步。" },
];

type GalleryGroup = {
  title: string;
  kicker: string;
  text: string;
  icon: LucideIcon;
  tone: "rank" | "live" | "crew" | "other";
  photos: number[];
};

const galleryGroups: GalleryGroup[] = [
  {
    title: "冲榜图",
    kicker: "FULL COMBO!",
    text: "点数、排名与不断刷新的目标——为下一张满分结果图继续开打。",
    icon: Trophy,
    tone: "rank",
    photos: [1, 24, 25, 26, 31, 32, 33, 34, 35, 36, 38],
  },
  {
    title: "现地图",
    kicker: "LIVE HOUSE",
    text: "从 Only 到舞台，从花篮到应援棒，把屏幕里的热爱带到真实现场。",
    icon: MapPinned,
    tone: "live",
    photos: [2, 3, 20, 23, 27, 37],
  },
  {
    title: "团建图",
    kicker: "WE ARE THE BAND",
    text: "一起摆摊、合影、带旗出发；同好会的合奏，永远有人在场。",
    icon: UsersRound,
    tone: "crew",
    photos: [28, 29, 30],
  },
  {
    title: "其他图片",
    kicker: "SIDE STORIES",
    text: "声优、手绘、周边与日常碎片——每一张都是邦邦人的支线故事。",
    icon: GalleryHorizontal,
    tone: "other",
    photos: [4, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 21, 22, 39, 40, 41, 42, 43, 44, 45],
  },
];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [activePhoto, setActivePhoto] = useState<{ src: string; alt: string } | null>(null);
  const [photoClosing, setPhotoClosing] = useState(false);

  const dismissIntro = () => {
    setIntroLeaving(true);
    window.setTimeout(() => setIntroDone(true), 560);
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const leaveDelay = isMobile ? (reducedMotion ? 1200 : 2600) : reducedMotion ? 80 : 1900;
    const doneDelay = isMobile ? (reducedMotion ? 1300 : 3200) : reducedMotion ? 180 : 2460;
    const leaveTimer = window.setTimeout(() => setIntroLeaving(true), leaveDelay);
    const doneTimer = window.setTimeout(() => setIntroDone(true), doneDelay);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (!activePhoto) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !photoClosing) {
        setPhotoClosing(true);
        window.setTimeout(() => {
          setActivePhoto(null);
          setPhotoClosing(false);
        }, 180);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activePhoto, photoClosing]);

  const closePhoto = () => {
    if (photoClosing) return;
    setPhotoClosing(true);
    window.setTimeout(() => {
      setActivePhoto(null);
      setPhotoClosing(false);
    }, 180);
  };

  const copyGroup = async () => {
    await navigator.clipboard?.writeText("824993838");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      {!introDone && <section className={`intro-screen ${introLeaving ? "is-leaving" : ""}`} aria-label="重庆大学 EF 邦多利马群入场动画">
        <div className="intro-stage-lines" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        <div className="intro-spark intro-spark-one" />
        <div className="intro-spark intro-spark-two" />
        <p className="intro-live" aria-hidden="true">LIVE START</p>
        <div className="intro-lockup">
          <img src="/ef-bandori-logo.png" alt="重庆大学 EF 邦多利同好会徽标" />
          <span className="intro-divider" aria-hidden="true" />
          <div className="intro-copy"><p>重庆大学EF邦多利马群</p><small>CHONGQING UNIVERSITY EF BANDORI FAN CLUB</small></div>
        </div>
        <button className="intro-skip" type="button" onClick={dismissIntro}>跳过动画</button>
      </section>}
      <nav className="wrap">
        <b><i>EF</i> 邦多利马群</b>
        <span>
          <a href="#bandori">BanG Dream!</a>
          <a href="#about">关于我们</a>
          <a href="#gallery">现场影像</a>
          <a className="navbtn" href="#join">现在加入 <ArrowRight aria-hidden="true" size={15} /></a>
        </span>
      </nav>

      <section className="hero">
        <div className="sun" />
        <div className="wrap">
          <p className="tag">CHONGQING UNIVERSITY · 2026 RECRUITING</p>
          <h1>把热爱，<br /><em>带到同一条</em>世界线。</h1>
          <p>重庆大学 EF 邦多利同好会，面向每一位喜欢交流、愿意分享的同学。<br />在校园里，遇见频率相同的伙伴。</p>
          <a className="cta" href="#join">申请进群 <ArrowRight aria-hidden="true" size={18} /></a>
          <small className="hero-note"><Sparkles aria-hidden="true" size={14} /> 新学期纳新进行中 · 欢迎每一位新同学</small>
        </div>
        <strong className="round">BANDORI<br /><i>× EF</i></strong>
      </section>

      <section className="bandori wrap" id="bandori">
        <div>
          <p className="tag">/ START HERE</p>
          <h2>BanG Dream!，<br /><span>从哪一拍入坑？</span></h2>
        </div>
        <div className="bandori-copy">
          <p>这是一个以女子乐队为核心的跨媒体企划：从动画、手游《BanG Dream! 少女乐团派对!》，到音乐、演唱会、真人乐队与声优活动，热爱总有地方落脚。</p>
          <p>不管是 Poppin&apos;Party、Roselia、RAISE A SUILEN，还是 MyGO!!!!!、Ave Mujica——从打歌到追番，从 live 到声优，你总能找到一个入坑方式。</p>
          <div className="band-tags"><span>Poppin&apos;Party</span><span>Roselia</span><span>RAISE A SUILEN</span><span>MyGO!!!!!</span><span>Ave Mujica</span></div>
        </div>
      </section>

      <section className="wrap about" id="about">
        <p className="tag">/ ABOUT OUR CREW</p>
        <h2>不是“找群聊”，<br />是<span>找到同路人。</span></h2>
        <p className="desc">这里是重庆大学 EF 邦多利同好会！一个集结了人类高质量二偶粉丝的神奇组织。我们聊邦多利，也聊 EF、二次元文化和日常；偶尔热闹聚集，也允许安静围观。</p>
        <div className="crew-grid">
          {crew.map(({ icon: Icon, title, text }) => <article key={title}><span className="icon-chip"><Icon aria-hidden="true" size={23} strokeWidth={2.2} /></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="play" id="play">
        <div className="wrap">
          <p className="tag">/ IN THIS WORLD</p>
          <h2>在这里，<span>万物皆可邦多利！</span></h2>
          <div className="play-list">
            {daily.map(({ icon: Icon, text }, index) => <article key={text}><b><Icon aria-hidden="true" size={17} /> 0{index + 1}</b><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="highlights wrap" id="highlights">
        <p className="tag">/ BANDORI IN MOTION</p>
        <h2>重大の邦邦人们<br /><span>正在创造历史。</span></h2>
        <div className="timeline">
          {highlights.map(({ icon: Icon, title, label, link }, index) => <article key={title}>
            <span className="line-dot">{String(index + 1).padStart(2, "0")}</span>
            <div className="event-card"><b><Icon aria-hidden="true" size={16} /> {label}</b><p>{link ? <a href={link} target="_blank" rel="noreferrer">{title} <ExternalLink aria-hidden="true" size={14} /></a> : title}</p></div>
          </article>)}
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="wrap">
          <div className="gallery-heading"><div><p className="tag">/ MEMORIES ON STAGE</p><h2>有图有真相，<br /><span>热爱正在发生。</span></h2></div><p>把每一次出发分成四首歌：冲榜、现地、团建，还有不设限的日常支线。</p></div>
          <div className="gallery-groups">
            {galleryGroups.map(({ title, kicker, text, icon: Icon, tone, photos }) => <section className={`gallery-group ${tone}`} key={title}>
              <header>
                <span className="gallery-icon"><Icon aria-hidden="true" size={22} /></span>
                <div><p>{kicker}</p><h3>{title}</h3></div>
                <small>{text}</small>
              </header>
              <div className="photo-grid">
                {photos.map((photo, index) => {
                  const src = `/gallery/photo-${String(photo).padStart(2, "0")}.jpg`;
                  const alt = `${title} · 重庆大学 EF 邦多利同好会影像 ${photo}`;
                  return <figure className={index === 0 ? "is-featured" : ""} key={src}><button type="button" onClick={() => { setPhotoClosing(false); setActivePhoto({ src, alt }); }} aria-label={`查看大图：${alt}`}><img src={src} alt={alt} loading="lazy" /></button></figure>;
                })}
              </div>
            </section>)}
          </div>
        </div>
      </section>

      <section className="events" id="events">
        <div className="wrap">
          <p className="tag">/ ALSO IN THE GROUP</p>
          <h2>群里，<span>还有这些日常。</span></h2>
          <div className="cards">
            {originalCards.map(({ icon: Icon, title, text }, index) => <article key={title}><b><Icon aria-hidden="true" size={17} /> 0{index + 1}</b><h3>{title}</h3><p>{text}</p><small>{index === 0 ? "今天也想聊聊……" : index === 1 ? "这个我也喜欢！" : "周末有空一起吗？"}</small></article>)}
          </div>
        </div>
      </section>

      <section className="wrap rules">
        <div><p className="tag">/ COMMUNITY NOTE</p><h2>舒服相处的<br /><span>三条小约定</span></h2></div>
        <ol><li><b>友善交流</b> 尊重不同喜好，不攻击、不拉踩。</li><li><b>保护彼此</b> 不传播他人隐私，群内内容不随意外传。</li><li><b>拒绝打扰</b> 不发广告、不刷屏；有分歧，先好好说话。</li></ol>
      </section>

      <section className="join" id="join">
        <div className="wrap">
          <p className="tag">/ JOIN THE LINE</p>
          <h2>下一位，<br />就是你。</h2>
          <p className="join-lede">还在犹豫什么，快点加入我们，一起击穿梦想，叩响明日的门扉吧！</p>
          <div className="group-card">
            <img src="/qq-group-qr.png" alt="QQ 群 824993838 二维码" />
            <div className="group-copy"><small>重庆大学 EF 邦多利同好会</small><strong>824993838</strong><span>保存或扫描二维码即可申请加入</span></div>
            <div className="group-actions">
              <a className="join-qq" href="https://qm.qq.com/cgi-bin/qm/qr?k=dJg43mUywnFUUnoCb0G-AD8k35qcQueu&jump_from=webapi&authKey=fp7Xp1Wit/WQZ/PZOu8fJcr+YgyBUpCfWpYo5Fqtyi7GM8YSQE4FhSAtPQmaTjK6" target="_blank" rel="noreferrer">加入 QQ 群 <ExternalLink aria-hidden="true" size={15} /></a>
              <button onClick={copyGroup} aria-label="复制 QQ 群号 824993838">{copied ? <><Check aria-hidden="true" size={15} /> 已复制</> : <><Copy aria-hidden="true" size={15} /> 复制群号</>}</button>
            </div>
          </div>
          <p className="join-note"><QrCode aria-hidden="true" size={14} /> 点击“加入 QQ 群”可直接跳转；也可以复制群号后在 QQ 中搜索加入。</p>
        </div>
      </section>
      <footer className="wrap">EF BANGDREAM · CQU · 重庆大学 EF 邦多利马群</footer>
      {activePhoto && <div className={`photo-lightbox ${photoClosing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="图片大图预览">
        <button className="photo-lightbox-backdrop" type="button" onClick={closePhoto} aria-label="关闭大图预览" />
        <div className="photo-lightbox-content">
          <button className="photo-lightbox-close" type="button" onClick={closePhoto} aria-label="关闭大图预览"><X aria-hidden="true" size={22} /></button>
          <img src={activePhoto.src} alt={activePhoto.alt} />
        </div>
      </div>}
    </main>
  );
}

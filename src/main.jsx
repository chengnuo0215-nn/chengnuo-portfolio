import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-600.css";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  ChatCircleText,
  EnvelopeSimple,
  GraduationCap,
  House,
  PenNib,
  Sparkle,
} from "@phosphor-icons/react";
import SideRays from "./components/SideRays/SideRays";
import "./styles.css";

const rotatingWords = ["体验视角 👀", "好奇心 💡", "逻辑推理 🧩", "执行力 ⚡", "系统思考 🧭"];

const navItems = [
  { label: "首页", href: "#home", icon: House },
  { label: "项目经验", href: "#projects", icon: Briefcase },
  { label: "关于我", href: "#more", icon: ChatCircleText },
  { label: "联系", href: "#contact", icon: EnvelopeSimple },
];

const educationItems = [
  ["硕士", "同济大学设计创意学院 · 交互设计", "2024.9-2027.3 · 用户体验 / 可穿戴设计 / AI Agent"],
  ["本科", "同济大学设计创意学院 · 工业设计", "2020.9-2024.6 · 产品设计 / 硬软件交互 / 专业前 3 保研本校"],
];

const experiences = [
  ["WXG 视频号设计组", "2025.12-2026.5", "参与视频号创作者工具体验设计，关注移动端效率与业务链路整合。"],
  ["Bilibili 会员购", "2025", "参与交易与会员购相关体验优化，处理多地址、售后等复杂流程问题。"],
  ["字节 TikTok 平台设计组", "2025.3-2025.8", "参与平台型工具与 Semi AI 组件体系建设，支持业务快速接入 AI 能力。"],
  ["小红书商业化设计组", "2024", "参与商业化产品体验设计，关注广告投放、增长工具与创作者商业场景。"],
];

const contactInfo = [
  ["电话", "18756396897"],
  ["邮箱", "Chengnuo0215@outlook.com"],
];

const splitText = (text) => Array.from(text);

const surpriseMessages = [
  ["好运加倍", "✦"],
  ["灵感增加 +1", "💡"],
  ["获取一点灵感", "✧"],
  ["今天会有好事发生", "🌟"],
  ["快乐电量充满", "⚡"],
  ["好运正在靠近", "🍀"],
  ["保持漂亮心情", "☁️"],
  ["收到一颗小星星", "✨"],
];

function getBeijingStatus(date = new Date()) {
  const beijingParts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const hour = Number(beijingParts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(beijingParts.find((part) => part.type === "minute")?.value || 0);
  const minutes = hour * 60 + minute;

  if (minutes < 10 * 60 || minutes >= 22 * 60) {
    return { state: "rest", items: ["休息中", "请留言"] };
  }

  return minutes % 20 < 10
    ? { state: "online", items: ["在线", "🥰 我在听歌"] }
    : { state: "music", items: ["在线", "🥰 我在听歌"] };
}

function useBurst(hostSelector) {
  const [burst, setBurst] = useState(null);
  const burstTimerRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(burstTimerRef.current);
  }, []);

  const showBurst = (x, y) => {
    const [message, mark] = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    const particles = Array.from({ length: 22 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      dx: `${(Math.random() - 0.5) * 290}px`,
      dy: `${-54 - Math.random() * 168}px`,
      rot: `${(Math.random() - 0.5) * 180}deg`,
      size: `${6 + Math.random() * 10}px`,
      delay: `${index * 12}ms`,
    }));

    setBurst({ id: Date.now(), x, y, message, mark, particles });
    window.clearTimeout(burstTimerRef.current);
    burstTimerRef.current = window.setTimeout(() => setBurst(null), 980);
  };

  const createBurst = (event) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const host = event.currentTarget.closest(hostSelector) || event.currentTarget.parentElement;
    if (!host) return;
    const hostRect = host.getBoundingClientRect();
    showBurst(
      targetRect.left - hostRect.left + targetRect.width / 2,
      targetRect.top - hostRect.top + targetRect.height / 2,
    );
  };

  const createBurstAt = (host, clientX, clientY) => {
    if (!host) return;
    const hostRect = host.getBoundingClientRect();
    showBurst(clientX - hostRect.left, clientY - hostRect.top);
  };

  return [burst, createBurst, createBurstAt];
}

function BurstLayer({ burst }) {
  if (!burst) return null;

  return (
    <div className="burst-layer" aria-hidden="true">
      <span className="burst-toast" style={{ "--x": `${burst.x}px`, "--y": `${burst.y}px` }}>
        <i>{burst.mark}</i>
        {burst.message}
      </span>
      {burst.particles.map((particle) => (
        <span
          className="burst-particle"
          key={particle.id}
          style={{
            "--x": `${burst.x}px`,
            "--y": `${burst.y}px`,
            "--dx": particle.dx,
            "--dy": particle.dy,
            "--rot": particle.rot,
            "--s": particle.size,
            "--d": particle.delay,
          }}
        />
      ))}
    </div>
  );
}

function PlayfulWord({ children, className = "", onClick }) {
  return (
    <button className={`playful-word ${className}`} type="button" onClick={onClick} aria-label={children}>
      {splitText(children).map((char, index) => (
        <span key={`${char}-${index}`} style={{ "--i": index }}>
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </button>
  );
}

function KineticTitle({ cn, en, accentIndex = 0 }) {
  const letters = splitText(en);

  return (
    <h2 className="kinetic-title" aria-label={cn ? `${cn} ${en}` : en}>
      {cn ? <span className="kinetic-cn">{cn}</span> : null}
      <span className="kinetic-en" aria-hidden="true">
        {letters.map((letter, index) => (
          <span className={index === accentIndex ? "is-accent" : ""} key={`${letter}-${index}`} style={{ "--i": index }}>
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </span>
    </h2>
  );
}

const projects = [
  {
    title: "微信视频号移动端加热工具重构",
    type: "C 端体验设计 / 信息架构重构",
    meta: "WXG 视频号设计组 · 2026",
    label: "体验重构",
    description: "通过设计改版，满足加热业务整合和用户体验提升的双重目标，打造移动端面向普通创作者的低门槛、轻量化的加热工具。",
    accent: "#7ef5b7",
    image: "/assets/video-heat/1.png",
    href: "/projects/video-heat",
  },
  {
    title: "基模美学打标平台",
    type: "AI 训练工具 / 复杂交互原型",
    meta: "AI 辅助设计专题 · 2026",
    label: "设计主导 · AI Workflow",
    description: "iLabel 是微信级内部基础模型的美学打标平台。整个需求由设计主导，参与到从需求定义、方案设计和最终上线的全过程，并通过 AI 的方式辅助方案沟通和效果交付。",
    accent: "#64e6ff",
    image: "/assets/model-label/card-figure.png",
    href: "/projects/model-label",
  },
  {
    title: "Agile AI Platform",
    type: "平台工具 / AI 评测流程",
    meta: "TikTok 平台设计组 · 2025",
    label: "B 端复杂业务",
    description: "Agile 是 TikTok 内部的 AI 模型训练平台，面对复杂的业务需求，找到真正的提效点，简化用户链路，提供合适引导，提升用户体验。",
    accent: "#bda2ff",
    image: "/assets/agile/3-1.png",
    href: "/projects/agile-platform",
  },
  {
    title: "Semi AI 组件体系",
    type: "AI 组件 / 设计系统",
    meta: "TikTok 平台设计组 · 2025",
    label: "AI Design System",
    description: "围绕生成、对话、确认和执行反馈沉淀 AI 组件模式，帮助业务在 Semi 体系内低成本接入智能能力。",
    accent: "#78a9ff",
    image: "/assets/semi/4-1.png",
    href: "/projects/semi-ai",
  },
];

const videoHeatImages = Array.from({ length: 8 }, (_, index) => `/assets/video-heat/${index + 1}.png`);
const modelLabelImages = Array.from({ length: 5 }, (_, index) => `/assets/model-label/2-${index + 1}.png`);
const agileImages = Array.from({ length: 9 }, (_, index) => `/assets/agile/3-${index + 1}.png`);
const semiImages = Array.from({ length: 14 }, (_, index) => `/assets/semi/4-${index + 1}.png`);
const modelLabelPlaygroundUrl = "https://image-labeling-platform-20260810004.vercel.app/?embed=1";
const modelLabelFullExperienceUrl = "https://image-labeling-platform-20260810004.vercel.app";

const videoHeatOverview =
  "通过设计改版，满足加热业务整合和用户体验提升的双重目标，打造移动端面向普通创作者的低门槛、轻量化的加热工具。";

const videoHeatFacts = [
  ["项目概览", videoHeatOverview],
  ["进行时间", "2026.04-2026.05"],
  ["职责范围", "独立负责整个移动端重构流程设计，包括业务链路梳理、信息架构调整、下单流程设计、数据看板优化、核心原型与交付跟进。"],
];

const detailNavItems = [
  { label: "首页", href: "/#home", icon: House },
  { label: "概览", href: "#detail-overview", icon: Briefcase },
  { label: "试玩", href: "#detail-playground", icon: Sparkle },
  { label: "过程", href: "#detail-gallery", icon: PenNib },
  { label: "其他项目", href: "#detail-related", icon: ChatCircleText },
];

const projectCases = {
  "/projects/video-heat": {
    title: "微信视频号移动端加热工具重构",
    topAlt: "微信视频号移动端加热工具重构项目主图",
    images: videoHeatImages,
    facts: videoHeatFacts,
  },
  "/projects/model-label": {
    title: "基模美学打标平台",
    topAlt: "基模美学打标平台项目主图",
    images: modelLabelImages,
    facts: [
      [
        "项目概览",
        "iLabel 是微信级内部基础模型的美学打标平台。整个需求由设计主导，参与到从需求定义、方案设计和最终上线的全过程，并通过 AI 的方式辅助方案沟通和效果交付。",
      ],
      ["进行时间", "2026"],
      ["职责范围", "独立负责平台核心体验设计，包括页面框架、题型结构、看图模式、快捷键操作、响应式规则、AI 原型验证与交付说明整理。"],
    ],
    playground: {
      title: "Playground",
      url: modelLabelPlaygroundUrl,
      externalUrl: modelLabelFullExperienceUrl,
    },
  },
  "/projects/semi-ai": {
    title: "Semi AI 组件体系",
    topAlt: "Semi AI 组件体系项目主图",
    images: semiImages,
    facts: [
      [
        "项目概览",
        "Semi AI 组件体系聚焦业务接入 AI 能力时反复出现的通用交互：生成、理解、追问、确认、执行与反馈。我参与沉淀组件模式、状态表达和使用边界，帮助业务在既有设计系统内快速搭建 AI 产品体验。",
      ],
      ["进行时间", "2025"],
      ["职责范围", "参与 AI 组件体系的场景拆解、组件规范梳理、视觉与交互状态设计，并沉淀可复用的设计规则与落地示例。"],
    ],
  },
  "/projects/agile-platform": {
    title: "Agile AI Platform",
    topAlt: "Agile AI Platform 项目主图",
    images: agileImages,
    facts: [
      [
        "项目概览",
        "Agile 是 TikTok 内部的 AI 模型训练平台，面对复杂的业务需求，找到真正的提效点，简化用户链路，提供合适引导，提升用户体验。",
      ],
      ["进行时间", "2025"],
      ["职责范围", "参与平台核心流程设计，包括任务路径梳理、评测配置结构、结果页信息组织、版本管理和关键页面原型沉淀。"],
    ],
  },
};

const aboutStickers = [
  ["MBTI", "INTJ 倾向", "先拆问题，再收路径", "🧠"],
  ["星座", "水瓶座", "对新工具和新系统很敏感", "♒"],
  ["家乡", "安徽", "在江浙沪寻找好机会", "📍"],
  ["做事风格", "先搭框架，再抠细节", "把混沌整理成秩序", "🗂️"],
];

const musicTracks = [
  ["Sweet Disposition", "The Temper Trap", "写方案时循环"],
  ["Midnight City", "M83", "通勤时恢复能量"],
  ["Instant Crush", "Daft Punk", "深夜改稿专用"],
];

const memoNotes = [
  "复杂业务先画状态机",
  "好体验是把判断前置",
  "别急着画页面，先找卡点",
  "AI 工具也需要体验秩序",
];

const thoughtDocs = [
  {
    title: "视频号评论体验报告.pdf",
    file: "/assets/docs/video-comments.pdf",
    thumb: "/assets/about/video-comments-thumb.png",
    pages: Array.from({ length: 34 }, (_, index) => `/assets/docs/previews/video-comments/page-${String(index + 1).padStart(2, "0")}.jpg`),
  },
  {
    title: "手势交互趋势调研.pdf",
    file: "/assets/docs/gesture-interaction.pdf",
    thumb: "/assets/about/gesture-thumb.png",
    pages: Array.from({ length: 33 }, (_, index) => `/assets/docs/previews/gesture-interaction/page-${String(index + 1).padStart(2, "0")}.jpg`),
  },
];

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    const target = document.querySelector(".keyword-line");
    if (!target) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setShowNav(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (projectCases[path]) {
    return (
      <>
        <div className="grain" aria-hidden="true" />
        <ProjectDetail caseData={projectCases[path]} currentPath={path} />
      </>
    );
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <HomePage showNav={showNav} />
    </>
  );
}

function HomePage({ showNav }) {
  const homeRef = useRef(null);
  const [burst, , createBurstAt] = useBurst(".home-shell");

  const handleAmbientClick = (event) => {
    if (!homeRef.current) return;
    if (
      event.target.closest(
        [
          "a",
          "button",
          "input",
          "textarea",
          "select",
          "iframe",
          ".basic-card",
          ".project-card",
          ".about-poster",
          ".designer-badge",
          ".dock",
          ".doc-modal",
          ".qr-modal",
          "[role='dialog']",
        ].join(", "),
      )
    ) {
      return;
    }
    createBurstAt(homeRef.current, event.clientX, event.clientY);
  };

  return (
    <div className="home-shell" ref={homeRef} onClick={handleAmbientClick}>
      <FloatingNav visible={showNav} />
      <main>
        <Hero />
        <Projects />
        <MoreAbout />
        <Contact />
      </main>
      <BurstLayer burst={burst} />
    </div>
  );
}

function ProjectDetail({ caseData, currentPath }) {
  const relatedProjects = projects.filter((project) => project.href !== currentPath);
  const currentDetailNavItems = detailNavItems.filter((item) => item.href !== "#detail-playground" || caseData.playground);

  return (
    <div className="detail-page">
      <nav className="detail-nav" aria-label="项目详情导航">
        <a className="detail-nav-back" href="/#projects" aria-label="返回项目列表">
          <ArrowLeft size={16} />
          <span>返回</span>
        </a>
        <span className="detail-nav-divider" aria-hidden="true" />
        {currentDetailNavItems.map(({ label, href, icon: Icon }) => (
          <a className="detail-nav-item" href={href} key={label} aria-label={label}>
            <Icon size={17} weight="regular" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <main className="detail-shell">
        <section id="detail-top" className="detail-hero">
          <div className="detail-hero-image">
            <img src={caseData.images[0]} alt={caseData.topAlt} />
          </div>
        </section>

        <section id="detail-overview" className="detail-overview" aria-label="项目概览">
          <div className="detail-facts">
            {caseData.facts.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </section>

        {caseData.playground ? (
          <section id="detail-playground" className="detail-playground" aria-label="项目 Playground">
            <div className="playground-heading">
              <h2>{caseData.playground.title}</h2>
              {caseData.playground.externalUrl ? (
                <a href={caseData.playground.externalUrl} target="_blank" rel="noreferrer">
                  前往网站完整体验
                </a>
              ) : null}
            </div>
            {caseData.playground.url ? (
              <iframe title={`${caseData.title} 交互原型`} src={caseData.playground.url} loading="lazy" />
            ) : (
              <div className="playground-empty">
                <strong>等待接入原型地址</strong>
                <p>部署打标平台原型后，将 URL 写入 <code>VITE_MODEL_LABEL_PLAYGROUND_URL</code>，这里会自动切换为可操作 iframe。</p>
              </div>
            )}
          </section>
        ) : null}

        <section id="detail-gallery" className="detail-gallery" aria-label="项目详情">
          {caseData.images.slice(1).map((image, index) => (
            <figure className="detail-figure" key={image}>
              <img src={image} alt={`${caseData.title}项目详情 ${index + 2}`} loading="lazy" />
            </figure>
          ))}
        </section>

        <section id="detail-related" className="detail-related" aria-label="其他项目">
          <h2>其他项目</h2>
          <div className="project-grid related-project-grid">
            {relatedProjects.map((project) => (
              <a className="project-card related-project-card" href={project.href} key={project.title} style={{ "--project-accent": project.accent }}>
                <div className="project-copy">
                  <span className="project-label">{project.label}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="project-image">
                  <img src={project.image} alt={project.title} loading="lazy" />
                </div>
                <div className="project-foot">
                  <span>查看项目</span>
                  <ArrowUpRight size={17} />
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FloatingNav({ visible }) {
  return (
    <nav className={`dock ${visible ? "is-visible" : ""}`} aria-label="页面导航" aria-hidden={!visible}>
      {navItems.map(({ label, href, icon: Icon }) => (
        <a
          className="dock-item"
          href={href}
          key={label}
          aria-label={label}
          aria-hidden={!visible}
          data-label={label}
          tabIndex={visible ? 0 : -1}
        >
          <Icon size={17} weight="regular" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

function DesignerBadge() {
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const motionRef = useRef(null);
  const baseMotion = {
    x: 0,
    y: 0,
    rotateX: -6,
    rotateY: -9,
    rotateZ: -3,
    shineX: 62,
    shineY: 30,
  };
  const [motion, setMotion] = useState({
    ...baseMotion,
    isDragging: false,
    isSettling: false,
    isFlipped: false,
  });

  const setBadgeMotion = (next) => {
    motionRef.current = next;
    setMotion(next);
  };

  if (!motionRef.current) {
    motionRef.current = motion;
  }

  const startSpringBack = ({ start = motionRef.current, velocity = velocityRef.current, showBack = false, drop = false } = {}) => {
    cancelAnimationFrame(frameRef.current);

    let x = start.x;
    let y = start.y;
    let vx = velocity.x * 18;
    let vy = velocity.y * 18 + (drop ? 34 : 0);
    let rotateZ = start.rotateZ;
    let angularVelocity = drop ? 1.2 : Math.max(-1.4, Math.min(1.4, vx * 0.018));
    let previous = performance.now();

    const settle = (timestamp) => {
      const delta = Math.min(timestamp - previous, 34);
      const time = delta / 16.67;
      previous = timestamp;

      vx += -x * 0.028 * time;
      vy += -y * 0.032 * time;
      vx *= Math.pow(0.84, time);
      vy *= Math.pow(0.82, time);
      x += vx * time;
      y += vy * time;

      const targetRotateZ = baseMotion.rotateZ + x * 0.026 - y * 0.006;
      angularVelocity += (targetRotateZ - rotateZ) * 0.06 * time;
      angularVelocity *= Math.pow(0.82, time);
      rotateZ += angularVelocity * time;

      setBadgeMotion({
        ...motionRef.current,
        x,
        y,
        rotateX: baseMotion.rotateX - y * 0.015 + vy * 0.025,
        rotateY: baseMotion.rotateY + x * 0.022 - vx * 0.018,
        rotateZ,
        shineX: x > 0 ? 70 : 36,
        shineY: y > 0 ? 64 : 24,
        isDragging: false,
        isSettling: true,
      });

      const stillMoving =
        Math.abs(x) > 0.55 ||
        Math.abs(y) > 0.55 ||
        Math.abs(vx) > 0.035 ||
        Math.abs(vy) > 0.035 ||
        Math.abs(rotateZ - baseMotion.rotateZ) > 0.06 ||
        Math.abs(angularVelocity) > 0.025;

      if (!stillMoving) {
        setBadgeMotion({
          ...motionRef.current,
          ...baseMotion,
          isFlipped: showBack ? true : motionRef.current.isFlipped,
          isDragging: false,
          isSettling: false,
        });
        return;
      }

      frameRef.current = requestAnimationFrame(settle);
    };

    frameRef.current = requestAnimationFrame(settle);
  };

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const getPointerMotion = (event, x = motionRef.current.x, y = motionRef.current.y, isDragging = false) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const pointerY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const baseRotateY = (pointerX - 0.5) * 18;
    const baseRotateX = (0.5 - pointerY) * 16;

    return {
      rotateX: baseRotateX - y * 0.018,
      rotateY: baseRotateY + x * 0.028,
      rotateZ: isDragging ? Math.max(-15, Math.min(15, -3 + x * 0.038)) : -3 + (pointerX - 0.5) * 4,
      shineX: pointerX * 100,
      shineY: pointerY * 100,
    };
  };

  const updateFromPointer = (event, isDragging = false) => {
    const current = motionRef.current;
    setBadgeMotion({
      ...current,
      ...getPointerMotion(event, current.x, current.y, isDragging),
    });
  };

  const handlePointerDown = (event) => {
    cancelAnimationFrame(frameRef.current);
    const current = motionRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
      lastX: current.x,
      lastY: current.y,
      lastTime: performance.now(),
      moved: false,
    };
    velocityRef.current = { x: 0, y: 0 };
    setBadgeMotion({
      ...current,
      ...getPointerMotion(event, current.x, current.y, true),
      isDragging: true,
      isSettling: false,
    });
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current) {
      updateFromPointer(event);
      return;
    }

    event.preventDefault();
    const drag = dragRef.current;
    const now = performance.now();
    const maxX = Math.min(window.innerWidth * 0.42, 360);
    const maxY = Math.min(window.innerHeight * 0.34, 280);
    const nextX = Math.max(-maxX, Math.min(maxX, drag.originX + event.clientX - drag.startX));
    const nextY = Math.max(-maxY, Math.min(maxY, drag.originY + event.clientY - drag.startY));
    const elapsed = Math.max(now - drag.lastTime, 16);

    velocityRef.current = {
      x: (nextX - drag.lastX) / elapsed,
      y: (nextY - drag.lastY) / elapsed,
    };

    drag.lastX = nextX;
    drag.lastY = nextY;
    drag.lastTime = now;
    drag.moved = drag.moved || Math.abs(nextX - drag.originX) + Math.abs(nextY - drag.originY) > 8;

    setBadgeMotion({
      ...motionRef.current,
      x: nextX,
      y: nextY,
      ...getPointerMotion(event, nextX, nextY, true),
      isDragging: true,
      isSettling: false,
    });
  };

  const releaseBadge = () => {
    const drag = dragRef.current;
    const current = motionRef.current;
    dragRef.current = null;

    if (!drag?.moved) {
      setBadgeMotion({
        ...current,
        isFlipped: !current.isFlipped,
        isDragging: false,
        isSettling: false,
      });
      return;
    }

    startSpringBack({
      start: current,
      velocity: velocityRef.current,
      showBack: true,
    });
  };

  const resetTilt = () => {
    if (dragRef.current) return;
    setBadgeMotion({
      ...motionRef.current,
      ...baseMotion,
      isDragging: false,
      isSettling: false,
    });
  };

  const handlePointerLeave = () => {
    resetTilt();
  };

  return (
    <div className="badge-stage" aria-label="程诺电子工卡">
      <div
        className={[
          "designer-badge",
          motion.isDragging ? "is-dragging" : "",
          motion.isSettling ? "is-settling" : "",
          motion.isFlipped ? "is-flipped" : "",
        ].filter(Boolean).join(" ")}
        role="img"
        aria-label="程诺的交互式电子工卡，点击可翻面，拖拽可移动"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={releaseBadge}
        onPointerCancel={releaseBadge}
        onPointerLeave={handlePointerLeave}
        style={{
          "--badge-x": `${motion.x}px`,
          "--badge-y": `${motion.y}px`,
          "--badge-rx": `${motion.rotateX}deg`,
          "--badge-ry": `${motion.rotateY}deg`,
          "--badge-rz": `${motion.rotateZ}deg`,
          "--shine-x": `${motion.shineX}%`,
          "--shine-y": `${motion.shineY}%`,
        }}
      >
        <div className="badge-object">
          <div className="badge-hardware" aria-hidden="true">
            <div className="badge-lanyard">
              <span>UX DESIGNER</span>
              <span>PRODUCT DESIGN</span>
              <span>UX DESIGNER</span>
            </div>
            <div className="badge-clip">
              <i />
              <span />
              <span />
            </div>
          </div>
          <div className="badge-surface badge-face badge-front">
            <span className="badge-hole" aria-hidden="true" />
            <div className="badge-grid" aria-hidden="true" />
            <div className="badge-photo">
              <img src="/assets/id-card/chengnuo-card-photo-v2.png" alt="" draggable="false" />
            </div>
            <div className="badge-body">
              <div>
                <h2>程诺</h2>
                <p>产品体验设计师</p>
              </div>
            </div>
          </div>
          <div className="badge-surface badge-face badge-back-surface">
            <span className="badge-hole" aria-hidden="true" />
            <div className="badge-back-grid" aria-hidden="true" />
            <div className="badge-back-top">
              <span>CONTACT CARD</span>
              <span>WECHAT</span>
            </div>
            <div className="badge-back-qr">
              <img src="/assets/id-card/wechat-qr.jpg" alt="微信二维码" draggable="false" />
            </div>
            <div className="badge-back-copy">
              <div>
                <p>
                  扫码联系
                  <span className="badge-arrow" aria-hidden="true">↗</span>
                </p>
                <span>Chengnuo / Experience Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const heroRef = useRef(null);
  const [burst, createBurst] = useBurst(".hero");
  const [status, setStatus] = useState(() => getBeijingStatus());

  useEffect(() => {
    const updateStatus = () => setStatus(getBeijingStatus());
    const timer = window.setInterval(updateStatus, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero section" ref={heroRef}>
      <div className="hero-rays" aria-hidden="true">
        <SideRays
          speed={2.5}
          rayColor1="#A855F7"
          rayColor2="#0876ee"
          intensity={3.4}
          spread={2.8}
          origin="top-left"
          tilt={0}
          saturation={1.85}
          blend={0.9}
          falloff={1.35}
          opacity={1.0}
        />
      </div>
      <div className="profile-layout">
        <div className="hero-top">
          <div className="hero-copy">
            <h1 className="identity-heading">
              <span className="identity-line identity-line-hi">
                <PlayfulWord onClick={createBurst}>HI</PlayfulWord>
                <button type="button" className="hero-wave-token" onClick={createBurst} aria-label="打招呼">
                  👋
                </button>
              </span>
              <span className="identity-line identity-line-main">
                <PlayfulWord onClick={createBurst}>THIS</PlayfulWord>
                <PlayfulWord onClick={createBurst}>IS</PlayfulWord>
                <PlayfulWord className="cn-name" onClick={createBurst}>CHENGNUO</PlayfulWord>
              </span>
            </h1>
            <p className="keyword-line">
              我的关键词
              <span className="word-rotator" aria-label={rotatingWords.join("、")}>
                {rotatingWords.map((word) => (
                  <b key={word}>{word}</b>
                ))}
              </span>
            </p>
            <div className={`hero-status-line is-${status.state}`} aria-label="当前状态">
              <span className="hero-status-dot" aria-hidden="true" />
              {status.items.map((item, index) => (
                <React.Fragment key={item}>
                  {index > 0 ? <span className="hero-status-separator" aria-hidden="true">·</span> : null}
                  <span className="hero-status-text">{item}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <DesignerBadge />
        </div>
        <div className="basic-grid">
          <div className="basic-stack">
            <article className="basic-card education">
              <div className="card-heading">
                <GraduationCap size={14} />
                <h3>学历</h3>
              </div>
              <ol className="credential-list">
                {educationItems.map(([label, school, detail]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <strong>{school}</strong>
                    <p>{detail}</p>
                  </li>
                ))}
              </ol>
            </article>
            <article className="basic-card contact-summary">
              <div className="card-heading">
                <EnvelopeSimple size={14} />
                <h3>联系方式</h3>
              </div>
              <div className="contact-lines">
                {contactInfo.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    {label === "邮箱" ? <a href={`mailto:${value}`}>{value}</a> : <strong>{value}</strong>}
                  </div>
                ))}
              </div>
            </article>
          </div>
          <article className="basic-card timeline">
            <div className="card-heading">
              <Briefcase size={14} />
              <h3>实习经历</h3>
            </div>
            <ol className="credential-list">
              {experiences.map(([company, time, detail]) => (
                <li key={company}>
                  <strong>{company}</strong>
                  <span>{time}</span>
                  <p>{detail}</p>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </div>
      <BurstLayer burst={burst} />
    </section>
  );
}

function MoreAbout() {
  const [burst, createBurst] = useBurst(".about-lab");
  const [activeDoc, setActiveDoc] = useState(null);

  useEffect(() => {
    if (!activeDoc) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveDoc(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDoc]);

  return (
    <section id="more" className="section more">
      <div id="about-notes" className="about-lab">
        <h2 className="about-display-title">MORE ABOUT ME</h2>
        <div className="about-scene" aria-label="程诺的更多信息">
          <article className="about-poster about-personality">
            <header>PERSONALITY <span>😯</span></header>
            <button className="about-token token-mom" type="button" onClick={createBurst}>💗 微E很J</button>
            <button className="about-token token-smile" type="button" onClick={createBurst}>😊 保持微笑</button>
            <button className="about-block token-aquarius" type="button" onClick={createBurst}>水瓶座</button>
            <button className="about-block token-esfj" type="button" onClick={createBurst}>ESFJ</button>
            <button className="about-block token-happy" type="button" onClick={createBurst}>乐天派达人</button>
            <button className="about-token token-thinking" type="button" onClick={createBurst}>🤔 奇思乱想</button>
          </article>

          <article className="about-poster about-hobbies">
            <header>HOBBIES <span>🥳</span></header>
            <button className="hobby-photo hobby-concert" type="button" onClick={createBurst}>
              <img src="/assets/about/concert.png" alt="线下演出" />
            </button>
            <button className="hobby-photo hobby-fitness" type="button" onClick={createBurst}>
              <img src="/assets/about/fitness.png" alt="健身记录" />
            </button>
            <button className="hobby-photo hobby-food" type="button" onClick={createBurst}>
              <img src="/assets/about/food.png" alt="日料" />
            </button>
            <button className="about-token hobby-tag concert-tag" type="button" onClick={createBurst}>🏋️ 健身坚持中</button>
            <button className="about-token hobby-tag fitness-tag" type="button" onClick={createBurst}>🍣 日料狂热者</button>
            <button className="about-token hobby-tag food-tag" type="button" onClick={createBurst}>🎤 线下演出嗨</button>
          </article>

          <article className="about-poster about-thinking">
            <header>THOUGHTS <span>🤔</span></header>
            <div className="doc-stack">
              {thoughtDocs.map((doc) => (
                <button className="doc-tile" type="button" key={doc.title} onClick={() => setActiveDoc(doc)}>
                  <img src={doc.thumb} alt="" />
                  <span>{doc.title}</span>
                </button>
              ))}
            </div>
          </article>
        </div>
        <BurstLayer burst={burst} />
      </div>
      {activeDoc ? (
        <div className="doc-modal" role="dialog" aria-modal="true" aria-label={activeDoc.title}>
          <button type="button" className="doc-modal-backdrop" aria-label="关闭预览" onClick={() => setActiveDoc(null)} />
          <div className="doc-modal-card">
            <div className="doc-modal-head">
              <div>
                <strong>{activeDoc.title}</strong>
              </div>
              <a href={activeDoc.file} download>下载源文件</a>
              <button type="button" onClick={() => setActiveDoc(null)} aria-label="关闭">×</button>
            </div>
            <div className="doc-preview">
              <div className="doc-preview-pages">
                {(activeDoc.pages || [activeDoc.thumb]).map((page, index) => (
                  <img src={page} alt={`${activeDoc.title} 第 ${index + 1} 页`} key={page} loading={index > 1 ? "lazy" : "eager"} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="section-title">
        <KineticTitle cn="" en="RECENT WORKS" accentIndex={8} />
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <a className="project-card" href={project.href} key={project.title} style={{ "--project-accent": project.accent }}>
            <div className="project-copy">
              <span className="project-label">{project.label}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-foot">
              <span>查看项目</span>
              <ArrowUpRight size={17} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [burst, createBurst] = useBurst(".footer");
  const [showQr, setShowQr] = useState(false);

  return (
    <footer id="contact" className="section footer">
      <div className="footer-stage">
        <button type="button" className="footer-slogan" onClick={createBurst}>
          <span>Build Something</span>
          <span>F<i>u</i>n Together!</span>
        </button>
        <button type="button" className="footer-sticker" onClick={() => setShowQr(true)}>
          Contact me
          <ArrowUpRight size={18} />
        </button>
        {showQr && (
          <div className="qr-modal" role="dialog" aria-modal="true" aria-label="微信二维码">
            <button type="button" className="qr-modal-backdrop" aria-label="关闭二维码" onClick={() => setShowQr(false)} />
            <div className="qr-modal-card">
              <button type="button" className="qr-close" onClick={() => setShowQr(false)} aria-label="关闭">
                ×
              </button>
              <span>WECHAT</span>
              <strong>扫码联系</strong>
              <img src="/assets/id-card/wechat-qr.jpg" alt="微信二维码" />
              <p>Chengnuo / Experience Design</p>
            </div>
          </div>
        )}
        <BurstLayer burst={burst} />
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(<App />);

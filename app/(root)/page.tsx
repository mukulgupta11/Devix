"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="font-body">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="/logo.svg"
                  alt="Devix Logo"
                  width={32}
                  height={32}
                  className="object-contain relative z-10 hover:rotate-[360deg] transition-transform duration-1000 ease-in-out"
                />
              </div>
              <span className="text-xl font-bold text-on-surface tracking-tighter font-headline group-hover:text-primary-container transition-colors">
                Devix
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/auth/sign-in"
              className="px-5 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/20 rounded-lg hover:bg-surface-container-high"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container/30 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-container/20 blur-[100px] rounded-full"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-[-0.04em] leading-[0.9] text-on-surface">
              Devix: The <span className="text-primary-container">Kinetic</span> IDE
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-body font-medium">
              Empower your engineering teams with a cloud-native IDE designed for speed, scale, and seamless collaboration. Experience zero-latency execution and AI-native intelligence in one unified platform.
            </p>
            <div className="pt-4">
              <Link href="/auth/sign-up">
                <button className="px-8 py-4 bg-primary-container text-on-primary font-bold rounded-full text-lg shadow-[0_0_20px_rgba(52,107,241,0.3)] hover:shadow-[0_0_30px_rgba(52,107,241,0.5)] transition-all hover:scale-105 active:scale-95">
                  Get Started for Free
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 mt-20 w-full max-w-6xl mx-auto group"
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-primary-container/20 to-transparent blur-2xl rounded-[2rem] opacity-50"></div>
            <div className="relative bg-surface-container-low rounded-t-xl border-x border-t border-outline-variant/20 shadow-2xl overflow-hidden aspect-[16/9]">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                </div>
                <div className="ml-4 text-xs font-mono text-on-surface-variant/40">
                  ~/devix-project/app/page.tsx
                </div>
              </div>
              {/* Editor Simulation */}
              <div className="grid grid-cols-[240px_1fr_300px] h-full">
                <div className="bg-surface-container-lowest/50 border-r border-outline-variant/10 p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-surface-container-highest rounded-sm opacity-20"></div>
                  <div className="h-4 w-1/2 bg-surface-container-highest rounded-sm opacity-20 ml-4"></div>
                  <div className="h-4 w-2/3 bg-surface-container-highest rounded-sm opacity-40 ml-4"></div>
                  <div className="h-4 w-1/2 bg-primary-container/20 rounded-sm ml-4"></div>
                </div>
                <div className="p-8 font-mono text-sm space-y-4">
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">1</span>
                    <span className="text-primary-container font-bold">import</span>{" "}
                    <span className="text-on-surface">React</span>{" "}
                    <span className="text-primary-container font-bold">from</span>{" "}
                    <span className="text-primary">'react'</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">2</span>
                    <span className="text-primary-container font-bold">export default function</span>{" "}
                    <span className="text-primary-fixed-dim font-bold">DevixEditor</span>() {"{"}
                  </div>
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">3</span>
                    &nbsp;&nbsp;<span className="text-primary-container font-bold">return</span> (
                  </div>
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">4</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;
                    <span className="text-primary-container font-bold">div</span> className=
                    <span className="text-primary">"kinetic-ui"</span>&gt;
                  </div>
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">5</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
                    <span className="text-primary-container font-bold">h1</span>&gt;The Future of Coding&lt;/
                    <span className="text-primary-container font-bold">h1</span>&gt;
                  </div>
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">6</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/
                    <span className="text-primary-container font-bold">div</span>&gt;
                  </div>
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">7</span>
                    &nbsp;&nbsp;)
                  </div>
                  <div className="flex gap-4">
                    <span className="text-on-surface-variant/50">8</span>
                    {"}"}
                  </div>
                </div>
                <div className="bg-surface-container-lowest/50 border-l border-outline-variant/10 p-4 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-sm">
                      chat_bubble
                    </span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant">
                      Devix AI Assistant
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-surface-container-high rounded-lg text-[0.7rem] text-on-surface-variant leading-relaxed">
                      "I can see you're building a kinetic UI. Would you like me to
                      optimize the layout for antigravity responsiveness?"
                    </div>
                    <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg text-[0.7rem] text-primary-fixed-dim leading-relaxed font-medium">
                      "Sure, let's use the Space Grotesk font with tight tracking."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Product Showcase Section */}
        <section className="py-24 space-y-32">
          {/* Feature 1: AI-Native Engineering */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6 order-2 lg:order-1">
              <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/10">
                AI-Native Development
              </span>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
                AI that speaks <br/>
                <span className="text-primary-container">Architectural Truth.</span>
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed font-body">
                Beyond simple autocomplete, Devix AI understands your entire codebase structure. 
                Get context-aware refactoring, deep logic explanation, and instant unit test generation 
                that aligns with your specific architectural patterns.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-on-surface">90%</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest">Faster Refactoring</span>
                </div>
                <div className="w-px h-10 bg-outline-variant/20"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-on-surface">Zero</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest">Manual Boilerplate</span>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 group">
              <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <Image
                src="/ai-feature.png"
                alt="AI-Native Editor"
                width={800}
                height={500}
                className="rounded-3xl border border-outline-variant/10 shadow-2xl relative z-10"
              />
            </div>
          </motion.div>

          {/* Feature 2: WebContainer Runtime */}
          <div className="bg-surface-container-low py-32 border-y border-outline-variant/10">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary-container/10 blur-[80px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <Image
                  src="/webcontainer-feature.png"
                  alt="WebContainer Runtime"
                  width={800}
                  height={500}
                  className="rounded-3xl border border-outline-variant/10 shadow-2xl relative z-10"
                />
              </div>
              <div className="space-y-6">
                <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/10">
                  Infrastructure-as-Context
                </span>
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
                  Bare-Metal Performance, <br/>
                  <span className="text-primary-container">in your Browser.</span>
                </h2>
                <p className="text-lg text-on-surface-variant leading-relaxed font-body">
                  Leverage the full power of Node.js directly in your browser. 
                  Devix uses WebContainer technology to provide a local-like environment 
                  with persistent filesystem access, zero latency, and seamless dependency isolation.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {["NODE.JS", "TYPESCRIPT", "VITE", "DOCKER-LITE"].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-surface-container-high rounded text-[0.6rem] font-bold text-on-surface-variant">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature 3: Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6">
              <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/10">
                Command & Control
              </span>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
                Your Entire Infrastructure <br/>
                <span className="text-primary-container">Visualized.</span>
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed font-body">
                Manage your projects with enterprise-grade clarity. 
                Our unified dashboard provides deep visibility into your team's 
                code health, deployment statistics, and engineering velocity 
                from one beautifully crafted command center.
              </p>
              <button className="flex items-center gap-2 text-primary font-bold group">
                Explore Analytics 
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-fixed-dim/10 blur-[100px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Image
                src="/dashboard-feature.png"
                alt="Developer Dashboard"
                width={800}
                height={500}
                className="rounded-3xl border border-outline-variant/10 shadow-2xl relative z-10"
              />
            </div>
          </motion.div>
        </section>

        {/* Template Showcase */}
        <section className="py-24 bg-surface-container-lowest/50">
          <div className="px-8 max-w-[1440px] mx-auto space-y-12">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <span className="text-[0.6875rem] uppercase tracking-[0.2em] font-bold text-primary-container">
                  Pre-Engineered
                </span>
                <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">
                  Ready-to-Use Templates
                </h2>
              </div>
            </div>
            
            <div className="overflow-hidden relative w-full pt-4">
              <div className="flex w-max gap-6 animate-marquee">
                {[
                  {
                    name: "Next.js",
                    title: "App Router Pro",
                    desc: "Next.js 15, Tailwind v4, & Framer Motion",
                    icon: "/nextjs-icon.svg",
                    tag1: "TYPESCRIPT",
                    tag2: "SSR"
                  },
                  {
                    name: "Hono",
                    title: "Ultra-Fast API",
                    desc: "Hono, Cloudflare Workers, & Drizzle ORM",
                    icon: "/hono.svg",
                    tag1: "EDGE",
                    tag2: "DB"
                  },
                  {
                    name: "React 19",
                    title: "Modern Dashboard",
                    desc: "React 19, TanStack Query, & Shadcn UI",
                    icon: "/react.svg",
                    tag1: "UI",
                    tag2: "STATE"
                  },
                  {
                    name: "Angular",
                    title: "Enterprise Shell",
                    desc: "Angular 18, Signals, & RxJS Core",
                    icon: "/angular-2.svg",
                    tag1: "SIGNALS",
                    tag2: "SCALABLE"
                  },
                  {
                    name: "Vue.js",
                    title: "Performant UI",
                    desc: "Vue 3, Composition API & Pinia",
                    icon: "/vuejs-icon.svg",
                    tag1: "REACTIVE",
                    tag2: "SPEED"
                  },
                  {
                    name: "Express.js",
                    title: "Minimal Backend",
                    desc: "Node.js, Express & Mongoose",
                    icon: "/expressjs-icon.svg",
                    tag1: "API",
                    tag2: "NODEJS"
                  }
                ].map((item, index) => (
                  <div key={index} className="w-[300px] shrink-0 group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 hover:bg-surface-container-high transition-all cursor-pointer">
                    <div className="h-40 rounded-xl bg-surface-container-highest mb-6 overflow-hidden relative flex items-center justify-center p-8">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={90}
                        height={90}
                        className="object-contain group-hover:scale-110 transition-transform duration-500 opacity-80"
                      />
                    </div>
                    <h4 className="text-xl font-bold font-headline mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant/60 mb-4 whitespace-normal">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-surface-container-highest rounded text-[0.6rem] font-bold">
                        {item.tag1}
                      </span>
                      <span className="px-2 py-1 bg-surface-container-highest rounded text-[0.6rem] font-bold">
                        {item.tag2}
                      </span>
                    </div>
                  </div>
                )).concat([
                  {
                    name: "Next.js",
                    title: "App Router Pro",
                    desc: "Next.js 15, Tailwind v4, & Framer Motion",
                    icon: "/nextjs-icon.svg",
                    tag1: "TYPESCRIPT",
                    tag2: "SSR"
                  },
                  {
                    name: "Hono",
                    title: "Ultra-Fast API",
                    desc: "Hono, Cloudflare Workers, & Drizzle ORM",
                    icon: "/hono.svg",
                    tag1: "EDGE",
                    tag2: "DB"
                  },
                  {
                    name: "React 19",
                    title: "Modern Dashboard",
                    desc: "React 19, TanStack Query, & Shadcn UI",
                    icon: "/react.svg",
                    tag1: "UI",
                    tag2: "STATE"
                  },
                  {
                    name: "Angular",
                    title: "Enterprise Shell",
                    desc: "Angular 18, Signals, & RxJS Core",
                    icon: "/angular-2.svg",
                    tag1: "SIGNALS",
                    tag2: "SCALABLE"
                  },
                  {
                    name: "Vue.js",
                    title: "Performant UI",
                    desc: "Vue 3, Composition API & Pinia",
                    icon: "/vuejs-icon.svg",
                    tag1: "REACTIVE",
                    tag2: "SPEED"
                  },
                  {
                    name: "Express.js",
                    title: "Minimal Backend",
                    desc: "Node.js, Express & Mongoose",
                    icon: "/expressjs-icon.svg",
                    tag1: "API",
                    tag2: "NODEJS"
                  }
                ].map((item, index) => (
                  <div key={`dup-${index}`} className="w-[300px] shrink-0 group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 hover:bg-surface-container-high transition-all cursor-pointer">
                    <div className="h-40 rounded-xl bg-surface-container-highest mb-6 overflow-hidden relative flex items-center justify-center p-8">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={90}
                        height={90}
                        className="object-contain group-hover:scale-110 transition-transform duration-500 opacity-80"
                      />
                    </div>
                    <h4 className="text-xl font-bold font-headline mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant/60 mb-4 whitespace-normal">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-surface-container-highest rounded text-[0.6rem] font-bold">
                        {item.tag1}
                      </span>
                      <span className="px-2 py-1 bg-surface-container-highest rounded text-[0.6rem] font-bold">
                        {item.tag2}
                      </span>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Highlight */}
        <section className="py-32 px-8 overflow-hidden relative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"
          >
            <div className="space-y-8">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-1.5 bg-primary-container/10 text-primary-fixed-dim rounded-full text-xs font-bold font-headline tracking-widest border border-primary-container/20 inline-block"
              >
                INTELLIGENT COMPANION
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-headline font-bold text-on-surface leading-[1.1] tracking-tight"
              >
                AI that speaks <br />
                <span className="text-primary-container">Architectural Truth.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-on-surface-variant leading-relaxed"
              >
                Devix AI isn't just an autocomplete tool. It understands your
                entire codebase context, suggests high-level refactors, and
                explains complex logic as you write.
              </motion.p>
              <motion.ul 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                className="space-y-6"
              >
                {[
                  { title: "Explain Logic", desc: "Break down complex regex or legacy functions in human terms." },
                  { title: "Refactor Instantaneously", desc: "Convert class components to hooks or optimize for performance automatically." }
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-lg">
                        check
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold font-headline text-on-surface">
                        {item.title}
                      </h4>
                      <p className="text-sm text-on-surface-variant/70">
                        {item.desc}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary-container/5 blur-[120px] rounded-full"></div>
              <div className="relative bg-surface-container-high rounded-3xl p-6 shadow-2xl border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-white"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        bolt
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-headline">Devix AI</h4>
                      <span className="text-[0.6rem] text-primary">
                        System Online
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40">
                    more_vert
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none border border-outline-variant/5">
                      <p className="text-xs font-mono text-on-surface-variant/80">
                        "How should I structure the state for this kinetic navigation
                        component?"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="flex-1 bg-primary-container/20 p-4 rounded-2xl rounded-tr-none border border-primary-container/30">
                      <p className="text-xs text-on-surface leading-relaxed">
                        "For kinetic movement, I recommend using{" "}
                        <span className="text-primary-fixed-dim font-bold">
                          framer-motion
                        </span>{" "}
                        with the{" "}
                        <span className="text-primary-fixed-dim font-bold">
                          useReducedMotion
                        </span>{" "}
                        hook to maintain accessibility while achieving that
                        weightless feel."
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/10 flex items-center gap-3">
                    <div className="flex-1 h-10 bg-surface-container-highest rounded-full px-4 flex items-center">
                      <span className="text-xs text-on-surface-variant/40">
                        Ask Devix anything...
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                      <span className="material-symbols-outlined">send</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-primary-container to-blue-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tight">
                Ready to build?
              </h2>
              <p className="text-xl text-white/80 max-w-lg mx-auto">
                Join 50k+ developers building the future of the web right from
                their browser.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <button className="w-full bg-white text-primary-container px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 group/btn">
                    Sign up with Google
                  </button>
                </Link>
                <Link href="/auth/sign-in" className="w-full sm:w-auto">
                  <button className="w-full bg-[#1b1b1b] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3">
                    Sign up with GitHub
                  </button>
                </Link>
              </div>
              <p className="text-xs text-white/40 pt-4 font-mono">
                NO CREDIT CARD REQUIRED • INSTANT SETUP
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface w-full py-12 px-8 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-[1440px] mx-auto">
          <div className="space-y-4">
            <div className="text-lg font-black text-on-surface font-headline">
              Devix
            </div>
            <p className="text-on-surface-variant font-['Inter'] text-sm tracking-wide leading-relaxed">
              © 2026 Devix Ai.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 justify-start md:justify-end">
            <Link
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors font-['Inter'] text-sm tracking-wide opacity-80 hover:opacity-100"
            >
              Changelog
            </Link>
            <Link
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors font-['Inter'] text-sm tracking-wide opacity-80 hover:opacity-100"
            >
              Security
            </Link>
            <Link
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors font-['Inter'] text-sm tracking-wide opacity-80 hover:opacity-100"
            >
              Terminal Config
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

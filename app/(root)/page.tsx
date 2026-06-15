"use client";

import {
  ArrowRight,
  Bot,
  Braces,
  Check,
  ChevronRight,
  Code2,
  Command,
  Cpu,
  Github,
  Layers3,
  Play,
  Sparkles,
  Terminal,
  WandSparkles,
  Zap,
} from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    icon: Bot,
    eyebrow: "Context-aware AI",
    title: "An agent that understands the whole system.",
    body: "Devix reads your files, follows dependencies, and turns intent into production-ready changes without losing the thread.",
    accent: "bg-[#dfa88f]",
  },
  {
    icon: Cpu,
    eyebrow: "Browser-native runtime",
    title: "Real Node.js. No remote machine between you and the idea.",
    body: "Install packages, run servers, inspect logs, and ship from an isolated WebContainer that wakes in seconds.",
    accent: "bg-[#9fc9a2]",
  },
  {
    icon: Layers3,
    eyebrow: "One connected workspace",
    title: "Editor, preview, terminal, and AI in one continuous flow.",
    body: "Every surface shares context, so iteration feels direct instead of fragmented across tools and tabs.",
    accent: "bg-[#9fbbe0]",
  },
];

const stack = ["Next.js", "React", "Vue", "Angular", "Hono", "Express"];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-[9px] bg-[#24231e] text-white">
        <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,#f4511e_46%,#f4511e_62%,transparent_63%)]" />
        <Code2 className="relative size-4" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="font-headline text-[17px] font-semibold tracking-[-0.03em]">
          devix
        </span>
      )}
    </span>
  );
}

function ProductStage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.35, ease }}
      className="relative mx-auto mt-16 w-full max-w-[1180px]"
    >
      <div className="absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_50%_0%,rgba(244,81,30,0.18),transparent_62%)] blur-2xl" />
      <div className="overflow-hidden rounded-[18px] border border-[#33322e] bg-[#11110f] text-[#d9d5cb] shadow-[0_40px_100px_rgba(36,35,30,0.18)]">
        <div className="flex h-11 items-center justify-between border-b border-white/8 px-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff6b51]" />
            <span className="size-2.5 rounded-full bg-[#e5b74d]" />
            <span className="size-2.5 rounded-full bg-[#63a56f]" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/40">
            <span className="size-1.5 rounded-full bg-[#79bf83]" />
            devix / storefront
          </div>
          <Command className="size-3.5 text-white/30" />
        </div>

        <div className="grid min-h-[520px] grid-cols-1 md:grid-cols-[190px_1fr] lg:grid-cols-[190px_1fr_310px]">
          <aside className="hidden border-r border-white/8 bg-[#0c0c0a] p-3 md:block">
            <div className="mb-5 flex items-center justify-between px-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                Explorer
              </span>
              <span className="text-white/25">•••</span>
            </div>
            {[
              ["app", "folder"],
              ["components", "folder"],
              ["page.tsx", "file"],
              ["globals.css", "file"],
              ["package.json", "file"],
            ].map(([label, type], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + index * 0.06 }}
                className={`flex h-8 items-center gap-2 rounded-md px-2 font-mono text-[11px] ${
                  label === "page.tsx"
                    ? "bg-white/8 text-white"
                    : "text-white/45"
                }`}
              >
                {type === "folder" ? (
                  <ChevronRight className="size-3" />
                ) : (
                  <span className="w-3" />
                )}
                {type === "folder" ? (
                  <Layers3 className="size-3.5 text-[#d3a54a]" />
                ) : (
                  <Braces className="size-3.5 text-[#7aa4d8]" />
                )}
                {label}
              </motion.div>
            ))}
          </aside>

          <div className="min-w-0 bg-[#11110f]">
            <div className="flex h-10 items-end border-b border-white/8 bg-[#0d0d0b] px-2">
              <div className="flex h-9 items-center gap-2 border-x border-t border-white/8 bg-[#11110f] px-4 font-mono text-[11px] text-white/70">
                <Braces className="size-3.5 text-[#75a8dc]" />
                page.tsx
                <span className="size-1.5 rounded-full bg-[#f4511e]" />
              </div>
            </div>
            <div className="relative overflow-hidden p-5 font-mono text-[11px] leading-6 sm:p-8 sm:text-[12px]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#f4511e]/5 to-transparent" />
              {[
                ["1", "import", " { motion } ", "from", ' "framer-motion"'],
                ["2", "import", " { Sparkles } ", "from", ' "lucide-react"'],
                ["3", "", "", "", ""],
                ["4", "export default", " function Launch() {", "", ""],
                ["5", "  return", " (", "", ""],
                ["6", "    <", "motion.main", "", ""],
                ["7", "      initial", "={{ opacity: 0 }}", "", ""],
                ["8", "      animate", "={{ opacity: 1 }}", "", ""],
                ["9", "      transition", "={{ duration: 0.6 }}", "", ""],
                ["10", "    >", "", "", ""],
                ["11", "      <", "Sparkles", " className", '="brand-mark" />'],
                ["12", "      <", "h1", ">", "Ship while the idea is alive.</h1>"],
                ["13", "    </", "motion.main", ">", ""],
                ["14", "  )", "", "", ""],
                ["15", "}", "", "", ""],
              ].map(([line, keyword, main, prop, value], index) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.035 }}
                  className="grid grid-cols-[24px_1fr]"
                >
                  <span className="select-none text-white/18">{line}</span>
                  <span className="whitespace-pre">
                    <span className="text-[#c4a4dc]">{keyword}</span>
                    <span className="text-[#d8d3c9]">{main}</span>
                    <span className="text-[#7eb3dd]">{prop}</span>
                    <span className="text-[#a9c58d]">{value}</span>
                  </span>
                </motion.div>
              ))}
              <motion.div
                animate={{ opacity: [0, 1, 1, 0], x: [0, 0, 120, 120] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                className="absolute left-[112px] top-[177px] h-5 w-px bg-[#f4511e]"
              />
            </div>
            <div className="grid grid-cols-2 border-t border-white/8 bg-[#0c0c0a] font-mono text-[10px] text-white/35">
              <div className="flex h-8 items-center gap-3 border-r border-white/8 px-4">
                <Terminal className="size-3" />
                TERMINAL
              </div>
              <div className="flex h-8 items-center gap-3 px-4">
                <Check className="size-3 text-[#79bf83]" />
                localhost:3000
              </div>
            </div>
          </div>

          <aside className="hidden border-l border-white/8 bg-[#151512] lg:block">
            <div className="flex h-10 items-center justify-between border-b border-white/8 px-4">
              <div className="flex items-center gap-2 text-xs font-medium text-white/75">
                <WandSparkles className="size-3.5 text-[#ff7d54]" />
                Agent
              </div>
              <span className="font-mono text-[9px] text-white/25">⌘ I</span>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-lg border border-white/8 bg-white/[0.035] p-3 text-[12px] leading-relaxed text-white/65">
                Add a kinetic entrance, then make the layout collapse cleanly on
                mobile.
              </div>
              <div className="space-y-2 border-l border-white/10 pl-3 font-mono text-[10px]">
                {[
                  ["Thinking", "bg-[#dfa88f] text-[#24231e]"],
                  ["Reading page.tsx", "bg-[#9fbbe0] text-[#24231e]"],
                  ["Editing layout", "bg-[#c0a8dd] text-[#24231e]"],
                  ["Done", "bg-[#c08532] text-white"],
                ].map(([label, color], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.25 + index * 0.24 }}
                    className="flex items-center gap-2"
                  >
                    <span className={`rounded-full px-2 py-1 ${color}`}>{label}</span>
                    {index === 3 && <Check className="size-3 text-[#8ac68e]" />}
                  </motion.div>
                ))}
              </div>
              <div className="rounded-lg border border-[#f4511e]/20 bg-[#f4511e]/8 p-3 text-[11px] leading-relaxed text-white/60">
                Updated the entrance sequence and added reduced-motion fallbacks.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollFeature({
  index,
  feature,
}: {
  index: number;
  feature: (typeof features)[number];
}) {
  const Icon = feature.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
      className="group relative overflow-hidden rounded-2xl border border-[#d8d3ca] bg-white p-6 sm:p-8"
    >
      <div
        className={`mb-16 grid size-11 place-items-center rounded-xl ${feature.accent} text-[#24231e] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3`}
      >
        <Icon className="size-5" />
      </div>
      <p className="dvx-kicker mb-3">{feature.eyebrow}</p>
      <h3 className="max-w-sm font-headline text-2xl font-normal leading-[1.14] tracking-[-0.04em] text-[#24231e]">
        {feature.title}
      </h3>
      <p className="mt-5 max-w-md text-sm leading-6 text-[#6d695f]">
        {feature.body}
      </p>
      <div className="absolute right-5 top-5 font-mono text-[10px] text-[#a39e94]">
        0{index + 1}
      </div>
    </motion.article>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(20);
  const smoothPointerX = useSpring(pointerX, { stiffness: 90, damping: 24 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 90, damping: 24 });
  const heroGlow = useMotionTemplate`radial-gradient(480px circle at ${smoothPointerX}% ${smoothPointerY}%, rgba(244,81,30,0.16), transparent 72%)`;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f3ee] text-[#24231e]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#24231e]/8 bg-[#f5f3ee]/88 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Devix home">
            <BrandMark />
          </Link>
          <div className="hidden items-center gap-7 text-sm text-[#5f5b52] md:flex">
            <Link href="#product" className="transition-colors hover:text-[#24231e]">
              Product
            </Link>
            <Link href="#workflow" className="transition-colors hover:text-[#24231e]">
              Workflow
            </Link>
            <Link href="#templates" className="transition-colors hover:text-[#24231e]">
              Templates
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/sign-in"
              className="dvx-focus-ring hidden rounded-lg px-4 py-2 text-sm font-medium sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-in"
              className="dvx-focus-ring group flex h-10 items-center gap-2 rounded-lg bg-[#24231e] px-4 text-sm font-medium text-[#f7f5ef] transition-transform hover:-translate-y-0.5"
            >
              Start building
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>
      </header>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[#f4511e]"
        style={{ scaleX: pageScrollProgress }}
      />

      <main>
        <section
          ref={heroRef}
          onMouseMove={(event) => {
            if (reducedMotion) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
            pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
          }}
          className="relative px-5 pb-24 pt-36 sm:px-8 sm:pt-44"
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: heroGlow }}
          />
          <div className="dvx-grid pointer-events-none absolute inset-0 opacity-70" />
          <div className="pointer-events-none absolute left-1/2 top-[-180px] size-[560px] -translate-x-1/2 rounded-full bg-[#f4511e]/8 blur-[120px]" />
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative mx-auto max-w-[1240px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#d4cfc5] bg-white/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b675f]"
            >
              <Sparkles className="size-3 text-[#f4511e]" />
              The browser-native AI workspace
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease }}
              className="mx-auto mt-8 max-w-5xl text-center font-headline text-[clamp(3.5rem,9vw,7.8rem)] font-normal leading-[0.86] tracking-[-0.075em]"
            >
              Build at the speed
              <span className="block text-[#f4511e]">of thought.</span>
            </motion.h1>
            <motion.div
              animate={
                reducedMotion
                  ? undefined
                  : { y: [0, -10, 0], rotate: [-2, 2, -2] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[3%] top-28 hidden rounded-lg border border-[#d8d3ca] bg-white/80 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#777168] backdrop-blur lg:block"
            >
              npm run idea
            </motion.div>
            <motion.div
              animate={
                reducedMotion
                  ? undefined
                  : { y: [0, 12, 0], rotate: [2, -2, 2] }
              }
              transition={{
                duration: 7.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="absolute right-[2%] top-48 hidden rounded-lg border border-[#d8d3ca] bg-white/80 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#777168] backdrop-blur lg:block"
            >
              preview: live
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease }}
              className="mx-auto mt-8 max-w-2xl text-center text-base leading-7 text-[#67635a] sm:text-lg"
            >
              Devix brings code, live runtime, and an AI agent into one responsive
              workspace. Go from a sentence to a running product without leaving
              the browser.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease }}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/auth/sign-in"
                className="dvx-focus-ring group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#f4511e] px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#df4518] sm:w-auto"
              >
                Open Devix
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#product"
                className="dvx-focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#cbc6bb] bg-white px-6 text-sm font-medium transition-colors hover:bg-[#ece9e2] sm:w-auto"
              >
                <Play className="size-3.5 fill-current" />
                See how it works
              </a>
            </motion.div>
            <ProductStage />
          </motion.div>
        </section>

        <section id="product" className="border-y border-[#d8d3ca] bg-[#ece9e2] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.7fr]">
              <div>
                <p className="dvx-kicker text-[#777168]">Designed for momentum</p>
                <h2 className="mt-4 max-w-3xl font-headline text-4xl font-normal leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                  Fewer handoffs. More finished work.
                </h2>
              </div>
              <p className="max-w-lg text-base leading-7 text-[#69655c] lg:justify-self-end">
                The interface stays quiet until you need it, then responds with
                clear motion, contextual controls, and immediate feedback.
              </p>
            </div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {features.map((feature, index) => (
                <ScrollFeature key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[#24231e] px-5 py-24 text-[#f5f3ee] sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, ease }}
            >
              <p className="dvx-kicker !text-[#aaa59a]">One continuous loop</p>
              <h2 className="mt-5 font-headline text-5xl font-normal leading-[0.98] tracking-[-0.055em] sm:text-7xl">
                Prompt.
                <br />
                Inspect.
                <br />
                <span className="text-[#ff7043]">Ship.</span>
              </h2>
              <p className="mt-7 max-w-md text-base leading-7 text-[#b9b5ab]">
                Devix keeps the AI close to the code and the result close to the
                editor. Every change is visible, reversible, and immediately
                runnable.
              </p>
              <Link
                href="/auth/sign-in"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-white"
              >
                Enter the workspace
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151512] p-3 sm:p-5"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff7043] to-transparent" />
              <div className="rounded-xl border border-white/8 bg-[#0e0e0c]">
                <div className="flex items-center justify-between border-b border-white/8 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Bot className="size-4 text-[#ff7043]" />
                    Devix Agent
                  </div>
                  <span className="font-mono text-[10px] text-white/30">LIVE</span>
                </div>
                <div className="space-y-5 p-5 sm:p-7">
                  <div className="ml-auto max-w-md rounded-xl bg-white/7 p-4 text-sm leading-6 text-white/75">
                    Build a pricing section that feels premium, uses our existing
                    tokens, and animates in as I scroll.
                  </div>
                  <div className="max-w-lg space-y-3 rounded-xl border border-white/8 bg-white/[0.025] p-4">
                    {[
                      ["Thinking", "#dfa88f"],
                      ["Reading design tokens", "#9fbbe0"],
                      ["Editing pricing.tsx", "#c0a8dd"],
                      ["Running checks", "#9fc9a2"],
                    ].map(([label, color], index) => (
                      <motion.div
                        key={label}
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: "100%", opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.25 + index * 0.18, ease }}
                        className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-mono text-[11px] text-white/55">
                          {label}
                        </span>
                        <span className="h-px flex-1 bg-white/8" />
                        {index < 3 ? (
                          <Check className="size-3.5 text-[#8dbe92]" />
                        ) : (
                          <span className="size-3 animate-pulse rounded-full bg-[#9fc9a2]" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#ff7043]/20 bg-[#ff7043]/8 p-4 text-sm text-white/70">
                    <Zap className="size-4 shrink-0 text-[#ff7043]" />
                    Preview updated in 1.2 seconds
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="templates" className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-[1240px]">
            <div className="text-center">
              <p className="dvx-kicker">Start with a strong foundation</p>
              <h2 className="mx-auto mt-4 max-w-3xl font-headline text-4xl font-normal leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Your stack is already waiting.
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#d8d3ca] bg-[#d8d3ca] md:grid-cols-3">
              {stack.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group flex min-h-40 flex-col justify-between bg-[#faf9f6] p-5 transition-colors hover:bg-white sm:min-h-48 sm:p-7"
                >
                  <span className="font-mono text-[10px] text-[#9b968c]">
                    0{index + 1}
                  </span>
                  <div className="flex items-end justify-between gap-3">
                    <span className="font-headline text-xl tracking-[-0.04em] sm:text-2xl">
                      {item}
                    </span>
                    <ArrowRight className="size-4 -translate-x-2 text-[#f4511e] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease }}
            className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[24px] bg-[#f4511e] px-6 py-16 text-white sm:px-14 sm:py-20"
          >
            <div className="dvx-noise absolute inset-0 opacity-[0.09] mix-blend-overlay" />
            <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.17em] text-white/70">
                  Your next build starts here
                </p>
                <h2 className="mt-5 max-w-4xl font-headline text-5xl font-normal leading-[0.94] tracking-[-0.06em] sm:text-7xl">
                  Keep the idea moving.
                </h2>
              </div>
              <Link
                href="/auth/sign-in"
                className="group flex h-13 items-center justify-center gap-2 rounded-lg bg-[#24231e] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-1"
              >
                Build with Devix
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[#d8d3ca] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <p className="text-xs text-[#7c786f]">
            Browser-native engineering, designed for momentum.
          </p>
          <div className="flex items-center gap-5 text-xs text-[#69655c]">
            <a href="https://github.com" aria-label="GitHub" className="hover:text-[#24231e]">
              <Github className="size-4" />
            </a>
            <span>© 2026 Devix</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

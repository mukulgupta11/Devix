"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Github, ShieldCheck, Sparkles } from "lucide-react";
import {
  signInWithGithub,
  signInWithGoogle,
} from "@/features/auth/actions";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.86A6.02 6.02 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.01c1.47 0 2.78.5 3.82 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.62C7.18 7.77 9.39 6 12 6Z"
      />
    </svg>
  );
}

const SignInFormClient = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[430px]"
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { rotate: [0, 4, -3, 0], y: [0, -5, 2, 0] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-3 -top-14 hidden size-12 place-items-center rounded-2xl border border-[#d8d3ca] bg-white text-[#f4511e] shadow-sm sm:grid"
      >
        <Sparkles className="size-5" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.12 }}
        className="dvx-kicker"
      >
        Welcome to Devix
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.65 }}
        className="mt-4 font-headline text-4xl font-normal tracking-[-0.05em] sm:text-5xl"
      >
        Pick up where the idea left off.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
        className="mt-4 max-w-sm text-sm leading-6 text-[#716d64]"
      >
        Sign in to open your projects, run your environments, and continue
        building with full context.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.38 } },
        }}
        className="mt-10 space-y-3"
      >
        <form action={signInWithGoogle}>
          <motion.button
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={reduceMotion ? undefined : { y: -3, scale: 1.008 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            type="submit"
            className="dvx-focus-ring group flex h-12 w-full items-center justify-between rounded-lg border border-[#cfc9be] bg-white px-4 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-[#aaa398] hover:bg-[#faf9f6]"
          >
            <span className="flex items-center gap-3">
              <GoogleMark />
              Continue with Google
            </span>
            <span className="translate-x-1 text-[#a29c91] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
              →
            </span>
          </motion.button>
        </form>
        <form action={signInWithGithub}>
          <motion.button
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={reduceMotion ? undefined : { y: -3, scale: 1.008 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            type="submit"
            className="dvx-focus-ring group flex h-12 w-full items-center justify-between rounded-lg bg-[#24231e] px-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#11110f]"
          >
            <span className="flex items-center gap-3">
              <Github className="size-4" />
              Continue with GitHub
            </span>
            <span className="translate-x-1 text-white/50 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
              →
            </span>
          </motion.button>
        </form>
      </motion.div>

      <div className="my-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-[#d8d3ca]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#979187]">
          Secure sign in
        </span>
        <span className="h-px flex-1 bg-[#d8d3ca]" />
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-lg border border-[#d8d3ca] bg-white/60 px-3 py-2 text-[11px] text-[#716d64]">
        <ShieldCheck className="size-3.5 text-[#4f805b]" />
        OAuth only. Devix never sees or stores your provider password.
      </div>
      <p className="text-xs leading-5 text-[#858077]">
        By continuing, you agree to the{" "}
        <a href="#" className="text-[#24231e] underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-[#24231e] underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </motion.div>
  );
};

export default SignInFormClient;

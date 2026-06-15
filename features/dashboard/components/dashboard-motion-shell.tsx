"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

export default function DashboardMotionShell({
  children,
}: {
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const firstOrbY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 130]);
  const secondOrbY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : -90]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      <motion.div
        style={{ y: firstOrbY }}
        className="pointer-events-none absolute -right-32 top-20 size-80 rounded-full bg-primary/8 blur-[100px]"
      />
      <motion.div
        style={{ y: secondOrbY }}
        className="pointer-events-none absolute -left-40 top-[620px] size-96 rounded-full bg-[#6f95c7]/10 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

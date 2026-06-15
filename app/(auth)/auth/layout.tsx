import Link from "next/link";
import { ArrowLeft, Check, Code2, Sparkles } from "lucide-react";
import type React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid min-h-screen bg-[#f5f3ee] text-[#24231e] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-[#d8d3ca] bg-[#24231e] p-10 text-[#f5f3ee] lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="dvx-grid absolute inset-0 opacity-[0.08]" />
        <div className="absolute -left-32 top-1/3 size-96 rounded-full bg-[#f4511e]/20 blur-[100px]" />
        <Link href="/" className="relative flex w-fit items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[10px] bg-[#f4511e]">
            <Code2 className="size-4.5 text-white" />
          </span>
          <span className="font-headline text-lg font-semibold tracking-[-0.03em]">
            devix
          </span>
        </Link>

        <div className="relative max-w-xl">
          <div className="mb-7 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
            <Sparkles className="size-3 text-[#ff7043]" />
            Your workspace is ready
          </div>
          <h1 className="font-headline text-6xl font-normal leading-[0.92] tracking-[-0.06em] xl:text-7xl">
            The shortest path from thought to software.
          </h1>
          <div className="mt-10 space-y-4 text-sm text-white/60">
            {[
              "Full browser-native Node.js runtime",
              "AI assistance with project-wide context",
              "Live preview, editor, and terminal in one place",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-[#9fc9a2] text-[#24231e]">
                  <Check className="size-3" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
          <span>Secure OAuth</span>
          <span>No credit card</span>
          <span>Instant workspace</span>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-10">
        <Link
          href="/"
          className="absolute left-5 top-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#6c685f] transition-colors hover:bg-[#ece9e2] hover:text-[#24231e] sm:left-8 sm:top-8"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="absolute right-6 top-6 flex items-center gap-2 lg:hidden">
          <span className="grid size-8 place-items-center rounded-[9px] bg-[#24231e] text-white">
            <Code2 className="size-4" />
          </span>
          <span className="font-headline font-semibold">devix</span>
        </div>
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;

"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function PlaygroundHeader({ title = "Code Editor" }: { title?: string }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-white/8 bg-[#11110f] px-3 text-white">
      <SidebarTrigger className="text-white/50 hover:bg-white/8 hover:text-white" />
      <h1 className="text-xs font-medium text-white/80">{title}</h1>
    </header>
  );
}

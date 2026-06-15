"use client";

import type { ReactNode } from "react";
import { PlaygroundHeader } from "./playground-header";

export function PlaygroundLayout({
  children,
  title,
}: {
  children?: ReactNode;
  title?: string;
}) {
  return (
    <div className="flex h-screen flex-col bg-[#0e0e0c]">
      <PlaygroundHeader title={title} />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

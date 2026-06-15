import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark h-screen overflow-hidden bg-[#0e0e0c]">
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}

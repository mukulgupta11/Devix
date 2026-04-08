import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar"
import { getAllPlaygroundForUser } from "@/features/playground/actions"
import type React from "react"
import { auth } from "@/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const playgroundData = await getAllPlaygroundForUser()
  const session = await auth()

  // Store icon names (strings) instead of the components themselves
  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  }

  const formattedPlaygroundData =
    playgroundData?.map((item) => ({
      id: item.id,
      name: item.title,
      starred: item.Starmark?.[0]?.isMarked || false,
      // Pass the icon name as a string
      icon: technologyIconMap[item.template] || "Code2", // Default to "Code2" if template not found
    })) || []

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-background text-foreground font-body">
        {/* Pass the formatted data with string icon names */}
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} user={session?.user} />
        <main className="flex-1 min-w-0 relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

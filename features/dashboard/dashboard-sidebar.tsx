"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Code2,
  Compass,
  Database,
  FlameIcon,
  FolderKanban,
  Laptop,
  Lightbulb,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  Star,
  Sun,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface PlaygroundData {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
  Zap,
  Lightbulb,
  Database,
  Compass,
  FlameIcon,
  Terminal,
  Code2,
};

function ProjectGroup({
  title,
  icon: Icon,
  projects,
  pathname,
}: {
  title: string;
  icon: LucideIcon;
  projects: PlaygroundData[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-mono text-[9px] uppercase tracking-[0.16em]">
        <Icon className="size-3.5" />
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.length === 0 ? (
            <div className="px-2 py-3 text-xs text-muted-foreground">
              Nothing here yet
            </div>
          ) : (
            projects.map((playground) => {
              const ProjectIcon = lucideIconMap[playground.icon] || Code2;
              return (
                <SidebarMenuItem key={playground.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/playground/${playground.id}`}
                    tooltip={playground.name}
                    className="h-9"
                  >
                    <Link href={`/playground/${playground.id}`}>
                      <ProjectIcon className="size-3.5" />
                      <span>{playground.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DashboardSidebar({
  initialPlaygroundData,
  user,
}: {
  initialPlaygroundData: PlaygroundData[];
  user?: any;
}) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const starredPlaygrounds = initialPlaygroundData.filter(
    (playground) => playground.starred
  );

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center gap-2 px-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-foreground text-background">
            <Code2 className="size-4" />
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="font-headline text-sm font-semibold tracking-[-0.03em]">
              devix
            </p>
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              Workspace
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard">
                  <FolderKanban className="size-4" />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Search projects"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("devix:focus-project-search"))
                }
              >
                <Search className="size-4" />
                <span>Search</span>
                <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                  ⌘K
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <ProjectGroup
          title="Starred"
          icon={Star}
          projects={starredPlaygrounds}
          pathname={pathname}
        />

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[9px] uppercase tracking-[0.16em]">
            <FolderKanban className="size-3.5" />
            Projects
          </SidebarGroupLabel>
          <SidebarGroupAction title="New project" asChild>
            <Link href="/dashboard">
              <Plus className="size-4" />
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {initialPlaygroundData.map((playground) => {
                const ProjectIcon =
                  lucideIconMap[playground.icon] || Code2;
                return (
                  <SidebarMenuItem key={playground.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/playground/${playground.id}`}
                      tooltip={playground.name}
                      className="h-9"
                    >
                      <Link href={`/playground/${playground.id}`}>
                        <ProjectIcon className="size-3.5" />
                        <span>{playground.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip="Account settings">
                  <Avatar className="size-7 rounded-lg">
                    <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                    <AvatarFallback className="rounded-lg text-xs">
                      {user?.name?.charAt(0).toUpperCase() || "D"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-xs font-medium">
                      {user?.name || "Devix User"}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {user?.email || "Developer workspace"}
                    </p>
                  </div>
                  <Settings className="size-3.5 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Moon className="size-4" />
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="size-4" />
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="size-4" />
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop className="size-4" />
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    window.location.assign("/auth/logout");
                  }}
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

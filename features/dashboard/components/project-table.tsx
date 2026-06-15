"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Copy,
  Edit3,
  ExternalLink,
  MoreHorizontal,
  Search,
  Share2,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { Project } from "../types";
import { MarkedToggleButton } from "./toggle-star";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string }
  ) => Promise<unknown>;
  onDeleteProject?: (id: string) => Promise<unknown>;
  onDuplicateProject?: (id: string) => Promise<unknown>;
}

const templateTone: Record<string, string> = {
  REACT: "bg-[#d7e8ff] text-[#25456d]",
  NEXTJS: "bg-[#24231e] text-white",
  EXPRESS: "bg-[#e2dfd7] text-[#4d4a43]",
  VUE: "bg-[#cfe7d3] text-[#295b3a]",
  HONO: "bg-[#f1d8cb] text-[#783a25]",
  ANGULAR: "bg-[#edd4dd] text-[#762b46]",
};

export default function ProjectTable({
  projects,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
}: ProjectTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"updated" | "name" | "created">("updated");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const templates = useMemo(
    () => Array.from(new Set(projects.map((project) => project.template))).sort(),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...projects]
      .filter((project) => {
        const matchesQuery =
          !normalizedQuery ||
          project.title.toLowerCase().includes(normalizedQuery) ||
          (project.description || "").toLowerCase().includes(normalizedQuery) ||
          project.template.toLowerCase().includes(normalizedQuery);
        const matchesTemplate =
          templateFilter === "ALL" || project.template === templateFilter;
        return matchesQuery && matchesTemplate;
      })
      .sort((left, right) => {
        if (sortBy === "name") return left.title.localeCompare(right.title);
        if (sortBy === "created") {
          return +new Date(right.createdAt) - +new Date(left.createdAt);
        }
        return +new Date(right.updatedAt) - +new Date(left.updatedAt);
      });
  }, [projects, query, templateFilter, sortBy]);

  useEffect(() => {
    const focusSearch = () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener("devix:focus-project-search", focusSearch);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("devix:focus-project-search", focusSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !onUpdateProject) return;
    setIsLoading(true);
    try {
      await onUpdateProject(selectedProject.id, editData);
      setEditDialogOpen(false);
      setSelectedProject(null);
      toast.success("Project updated");
    } catch {
      toast.error("Could not update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !onDeleteProject) return;
    setIsLoading(true);
    try {
      await onDeleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      toast.success("Project deleted");
    } catch {
      toast.error("Could not delete project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return;
    setIsLoading(true);
    try {
      await onDuplicateProject(project.id);
      toast.success("Project duplicated");
    } catch {
      toast.error("Could not duplicate project");
    } finally {
      setIsLoading(false);
    }
  };

  const copyProjectUrl = async (projectId: string) => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/playground/${projectId}`
    );
    toast.success("Project URL copied");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, descriptions, or stacks..."
            className="h-10 bg-background pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="hidden size-4 text-muted-foreground sm:block" />
          <select
            value={templateFilter}
            onChange={(event) => setTemplateFilter(event.target.value)}
            className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-xs outline-none focus:border-primary sm:flex-none"
            aria-label="Filter by stack"
          >
            <option value="ALL">All stacks</option>
            {templates.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "updated" | "name" | "created")
            }
            className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-xs outline-none focus:border-primary sm:flex-none"
            aria-label="Sort projects"
          >
            <option value="updated">Recently updated</option>
            <option value="created">Recently created</option>
            <option value="name">Name</option>
          </select>
        </div>
        <span className="whitespace-nowrap px-1 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
          {filteredProjects.length} results
        </span>
      </motion.div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="hidden grid-cols-[1.5fr_0.55fr_0.55fr_42px] border-b border-border bg-muted/50 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:grid">
          <span>Project</span>
          <span>Stack</span>
          <span>Updated</span>
          <span />
        </div>
        <div className="divide-y divide-border">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.045 }}
              className="group grid items-center gap-5 px-4 py-4 transition-colors hover:bg-muted/45 sm:px-5 md:grid-cols-[1.5fr_0.55fr_0.55fr_42px]"
            >
              <Link
                href={`/playground/${project.id}`}
                className="flex min-w-0 items-center gap-4"
              >
                <div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-background font-headline text-sm font-semibold uppercase">
                  {project.template.slice(0, 1)}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-headline text-[15px] font-semibold tracking-[-0.02em]">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {project.description || "Ready for the next iteration"}
                  </p>
                </div>
              </Link>

              <div>
                <Badge
                  className={`border-0 px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.08em] ${
                    templateTone[project.template] || "bg-muted text-foreground"
                  }`}
                >
                  {project.template}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <div className="size-6 overflow-hidden rounded-full border border-border bg-muted">
                  <Image
                    src={project.user.image || "/placeholder.svg"}
                    alt={project.user.name || "Project owner"}
                    width={24}
                    height={24}
                    className="size-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs">
                    {formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {project.user.name || "Devix user"}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-lg"
                    aria-label={`Actions for ${project.title}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <MarkedToggleButton
                      markedForRevision={project.Starmark[0]?.isMarked}
                      id={project.id}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/playground/${project.id}`}>
                      <ArrowUpRight className="size-4" />
                      Open project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/playground/${project.id}`} target="_blank">
                      <ExternalLink className="size-4" />
                      Open in new tab
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditClick(project)}>
                    <Edit3 className="size-4" />
                    Edit details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDuplicateProject(project)}
                    disabled={isLoading}
                  >
                    <Copy className="size-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyProjectUrl(project.id)}>
                    <Share2 className="size-4" />
                    Copy project URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setSelectedProject(project);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="size-4" />
                    Delete project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.article>
          ))}
          {filteredProjects.length === 0 && (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
              <Search className="size-6 text-muted-foreground" />
              <p className="mt-4 text-sm font-medium">No projects found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different search or clear the stack filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl font-normal tracking-[-0.04em]">
              Edit project
            </DialogTitle>
            <DialogDescription>
              Update how this project appears in your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-5">
            <div className="grid gap-2">
              <Label htmlFor="title">Project title</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(event) =>
                  setEditData((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(event) =>
                  setEditData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateProject}
              disabled={isLoading || !editData.title.trim()}
            >
              {isLoading ? "Saving" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedProject?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the playground and its saved files. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isLoading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isLoading ? "Deleting" : "Delete project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

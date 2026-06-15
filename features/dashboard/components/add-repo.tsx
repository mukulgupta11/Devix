"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, GitBranch, Github, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AddRepo = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleImport = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!repoUrl) {
      toast.error("Enter a GitHub repository URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, title }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to import repository");
      }
      toast.success("Repository mounted");
      setIsOpen(false);
      router.push(`/playground/${data.playgroundId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="group relative min-h-52 overflow-hidden rounded-2xl border border-border bg-card p-6 text-left"
      >
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_100%_0%,rgba(111,149,199,0.2),transparent_65%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl border border-border bg-background">
              <ArrowDownToLine className="size-5 transition-transform duration-500 group-hover:translate-y-1" />
            </span>
            <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
          </div>
          <div className="mt-12">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <GitBranch className="size-3 text-[#6f95c7]" />
              Continue existing work
            </div>
            <h3 className="font-headline text-2xl font-normal tracking-[-0.04em]">
              Import from GitHub
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Mount a public repository directly into a live Devix runtime.
            </p>
          </div>
        </div>
        <Github className="absolute bottom-5 right-6 size-16 text-foreground/[0.035]" />
      </motion.button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-border bg-card sm:max-w-[460px]">
          <form onSubmit={handleImport}>
            <DialogHeader>
              <div className="mb-3 grid size-10 place-items-center rounded-xl bg-foreground text-background">
                <Github className="size-4.5" />
              </div>
              <DialogTitle className="font-headline text-2xl font-normal tracking-[-0.04em]">
                Import a repository
              </DialogTitle>
              <DialogDescription className="leading-6">
                Devix will fetch the public repository, detect its framework, and
                prepare a new playground.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <Label htmlFor="repo-url">Repository URL</Label>
                <Input
                  id="repo-url"
                  placeholder="https://github.com/user/repo"
                  value={repoUrl}
                  onChange={(event) => setRepoUrl(event.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Project title</Label>
                <Input
                  id="title"
                  placeholder="Optional, defaults to repository name"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !repoUrl}>
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Mounting
                  </>
                ) : (
                  "Import repository"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRepo;

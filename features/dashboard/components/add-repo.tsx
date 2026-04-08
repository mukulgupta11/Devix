"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, Github, Loader2 } from "lucide-react";
import Image from "next/image";
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

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/github/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl, title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import repository");
      }

      toast.success("Repository imported successfully!");
      setIsOpen(false);
      
      // Redirect to the new playground
      router.push(`/playground/${data.playgroundId}`);
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(error.message || "Failed to import repository");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border border-border rounded-2xl bg-card cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-muted hover:border-secondary hover:-translate-y-1
        shadow-sm
        hover:shadow-md"
      >
        <div className="flex flex-row justify-center items-start gap-5">
          <div
            className="flex justify-center flex-shrink-0 items-center w-12 h-12 rounded-xl bg-muted border border-border text-muted-foreground group-hover:bg-secondary/10 group-hover:border-secondary/30 group-hover:text-secondary transition-colors duration-300"
          >
            <ArrowDown size={24} className="transition-transform duration-300 group-hover:translate-y-1" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-headline text-foreground group-hover:text-secondary transition-colors">Import Repository</h1>
            <p className="text-sm text-muted-foreground max-w-[220px] font-body">Mount Github directly into Devix</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleImport}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Import from GitHub
              </DialogTitle>
              <DialogDescription>
                Enter the URL of a public GitHub repository. We will fetch its files and create a new Devix playground.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="repo-url">Repository URL</Label>
                <Input
                  id="repo-url"
                  placeholder="https://github.com/user/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Will use repo name if left blank"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !repoUrl}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mounting...
                  </>
                ) : (
                  "Import Repository"
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

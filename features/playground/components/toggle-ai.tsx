"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Code, 
  FileText, 
  Import, 
  Loader2,
  Power,
  PowerOff,
  Braces,
  Variable
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { AIChatSidePanel } from "@/features/ai-chat/components/ai-chat-sidepanel";
import { useTheme } from "next-themes";
import { useFileExplorer } from "../hooks/useFileExplorer";
import { toast } from "sonner";


interface ToggleAIProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  
  suggestionLoading: boolean;
  loadingProgress?: number;
  activeFeature?: string;
  cursorPosition?: { line: number; column: number };
  onRunCode?: (code: string, language: string) => void;
}

const ToggleAI: React.FC<ToggleAIProps> = ({
  isEnabled,
  onToggle,

  suggestionLoading,
  loadingProgress = 0,
  activeFeature,
  cursorPosition = { line: 1, column: 1 },
  onRunCode,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme: appTheme } = useTheme();
  const theme = (appTheme === "light" ? "light" : "dark") as "dark" | "light";

  // Get real active file from the file explorer store
  const { openFiles, activeFileId, updateFileContent } = useFileExplorer();

  const activeOpenFile = useMemo(() => {
    if (!activeFileId) return null;
    return openFiles.find((f) => f.id === activeFileId) || null;
  }, [openFiles, activeFileId]);

  // Derive file info from the real active file
  const activeFile = useMemo(() => {
    if (!activeOpenFile) return null;
    const fullName = `${activeOpenFile.filename}.${activeOpenFile.fileExtension}`;
    return { name: fullName, content: activeOpenFile.content };
  }, [activeOpenFile]);

  // Detect language from file extension
  const activeFileLanguage = useMemo(() => {
    if (!activeOpenFile) return "text";
    const ext = activeOpenFile.fileExtension.toLowerCase();
    const langMap: Record<string, string> = {
      ts: "TypeScript", tsx: "TypeScript",
      js: "JavaScript", jsx: "JavaScript",
      py: "Python", java: "Java", go: "Go",
      rs: "Rust", php: "PHP", rb: "Ruby",
      html: "HTML", css: "CSS", scss: "SCSS",
      json: "JSON", md: "Markdown", sql: "SQL",
      sh: "Shell", yaml: "YAML", yml: "YAML",
    };
    return langMap[ext] || "text";
  }, [activeOpenFile]);

  const handleInsertCode = (code: string, fileName?: string, position?: { line: number; column: number }) => {
    const targetFile =
      openFiles.find(
        (file) => `${file.filename}.${file.fileExtension}` === fileName
      ) || activeOpenFile;
    if (!targetFile) {
      toast.error("Open a file before inserting code");
      return;
    }

    const targetPosition = position || cursorPosition;
    const lines = targetFile.content.split("\n");
    const lineIndex = Math.max(
      0,
      Math.min((targetPosition.line || 1) - 1, lines.length - 1)
    );
    const columnIndex = Math.max(
      0,
      Math.min((targetPosition.column || 1) - 1, lines[lineIndex]?.length || 0)
    );
    const before = lines.slice(0, lineIndex);
    const after = lines.slice(lineIndex + 1);
    const currentLine = lines[lineIndex] || "";
    const nextContent = [
      ...before,
      `${currentLine.slice(0, columnIndex)}${code}${currentLine.slice(columnIndex)}`,
      ...after,
    ].join("\n");

    updateFileContent(targetFile.id, nextContent);
    toast.success(`Inserted code into ${targetFile.filename}.${targetFile.fileExtension}`);
  };

  const handleRunCode = (code: string, language: string) => {
    if (!onRunCode) {
      toast.error("The runtime is not ready yet");
      return;
    }
    onRunCode(code, language);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            variant={isEnabled ? "default" : "outline"}
            className={cn(
              "relative h-8 gap-2 border px-2.5 text-[10px] font-medium transition-all duration-200",
              isEnabled 
                ? "border-[#ff7043]/30 bg-[#ff7043]/15 text-[#ff9a78] hover:bg-[#ff7043]/20"
                : "border-white/8 bg-white/[0.03] text-white/45 hover:bg-white/8 hover:text-white",
              suggestionLoading && "opacity-75"
            )}
            onClick={(e) => e.preventDefault()}
          >
            {suggestionLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Bot className="size-3.5" />
            )}
            <span>AI</span>
            {isEnabled ? (
              <div className="size-1.5 animate-pulse rounded-full bg-[#9fc9a2]" />
            ) : (
              <div className="size-1.5 rounded-full bg-white/20" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                isEnabled 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isEnabled ? "Active" : "Inactive"}
            </Badge>
          </DropdownMenuLabel>
          
          {suggestionLoading && activeFeature && (
            <div className="px-3 pb-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{activeFeature}</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                <Progress 
                  value={loadingProgress} 
                  className="h-1.5"
                />
              </div>
            </div>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => onToggle(!isEnabled)}
            className="py-2.5 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {isEnabled ? (
                  <Power className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <PowerOff className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <div className="text-sm font-medium">
                    {isEnabled ? "Disable" : "Enable"} AI
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Toggle AI assistance
                  </div>
                </div>
              </div>
              <div className={cn(
                "w-8 h-4 rounded-full border transition-all duration-200 relative",
                isEnabled 
                  ? "bg-primary border-primary" 
                  : "bg-muted border-border"
              )}>
                <div className={cn(
                  "w-3 h-3 rounded-full bg-background transition-all duration-200 absolute top-0.5",
                  isEnabled ? "left-4" : "left-0.5"
                )} />
              </div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsChatOpen(true)}
            className="py-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-3 w-full">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Open Chat</div>
                <div className="text-xs text-muted-foreground">
                  Chat with AI assistant
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AIChatSidePanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onInsertCode={handleInsertCode}
        onRunCode={handleRunCode}
        activeFileName={activeFile?.name}
        activeFileContent={activeFile?.content}
        activeFileLanguage={activeFileLanguage}
        cursorPosition={cursorPosition}
        theme={theme}
      />
    </>
  );
};

export default ToggleAI;

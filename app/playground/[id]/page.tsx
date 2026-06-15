"use client";

import React, { useRef } from "react";
import { useState, useCallback } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TemplateFileTree } from "@/features/playground/components/playground-explorer";
import type { TemplateFile } from "@/features/playground/libs/path-to-json";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  AlertCircle,
  Save,
  TerminalSquare,
  X,
  Settings,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WebContainerPreview from "@/features/webcontainers/components/webcontainer-preveiw";
import LoadingStep from "@/components/ui/loader";
import { PlaygroundEditor } from "@/features/playground/components/playground-editor";
import ToggleAI from "@/features/playground/components/toggle-ai";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useAISuggestions } from "@/features/playground/hooks/useAISuggestion";
import { useWebContainer } from "@/features/webcontainers/hooks/useWebContainer";
import { SaveUpdatedCode } from "@/features/playground/actions";
import { TemplateFolder } from "@/features/playground/types";
import { findFilePath } from "@/features/playground/libs";
import { ConfirmationDialog } from "@/features/playground/components/dialogs/conformation-dialog";
import { StatusBar } from "@/features/playground/components/status-bar";
import { AnimatePresence, motion } from "framer-motion";

const MainPlaygroundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // UI state
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [runOutput, setRunOutput] = useState<{
    status: "running" | "success" | "error";
    content: string;
  } | null>(null);

  // Custom hooks
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);
  const aiSuggestions = useAISuggestions();
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
  } = useWebContainer({ templateData, projectId: id as string });

  const lastSyncedContent = useRef<Map<string, string>>(new Map());

  // Set template data when playground loads
  React.useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  // Initialize zustand templateData from usePlayground only on first load
  React.useEffect(() => {
    if (templateData && !openFiles.length) {

      
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  // Create wrapper functions that pass saveTemplateData
  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        writeFileSync!,
        instance,
        saveTemplateData
      );
    },
    [handleAddFile, writeFileSync, instance, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    },
    [handleAddFolder, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, instance, saveTemplateData);
    },
    [handleDeleteFile, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, instance, saveTemplateData);
    },
    [handleDeleteFolder, instance, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        instance,
        saveTemplateData
      );
    },
    [handleRenameFile, instance, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        instance,
        saveTemplateData
      );
    },
    [handleRenameFolder, instance, saveTemplateData]
  );

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  const handleSave = useCallback(
    async (fileId?: string, silent = false) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
          return;
        }

        // Update file content in template data (clone for immutability)
        const updatedTemplateData = JSON.parse(
          JSON.stringify(latestTemplateData)
        );
        const updateFileContent = (items: any[]): any[] =>
          items.map((item) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContent(item.items) };
            } else if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });
        updatedTemplateData.items = updateFileContent(
          updatedTemplateData.items
        );

        // Sync with WebContainer
        if (writeFileSync) {
          await writeFileSync(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
          if (instance && instance.fs) {
            await instance.fs.writeFile(filePath, fileToSave.content);
          }
        }

        // Use saveTemplateData to persist changes
        await saveTemplateData(updatedTemplateData);
        setTemplateData(updatedTemplateData);

        // Update open files
        const updatedOpenFiles = openFiles.map((f) =>
          f.id === targetFileId
            ? {
                ...f,
                content: fileToSave.content,
                originalContent: fileToSave.content,
                hasUnsavedChanges: false,
              }
            : f
        );
        setOpenFiles(updatedOpenFiles);

        setLastSaved(new Date());
        if (!silent) {
          toast.success(
            `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
        }
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
        throw error;
      }
    },
    [
      activeFileId,
      openFiles,
      writeFileSync,
      instance,
      saveTemplateData,
      setTemplateData,
      setOpenFiles,
    ]
  );

  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch (error) {
      toast.error("Failed to save some files");
    }
  };

  // Add event to save file by click ctrl + s
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSaveAll();
        } else {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  React.useEffect(() => {
    const storedValue = window.localStorage.getItem("devix:auto-save");
    if (storedValue !== null) {
      setAutoSaveEnabled(storedValue === "true");
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem("devix:auto-save", String(autoSaveEnabled));
  }, [autoSaveEnabled]);

  React.useEffect(() => {
    if (!autoSaveEnabled || !activeFile?.hasUnsavedChanges) return;
    const timeoutId = window.setTimeout(() => {
      handleSave(activeFile.id, true).catch(() => undefined);
    }, 1600);
    return () => window.clearTimeout(timeoutId);
  }, [
    activeFile?.content,
    activeFile?.hasUnsavedChanges,
    activeFile?.id,
    autoSaveEnabled,
    handleSave,
  ]);

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const requestCloseFile = (fileId: string) => {
    const file = openFiles.find((item) => item.id === fileId);
    if (!file?.hasUnsavedChanges) {
      closeFile(fileId);
      return;
    }

    setConfirmationDialog({
      isOpen: true,
      title: `Close ${file.filename}.${file.fileExtension}?`,
      description: "This file has unsaved changes. Closing it will discard them.",
      onConfirm: () => {
        closeFile(fileId);
        setConfirmationDialog((previous) => ({ ...previous, isOpen: false }));
      },
      onCancel: () =>
        setConfirmationDialog((previous) => ({ ...previous, isOpen: false })),
    });
  };

  const requestCloseAllFiles = () => {
    if (!hasUnsavedChanges) {
      closeAllFiles();
      return;
    }

    setConfirmationDialog({
      isOpen: true,
      title: "Close all files?",
      description: "Some files have unsaved changes that will be discarded.",
      onConfirm: () => {
        closeAllFiles();
        setConfirmationDialog((previous) => ({ ...previous, isOpen: false }));
      },
      onCancel: () =>
        setConfirmationDialog((previous) => ({ ...previous, isOpen: false })),
    });
  };

  const handleRunCode = useCallback(
    async (code: string, language: string) => {
      if (!instance) {
        toast.error("The runtime is still starting");
        return;
      }

      const normalizedLanguage = language.toLowerCase();
      if (
        !["js", "javascript", "jsx", "node"].some((value) =>
          normalizedLanguage.includes(value)
        )
      ) {
        toast.error("Run currently supports JavaScript snippets");
        return;
      }

      setRunOutput({ status: "running", content: "Running snippet..." });
      try {
        const process = await instance.spawn("node", ["-e", code]);
        let output = "";
        const outputPromise = process.output.pipeTo(
          new WritableStream({
            write(chunk) {
              output += chunk;
              setRunOutput({ status: "running", content: output });
            },
          })
        );
        const exitCode = await process.exit;
        await outputPromise;
        setRunOutput({
          status: exitCode === 0 ? "success" : "error",
          content: output || `Process exited with code ${exitCode}`,
        });
      } catch (error) {
        setRunOutput({
          status: "error",
          content: error instanceof Error ? error.message : "Snippet failed",
        });
      }
    },
    [instance]
  );

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }

  // No template data
  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-amber-600 mb-2">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        <TemplateFileTree
          data={templateData}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
          title="File Explorer"
          onAddFile={wrappedHandleAddFile}
          onAddFolder={wrappedHandleAddFolder}
          onDeleteFile={wrappedHandleDeleteFile}
          onDeleteFolder={wrappedHandleDeleteFolder}
          onRenameFile={wrappedHandleRenameFile}
          onRenameFolder={wrappedHandleRenameFolder}
        />

        <SidebarInset className="min-w-0 bg-[#0e0e0c] text-[#eeeae1]">
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex h-14 shrink-0 items-center gap-2 border-b border-white/8 bg-[#11110f] px-3"
          >
            <SidebarTrigger className="text-white/50 hover:bg-white/8 hover:text-white" />
            <Link
              href="/dashboard"
              className="hidden size-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/8 hover:text-white sm:flex"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="mr-2 h-5 w-px bg-white/8" />

            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                <h1 className="text-xs font-medium text-white/80">
                  {playgroundData?.title || "Code Playground"}
                </h1>
                <p className="font-mono text-[9px] text-white/30">
                  {openFiles.length} file(s) open
                  {hasUnsavedChanges && " • Unsaved changes"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSave()}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                      className="h-8 border border-white/8 bg-white/[0.03] px-2.5 text-white/50 hover:bg-white/8 hover:text-white"
                    >
                      <Save className="size-3.5" />
                      <span className="hidden text-[10px] sm:inline">Save</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save (Ctrl+S)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveAll}
                      disabled={!hasUnsavedChanges}
                      className="hidden h-8 border border-white/8 bg-white/[0.03] px-2.5 text-white/50 hover:bg-white/8 hover:text-white md:flex"
                    >
                      <Save className="size-3.5" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                </Tooltip>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPreviewVisible((visible) => !visible)}
                  className="h-8 border border-white/8 bg-white/[0.03] px-2.5 text-white/50 hover:bg-white/8 hover:text-white"
                >
                  {isPreviewVisible ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                  <span className="hidden text-[10px] lg:inline">
                    {isPreviewVisible ? "Hide preview" : "Show preview"}
                  </span>
                </Button>

                <ToggleAI
                  isEnabled={aiSuggestions.isEnabled}
                  onToggle={aiSuggestions.toggleEnabled}
                  suggestionLoading={aiSuggestions.isLoading}
                  cursorPosition={cursorPosition}
                  onRunCode={handleRunCode}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-8 border border-white/8 bg-white/[0.03] p-0 text-white/50 hover:bg-white/8 hover:text-white"
                    >
                      <Settings className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setAutoSaveEnabled((enabled) => !enabled)}
                    >
                      <Zap className="size-4" />
                      {autoSaveEnabled ? "Disable" : "Enable"} auto save
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={requestCloseAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.header>

          <div className="h-[calc(100vh-3.5rem)]">
            {openFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                {/* File Tabs */}
                <div className="border-b border-white/8 bg-[#0c0c0a]">
                  <Tabs
                    value={activeFileId || ""}
                    onValueChange={setActiveFileId}
                  >
                    <div className="flex min-h-10 items-end justify-between overflow-x-auto px-2">
                      <TabsList className="h-10 bg-transparent p-0">
                        {openFiles.map((file) => (
                          <TabsTrigger
                            key={file.id}
                            value={file.id}
                            className="group relative h-10 rounded-none border-x border-transparent px-3 font-mono text-[10px] text-white/35 shadow-none data-[state=active]:border-white/8 data-[state=active]:bg-[#11110f] data-[state=active]:text-white/75"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              <span>
                                {file.filename}.{file.fileExtension}
                              </span>
                              {file.hasUnsavedChanges && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="size-1.5 rounded-full bg-[#ff7043]"
                                />
                              )}
                              {file.id === activeFileId && (
                                <motion.span
                                  layoutId="active-file-tab"
                                  className="absolute inset-x-2 bottom-0 h-px bg-[#ff7043]"
                                />
                              )}
                              <span
                                className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  requestCloseFile(file.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {openFiles.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={requestCloseAllFiles}
                          className="mb-1 h-7 px-2 font-mono text-[9px] text-white/30 hover:bg-white/8 hover:text-white"
                        >
                          Close All
                        </Button>
                      )}
                    </div>
                  </Tabs>
                </div>

                {/* Editor and Preview */}
                <div className="flex-1">
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full"
                  >
                    <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                      <PlaygroundEditor
                        activeFile={activeFile}
                        content={activeFile?.content || ""}
                        onContentChange={(value) =>
                          activeFileId && updateFileContent(activeFileId, value)
                        }
                        suggestion={aiSuggestions.suggestion}
                        suggestionLoading={aiSuggestions.isLoading}
                        suggestionPosition={aiSuggestions.position}
                        onAcceptSuggestion={(editor, monaco) =>
                          aiSuggestions.acceptSuggestion(editor, monaco)
                        }
                        onRejectSuggestion={(editor) =>
                          aiSuggestions.rejectSuggestion(editor)
                        }
                        onTriggerSuggestion={(type, editor) =>
                          aiSuggestions.fetchSuggestion(type, editor)
                        }
                        onCursorPositionChange={setCursorPosition}
                      />
                    </ResizablePanel>

                    {isPreviewVisible && (
                      <>
                        <ResizableHandle className="w-px bg-white/8 after:bg-[#ff7043]" />
                        <ResizablePanel defaultSize={50}>
                          <WebContainerPreview
                            templateData={templateData}
                            instance={instance}
                            writeFileSync={writeFileSync}
                            isLoading={containerLoading}
                            error={containerError}
                            serverUrl={serverUrl!}
                            forceResetup={false}
                            projectId={id as string}
                          />
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </div>
                <StatusBar
                  isConnected={Boolean(instance) && !containerError}
                  hasUnsavedChanges={hasUnsavedChanges}
                  activeFile={
                    activeFile
                      ? `${activeFile.filename}.${activeFile.fileExtension}`
                      : undefined
                  }
                  lineNumber={cursorPosition.line}
                  columnNumber={cursorPosition.column}
                  language={activeFile?.fileExtension || "plaintext"}
                  autoSaveEnabled={autoSaveEnabled}
                  lastSaved={lastSaved}
                />
              </div>
            ) : (
              <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden text-white/35">
                <div className="dvx-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
                <div className="relative grid size-14 place-items-center rounded-2xl border border-white/8 bg-white/[0.025]">
                  <FileText className="size-6" />
                </div>
                <div className="relative text-center">
                  <p className="text-sm font-medium text-white/65">Select a file to begin</p>
                  <p className="mt-1 text-xs text-white/30">
                    The editor and live preview will stay in sync.
                  </p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>

      <AnimatePresence>
        {runOutput && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="fixed bottom-9 right-4 z-50 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/10 bg-[#11110f]/95 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-10 items-center justify-between border-b border-white/8 px-3">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
                <TerminalSquare className="size-3.5 text-[#ff7043]" />
                AI snippet output
                <span
                  className={`size-1.5 rounded-full ${
                    runOutput.status === "running"
                      ? "animate-pulse bg-[#dfa88f]"
                      : runOutput.status === "success"
                        ? "bg-[#9fc9a2]"
                        : "bg-red-400"
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={() => setRunOutput(null)}
                className="grid size-7 place-items-center rounded-md text-white/35 hover:bg-white/8 hover:text-white"
                aria-label="Close output"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap p-4 font-mono text-[11px] leading-5 text-white/65">
              {runOutput.content}
            </pre>
          </motion.aside>
        )}
      </AnimatePresence>

      <ConfirmationDialog
      isOpen={confirmationDialog.isOpen}
      title={confirmationDialog.title}
      description={confirmationDialog.description}
      onConfirm={confirmationDialog.onConfirm}
      onCancel={confirmationDialog.onCancel}
      setIsOpen={(open) => setConfirmationDialog((prev) => ({ ...prev, isOpen: open }))}
      />
      </>
    </TooltipProvider>
  );
};

export default MainPlaygroundPage;

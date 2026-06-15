"use client";

import React, { useEffect, useState, useRef } from "react";
import type { TemplateFolder } from "@/features/playground/libs/path-to-json";
import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle, Terminal as TerminalIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const TerminalComponent = dynamic(() => import("./terminal"), { ssr: false });
import { WebContainer } from "@webcontainer/api";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean;
  projectId?: string; // Track project switches
}

const WebContainerPreview: React.FC<WebContainerPreviewProps> = ({
  templateData,
  error,
  instance,
  isLoading,
  serverUrl,
  writeFileSync,
  forceResetup = false,
  projectId,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loadingState, setLoadingState] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  // Ref to access terminal methods
  const terminalRef = useRef<any>(null);

  // Track the active start process so we can kill it on project switch
  const startProcessRef = useRef<any>(null);

  // Track previous project ID to detect switches
  const prevProjectId = useRef<string | undefined>(projectId);

  // Reset everything when project changes
  useEffect(() => {
    if (prevProjectId.current !== projectId && prevProjectId.current !== undefined) {
      console.log(`[Preview] Project switched: ${prevProjectId.current} → ${projectId}. Resetting.`);
      
      // Kill any running server process from the old project
      if (startProcessRef.current) {
        try { startProcessRef.current.kill(); } catch (e) { /* ignore */ }
        startProcessRef.current = null;
      }

      // Reset all state
      setIsSetupComplete(false);
      setIsSetupInProgress(false);
      setPreviewUrl("");
      setSetupError(null);
      setCurrentStep(0);
      setLoadingState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
      });

      // Reset the terminal (clear all output from old project)
      if (terminalRef.current?.resetTerminal) {
        terminalRef.current.resetTerminal();
      }
    }
    prevProjectId.current = projectId;
  }, [projectId]);

  // Reset setup state when forceResetup changes
  useEffect(() => {
    if (forceResetup) {
      // Kill old server process
      if (startProcessRef.current) {
        try { startProcessRef.current.kill(); } catch (e) { /* ignore */ }
        startProcessRef.current = null;
      }

      setIsSetupComplete(false);
      setIsSetupInProgress(false);
      setPreviewUrl("");
      setCurrentStep(0);
      setLoadingState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
      });
    }
  }, [forceResetup]);

  useEffect(() => {
    async function setupContainer() {
      // Don't run setup if it's already complete or in progress
      if (!instance || isSetupComplete || isSetupInProgress) return;

      try {
        setIsSetupInProgress(true);
        setSetupError(null);

        // Check if server is already running by testing if files are already mounted
        try {
          const packageJsonExists = await instance.fs.readFile('package.json', 'utf8');
          if (packageJsonExists) {
            // Files are already mounted, just reconnect to existing server
            if (terminalRef.current?.writeToTerminal) {
              terminalRef.current.writeToTerminal("🔄 Reconnecting to existing WebContainer session...\r\n");
            }

            // Check if server is already running
            instance.on("server-ready", (port: number, url: string) => {
              console.log(`Reconnected to server on port ${port} at ${url}`);
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(`🌐 Reconnected to server at ${url}\r\n`);
              }
              setPreviewUrl(url);
              setLoadingState((prev) => ({
                ...prev,
                starting: false,
                ready: true,
              }));
              setIsSetupComplete(true);
              setIsSetupInProgress(false);
            });

            setCurrentStep(4);
            setLoadingState((prev) => ({ ...prev, starting: true }));
            return;
          }
        } catch (e) {
          // Files don't exist, proceed with normal setup
        }

        // Step 1: Transform data
        setLoadingState((prev) => ({ ...prev, transforming: true }));
        setCurrentStep(1);

        // Write to terminal
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("🔄 Transforming template data...\r\n");
        }

        // @ts-ignore
        const files = transformToWebContainerFormat(templateData);

        setLoadingState((prev) => ({
          ...prev,
          transforming: false,
          mounting: true,
        }));
        setCurrentStep(2);

        // Step 2: Mount files
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("📁 Mounting files to WebContainer...\r\n");
        }

        await instance.mount(files);

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("✅ Files mounted successfully\r\n");
        }

        setLoadingState((prev) => ({
          ...prev,
          mounting: false,
          installing: true,
        }));
        setCurrentStep(3);

        // Step 3: Install dependencies
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("📦 Installing dependencies...\r\n");
        }

        const installProcess = await instance.spawn("npm", ["install", "--no-audit", "--no-fund"]);

        // Stream install output to terminal
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              // Write directly to terminal
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(data);
              }
            },
          })
        );

        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error(`Failed to install dependencies. Exit code: ${installExitCode}`);
        }

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("✅ Dependencies installed successfully\r\n");
        }

        setLoadingState((prev) => ({
          ...prev,
          installing: false,
          starting: true,
        }));
        setCurrentStep(4);

        // Step 4: Start the server
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("🚀 Starting development server...\r\n");
        }

        // Determine start command by looking at package.json
        let startCommand = ["run", "start"];
        try {
          const pkgFile = (files as any)["package.json"]?.file?.contents;
          if (pkgFile) {
            const pkgInfo = JSON.parse(typeof pkgFile === "string" ? pkgFile : new TextDecoder().decode(pkgFile as Uint8Array));
            if (pkgInfo.scripts && pkgInfo.scripts.dev) {
              startCommand = ["run", "dev"];
            }
          }
        } catch(e) { 
          console.error("Could not parse package.json for start script prediction", e);
        }

        const startProcess = await instance.spawn("npm", startCommand);
        startProcessRef.current = startProcess; // Track for cleanup

        // Listen for server ready event
        instance.on("server-ready", (port: number, url: string) => {
          console.log(`Server ready on port ${port} at ${url}`);
          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(`🌐 Server ready at ${url}\r\n`);
          }
          setPreviewUrl(url);
          setLoadingState((prev) => ({
            ...prev,
            starting: false,
            ready: true,
          }));
          setIsSetupComplete(true);
          setIsSetupInProgress(false);
        });

        // Handle start process output - stream to terminal
        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(data);
              }
            },
          })
        );

      } catch (err) {
        console.error("Error setting up container:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(`❌ Error: ${errorMessage}\r\n`);
        }

        setSetupError(errorMessage);
        setIsSetupInProgress(false);
        setLoadingState({
          transforming: false,
          mounting: false,
          installing: false,
          starting: false,
          ready: false,
        });
      }
    }

    setupContainer();
  }, [instance, templateData, isSetupComplete, isSetupInProgress]);

  // Cleanup function on unmount — kill running processes
  useEffect(() => {
    return () => {
      if (startProcessRef.current) {
        try { startProcessRef.current.kill(); } catch (e) { /* ignore */ }
        startProcessRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#151512]">
        <div className="max-w-sm space-y-4 rounded-xl border border-white/8 bg-white/[0.025] p-6 text-center">
          <Loader2 className="mx-auto size-7 animate-spin text-[#ff7043]" />
          <h3 className="text-sm font-medium text-white/75">Starting runtime</h3>
          <p className="text-xs leading-5 text-white/35">
            Preparing an isolated browser environment for this project.
          </p>
        </div>
      </div>
    );
  }

  if (error || setupError) {
    return (
      <div className="flex h-full items-center justify-center bg-[#151512]">
        <div className="max-w-md rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-red-300">
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="size-5" />
            <h3 className="text-sm font-semibold">Runtime failed to start</h3>
          </div>
          <p className="text-xs leading-5 text-red-200/60">{error || setupError}</p>
        </div>
      </div>
    );
  }

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span className={`text-sm font-medium ${isComplete ? 'text-green-600' :
          isActive ? 'text-blue-600' :
            'text-gray-500'
        }`}>
        {label}
      </span>
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#151512]">
      {!previewUrl ? (
        <div className="flex h-full flex-col">
          <div className="mx-auto m-5 w-full max-w-md rounded-xl border border-white/8 bg-white/[0.025] p-6">
            <div className="mb-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">Runtime setup</p>
              <h3 className="mt-2 text-sm font-medium text-white/75">Preparing live preview</h3>
            </div>


            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2 mb-6"
            />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                {getStepIcon(1)}
                {getStepText(1, "Transforming template data")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(2)}
                {getStepText(2, "Mounting files")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(3)}
                {getStepText(3, "Installing dependencies")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(4)}
                {getStepText(4, "Starting development server")}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="min-h-0 flex-1 border-t border-white/8 p-3">
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      ) : (
        <div className="relative flex h-full flex-col">
          {/* Terminal Toggle Button */}
          <div className="absolute right-3 top-3 z-10 opacity-70 transition-opacity hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="h-8 gap-2 border border-black/10 bg-white/90 text-[#24231e] shadow-none hover:bg-white"
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              <span className="text-xs">{isTerminalOpen ? "Hide Terminal" : "Show Terminal"}</span>
            </Button>
          </div>

          {/* Preview */}
          <div className="min-h-0 flex-1 bg-white">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
            />
          </div>

          {/* Terminal at bottom when preview is ready */}
          <div className={`h-56 shrink-0 border-t border-white/8 ${!isTerminalOpen ? "hidden" : ""}`}>
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;

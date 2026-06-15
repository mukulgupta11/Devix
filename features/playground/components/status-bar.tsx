"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GitBranch, Wifi, WifiOff, AlertTriangle, CheckCircle, Zap } from "lucide-react"

interface StatusBarProps {
  isConnected: boolean
  hasUnsavedChanges: boolean
  activeFile?: string
  lineNumber?: number
  columnNumber?: number
  language?: string
  encoding?: string
  autoSaveEnabled?: boolean
  lastSaved?: Date
}

export function StatusBar({
  isConnected,
  hasUnsavedChanges,
  activeFile,
  lineNumber = 1,
  columnNumber = 1,
  language = "plaintext",
  encoding = "UTF-8",
  autoSaveEnabled = true,
  lastSaved,
}: StatusBarProps) {
  return (
    <div className="flex h-6 items-center justify-between border-t border-white/8 bg-[#0c0c0a] px-3 font-mono text-[9px] text-white/35">
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {isConnected ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
          <span className={isConnected ? "text-[#9fc9a2]" : "text-red-400"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Git Branch */}
        <div className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          <span>main</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Unsaved Changes */}
        {hasUnsavedChanges && (
          <>
            <div className="flex items-center gap-1 text-[#dfa88f]">
              <AlertTriangle className="h-3 w-3" />
              <span>Unsaved changes</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}

        {/* Auto Save Status */}
        {autoSaveEnabled && (
          <>
            <div className="flex items-center gap-1 text-[#9fbbe0]">
              <Zap className="h-3 w-3" />
              <span>Auto Save</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}

        {/* Last Saved */}
        {lastSaved && (
          <>
            <div className="flex items-center gap-1 text-[#9fc9a2]">
              <CheckCircle className="h-3 w-3" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Active File */}
        {activeFile && (
          <>
            <span className="font-medium">{activeFile}</span>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}

        {/* Cursor Position */}
        <span>
          Ln {lineNumber}, Col {columnNumber}
        </span>

        <Separator orientation="vertical" className="h-4" />

        {/* Language */}
        <Badge variant="secondary" className="h-4 text-xs">
          {language.toUpperCase()}
        </Badge>

        <Separator orientation="vertical" className="h-4" />

        {/* Encoding */}
        <span>{encoding}</span>
      </div>
    </div>
  )
}

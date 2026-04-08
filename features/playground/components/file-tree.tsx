"use client"

import { useState, useMemo } from "react"
import { ChevronRight, File, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FileItem {
  filename: string
  fileextension?: string
  content: string
  type: "file"
}

interface FolderItem {
  foldername: string
  items: (FileItem | FolderItem)[]
  type: "folder"
}

type FileSystemItem = FileItem | FolderItem

interface FileTreeProps {
  data: FileSystemItem
  onFileSelect: (file: FileItem) => void
  selectedFile?: FileItem
}

export function FileTree({ data, onFileSelect, selectedFile }: FileTreeProps) {
  return (
    <div className="w-full overflow-auto">
      <FileTreeNode item={data} onFileSelect={onFileSelect} selectedFile={selectedFile} level={0} />
    </div>
  )
}

interface FileTreeNodeProps {
  item: FileSystemItem
  onFileSelect: (file: FileItem) => void
  selectedFile?: FileItem
  level: number
}

function FileTreeNode({ item, onFileSelect, selectedFile, level }: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(level < 1)

  if (item.type === "file") {
    const isSelected =
      selectedFile && selectedFile.filename === item.filename && selectedFile.fileextension === item.fileextension

    const fileName = item.fileextension ? `${item.filename}.${item.fileextension}` : item.filename

    return (
      <div
        className={cn(
          "flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-accent/50 rounded-md",
          isSelected && "bg-accent text-accent-foreground",
        )}
        onClick={() => onFileSelect(item)}
      >
        <File className="h-4 w-4 mr-2 shrink-0" />
        <span className="truncate">{fileName}</span>
      </div>
    )
  }

  if (item.type === "folder") {
    const sortedItems = useMemo(() => {
      return [...item.items].sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1
        if (a.type === "folder" && b.type === "folder") return a.foldername.localeCompare(b.foldername)
        if (a.type === "file" && b.type === "file") {
          const aName = a.fileextension ? `${a.filename}.${a.fileextension}` : a.filename
          const bName = b.fileextension ? `${b.filename}.${b.fileextension}` : b.filename
          return aName.localeCompare(bName)
        }
        return 0
      })
    }, [item.items])

    return (
      <div>
        <Collapsible open={expanded} onOpenChange={setExpanded} className="w-full">
          <CollapsibleTrigger className="flex items-center py-1 px-2 text-sm w-full hover:bg-accent/50 rounded-md">
            <ChevronRight className={cn("h-4 w-4 mr-1 shrink-0 transition-transform", expanded && "rotate-90")} />
            <Folder className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{item.foldername}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 border-l border-border/50 ml-3 mt-1">
            {sortedItems.map((childItem, index) => (
              <FileTreeNode
                key={index}
                item={childItem}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                level={level + 1}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  return null
}

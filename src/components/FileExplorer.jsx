// components/FileExplorer.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Folder, File, Plus, MoreVertical } from 'lucide-react';

/**
 * FileExplorer - simple VS Code style file list
 *
 * Props:
 * - files: { filename: content }
 * - activeFile: string
 * - onFileOpen(name)
 * - onCreate(name)
 * - onRename(old, new)
 * - onDelete(name)
 * - onDuplicate(name)
 * - onDownload(name)
 */
export function FileExplorer({
  files = {},
  activeFile,
  onFileOpen,
  onCreate,
  onRename,
  onDelete,
  onDuplicate,
  onDownload,
}) {
  const [filter, setFilter] = useState("");
  const fileNames = Object.keys(files || {}).filter((f) => f.toLowerCase().includes(filter.toLowerCase()));

  const handleNew = () => {
    const name = prompt("New file name (include extension):", "untitled.js");
    if (!name) return;
    onCreate && onCreate(name);
  };

  const handleRename = (oldName) => {
    const newName = prompt("Rename file:", oldName);
    if (!newName || newName === oldName) return;
    onRename && onRename(oldName, newName);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4" />
          <h3 className="text-sm font-medium text-foreground">Explorer</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={handleNew} className="bg-transparent text-foreground hover:bg-muted">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-2 border-b border-border">
        <input
          placeholder="Filter files..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm border border-input"
        />
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1">
        {fileNames.length === 0 && <div className="text-xs text-muted-foreground px-2">No files</div>}
        {fileNames.map((name) => (
          <div
            key={name}
            className={`flex items-center justify-between gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-muted/40 ${name === activeFile ? "bg-muted/50" : ""}`}
          >
            <div className="flex items-center gap-2" onClick={() => onFileOpen && onFileOpen(name)}>
              <File className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{name}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => onDownload && onDownload(name)} className="bg-transparent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="bg-transparent">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-border">
                  <DropdownMenuItem onClick={() => onDuplicate && onDuplicate(name)}>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRename(name)}>Rename</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    if (confirm(`Delete ${name}?`)) onDelete && onDelete(name);
                  }}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border text-xs text-muted-foreground">
        Files are stored in your browser. Use Download to export.
      </div>
    </div>
  );
}

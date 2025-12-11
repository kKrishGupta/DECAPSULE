import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Play,
  Zap,
  Moon,
  Sun,
  FileCode,
  User,
  Loader2,
  ChevronDown,
  Bug,
} from "lucide-react";

/* ---------------- Language Config ---------------- */
const languageConfig = {
  javascript: { label: "JavaScript", extension: ".js", icon: "🟨" },
  python: { label: "Python", extension: ".py", icon: "🐍" },
  cpp: { label: "C++", extension: ".cpp", icon: "⚙️" },
  java: { label: "Java", extension: ".java", icon: "☕" },
};

export function Navbar({
  files = {},
  activeFile,
  onFileSelect,
  onNewFile,
  onRenameFile,
  onDeleteFile,
  onDuplicateFile,
  onSaveFile,
  onDownloadFile,
  onDownloadPDF,
  onUploadFile,
  onShareLink,

  onAutoFixClick,
  onRun,
  onDebugClick,
  isRunning,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  onProfileClick,
  isLoggedIn,
  currentUser,
}) {
  const currentLang = languageConfig[language];

  /* ---------------- New File State ---------------- */
  const [creating, setCreating] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");

  const startCreating = () => {
    setCreating(true);
    setTimeout(() => {
      const input = document.getElementById("newFileInput");
      if (input) input.focus();
    }, 20);
  };

  const handleCreate = () => {
    const name = newFileName.trim();
    if (!name) {
      setCreating(false);
      setNewFileName("");
      return;
    }

    onNewFile(name);

    setNewFileName("");
    setCreating(false);
    document.body.click(); // close dropdown
  };

  const handleClose = () => {
    setCreating(false);
    setNewFileName("");
    document.body.click();
  };

  /* ---------------- Rename State ---------------- */
  const [renaming, setRenaming] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState("");

  const startRenaming = () => {
    if (!activeFile) return;
    setRenaming(true);
    setRenameValue(activeFile);

    setTimeout(() => {
      const input = document.getElementById("renameInput");
      if (input) input.focus();
    }, 20);
  };

  const handleRename = () => {
    if (!renameValue) return;

    const newName = renameValue.trim();
    if (!newName) {
      setRenaming(false);
      setRenameValue("");
      return;
    }

    onRenameFile(activeFile, newName);

    setRenaming(false);
    setRenameValue("");
    document.body.click();
  };

  const handleCancelRename = () => {
    setRenaming(false);
    setRenameValue("");
    document.body.click();
  };

  /* ---------------- Upload File ---------------- */
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) onUploadFile(file);
    e.target.value = null;
  };

  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-8">

        {/* ---------------- LOGO ---------------- */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-1 flex items-center justify-center">
            <FileCode className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-tech font-semibold">DECAPSULE</h1>
        </div>

        {/* ---------------- FILE MENU ---------------- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              {activeFile}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-64 p-0">

            <div className="px-4 py-2 border-b text-xs font-semibold text-muted-foreground">
              Files
            </div>

            {/* FILE LIST */}
            <div className="max-h-60 overflow-auto">
              {Object.keys(files).map((file) => (
                <div
                  key={file}
                  onClick={() => onFileSelect(file)}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/40 ${
                    activeFile === file ? "bg-muted" : ""
                  }`}
                >
                  <span>{file}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(files[file]?.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            <DropdownMenuSeparator />

            {/* ---------------- NEW FILE ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={startCreating}
              className="px-4 py-2 cursor-pointer"
            >
              ➕ New File
            </DropdownMenuItem>

            {creating && (
              <div className="px-4 py-3">
                <input
                  id="newFileInput"
                  value={newFileName}
                  autoFocus
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") handleClose();
                  }}
                  placeholder="Enter filename (ex: main.js)"
                  className="w-full px-2 py-1 bg-muted rounded border border-border outline-none"
                />

                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-primary text-primary-foreground flex-1" onClick={handleCreate}>
                    Create
                  </Button>

                  <Button size="sm" variant="secondary" className="flex-1" onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------- RENAME ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={startRenaming}
              className="px-4 py-2 cursor-pointer"
            >
              ✏️ Rename
            </DropdownMenuItem>

            {renaming && (
              <div className="px-4 py-3">
                <input
                  id="renameInput"
                  value={renameValue}
                  autoFocus
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") handleCancelRename();
                  }}
                  placeholder="Enter new filename"
                  className="w-full px-2 py-1 bg-muted rounded border border-border outline-none"
                />

                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-primary text-primary-foreground flex-1" onClick={handleRename}>
                    Save
                  </Button>

                  <Button size="sm" variant="secondary" className="flex-1" onClick={handleCancelRename}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------- DUPLICATE ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => onDuplicateFile(activeFile)}
              className="px-4 py-2 cursor-pointer"
            >
              📑 Duplicate
            </DropdownMenuItem>

            {/* ---------------- DELETE ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => onDeleteFile(activeFile)}
              className="px-4 py-2 cursor-pointer"
            >
              🗑 Delete
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* ---------------- SAVE ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => onSaveFile(activeFile)}
              className="px-4 py-2 cursor-pointer"
            >
              💾 Save
            </DropdownMenuItem>

            {/* ---------------- DOWNLOAD FILE ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => onDownloadFile(activeFile)}
              className="px-4 py-2 cursor-pointer"
            >
              ⬇️ Download File
            </DropdownMenuItem>

            {/* ---------------- DOWNLOAD PDF ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => onDownloadPDF(activeFile)}
              className="px-4 py-2 cursor-pointer"
            >
              📄 Download PDF
            </DropdownMenuItem>

            {/* ---------------- SHARE LINK ---------------- */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => onShareLink(activeFile)}
              className="px-4 py-2 cursor-pointer"
            >
              🔗 Share Link
            </DropdownMenuItem>

            {/* ---------------- UPLOAD FILE ---------------- */}
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <label className="px-4 py-2 w-full cursor-pointer">
                📤 Upload File
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

        {/* ---------------- LANGUAGE SELECTOR ---------------- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="bg-muted">
              <span className="mr-2">{currentLang.icon}</span>
              {currentLang.label}
              <ChevronDown className="ml-1 w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {Object.entries(languageConfig).map(([key, config]) => (
              <DropdownMenuItem key={key} onClick={() => onLanguageChange(key)}>
                <span className="mr-2">{config.icon}</span>
                {config.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* ---------------- RIGHT SIDE BUTTONS ---------------- */}
      <div className="flex items-center gap-3">

        <Button onClick={onRun} disabled={isRunning} className="bg-primary text-primary-foreground">
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running…
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" /> Run
            </>
          )}
        </Button>

        <Button className="bg-amber-600 text-white" onClick={onDebugClick}>
          <Bug className="w-4 h-4 mr-2" /> Debug
        </Button>

        <Button className="bg-tertiary text-tertiary-foreground" onClick={onAutoFixClick}>
          <Zap className="w-4 h-4 mr-2" /> Auto-Fix
        </Button>

        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {theme === "dark" ? <Moon /> : <Sun />}
        </Button>

        {/* ---------------- PROFILE ---------------- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                </div>
                <DropdownMenuItem onClick={onProfileClick}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onProfileClick}>Logout</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={onProfileClick}>Login</DropdownMenuItem>
                <DropdownMenuItem onClick={onProfileClick}>Sign Up</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </nav>
  );
}

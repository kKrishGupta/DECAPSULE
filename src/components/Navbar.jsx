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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { AutoFixModal } from "@/components/AutoFixModal";

/* ---------------- Language Config ---------------- */
const languageConfig = {
  javascript: { label: "JavaScript", extension: ".js", icon: "🟨" },
  python: { label: "Python", extension: ".py", icon: "🐍" },
  cpp: { label: "C++", extension: ".cpp", icon: "⚙️" },
  java: { label: "Java", extension: ".java", icon: "☕" },
};

/* -------------- FILE EXTENSION → LANGUAGE ICON -------------- */
const getFileIcon = (fileName) => {
  if (!fileName) return "📄";
  const ext = fileName.split(".").pop().toLowerCase();

  if (ext === "js") return "🟨";
  if (ext === "py") return "🐍";
  if (["cpp", "cc", "cxx", "c++", "c"].includes(ext)) return "⚙️";
  if (ext === "java") return "☕";

  return "📄";
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

  onRun,
  onDebugClick,
  isRunning,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  onProfileClick,
  onLogout,
  isLoggedIn,
  currentUser,

  /* NEW: Autofix apply function */
  onApplyAutoFix,
}) {
  const currentLang = languageConfig[language];

  /* ---------------- RUN MODAL ---------------- */
  const [showInputModal, setShowInputModal] = React.useState(false);
  const [runInput, setRunInput] = React.useState("");
  const [isAutoFixing, setIsAutoFixing] = React.useState(false);

  const openRunModal = () => setShowInputModal(true);
  const submitRun = () => {
    setShowInputModal(false);
    onRun(activeFile, runInput);
  };

  /* ---------------- DEBUG MODAL ---------------- */
  const [showDebugModal, setShowDebugModal] = React.useState(false);
  const [debugInput, setDebugInput] = React.useState("");

  const openDebugModal = () => setShowDebugModal(true);
  const submitDebug = () => {
    setShowDebugModal(false);
    onDebugClick(activeFile, debugInput);
  };

  /* ---------------- AUTO FIX MODAL ---------------- */
  const [autoFixOpen, setAutoFixOpen] = React.useState(false);
  const [autoFixData, setAutoFixData] = React.useState(null);

  const handleAutoFix = async () => {
  if (!activeFile) return alert("No active file to fix!");

  setIsAutoFixing(true); // 🔥 Start loading

  const originalCode = files[activeFile]?.content || "";

  try {
      const base =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

      const response = await fetch(`${base}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: activeFile,
          code: originalCode,
          language: language,
        }),
      });


    const json = await response.json();
    const result = json?.result || {};

    const formatted = {
      before: originalCode,
      after: result.fix || originalCode,
      explanation: {
        problem:
          (result.issues && result.issues.join("\n")) ||
          "No problem description provided.",
        solution: "AI applied automated debugging and fix generation.",
        impact: {
          time: "N/A",
          space: "N/A",
          execution: result.runtime?.stderr
            ? "Execution error fixed"
            : "Execution unchanged",
        },
        full_text: result.explanation || "",
      },
    };

    setAutoFixData(formatted);
    setAutoFixOpen(true);
  } catch (err) {
    console.error("AutoFix failed:", err);
    alert("AutoFix backend error — check console");
  }

  setIsAutoFixing(false); // 🔥 Stop loading
};


  /* ---------------- FILE MENU STATES ---------------- */
  const [creating, setCreating] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");

  const startCreating = () => {
    setCreating(true);
    setTimeout(() => {
      document.getElementById("newFileInput")?.focus();
    }, 20);
  };

  const handleCreate = () => {
    const name = newFileName.trim();
    if (!name) return handleCloseCreate();
    onNewFile?.(name);
    handleCloseCreate();
  };

  const handleCloseCreate = () => {
    setCreating(false);
    setNewFileName("");
    document.body.click();
  };

  /* ---------------- RENAME ---------------- */
  const [renaming, setRenaming] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState("");

  const startRenaming = () => {
    if (!activeFile) return;
    setRenaming(true);
    setRenameValue(activeFile);

    setTimeout(() => {
      document.getElementById("renameInput")?.focus();
    }, 20);
  };

  const handleRename = () => {
    const newName = renameValue.trim();
    if (!newName) return handleCancelRename();
    onRenameFile?.(activeFile, newName);
    handleCancelRename();
  };

  const handleCancelRename = () => {
    setRenaming(false);
    setRenameValue("");
    document.body.click();
  };

  /* ---------------- UPLOAD ---------------- */
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) onUploadFile?.(file);
    e.target.value = null;
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-1 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-tech font-semibold">DECAPSULE</h1>
          </div>

          {/* FILE MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {getFileIcon(activeFile)} {activeFile}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-64 p-0">
              <div className="px-4 py-2 border-b text-xs font-semibold text-muted-foreground">
                Files
              </div>

              <div className="max-h-60 overflow-auto">
                {Object.keys(files).map((file) => (
                  <div
                    key={file}
                    onClick={() => onFileSelect?.(file)}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/40 ${
                      activeFile === file ? "bg-muted" : ""
                    }`}
                  >
                    <span>{getFileIcon(file)} {file}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(files[file]?.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

              <DropdownMenuSeparator />

              {/* NEW FILE */}
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
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreate();
                      if (e.key === "Escape") handleCloseCreate();
                    }}
                    className="w-full px-2 py-1 bg-muted border border-border rounded outline-none"
                    placeholder="main.cpp"
                  />

                  <div className="flex gap-2 mt-2">
                    <Button size="sm" className="bg-primary text-white flex-1" onClick={handleCreate}>
                      Create
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={handleCloseCreate}>
                      Close
                    </Button>
                  </div>
                </div>
              )}

              {/* RENAME */}
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
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") handleCancelRename();
                    }}
                    className="w-full px-2 py-1 bg-muted border border-border rounded outline-none"
                  />

                  <div className="flex gap-2 mt-2">
                    <Button size="sm" className="bg-primary text-white flex-1" onClick={handleRename}>
                      Save
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={handleCancelRename}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* DUPLICATE */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => onDuplicateFile?.(activeFile)}
                className="px-4 py-2 cursor-pointer"
              >
                📑 Duplicate
              </DropdownMenuItem>

              {/* DELETE */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => onDeleteFile?.(activeFile)}
                className="px-4 py-2 cursor-pointer"
              >
                🗑 Delete
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* SAVE */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => onSaveFile?.()}
                className="px-4 py-2 cursor-pointer"
              >
                💾 Save
              </DropdownMenuItem>

              {/* DOWNLOAD */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => onDownloadFile?.(activeFile)}
                className="px-4 py-2 cursor-pointer"
              >
                ⬇️ Download File
              </DropdownMenuItem>

              {/* PDF */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => onDownloadPDF?.(activeFile)}
                className="px-4 py-2 cursor-pointer"
              >
                📄 Download PDF
              </DropdownMenuItem>

              {/* SHARE */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => onShareLink?.()}
                className="px-4 py-2 cursor-pointer"
              >
                🔗 Share
              </DropdownMenuItem>

              {/* UPLOAD */}
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <label className="px-4 py-2 w-full cursor-pointer">
                  📤 Upload File
                  <input type="file" className="hidden" onChange={handleUpload} />
                </label>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

          {/* LANGUAGE SELECTOR */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-muted">
                <span className="mr-2">{currentLang.icon}</span>
                {currentLang.label}
                <ChevronDown className="ml-1 w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {Object.entries(languageConfig).map(([key, cfg]) => (
                <DropdownMenuItem key={key} onClick={() => onLanguageChange?.(key)}>
                  <span className="mr-2">{cfg.icon}</span>
                  {cfg.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* RUN */}
          <Button
            onClick={openRunModal}
            disabled={isRunning}
            className="bg-primary text-white"
          >
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

          {/* DEBUG */}
          <Button className="bg-amber-600 text-white" onClick={openDebugModal}>
            <Bug className="w-4 h-4 mr-2" /> Debug
          </Button>

          {/* AUTO FIX */}
          <Button
            className={`bg-tertiary text-tertiary-foreground flex items-center gap-2 ${
              isAutoFixing ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isAutoFixing}
            onClick={handleAutoFix}
          >
            {isAutoFixing ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Auto-Fixing…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Auto-Fix
              </>
            )}
          </Button>

          {/* THEME TOGGLE */}
          <Button variant="ghost" size="icon" onClick={onThemeToggle}>
            {theme === "dark" ? <Moon /> : <Sun />}
          </Button>

          {/* PROFILE */}
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
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.email}
                    </p>
                  </div>

                  <DropdownMenuItem onClick={onProfileClick}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={onProfileClick}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onProfileClick}>
                    Sign Up
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* ======================= RUN MODAL ======================= */}
      <Dialog open={showInputModal} onOpenChange={setShowInputModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Input</DialogTitle>
            <DialogDescription>
              Provide input for your program.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder='Example: {"code": "print(5)", "language": "python"}'
            value={runInput}
            onChange={(e) => setRunInput(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setShowInputModal(false)}
            >
              Cancel
            </Button>
            <Button className="bg-primary text-white" onClick={submitRun}>
              Run
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================= DEBUG MODAL ======================= */}
      <Dialog open={showDebugModal} onOpenChange={setShowDebugModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Debug Input</DialogTitle>
            <DialogDescription>
              Provide input object for debugging.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder='Example: {"code": "nums=[1,2];print(nums[5])"}'
            value={debugInput}
            onChange={(e) => setDebugInput(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDebugModal(false)}
            >
              Cancel
            </Button>
            <Button className="bg-amber-600 text-white" onClick={submitDebug}>
              Debug
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================= AUTO FIX MODAL ======================= */}
      <AutoFixModal
        open={autoFixOpen}
        onOpenChange={setAutoFixOpen}
        result={autoFixData}
        language={language}
        onApplyFix={(newCode) => onApplyAutoFix?.(newCode)}
      />
    </>
  );
}

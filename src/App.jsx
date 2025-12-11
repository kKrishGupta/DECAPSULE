// App.jsx  (complete file)
import React, { useState, useEffect, useRef } from "react";

// MAIN COMPONENTS
import { Navbar } from "./components/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { CodeEditor } from "./components/CodeEditor.jsx";
import { VisualizerPane } from "./components/VisualizerPane.jsx";
import { TimelineSlider } from "./components/TimelineSlider.jsx";
import { BottomPanels } from "./components/BottomPanels.jsx";
import { AutoFixModal } from "./components/AutoFixModal.jsx";
import { ProfileModal } from "./components/ProfileModal.jsx";

// PAGE VIEWS
import { Dashboard } from "./components/views/Dashboard.jsx";
import { Projects } from "./components/views/Projects.jsx";
import { Tests } from "./components/views/Tests.jsx";
import { Settings } from "./components/views/Settings.jsx";

// PDF Library
import jsPDF from "jspdf";

/* ------------------ DEFAULT SAMPLE FILES ------------------ */
const DEFAULT_FILES = {
  "fibonacci.js": {
    content: `function fibonacci(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(10));`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  "quicksort.js": {
    content: `function quicksort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => x < pivot);
  const mid = arr.filter((x) => x === pivot);
  const right = arr.filter((x) => x > pivot);
  return [...quicksort(left), ...mid, ...quicksort(right)];
}

console.log(quicksort([5, 3, 8, 1, 2]));`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  "graph-bfs.js": {
    content: `function bfs(start, graph){
  const visited = new Set();
  const q = [start];
  visited.add(start);

  while(q.length){
    const node = q.shift();
    console.log('visit', node);

    for(const nei of graph[node] || []){
      if(!visited.has(nei)){
        visited.add(nei);
        q.push(nei);
      }
    }
  }
}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

/* ------------------ LOCAL STORAGE ------------------ */
function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("decapsule_files_v1")) || null;
  } catch {
    return null;
  }
}
function saveToStorage(data) {
  try {
    localStorage.setItem("decapsule_files_v1", JSON.stringify(data));
  } catch {}
}

/* ------------------ Base64 Helpers ------------------ */
function base64EncodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function base64DecodeUnicode(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

/* ============================================================= */
/* ========================== APP =============================== */
/* ============================================================= */

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeVisualizer, setActiveVisualizer] = useState("recursion");
  const [autoFixOpen, setAutoFixOpen] = useState(false);
  const [selectedLine] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [activeView, setActiveView] = useState("debug");
  const [theme, setTheme] = useState("dark");
  const [codeContent, setCodeContent] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const totalSteps = 15;

  /* ------------------ Load Files ------------------ */
  const stored = loadFromStorage();
  const initialFiles = stored?.files || DEFAULT_FILES;
  const initialActive = stored?.activeFile || Object.keys(initialFiles)[0];

  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialActive);

  /* ------------------ Splitter ------------------ */
  const [editorPercent, setEditorPercent] = useState(75);
  const dragStateRef = useRef({ dragging: false, startX: 0, startPercent: 75 });
  const containerRef = useRef(null);

  const startDrag = (e) => {
    dragStateRef.current.dragging = true;
    dragStateRef.current.startX = e.clientX;
    dragStateRef.current.startPercent = editorPercent;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    e.preventDefault();
  };

  const onDrag = (e) => {
    if (!dragStateRef.current.dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStateRef.current.startX;
    const deltaPercent = (dx / rect.width) * 100;
    let next = dragStateRef.current.startPercent + deltaPercent;
    if (next < 30) next = 30;
    if (next > 90) next = 90;
    setEditorPercent(next);
  };

  const stopDrag = () => {
    dragStateRef.current.dragging = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  /* ------------------ Shared Code Loader ------------------ */
  const loadSharedCode = () => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("code");
    if (!encoded) return;

    try {
      const decodedJson = base64DecodeUnicode(decodeURIComponent(encoded));
      const decoded = JSON.parse(decodedJson);

      if (decoded.files) {
        setFiles(decoded.files);
        const af = decoded.activeFile || Object.keys(decoded.files)[0];
        setActiveFile(af);
        setCodeContent(decoded.files[af].content);
      }
    } catch (err) {
      console.error("Invalid link", err);
    }
  };

  useEffect(() => {
    loadSharedCode();
  }, []);

  /* ------------------ Share Link ------------------ */
  const generateShareLink = (filename) => {
    const fileToShare = filename || activeFile;
    const payload = {
      files: { [fileToShare]: files[fileToShare] },
      activeFile: fileToShare,
      theme: theme,
      createdAt: Date.now(),
    };

    const encoded = encodeURIComponent(base64EncodeUnicode(JSON.stringify(payload)));
    const link = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(link).catch(() => alert(link));
    alert("Share link copied:\n" + link);
  };

  /* ------------------ File Content Load ------------------ */
  useEffect(() => {
    if (activeFile && files[activeFile]) setCodeContent(files[activeFile].content);
  }, [activeFile, files]);

  /* ------------------ Auto Detect Language ------------------ */
  useEffect(() => {
    const ext = activeFile.split(".").pop();
    setLanguage(
      ext === "py"
        ? "python"
        : ["cpp", "c", "cc", "cxx"].includes(ext)
        ? "cpp"
        : ext === "java"
        ? "java"
        : "javascript"
    );
  }, [activeFile]);

  /* ------------------ Auto Save ------------------ */
  useEffect(() => {
    if (!activeFile) return;
    setFiles((prev) => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], content: codeContent },
    }));
  }, [codeContent]);

  /* ------------------ File Operations ------------------ */
  const STARTER_TEMPLATES = {
    js: `function main() {
  console.log("Hello JavaScript!");
}
main();`,

    py: `def main():
    print("Hello Python!")
if __name__ == "__main__":
    main()`,

    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello C++!";
    return 0;
}`,

    java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java!");
  }
}`,
  };

  const createFile = (name) => {
    if (!name.trim()) return;
    const ext = name.split(".").pop();
    const starter =
      ext === "py"
        ? STARTER_TEMPLATES.py
        : ["cpp", "c", "cc", "cxx"].includes(ext)
        ? STARTER_TEMPLATES.cpp
        : ext === "java"
        ? STARTER_TEMPLATES.java
        : STARTER_TEMPLATES.js;

    setFiles((prev) => ({
      ...prev,
      [name]: { content: starter, createdAt: Date.now(), updatedAt: Date.now() },
    }));

    setActiveFile(name);
    setCodeContent(starter);
  };

  const deleteFile = (name) => {
    if (Object.keys(files).length === 1) return alert("At least one file required!");

    const updated = { ...files };
    delete updated[name];

    const first = Object.keys(updated)[0];
    setFiles(updated);
    setActiveFile(first);
    setCodeContent(updated[first].content);
  };

  const duplicateFile = (name) => {
    const ext = name.match(/\.\w+$/)?.[0];
    const base = name.replace(ext, "");
    let newName = `${base}-copy${ext}`;
    let i = 1;
    while (files[newName]) newName = `${base}-copy-${i++}${ext}`;

    setFiles((prev) => ({
      ...prev,
      [newName]: { ...prev[name], updatedAt: Date.now() },
    }));

    setActiveFile(newName);
    setCodeContent(files[name].content);
  };

  /* ------------------ RENDER MAIN CONTENT ------------------ */
  const renderMainContent = () => {
    if (activeView === "dashboard") return <Dashboard />;
    if (activeView === "projects") return <Projects />;
    if (activeView === "tests") return <Tests isRunning={isRunning} onRun={() => {}} />;
    if (activeView === "settings") return <Settings />;

    /* -------- DEBUG VIEW (FIXED LAYOUT) -------- */
    return (
      <div className="flex flex-col flex-1 min-h-0">

        {/* ==== TOP AREA (420px) ==== */}
        <div
          ref={containerRef}
          className="flex overflow-hidden"
          style={{ height: "420px", minHeight: "420px", maxHeight: "420px" }}
        >
          {/* LEFT Editor */}
          <div
            className="min-w-0 flex flex-col border-r border-border"
            style={{
              width: `${editorPercent}%`,
              height: "420px",
              overflow: "hidden",
            }}
          >
            <div className="px-4 py-2 border-b bg-card text-sm font-semibold">
              Code Editor
            </div>

            <div className="flex-1 overflow-auto min-h-0">
              <CodeEditor codeContent={codeContent} onCodeChange={setCodeContent} language={language} />
            </div>
          </div>

          {/* DIVIDER */}
          <div
            onMouseDown={startDrag}
            className="w-1 cursor-col-resize bg-muted/40 hover:bg-muted"
            style={{ zIndex: 10 }}
          />

          {/* RIGHT Visualizer */}
          <div
            className="min-w-[300px] flex flex-col"
            style={{
              width: `${100 - editorPercent}%`,
              height: "420px",
              overflow: "hidden",
            }}
          >
            <VisualizerPane activeTab={activeVisualizer} onTabChange={setActiveVisualizer} />
          </div>
        </div>

        {/* TIMELINE */}
        <div className="border-t border-border">
          <TimelineSlider currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Bottom Panel 260px */}
        <div
          className="bg-surface border-t border-border"
          style={{ height: "260px", minHeight: "260px", maxHeight: "260px" }}
        >
          <div className="h-full overflow-auto">
            <BottomPanels selectedLine={selectedLine} />
          </div>
        </div>
      </div>
    );
  };

  /* ------------------ RETURN ------------------ */
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar
        files={files}
        activeFile={activeFile}
        onFileSelect={(f) => {
          setActiveFile(f);
          setCodeContent(files[f].content);
        }}
        onNewFile={createFile}
        onDeleteFile={deleteFile}
        onDuplicateFile={duplicateFile}
        onShareLink={() => generateShareLink(activeFile)}
        language={language}
        theme={theme}
        onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 min-h-0">{renderMainContent()}</main>
      </div>

      <AutoFixModal open={autoFixOpen} onOpenChange={setAutoFixOpen} />
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

export default App;

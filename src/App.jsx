// App.jsx
import React, { useState, useEffect } from "react";

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
import { DebugView } from "./components/views/DebugView.jsx";
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

/* ------------------ LOCAL STORAGE FUNCTIONS ------------------ */
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

/* ============================================================= */
/* ========================== APP =============================== */
/* ============================================================= */

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeVisualizer, setActiveVisualizer] = useState("recursion");
  const [autoFixOpen, setAutoFixOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [activeView, setActiveView] = useState("debug");
  const [theme, setTheme] = useState("dark");
  const [codeContent, setCodeContent] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const totalSteps = 15;

  /* ------------------ LOAD FILE SYSTEM ------------------ */
  const stored = loadFromStorage();
  const initialFiles = stored?.files || DEFAULT_FILES;
  const initialActive = stored?.activeFile || Object.keys(initialFiles)[0];

  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialActive);

  /* ------------------ Load Shared Code ------------------ */
  const loadSharedCode = () => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("code");

    if (!encoded) return;

    try {
      const decoded = JSON.parse(atob(decodeURIComponent(encoded)));

      if (decoded.files) {
        setFiles(decoded.files);
        setActiveFile(decoded.activeFile);
        setTheme(decoded.theme);

        setCodeContent(decoded.files[decoded.activeFile].content);

        console.log("Loaded shared code.");
      }
    } catch (err) {
      console.error("Invalid share link:", err);
    }
  };

  useEffect(() => {
    loadSharedCode();
  }, []);

  /* ------------------ Generate Share Link ------------------ */
  const generateShareLink = () => {
    const payload = {
      files,
      activeFile,
      theme,
    };

    const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
    const link = `${window.location.origin}?code=${encoded}`;

    navigator.clipboard.writeText(link);
    alert("Share Link Copied:\n\n" + link);
  };

  /* ------------------ LOAD ACTIVE FILE CONTENT ------------------ */
  useEffect(() => {
    if (activeFile && files[activeFile]) {
      setCodeContent(files[activeFile].content);
    }
  }, [activeFile, files]);

  /* ------------------ 🔥 AUTO-DETECT LANGUAGE FROM EXT ------------------ */
  useEffect(() => {
    if (!activeFile) return;

    const ext = activeFile.split(".").pop().toLowerCase();

    let detected = "javascript";
    if (ext === "js") detected = "javascript";
    else if (ext === "py") detected = "python";
    else if (["cpp", "c++", "cc", "cxx", "c"].includes(ext)) detected = "cpp";
    else if (ext === "java") detected = "java";

    setLanguage(detected);
  }, [activeFile]);

  /* ------------------ PERSIST STORAGE ------------------ */
  useEffect(() => {
    saveToStorage({ files, activeFile, theme });
  }, [files, activeFile, theme]);

  /* ------------------ AUTO-SAVE ------------------ */
  useEffect(() => {
    if (!activeFile) return;

    setFiles((prev) => ({
      ...prev,
      [activeFile]: {
        ...prev[activeFile],
        content: codeContent,
        updatedAt: Date.now(),
      },
    }));
  }, [codeContent]);

  /* ============================================================= */
  /* ===================== FILE OPERATIONS ======================== */
  /* ============================================================= */

  /* ---------- STARTER TEMPLATES (Option A) ---------- */
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
    cout << "Hello C++!" << endl;
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

    const filename = name.trim();
    if (files[filename]) return alert("File already exists!");

    const now = Date.now();
    const ext = filename.split(".").pop().toLowerCase();

    let starter = STARTER_TEMPLATES.js;
    if (ext === "py") starter = STARTER_TEMPLATES.py;
    else if (["cpp", "c++", "cc", "cxx", "c"].includes(ext))
      starter = STARTER_TEMPLATES.cpp;
    else if (ext === "java") starter = STARTER_TEMPLATES.java;

    setFiles((prev) => ({
      ...prev,
      [filename]: { content: starter, createdAt: now, updatedAt: now },
    }));

    setActiveFile(filename);
    setCodeContent(starter);
  };

  const renameFile = (oldName, newName) => {
    if (!oldName || !newName.trim()) return;
    if (files[newName]) return alert("File already exists!");

    setFiles((prev) => {
      const next = { ...prev };
      next[newName] = { ...prev[oldName], updatedAt: Date.now() };
      delete next[oldName];
      return next;
    });

    if (activeFile === oldName) {
      setActiveFile(newName);
      setCodeContent(files[oldName].content);
    }
  };

  const deleteFile = (name) => {
    if (!name || !files[name]) return;
    if (Object.keys(files).length === 1)
      return alert("At least one file required!");

    setFiles((prev) => {
      const next = { ...prev };
      delete next[name];

      const first = Object.keys(next)[0];
      setActiveFile(first);
      setCodeContent(next[first].content);

      return next;
    });
  };

  const duplicateFile = (name) => {
    const base = name.replace(/\.\w+$/, "");
    const ext = name.match(/\.\w+$/)?.[0] || "";
    let i = 1;
    let newName = `${base}-copy${ext}`;

    while (files[newName]) {
      newName = `${base}-copy-${i}${ext}`;
      i++;
    }

    const now = Date.now();

    setFiles((prev) => ({
      ...prev,
      [newName]: {
        ...prev[name],
        createdAt: now,
        updatedAt: now,
      },
    }));

    setActiveFile(newName);
    setCodeContent(files[name].content);
  };

  /* ---------------- SAVE WITH FILE PICKER ---------------- */
  const saveFile = async (name) => {
    try {
      const content = files[name]?.content || "";

      const options = {
        suggestedName: name,
        types: [
          {
            description: "Code Files",
            accept: {
              "text/plain": [
                ".js",
                ".py",
                ".cpp",
                ".java",
                ".txt",
                ".html",
                ".css",
              ],
            },
          },
        ],
      };

      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();

      await writable.write(content);
      await writable.close();

      alert("File saved successfully!");
    } catch (err) {
      console.warn("Save cancelled or failed:", err);
    }
  };

  /* ---------------- PDF DOWNLOAD ---------------- */
  const downloadPDF = (name) => {
    try {
      const content = files[name]?.content || "";
      const pdf = new jsPDF({ unit: "pt", format: "a4" });

      const lines = pdf.splitTextToSize(content, 550);
      pdf.text(lines, 30, 40);

      pdf.save(name.replace(/\.\w+$/, "") + ".pdf");
    } catch (err) {
      alert("Failed to download PDF");
      console.error(err);
    }
  };

  /* ---------------- DOWNLOAD PLAIN FILE ---------------- */
  const downloadFile = (name) => {
    const blob = new Blob([files[name].content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  };

  const uploadFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const now = Date.now();
      const content = e.target.result;

      setFiles((prev) => ({
        ...prev,
        [file.name]: { content, createdAt: now, updatedAt: now },
      }));

      setActiveFile(file.name);
      setCodeContent(content);
    };

    reader.readAsText(file);
  };

  /* ============================================================= */
  /* ======================= OLD FUNCTIONALITY ==================== */
  /* ============================================================= */

  const handleRun = () => {
    setIsRunning(true);
    setIsExecuted(false);
    setCurrentStep(0);

    setTimeout(() => {
      setIsRunning(false);
      setIsExecuted(true);
    }, 1000);
  };

  const handleDebug = () => {
    alert("Debug mode started!");
    setIsRunning(true);
    setIsExecuted(false);

    setTimeout(() => {
      setIsRunning(false);
      setIsExecuted(true);
    }, 1500);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;

      case "projects":
        return <Projects />;

      case "tests":
        return <Tests onRun={handleRun} isRunning={isRunning} />;

      case "settings":
        return <Settings />;

      case "debug":
      default:
        return (
          <>
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 border-r border-border">
                <CodeEditor
                  codeContent={codeContent}
                  onCodeChange={setCodeContent}
                />
              </div>

              <div className="w-2/5">
                <VisualizerPane
                  activeTab={activeVisualizer}
                  onTabChange={setActiveVisualizer}
                />
              </div>
            </div>

            <TimelineSlider currentStep={currentStep} totalSteps={totalSteps} />
            <BottomPanels selectedLine={selectedLine} />
          </>
        );
    }
  };

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
        onRenameFile={renameFile}
        onDeleteFile={deleteFile}
        onDuplicateFile={duplicateFile}
        onSaveFile={saveFile}
        onDownloadFile={downloadFile}
        onDownloadPDF={downloadPDF}
        onUploadFile={uploadFile}
        onShareLink={generateShareLink}
        onRun={handleRun}
        onDebugClick={handleDebug}
        isRunning={isRunning}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={() =>
          setTheme((t) => (t === "dark" ? "light" : "dark"))
        }
        onAutoFixClick={() => setAutoFixOpen(true)}
        onProfileClick={() => setProfileOpen(true)}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1">{renderMainContent()}</main>
      </div>

      <AutoFixModal
        open={autoFixOpen}
        onOpenChange={setAutoFixOpen}
        onApplyFix={(code) => {
          setFiles((prev) => ({
            ...prev,
            [activeFile]: { ...prev[activeFile], content: code },
          }));
          setCodeContent(code);
          setAutoFixOpen(false);
        }}
      />

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

export default App;

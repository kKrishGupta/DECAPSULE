import React, { useState, useEffect, useRef } from "react";

// MAIN COMPONENTS
import { Navbar } from "./components/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { CodeEditor } from "./components/CodeEditor.jsx";
import { VisualizerPane } from "./components/VisualizerPane.jsx";
import { TimelineSlider } from "./components/TimelineSlider.jsx";
import { BottomPanels } from "./components/BottomPanels.jsx";
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

    for(const nei of graph[node] || []) {
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

  // Visualizer tab state
  const [activeTab, setActiveTab] = useState("recursion");
  const [activeVisualizer, setActiveVisualizer] = useState("recursion");
  const [selectedLine, setSelectedLine] = useState(null);

  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false); // run executed flag
  const [activeView, setActiveView] = useState("debug");
  const [theme, setTheme] = useState("dark");
  const [codeContent, setCodeContent] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  /* ------------------ Bottom Panel Height ------------------ */
  const [bottomPanelHeight, setBottomPanelHeight] = useState(350);
  const dragBottomRef = useRef({ dragging: false, startY: 0, startHeight: 350 });

  const startBottomDrag = (e) => {
    dragBottomRef.current.dragging = true;
    dragBottomRef.current.startY = e.clientY;
    dragBottomRef.current.startHeight = bottomPanelHeight;
    document.addEventListener("mousemove", onBottomDrag);
    document.addEventListener("mouseup", stopBottomDrag);
    e.preventDefault();
  };

  const onBottomDrag = (e) => {
    if (!dragBottomRef.current.dragging) return;
    const dy = dragBottomRef.current.startY - e.clientY;
    let next = dragBottomRef.current.startHeight + dy;
    if (next < 150) next = 150;
    if (next > 600) next = 600;
    setBottomPanelHeight(next);
  };

  const stopBottomDrag = () => {
    dragBottomRef.current.dragging = false;
    document.removeEventListener("mousemove", onBottomDrag);
    document.removeEventListener("mouseup", stopBottomDrag);
  };

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
  useEffect(() => {
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
      console.warn("Failed to decode shared code:", err);
    }
  }, []);

  /* ------------------ SHARE LINK ------------------ */
  const generateShareLink = (filename) => {
    const fileToShare = filename || activeFile;
    const payload = {
      files: { [fileToShare]: files[fileToShare] },
      activeFile: fileToShare,
      theme,
      createdAt: Date.now(),
    };
    const encoded = encodeURIComponent(base64EncodeUnicode(JSON.stringify(payload)));
    const link = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(link).catch(() => alert(link));
    alert("Share link copied:\n" + link);
  };

  /* ------------------ Load Active File Content ------------------ */
  useEffect(() => {
    if (activeFile && files[activeFile]) setCodeContent(files[activeFile].content);
  }, [activeFile, files]);

  /* ------------------ Auto Detect Language ------------------ */
  useEffect(() => {
    const ext = (activeFile || "").split(".").pop();
    setLanguage(
      ext === "py"
        ? "python"
        : ["cpp", "c", "cc", "cxx", "c++"].includes(ext)
        ? "cpp"
        : ext === "java"
        ? "java"
        : "javascript"
    );
  }, [activeFile]);

  /* ------------------ Auto Save (Live Update) ------------------ */
  useEffect(() => {
    if (!activeFile) return;
    setFiles((prev) => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], content: codeContent },
    }));
  }, [codeContent]);

  /* ------------------ FILE OPERATIONS ------------------ */
  const STARTER_TEMPLATES = {
    js: `function main() { console.log("Hello JavaScript!"); }
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
    if (Object.keys(files).length === 1)
      return alert("At least one file required!");

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

  /* ------------------ SAVE FILE ------------------ */
  const saveFile = () => {
    setFiles((prev) => {
      const updated = {
        ...prev,
        [activeFile]: {
          ...prev[activeFile],
          content: codeContent,
          updatedAt: Date.now(),
        },
      };
      saveToStorage({
        files: updated,
        activeFile,
      });
      return updated;
    });

    alert("File saved successfully!");
  };

  /* ------------------ DOWNLOAD FILE AS TEXT ------------------ */
  const downloadFile = () => {
    if (!activeFile || !files[activeFile]) {
      alert("No file selected");
      return;
    }

    const content = files[activeFile].content;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile;
    a.click();

    URL.revokeObjectURL(url);
  };

  /* ------------------ DOWNLOAD FILE AS PDF ------------------ */
  const downloadPDF = () => {
    if (!activeFile || !files[activeFile]) {
      alert("No file selected");
      return;
    }

    const content = files[activeFile].content;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const lineHeight = 14;
    const leftMargin = 20;
    const topMargin = 20;
    const maxWidth = 550;

    const lines = pdf.splitTextToSize(content, maxWidth);

    pdf.setFont("Courier", "normal");
    pdf.setFontSize(10);

    let y = topMargin;
    lines.forEach((line) => {
      if (y > 800) {
        pdf.addPage();
        y = topMargin;
      }
      pdf.text(line, leftMargin, y);
      y += lineHeight;
    });

    pdf.save(activeFile.replace(/\.\w+$/, "") + ".pdf");
  };

  /* ------------------ UPLOAD FILE ------------------ */
  const uploadFile = async (file) => {
    try {
      const text = await file.text();
      const name = file.name;

      setFiles((prev) => ({
        ...prev,
        [name]: {
          content: text,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      }));

      setActiveFile(name);
      setCodeContent(text);

      alert(`File "${name}" uploaded successfully!`);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Could not upload the file.");
    }
  };

  /* ---------------------------------------------------------------- */
  /* ---------------------- RUN (NORMAL MODE) ------------------------ */
  /* ---------------------------------------------------------------- */

  const [outputText, setOutputText] = useState("");

  const handleRun = async (fileName, input = "") => {
    const codeFromFiles = files?.[fileName]?.content;
    const codeToSend =
      typeof codeFromFiles === "string" && codeFromFiles.length > 0
        ? codeFromFiles
        : codeContent;

    if (!codeToSend) {
      alert("No code to run!");
      return;
    }

    setIsRunning(true);
    setIsExecuted(false);
    setOutputText("Running...");

    try {
      const base = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${base}/run/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToSend,
          input: input || "",
        }),
      });

      const data = await res.json();

      let finalOutput = "";

      if (data.stdout) {
        finalOutput += data.stdout.replace(/\r\n/g, "\n");
      }

      if (data.stderr) {
        finalOutput += `\nError:\n${data.stderr}`;
      }

      if (typeof data.exit_code !== "undefined" && data.exit_code !== 0) {
        finalOutput += `\n\nExit Code: ${data.exit_code}`;
      }

      setOutputText(finalOutput.trim());
      setIsExecuted(true);
    } catch (err) {
      console.error("Run error:", err);
      setOutputText("Error running code");
      setIsExecuted(true);
    } finally {
      setIsRunning(false);
    }
  };

  /* ==================================================================== */
  /* ========================== DEBUG MODE (SSE) ========================= */
  /* ==================================================================== */

  const [debugData, setDebugData] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);

  // we keep the SSE connection here
  const streamRef = useRef(null);

  // deep merge helper for partial streaming patches
  const mergeDebug = (prev = {}, patch = {}) => {
    const next = { ...prev };
    for (const key of Object.keys(patch)) {
      const val = patch[key];
      if (Array.isArray(val)) {
        next[key] = Array.isArray(next[key]) ? [...next[key], ...val] : [...val];
      } else if (val && typeof val === "object" && !Array.isArray(val)) {
        next[key] = mergeDebug(next[key] || {}, val);
      } else {
        next[key] = val;
      }
    }
    return next;
  };

  // robust SSE JSON parser
  const parseSSEData = (raw) => {
    if (!raw) return null;
    let text = raw.trim();

    // strip "data:" prefix if present
    if (text.startsWith("data:")) {
      text = text.replace(/^data:\s*/i, "");
    }

    // find JSON boundaries
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first >= 0 && last > first) {
      text = text.substring(first, last + 1);
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      console.warn("SSE JSON parse failed:", text);
      return null;
    }
  };

  // start SSE streaming after POST
  const startEventStream = (sessionId = null) => {
    if (streamRef.current) {
      try { streamRef.current.close(); } catch {}
      streamRef.current = null;
    }

    const base = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    let url = `${base}/process_stream/stream`;

    // if server returned a session ID, attach it
    if (sessionId) {
      url += `?session_id=${encodeURIComponent(sessionId)}`;
    }

    const es = new EventSource(url);
    streamRef.current = es;

    es.addEventListener("open", () => {
      console.log("SSE connection opened:", url);
    });

    es.addEventListener("error", (ev) => {
      console.error("SSE error:", ev);
    });

    es.addEventListener("message", (ev) => {
      const parsed = parseSSEData(ev.data);

      if (!parsed || typeof parsed !== "object") {
        setOutputText((prev) =>
          prev ? prev + "\n" + ev.data : ev.data
        );
        return;
      }

      const stage = parsed.stage;
      const payload = parsed.payload ?? {};

      switch (stage) {
        case "classification":
          setDebugData((prev) => mergeDebug(prev, { classification: payload }));
          break;

        case "runtime_start":
          setDebugData((prev) =>
            mergeDebug(prev, { runtime: { started: true, meta: payload } })
          );
          break;

        case "runtime":
          setDebugData((prev) =>
            mergeDebug(prev, {
              runtime: { ...(prev?.runtime || {}), ...payload },
            })
          );

          setOutputText((prev) => {
            let next = prev || "";
            if (payload.stdout) {
              next += (next ? "\n" : "") + payload.stdout.replace(/\r\n/g, "\n");
            }
            if (payload.stderr) {
              next +=
                (next ? "\n" : "") +
                "Error:\n" +
                payload.stderr.replace(/\r\n/g, "\n");
            }
            return next;
          });
          break;

        case "analysis":
          setDebugData((prev) => mergeDebug(prev, { analysis: payload }));
          break;

        case "dp":
        case "dp_skipped":
          setDebugData((prev) => mergeDebug(prev, { dp: payload }));
          break;

        case "recursion_tree":
          setDebugData((prev) => mergeDebug(prev, { recursion_tree: payload }));
          break;

        case "issues":
          setDebugData((prev) => mergeDebug(prev, { issues: payload || [] }));
          break;

        case "explain_start":
          setDebugData((prev) =>
            mergeDebug(prev, { explanation_in_progress: true })
          );
          break;

        case "explanation":
          setDebugData((prev) =>
            mergeDebug(prev, { explanation: payload })
          );
          break;

        case "done":
          // merge everything final
          setDebugData((prev) => mergeDebug(prev, payload || {}));
          setIsExecuted(true);
          setIsDebugging(false);

          // handle final runtime output
          if (payload.runtime) {
            setOutputText((prev) => {
              let next = prev || "";
              if (payload.runtime.stdout) {
                next +=
                  (next ? "\n" : "") +
                  payload.runtime.stdout.replace(/\r\n/g, "\n");
              }
              if (payload.runtime.stderr) {
                next +=
                  (next ? "\n" : "") +
                  "Error:\n" +
                  payload.runtime.stderr.replace(/\r\n/g, "\n");
              }
              return next;
            });
          }

          try { es.close(); } catch {}
          streamRef.current = null;
          break;

        default:
          setDebugData((prev) =>
            mergeDebug(prev, { [stage || "unknown"]: payload })
          );
          break;
      }
    });
  };

  // cleanup on app unload
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        try { streamRef.current.close(); } catch {}
        streamRef.current = null;
      }
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* ------------------------ DEBUG HANDLER -------------------------- */
  /* ---------------------------------------------------------------- */

  const handleDebug = async (fileName, input = "") => {
    const codeFromFiles = files?.[fileName]?.content;
    const codeToSend =
      typeof codeFromFiles === "string" && codeFromFiles.length > 0
        ? codeFromFiles
        : codeContent;

    if (!codeToSend) {
      alert("No code to debug!");
      return;
    }

    setIsDebugging(true);
    setDebugData(null);
    setIsExecuted(false);
    setOutputText("");

    const base = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

    try {
      // send the code first
      const res = await fetch(`${base}/process_stream/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToSend,
          language,
          filename: fileName,
        }),
      });

      let sessionId = null;

      if (res.ok) {
        const json = await res.json();
        sessionId = json.session_id || null;
      }

      // now start SSE
      startEventStream(sessionId);
    } catch (err) {
      console.error("Debug POST error:", err);
      setIsDebugging(false);
      alert("Failed to start debug session.");
    }
  };

  /* ==================================================================== */
  /* =================== END OF SSE DEBUG SYSTEM ======================== */
  /* ==================================================================== */

  /* ==================================================================== */
  /* ============================ RENDER UI ============================== */
  /* ==================================================================== */

  return (
    <div className={`w-full h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      {/* ---------------- NAVBAR ---------------- */}
      <Navbar
        files={files}
        activeFile={activeFile}
        onFileSelect={setActiveFile}
        onNewFile={createFile}
        onRenameFile={(oldName, newName) => {
          if (!files[oldName]) return;
          const updated = { ...files };
          updated[newName] = { ...updated[oldName], updatedAt: Date.now() };
          delete updated[oldName];
          setFiles(updated);
          setActiveFile(newName);
          setCodeContent(updated[newName].content);
        }}
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
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        onProfileClick={() => setProfileOpen(true)}
        onLogout={() => setIsLoggedIn(false)}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />

      {/* ---------------- MAIN LAYOUT ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        {/* -------- SIDEBAR -------- */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((p) => !p)}
          activeView={activeView}
          onViewChange={setActiveView}
          onDebugClick={() => handleDebug(activeFile)}
        />

        {/* -------- CONTENT AREA -------- */}
        <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden">
          {/* Top half: Editor + Visualizer */}
          <div className="flex flex-1 relative overflow-hidden">
            {/* Editor */}
            <div
              className="h-full border-r border-border overflow-hidden"
              style={{ width: `${editorPercent}%` }}
            >
              <CodeEditor
                selectedLine={selectedLine}
                onLineClick={setSelectedLine}
                currentStep={currentStep}
                language={language}
                isExecuted={isExecuted}
                codeContent={codeContent}
                onCodeChange={setCodeContent}
                activeFile={activeFile}
              />
            </div>

            {/* Drag bar */}
            <div
              className="w-1 bg-border cursor-col-resize hover:bg-primary"
              onMouseDown={startDrag}
            />

            {/* Visualizer */}
            <div className="flex-1 overflow-hidden">
              <VisualizerPane
                activeTab={activeTab}
                onTabChange={setActiveTab}
                currentStep={currentStep}
                isExecuted={isExecuted}
                debugData={debugData}
              />
            </div>
          </div>

          {/* Drag for Bottom Panel */}
          <div
            className="w-full h-1 bg-border cursor-row-resize hover:bg-primary"
            onMouseDown={startBottomDrag}
          />

          {/* Bottom Panel */}
          <div
            className="w-full bg-card border-t border-border"
            style={{ height: bottomPanelHeight }}
          >
            <BottomPanels
              selectedLine={selectedLine}
              outputText={outputText}
              isExecuted={isExecuted}
              debugData={debugData}
              isDebugging={isDebugging}
            />
          </div>
        </div>
      </div>

      {/* ---------------- PROFILE MODAL ---------------- */}
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

export default App;


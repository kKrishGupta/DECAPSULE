import React, { useState, useEffect, useRef } from "react";

// MAIN COMPONENTS
import { Navbar } from "./components/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { CodeEditor } from "./components/CodeEditor.jsx";
import { VisualizerPane } from "./components/VisualizerPane.jsx";
import { TimelineSlider } from "./components/TimelineSlider.jsx";
import { BottomPanels } from "./components/BottomPanels.jsx";
import { ProfileModal } from "./components/ProfileModal.jsx";

// PAGE VIEWS (all .jsx)
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

  const [language, setLanguage] = useState("python");
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false); // run executed flag
  const [activeView, setActiveView] = useState("debug");
  const [theme, setTheme] = useState("dark");
  const [codeContent, setCodeContent] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const totalSteps = 15;
// /****************************************************** */
function buildRecursionTreeFromEvents(events = []) {
  if (!events.length) return null;

  const stack = [];
  let root = null;

  for (const e of events) {
    if (e.event === "call") {
      const node = {
        func: e.func_name,
        args: e.locals || {},
        children: [],
        return: null,
      };

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(node);
      } else {
        root = node;
      }

      stack.push(node);
    }

    if (e.event === "return") {
      const node = stack.pop();
      if (node) {
        node.return = e.return_value;
      }
    }
  }

  return root;
}
// ******************************************************************************

    // ----------- VIEW RENDERING SWITCH -----------
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
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
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

              <div className="w-full lg:w-2/5 flex flex-col overflow-hidden">
                <VisualizerPane
                  activeTab={activeVisualizer}
                  onTabChange={setActiveVisualizer}
                  currentStep={currentStep}
                  isExecuted={isExecuted}
                  debugData={debugData}
                />
              </div>
            </div>

            <TimelineSlider
              currentStep={currentStep}
              totalSteps={totalSteps}
              onStepChange={setCurrentStep}
              isExecuted={isExecuted}
            />

            <BottomPanels
              selectedLine={selectedLine}
              currentStep={currentStep}
              language={language}
              isExecuted={isExecuted}
              debugData={debugData}
              isDebugging={isDebugging}
            />
          </>
        );
    }
  };

  // Auto-login from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dec_user");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Failed to load user from storage", err);
      }
    }
  }, []);


// login and signup 
function extractUsername(email) {
  if (!email) return "User";
  return email.split("@")[0];  
}

// LOGIN
const handleLogin = (email, password) => {
  const username = extractUsername(email);

  const user = {
    name: username,
    email,
  };

  setIsLoggedIn(true);
  setCurrentUser(user);

  // Save to localStorage 
  localStorage.setItem("dec_user", JSON.stringify(user));

  return true;
};


// SIGNUP
const handleSignup = (name, email, pass, confirmPass) => {
  if (pass !== confirmPass) {
    alert("Passwords do not match");
    return false;
  }

  const username = name || extractUsername(email);

  const user = {
    name: username,
    email,
  };

  setIsLoggedIn(true);
  setCurrentUser(user);

  // Save to localStorage
  localStorage.setItem("dec_user", JSON.stringify(user));

  return true;
};


// LOGOUT
const handleLogout = () => {
  setIsLoggedIn(false);
  setCurrentUser(null);
  localStorage.removeItem("dec_user");
};



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

  if (ext === "py") {
    setLanguage("python");
  }
  // else if (["cpp", "c", "cc"].includes(ext)) {
  //   setLanguage("cpp");
  // }
  // else if (ext === "java") {
  //   setLanguage("java");
  // }
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
  // js: `function main() {
  //   console.log("Hello JavaScript!");
  // }
  // main();`,

  py: `def main():
    print("Hello Python!")

if __name__ == "__main__":
    main()`,

  // cpp: `#include <bits/stdc++.h>
  // using namespace std;
  // int main() {
  //     cout << "Hello C++!";
  //     return 0;
  // }`,

  // java: `public class Main {
  //   public static void main(String[] args) {
  //     System.out.println("Hello Java!");
  //   }
  // }`,
};


  const createFile = (name) => {
  if (!name.trim()) return;

  const ext = name.split(".").pop();

  const starter =
    ext === "py"
      ? STARTER_TEMPLATES.py
      : null
      // : ["cpp", "c", "cc", "cxx"].includes(ext)
      // ? STARTER_TEMPLATES.cpp
      // : ext === "java"
      // ? STARTER_TEMPLATES.java
      // : STARTER_TEMPLATES.js;

  // ❌ Block non-python files for now
  if (!starter) {
    alert("Only Python (.py) files are supported right now.");
    return;
  }

  setFiles((prev) => ({
    ...prev,
    [name]: {
      content: starter,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
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

  const [debugData, setDebugData] = useState({});
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
  const code = files?.[fileName]?.content || codeContent;
  if (!code) {
    alert("No code to debug!");
    return;
  }

  setIsDebugging(true);
  setIsExecuted(false);
  setDebugData({});
  setOutputText("");

  const base =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const res = await fetch(`${base}/process_stream/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, input }),
  });

  if (!res.body) {
    alert("Streaming not supported");
    setIsDebugging(false);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop();

    for (const evt of events) {
      const line = evt.split("\n").find(l => l.startsWith("data:"));
      if (!line) continue;

      let parsed;
      try {
        parsed = JSON.parse(line.replace("data:", "").trim());
      } catch {
        continue;
      }

      const { stage, payload } = parsed;

      console.group(`🟢 ${stage}`);
      console.log(payload);
      console.groupEnd();

      setDebugData(prev => {
        const next = { ...prev };

        switch (stage) {

          /* ================= CLASSIFICATION ================= */
          case "classification":
            next.classification = payload;
            break;

          /* ================= RECURSION ================= */
              case "recursion": {
                const events = payload?.events || [];

                next.recursion = {
                  events,
                  tree:
                    payload.tree ||
                    buildRecursionTreeFromEvents(events),
                };
                break;
              }

              case "recursion_error": {
                try {
                  const raw = payload?.raw_stdout || "";

                  // ✅ SAFEST WAY: extract LAST valid JSON block only
                  const match = raw.match(/{[\s\S]*}$/);
                  if (!match) break;

                  const recovered = JSON.parse(match[0]);
                  const events = recovered.events || [];

                  if (!events.length) break;

                  next.recursion = {
                    events,
                    tree: buildRecursionTreeFromEvents(events),
                  };
                } catch (err) {
                  console.error("❌ Failed to recover recursion JSON", err);
                }
                break;
              }

          /* ================= DP ================= */
          case "dp_start":
            next.dp = { table: null };
            break;

          case "dp_step": {
            const rawTable = payload.table || {};

            const entries = Object.entries(rawTable)
              .map(([k, v]) => [Number(k), v])
              .sort((a, b) => a[0] - b[0]);

            const indexRow = entries.map(([i]) => i);
            const valueRow = entries.map(([, v]) => v);

            next.dp = {
              table: [indexRow, valueRow],
            };
            break;
          }

          /* ================= GRAPH ================= */
          case "graph_start":
            next.graph = { steps: [] };
            break;

          case "graph_step":
            next.graph = {
              ...(prev.graph || { steps: [] }),
              steps: [...(prev.graph?.steps || []), payload],
            };
            break;

          /* ================= OTHERS ================= */
          case "issues":
            next.issues = payload || [];
            break;

          case "explanation":
            next.explanation = payload;
            break;

          case "done":
            setIsExecuted(true);
            setIsDebugging(false);
            return prev; // ⛔ keep last state
        }

        return next;
      });
    }
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
      codeContent={codeContent}
      isDebugging={isDebugging}   // 🔥 ADD THIS
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
  isLoggedIn={isLoggedIn}
  currentUser={currentUser}
  onLogout={handleLogout}
    />

    {/* ---------------- MAIN LAYOUT ---------------- */}
    <div className="flex flex-1 overflow-hidden">

      {/* -------- SIDEBAR -------- */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        activeView={activeView}
        onViewChange={setActiveView}
         onDebugClick={() => setActiveView("debug")} // ✔ correct

      />

      {/* -------- CONTENT AREA -------- */}
      <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden">

        {activeView !== "debug" ? (
          /* ========== NON-DEBUG VIEWS (Dashboard, Projects, Tests, Settings) ========== */
          <main className="flex-1 overflow-hidden">
            {renderMainContent()}
          </main>
        ) : (
          /* ========== DEBUG VIEW UI ========== */
          <>
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
                currentStep={currentStep}   // ✅ ADD THIS
              />
            </div>
          </>
        )}

      </div>
    </div>

    {/* ---------------- PROFILE MODAL ---------------- */}
    <ProfileModal
  open={profileOpen}
  onOpenChange={setProfileOpen}
  isLoggedIn={isLoggedIn}
  currentUser={currentUser}
  onLogin={handleLogin}
  onSignup={handleSignup}
  onLogout={handleLogout}
/>

  </div>
)};

export default App;


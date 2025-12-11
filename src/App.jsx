import React, { useState, useEffect } from "react";

// MAIN COMPONENTS (all .jsx)
import { Navbar } from "./components/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { CodeEditor } from "./components/CodeEditor.jsx";
import { VisualizerPane } from "./components/VisualizerPane.jsx";
import { TimelineSlider } from "./components/TimelineSlider.jsx";
import { BottomPanels } from "./components/BottomPanels.jsx";
import { AutoFixModal } from "./components/AutoFixModal.jsx";
import { ProfileModal } from "./components/ProfileModal.jsx";

// PAGE VIEWS (all .jsx)
import { Dashboard } from "./components/views/Dashboard.jsx";
import { Projects } from "./components/views/Projects.jsx";
import { Tests } from "./components/views/Tests.jsx";
import { DebugView } from "./components/views/DebugView.jsx";
import { Settings } from "./components/views/Settings.jsx";

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

  const totalSteps = 15;

  const handleRun = () => {
    setIsRunning(true);
    setIsExecuted(false);
    setCurrentStep(0);

    setTimeout(() => {
      setIsRunning(false);
      setIsExecuted(true);
    }, 1000);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleApplyFix = (fixedCode) => {
    setCodeContent(fixedCode);
    setAutoFixOpen(false);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (newTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.add("light");
  }, []);

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
                />
              </div>

              <div className="w-full lg:w-2/5 flex flex-col overflow-hidden">
                <VisualizerPane
                  activeTab={activeVisualizer}
                  onTabChange={setActiveVisualizer}
                  currentStep={currentStep}
                  isExecuted={isExecuted}
                />
              </div>
            </div>

            <div className="border-t border-border">
              <TimelineSlider
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepChange={setCurrentStep}
                isExecuted={isExecuted}
              />
            </div>

            <div className="border-t border-border">
              <BottomPanels
                selectedLine={selectedLine}
                currentStep={currentStep}
                language={language}
                isExecuted={isExecuted}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Navbar
        onAutoFixClick={() => setAutoFixOpen(true)}
        onRun={handleRun}
        isRunning={isRunning}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onProfileClick={() => setProfileOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={handleToggleSidebar}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {renderMainContent()}
        </main>
      </div>

      <AutoFixModal
        open={autoFixOpen}
        onOpenChange={setAutoFixOpen}
        language={language}
        onApplyFix={handleApplyFix}
      />

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

export default App;

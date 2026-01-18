import React, { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CodeEditor({
  selectedLine,
  onLineClick,
  currentStep,
  language,
  isExecuted,
  codeContent,
  onCodeChange,
  activeFile,
  timeline,
}) {
  const editorRef = useRef(null);

  /* ---------------- Mount ---------------- */
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Python indentation & formatting
    monaco.languages.setLanguageConfiguration("python", {
      indentationRules: {
        increaseIndentPattern: /:\s*$/,
        decreaseIndentPattern: /^\s*(return|pass|break|continue)/,
      },
    });

    // Highlight active line click
    editor.onMouseDown((e) => {
      if (e.target.position) {
        onLineClick?.(e.target.position.lineNumber);
      }
    });
  };

  /* ---------------- Active Debug Line ---------------- */
  const decorations = useMemo(() => {
    const evt = timeline?.[currentStep];
    if (!evt?.lineno) return [];

    return [
      {
        range: {
          startLineNumber: evt.lineno,
          endLineNumber: evt.lineno,
          startColumn: 1,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "bg-primary/20",
        },
      },
    ];
  }, [timeline, currentStep]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.deltaDecorations([], decorations);
    }
  }, [decorations]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-6 py-3 border-b border-border">
        <h2 className="text-sm font-medium">Code Editor</h2>
      </div>

      <ScrollArea className="flex-1">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={codeContent}
          onChange={(value) => onCodeChange(value ?? "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            minimap: { enabled: false },
            wordBasedSuggestions: true,
            autoIndent: "full",
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            tabSize: 4,
            insertSpaces: true,
            readOnly: isExecuted,
            smoothScrolling: true,
          }}
        />
      </ScrollArea>
    </div>
  );
}

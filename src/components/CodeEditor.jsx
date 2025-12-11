import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const codeExamples = {
  javascript: `function fibonacci(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(10));`,
  python: `def fibonacci(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

print(fibonacci(10))`,
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

export function CodeEditor({
  selectedLine,
  onLineClick,
  currentStep,
  language,
  isExecuted,
  codeContent,
  onCodeChange,
  activeFile,
}) {
  const editorRef = React.useRef(null);
  const lineRef = React.useRef(null);

  const safeCode =
    typeof codeContent === "string"
      ? codeContent
      : codeExamples[language] || "";

  // 🔥 Draw line numbers WITHOUT React
  const updateLineNumbers = (text) => {
    if (!lineRef.current) return;
    const count = (text || "").split("\n").length;

    let html = "";
    for (let i = 1; i <= count; i++) html += i + "\n";

    lineRef.current.textContent = html;
  };

  // Load file / change language
  React.useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.innerText = safeCode;
    updateLineNumbers(safeCode);
  }, [activeFile, language]);

  // Highlight running line
  const executingLine = isExecuted
    ? Math.min(Math.floor(currentStep / 2) + 1, safeCode.split("\n").length)
    : null;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-6 py-3 border-b border-border flex justify-between">
        <h2 className="text-sm font-medium">Code Editor</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="relative w-full h-full font-mono text-sm">

          {/* ⭐ FINAL NON-FLICKER LINE NUMBER PANEL */}
          <pre
            ref={lineRef}
            className="
              absolute top-0 left-0
              w-12
              bg-background
              border-r border-border
              text-right pr-2 pt-2
              text-muted-foreground
              select-none
              whitespace-pre
              leading-6
            "
          />

          {/* ⭐ EDITABLE CODE BOX */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const text = e.currentTarget.innerText;
              onCodeChange(text);
              updateLineNumbers(text);
            }}
            onClick={() => {
              const sel = window.getSelection();
              const pos = sel.anchorOffset;
              const txt = editorRef.current.innerText;
              const line = txt.substring(0, pos).split("\n").length;
              onLineClick?.(line);
            }}
            className="
              pl-14
              pr-4
              py-2
              whitespace-pre-wrap
              break-words
              outline-none
              min-h-full
              text-foreground
              leading-6
              cursor-text
            "
            spellCheck="false"
          />

          {/* RUNNING LINE HIGHLIGHT */}
          {executingLine && (
            <div
              className="absolute left-0 right-0 bg-primary/10 animate-pulse-glow"
              style={{
                top: (executingLine - 1) * 24,
                height: 24,
                zIndex: -1,
              }}
            />
          )}

        </div>
      </ScrollArea>
    </div>
  );
}

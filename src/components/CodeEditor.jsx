import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const codeExamples = {
  javascript: `function fibonacci(n, memo = {}) {
  // Base cases
  if (n <= 1) return n;
  
  // Check if already computed
  if (memo[n]) return memo[n];
  
  // Recursive computation with memoization
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  
  return memo[n];
}

// Test execution
const result = fibonacci(10);
console.log('Fibonacci(10):', result);`,

  python: `def fibonacci(n, memo=None):
    # Initialize memo dictionary
    if memo is None:
        memo = {}
    
    # Base cases
    if n <= 1:
        return n
    
    # Check if already computed
    if n in memo:
        return memo[n]
    
    # Recursive computation with memoization
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    
    return memo[n]

# Test execution
result = fibonacci(10)
print(f'Fibonacci(10): {result}')`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello C++!";
    return 0;
}`,

  java: `import java.util.HashMap;
import java.util.Map;

public class Fibonacci {
    public static int fibonacci(int n, Map<Integer, Integer> memo) {
        // Base cases
        if (n <= 1) return n;
        
        // Check if already computed
        if (memo.containsKey(n)) {
            return memo.get(n);
        }
        
        // Recursive computation with memoization
        int result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
        memo.put(n, result);
        
        return result;
    }
    
    public static void main(String[] args) {
        Map<Integer, Integer> memo = new HashMap<>();
        int result = fibonacci(10, memo);
        System.out.println("Fibonacci(10): " + result);
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
}) {
  const editorRef = React.useRef(null);

  // 🛡 SAFE STRING ALWAYS
  const safeCode =
    typeof codeContent === "string"
      ? codeContent
      : codeExamples[language] || "";

  const lines = safeCode.split("\n");

  // RUNNING LINE HIGHLIGHT
  const executingLine =
    isExecuted
      ? Math.min(Math.floor(currentStep / 2) + 1, lines.length)
      : null;

  // ⭐ FIX: RESET EDITOR ON FILE TYPE / CONTENT CHANGE
  React.useEffect(() => {
    if (editorRef.current) {
      // Clear previous content first
      editorRef.current.textContent = "";

      // Insert updated template or code
      editorRef.current.textContent = safeCode;
    }
  }, [safeCode, language]); // 🔥 IMPORTANT FIX

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-6 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Code Editor</h2>
        {!isExecuted && (
          <span className="text-xs text-muted-foreground">
            Click Run to start debugging
          </span>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="relative w-full h-full font-mono text-sm">

          {/* LEFT LINE NUMBERS */}
          <div
            className="absolute top-0 left-0 w-12 bg-background border-r border-border text-right pr-2 pt-2 text-muted-foreground select-none"
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* EDITOR */}
          <div
            ref={editorRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={(e) => onCodeChange(e.currentTarget.innerText)}
            onClick={(e) => {
              const text = editorRef.current.innerText;
              const pos = window.getSelection().anchorOffset;
              const line = text.substring(0, pos).split("\n").length;
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

          {/* EXECUTING LINE HIGHLIGHT */}
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

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

  cpp: `#include <iostream>
#include <unordered_map>
using namespace std;

int fibonacci(int n, unordered_map<int, int>& memo) {
    // Base cases
    if (n <= 1) return n;
    
    // Check if already computed
    if (memo.find(n) != memo.end()) {
        return memo[n];
    }
    
    // Recursive computation with memoization
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    
    return memo[n];
}

int main() {
    unordered_map<int, int> memo;
    int result = fibonacci(10, memo);
    cout << "Fibonacci(10): " << result << endl;
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
  // 🔥 ALWAYS SAFE STRING (CRASH FIX)
  const safeCode =
    typeof codeContent === "string"
      ? codeContent
      : codeExamples[language] || "";

  const lines = safeCode.split("\n");

  const executingLine =
    isExecuted
      ? Math.min(Math.floor(currentStep / 2) + 1, lines.length)
      : null;

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
        <div className="font-mono text-sm">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isExecuting = lineNumber === executingLine;
            const isSelected = lineNumber === selectedLine;

            return (
              <div
                key={index}
                onClick={() => onLineClick(lineNumber)}
                className={`flex hover:bg-muted/50 cursor-pointer transition-colors ${
                  isExecuting ? "bg-primary/10 animate-pulse-glow" : ""
                } ${isSelected ? "bg-secondary/10" : ""}`}
              >
                <div className="w-12 flex-shrink-0 text-right pr-4 py-2 text-muted-foreground select-none border-r border-border">
                  {lineNumber}
                </div>

                <div className="flex-1 px-4 py-2">
                  <pre className="text-foreground whitespace-pre-wrap break-words">
                    <code>{line || " "}</code>
                  </pre>
                </div>

                {isExecuting && <div className="w-1 bg-primary animate-pulse-glow" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

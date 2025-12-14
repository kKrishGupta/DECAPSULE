# 🚀 DECAPSULE
### AI-Powered Code Debugging & Algorithm Visualization Engine

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://decapsule-git-main-krish-guptas-projects-5351c1cf.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-teal?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](LICENSE)

> **Smart · Fast · Interactive · Built for Developers**

---

## 🧠 What does DECAPSULE mean?

**DECAPSULE = De + Capsule**

To break open a capsule and reveal what’s happening inside.
In programming terms, Decapsule breaks open your code and exposes:

* **Hidden execution flow**
* **Call stacks & Recursion depth**
* **Dynamic Programming tables**
* **Logical bugs & Algorithmic behavior**

Instead of treating code as a black box, **Decapsule opens it step-by-step.**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Why Decapsule is Different](#-why-decapsule-is-different)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-endpoints)
- [Limitations & Roadmap](#-current-limitations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Decapsule** is a full-stack AI debugging and analysis engine. It safely executes code in a sandbox, classifies algorithmic intent (Recursion, DP, Graph), and streams real-time visualizations to the frontend.

It doesn't just run code; it **understands** it using AST analysis and Groq AI to generate teacher-level explanations and auto-fixes.

---

## 🔥 Why Decapsule is Different

Unlike typical code runners or AI chat tools, Decapsule combines the best of all worlds:

| Feature | Standard Runners | AI Chatbots | **Decapsule** |
| :--- | :---: | :---: | :---: |
| **Static Analysis** | ❌ | ❌ | ✅ |
| **Runtime Tracing** | ✅ | ❌ | ✅ |
| **Algo Visualization** | ❌ | ❌ | ✅ |
| **AI Auto-Fix** | ❌ | ✅ | ✅ |
| **Real-time Streaming**| ❌ | ❌ | ✅ |

---

## ✨ Core Features

### 🔎 1. Code Classification Engine (AST-Based)
Automatically detects logic types to trigger the correct debugging pipeline:
* Recursion
* Dynamic Programming (Top-Down & Bottom-Up)
* Graph Algorithms (BFS supported)
* Arrays & String logic

### ⚙️ 2. Sandboxed Code Execution
Runs user code in a secure, isolated environment:
* **Time-limited & Memory-safe**
* Captures `stdout`, `stderr`, and exit codes.
* No filesystem or system access.

### 🔁 3. Recursion Runtime Tracing
Captures every function call, return, and argument state to build a **full recursion call tree** JSON for visualization.

### 🧮 4. Dynamic Programming Analyzer
* Detects DP arrays (`dp[]`, `memo`).
* Tracks updates step-by-step.
* **Streams DP table updates** live for UI rendering.

### 🔧 5. Static Bug Finder
Custom analysis engine detects:
* Missing base cases
* Off-by-one errors
* Infinite loops (heuristic)
* Unused variables

### 🤖 6. AI-Powered Auto-Fix (Groq)
Uses the **Groq LLM client** to suggest minimal logical fixes and explain *why* the fix works, returning strictly structured JSON.

### 🧠 7. AI Explanation Engine (Teacher Mode)
Generates human-readable explanations covering execution flow, time/space complexity, and logic breakdown.

### 🔥 8. Live Debugging Stream (SSE)
Supports **Server-Sent Events (SSE)** to stream classification, runtime events, DP updates, and AI explanations in real-time.

---

## 🛠️ Tech Stack

### **Backend**
* **FastAPI**: High-performance Async API.
* **Python 3.x**: Core logic.
* **AST**: Abstract Syntax Tree for static analysis.

### **AI / ML**
* **Groq LLM Client**: For ultra-fast AI inference.
* **Prompt Engineering**: Custom structured prompts for JSON-safe output.

### **Communication**
* **REST APIs**: Standard request/response.
* **Server-Sent Events (SSE)**: For live data streaming.

---

## 📁 Project Structure

```bash
Backend/
│
├── main.py                     # Entry point
├── .env                        # Environment variables
├── requirements.txt            # Dependencies
│
├── routes/                     # API Routes
│   ├── run.py                  # Simple execution
│   ├── process.py              # Full pipeline (JSON)
│   └── process_stream.py       # SSE Streaming pipeline
│
├── engines/                    # Core Logic Engines
│   ├── classifier.py           # AST Classification
│   ├── recursion_engine.py     # Trace recursion
│   ├── recursion_tree_builder.py
│   ├── dp_engine.py            # Trace DP tables
│   ├── debugger.py             # Static analysis
│   └── sandbox_runner.py       # Secure execution
│
└── ml/                         # AI Modules
    ├── groq_client.py
    ├── explain_prompt.py
    └── fix_prompt.py
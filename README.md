# 🚀 DECAPSULE (Frontend)
### AI-Powered Code Debugging & Algorithm Visualization Engine

[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
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
- [Visualization Components](#-visualization-components)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

This is the **Frontend Client** for Decapsule. It is a highly interactive React application that serves as the interface for developers to write code, visualize algorithms, and receive AI-driven explanations.

It connects to the **Decapsule Backend** to receive real-time execution streams and renders complex data structures (Trees, Graphs, DP Tables) into beautiful, animated visualizations.

---

## 🔥 Why Decapsule is Different

Unlike typical code runners or AI chat tools, Decapsule combines the best of all worlds:

| Feature | Standard Runners | AI Chatbots | **Decapsule** |
| :--- | :---: | :---: | :---: |
| **Interactive Visuals** | ❌ | ❌ | ✅ |
| **Real-time Streaming** | ❌ | ❌ | ✅ |
| **Live Algo Tracing** | ❌ | ❌ | ✅ |
| **Teacher-Mode Explanations** | ❌ | ✅ | ✅ |
| **Instant Auto-Fix**| ❌ | ✅ | ✅ |

---

## ✨ Core Features

### 🎨 1. Interactive Visualization Pane
Automatically renders the correct data structure based on the code analysis:
* **Recursion Trees:** visualizes function calls and return paths.
* **DP Tables:** Animate grid updates for dynamic programming.
* **Graph Maps:** Shows node traversal and connections.

### 📝 2. Intelligent Code Editor
A robust editor environment (`CodeEditor.jsx`) that supports:
* Syntax highlighting
* Line numbers
* Real-time error feedback

### ⚡ 3. Live Debugging Stream (SSE)
Consumes **Server-Sent Events** from the backend to update the UI incrementally. You see the logic unfold step-by-step, rather than waiting for the whole process to finish.

### 🤖 4. AI Assistant Integration
* **Auto-Fix Modal:** Pop-up interface to view and apply AI-suggested code fixes.
* **Explanation Panel:** Reads out teacher-style logic breakdowns.

### 🎛️ 5. Playback Controls
* **Timeline Slider:** Scrub through the execution history.
* **Step-by-Step Navigation:** Move forward or backward through the code execution flow.

---

## 🛠️ Tech Stack

### **Core Framework**
* **React 18**: Component-based UI.
* **Vite**: Next-generation frontend tooling.

### **Styling & UI**
* **Tailwind CSS**: Utility-first styling.
* **Framer Motion**: For smooth animations (Trees/Graphs).
* **Lucide React**: Beautiful icons.

### **State & API**
* **Axios**: HTTP requests.
* **React Hooks**: Custom hooks for state management.
* **EventSource API**: For handling SSE streams.

---

## 📁 Project Structure

```bash
DECAPSULE/
│
├── src/
│   ├── api/                    # API connection logic
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI elements (Buttons, Cards)
│   │   ├── views/              # Specialized Visualization Views
│   │   │   ├── DPTable.jsx     # Dynamic Programming Grid
│   │   │   ├── GraphMap.jsx    # Graph Algo Visualization
│   │   │   └── RecursionTree.jsx # Tree Visualization
│   │   │
│   │   ├── AutoFixModal.jsx    # AI Fix Popup
│   │   ├── BottomPanels.jsx    # Console & Output Logs
│   │   ├── CodeEditor.jsx      # Main Editor Window
│   │   ├── FileExplorer.jsx    # Sidebar File Tree
│   │   ├── Navbar.jsx          # Top Navigation
│   │   ├── ProfileModal.jsx    # User Settings
│   │   ├── Sidebar.jsx         # App Sidebar
│   │   ├── TimelineSlider.jsx  # Execution Playback Control
│   │   └── VisualizerPane.jsx  # Main Display Area
│   │
│   ├── hooks/                  # Custom React Hooks
│   ├── lib/                    # Utility functions
│   │
│   ├── App.jsx                 # Main App Component
│   ├── auth.jsx                # Authentication Context
│   ├── index.css               # Global Styles (Tailwind)
│   └── index.jsx               # Entry Point
│
├── .env                        # Environment Variables
├── .gitignore
├── eslint.config.js            # Linting Rules
├── index.html                  # HTML Root
├── package.json                # Dependencies
└── vite.config.js              # Vite Configuration

``` 

## 🚀 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/decapsule-frontend.git](https://github.com/yourusername/decapsule-frontend.git)
    cd decapsule-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## ❤️ Contributing

Contributions are welcome! We are actively looking for help with:

- [ ] Enhancing the Graph visualization engine.
- [ ] Adding more themes to the Code Editor.
- [ ] Improving mobile responsiveness.
- [ ] Adding support for Tree DP visualizations.

Feel free to **open an issue** or **submit a PR** 🚀

---

## 📄 License

**MIT License** — Free to use, modify, and extend.
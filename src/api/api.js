// Load BASE URL from .env file
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* ---------------------------------------------------------
   1) RUN CODE
--------------------------------------------------------- */
export async function runCode(code, input = "") {
  const res = await fetch(`${BASE_URL}/run/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, input }),
  });

  return res.json();
}

/* ---------------------------------------------------------
   2) DEBUG + EXPLANATION CODE
--------------------------------------------------------- */
export async function debugCode(code) {
  // STEP 1 — Analyze
  const analyzeRes = await fetch(`${BASE_URL}/analyze/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, use_ml: false }),
  });
  const analysis = await analyzeRes.json();

  // STEP 2 — Simulation
  const simRes = await fetch(`${BASE_URL}/simulate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      topic: "recursion",
      entry_func: "fibonacci",
      entry_args: [10],
    }),
  });
  const simulation = await simRes.json();

  // STEP 3 — Debug
  const debugRes = await fetch(`${BASE_URL}/debug/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      array: [],
      string: "",
    }),
  });
  const debugOutput = await debugRes.json();

  // STEP 4 — Explain
  const explainRes = await fetch(`${BASE_URL}/explain/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      trace: simulation,
    }),
  });
  const explanation = await explainRes.json();

  return {
    analysis,
    simulation,
    debugOutput,
    explanation,
  };
}

/* ---------------------------------------------------------
   3) FIX CODE (AI ERROR FIX)
--------------------------------------------------------- */
export async function fixCode(code) {
  const res = await fetch(`${BASE_URL}/fix/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  return res.json();
}

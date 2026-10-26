import { move, addRandom, hasMoves, emptyGrid } from "./logic.js";

const COLORS = {
  0: "#0b0f17", 2: "#1e293b", 4: "#334155", 8: "#f59e0b", 16: "#f97316",
  32: "#ef4444", 64: "#dc2626", 128: "#eab308", 256: "#ca8a04", 512: "#22c55e",
  1024: "#16a34a", 2048: "#2563eb",
};

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const msgEl = document.getElementById("msg");

let grid = emptyGrid(4);
let score = 0;
const BEST_KEY = "twenty48-best";

// localStorage can throw (blocked storage) or hold garbage; never let that break the game.
function loadBest() {
  try {
    const n = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // storage unavailable: the best score just won't persist
  }
}

let best = loadBest();
let over = false;

function start() {
  grid = addRandom(addRandom(emptyGrid(4)));
  score = 0;
  over = false;
  msgEl.textContent = "";
  render();
}

function render() {
  bestEl.textContent = String(best);
  scoreEl.textContent = String(score);
  boardEl.innerHTML = "";
  for (const row of grid) {
    for (const v of row) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = v ? String(v) : "";
      cell.style.background = COLORS[v] || "#7c3aed";
      cell.style.color = v && v <= 4 ? "#94a3b8" : "#fff";
      boardEl.appendChild(cell);
    }
  }
}

function doMove(dir) {
  if (over) return;
  const res = move(grid, dir);
  if (!res.moved) return;
  grid = addRandom(res.grid);
  score += res.gained;
  if (score > best) {
    best = score;
    saveBest(best);
  }
  if (grid.flat().includes(2048)) msgEl.textContent = "🎉 2048! continue jogando…";
  if (!hasMoves(grid)) {
    over = true;
    msgEl.textContent = "💀 fim de jogo — Novo jogo?";
  }
  render();
}

const KEYS = {
  ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
  a: "left", d: "right", w: "up", s: "down",
};
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return; // keep browser shortcuts (Ctrl+S, Cmd+W, ...)
  const dir = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
  if (dir) {
    e.preventDefault();
    doMove(dir);
  }
});

// touch swipe
let sx = 0, sy = 0;
boardEl.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
boardEl.addEventListener("pointerup", (e) => {
  const dx = e.clientX - sx, dy = e.clientY - sy;
  if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "right" : "left");
  else doMove(dy > 0 ? "down" : "up");
});

document.getElementById("new").addEventListener("click", start);
start();

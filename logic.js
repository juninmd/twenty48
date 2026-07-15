// 2048 core logic — pure, no DOM. Grid is an array of N rows × N cols (0 = empty).

/** Slide + merge a single row to the LEFT. Returns { row, gained }. */
export function slide(row) {
  const nums = row.filter((x) => x !== 0);
  const out = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      out.push(merged);
      gained += merged;
      i++; // consume the pair — no triple merges
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < row.length) out.push(0);
  return { row: out, gained };
}

const transpose = (g) => g[0].map((_, c) => g.map((row) => row[c]));
const reverseRows = (g) => g.map((row) => [...row].reverse());

/**
 * Apply a move in a direction ("left"|"right"|"up"|"down").
 * Returns { grid, gained, moved }.
 */
export function move(grid, dir) {
  let work = grid.map((r) => [...r]);
  if (dir === "right") work = reverseRows(work);
  else if (dir === "up") work = transpose(work);
  else if (dir === "down") work = reverseRows(transpose(work));

  let gained = 0;
  const slid = work.map((row) => {
    const r = slide(row);
    gained += r.gained;
    return r.row;
  });

  let result = slid;
  if (dir === "right") result = reverseRows(slid);
  else if (dir === "up") result = transpose(slid);
  else if (dir === "down") result = transpose(reverseRows(slid));

  const moved = JSON.stringify(result) !== JSON.stringify(grid);
  return { grid: result, gained, moved };
}

export function emptyCells(grid) {
  const cells = [];
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++) if (grid[r][c] === 0) cells.push([r, c]);
  return cells;
}

/** Place a 2 (90%) or 4 (10%) on a random empty cell. rng() → [0,1). */
export function addRandom(grid, rng = Math.random) {
  const cells = emptyCells(grid);
  if (cells.length === 0) return grid;
  const [r, c] = cells[Math.floor(rng() * cells.length)];
  const next = grid.map((row) => [...row]);
  next[r][c] = rng() < 0.9 ? 2 : 4;
  return next;
}

/** True while any move is still possible. */
export function hasMoves(grid) {
  if (emptyCells(grid).length > 0) return true;
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++) {
      if (c + 1 < grid[r].length && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < grid.length && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

export function emptyGrid(n = 4) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}

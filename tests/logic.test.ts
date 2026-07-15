import { test, expect } from "bun:test";
import { slide, move, hasMoves, emptyCells, addRandom, emptyGrid } from "../logic.js";

test("slide merges pairs once, packs left", () => {
  expect(slide([2, 2, 0, 0])).toEqual({ row: [4, 0, 0, 0], gained: 4 });
  expect(slide([2, 2, 2, 2])).toEqual({ row: [4, 4, 0, 0], gained: 8 });
  expect(slide([2, 2, 2, 0])).toEqual({ row: [4, 2, 0, 0], gained: 4 });
  expect(slide([4, 0, 4, 0])).toEqual({ row: [8, 0, 0, 0], gained: 8 });
  expect(slide([0, 0, 0, 0])).toEqual({ row: [0, 0, 0, 0], gained: 0 });
});

test("no triple merge (2,2,2 -> 4,2)", () => {
  expect(slide([2, 2, 2, 4])).toEqual({ row: [4, 2, 4, 0], gained: 4 });
});

test("move left/right/up/down", () => {
  const g = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  expect(move(g, "left").grid[0]).toEqual([4, 0, 0, 0]);
  expect(move(g, "right").grid[0]).toEqual([0, 0, 0, 4]);
  const col = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  expect(move(col, "up").grid.map((r) => r[0])).toEqual([4, 0, 0, 0]);
  expect(move(col, "down").grid.map((r) => r[0])).toEqual([0, 0, 0, 4]);
});

test("move reports moved=false when nothing changes", () => {
  const g = [
    [2, 4, 8, 0], // already left-packed, no equal neighbors
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  expect(move(g, "left").moved).toBe(false); // no change
  expect(move(g, "right").moved).toBe(true); // slides to the right edge
});

test("hasMoves detects lock", () => {
  const locked = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];
  expect(hasMoves(locked)).toBe(false);
  expect(hasMoves([[2, 2, 4, 8], [4, 8, 16, 32], [2, 4, 8, 16], [4, 8, 16, 32]])).toBe(true);
});

test("addRandom fills exactly one empty cell", () => {
  const g = emptyGrid(4);
  const next = addRandom(g, () => 0); // deterministic: first cell, value 2
  expect(emptyCells(next).length).toBe(15);
  expect(next[0][0]).toBe(2);
});

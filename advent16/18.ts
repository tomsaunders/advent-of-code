#!/usr/bin/env ts-node
import { test, arrSum } from "./util";
const input =
  ".^^^^^.^^^..^^^^^...^.^..^^^.^^....^.^...^^^...^^^^..^...^...^^.^.^.......^..^^...^.^.^^..^^^^^...^.";

const SAFE = ".";
const TRAP = "^";

function isTrap(prev: string): boolean {
  const [left, center, right] = prev.split("");
  const l = left === TRAP;
  const c = center === TRAP;
  const r = right === TRAP;
  return (l && c && !r) || (!l && c && r) || (l && !c && !r) || (!l && !c && r);
  // Its left and center tiles are traps, but its right tile is not.
  // Its center and right tiles are traps, but its left tile is not.
  // Only its left tile is a trap.
  // Only its right tile is a trap.
}

function nextLine(line: string): string {
  const current = `${SAFE}${line}${SAFE}`;
  let next = "";
  for (let i = 0; i < line.length; i++) {
    next += isTrap(current.substr(i, 3)) ? TRAP : SAFE;
  }
  return next;
}

function safeCount(start: string, rows: number): number {
  let grid = 1;
  let last = start;

  let safeCount = start.split("").filter((c) => c === SAFE).length;
  let seen = new Map<string, string>();
  let count = new Map<string, number>();
  count.set(start, safeCount);

  while (grid < rows) {
    if (seen.has(last)) {
      last = seen.get(last) as string;
      safeCount += count.get(last) as number;
    } else {
      const next = nextLine(last);
      const c = next.split("").filter((c) => c === SAFE).length;
      safeCount += c;

      seen.set(last, next);
      count.set(last, c);
      last = next;
    }
    grid++;
  }
  return safeCount;
}

test(safeCount("..^^.", 3), 6);
test(safeCount(".^^.^.^^^^", 10), 38);

console.log("Part One", safeCount(input, 40));
console.log("Part One", safeCount(input, 400000));

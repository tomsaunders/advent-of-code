#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const input = fs.readFileSync("input15.txt", "utf8");

// Disc #1 has 17 positions; at time=0, it is at position 1.
// Disc #2 has 7 positions; at time=0, it is at position 0.
// Disc #3 has 19 positions; at time=0, it is at position 2.
// Disc #4 has 5 positions; at time=0, it is at position 0.
// Disc #5 has 3 positions; at time=0, it is at position 0.
// Disc #6 has 13 positions; at time=0, it is at position 5.

type Discs = [number, number][];
const inputDiscs: Discs = [
  [17, 1],
  [7, 0],
  [19, 2],
  [5, 0],
  [3, 0],
  [13, 5],
];

const testDiscs: Discs = [
  [5, 4],
  [2, 1],
];

function syncTime(discs: Discs): number {
  let t = 0;
  let mult = 1;
  let running = true;
  const seen = new Set<number>();
  while (running) {
    const match = discs.every((d, i) => {
      const [n, p] = d;
      const positionAtDropTime = t + p + i + 1;
      const m = positionAtDropTime % n;
      if (m === 0 && !seen.has(n)) {
        seen.add(n);
        mult *= n;
      }
      return m === 0;
    });
    if (match) {
      running = false;
    } else {
      t += mult;
    }
  }
  return t;
}

test(5, syncTime(testDiscs));
console.log("Part One", syncTime(inputDiscs));
console.log("Part Two", syncTime(inputDiscs.concat([[11, 0]])));

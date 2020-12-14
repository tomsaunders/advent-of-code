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

// t0 c0
// t1 c1
// t2 c2
// t3 c0
// t4 c1
// t5 c2

const discs: [number, number][] = [
  // [17, 1],
  // [7, 0],
  // [19, 2],
  // [5, 0],
  // [3, 0],
  // [13, 5],
  [5, 4],
  [2, 1],
];

for (let d = 0; d < discs.length; d++) {
  const disc = discs[d];
  const t = d + 1;
  const p = disc[1] + t; // after t , at this pos
  const m = (disc[0] - p) % disc[0];
  disc.push(m < 0 ? m + disc[0] : m);
}

let t = 0;
let mult = 1;
let running = true;
const seen = new Set<number>();
while (running) {
  const match = discs.every((d) => {
    const [n, p] = d;
    const m = t % n;
    if (m === p && !seen.has(n)) {
      seen.add(n);
      // mult *= n;
    }
    console.log(t, n, p, m);
    return m === p;
  });
  if (match) {
    running = false;
  } else {
    t += mult;
  }
}
console.log(t);
console.log(discs);

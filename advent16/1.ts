#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");
const ins = input.split(", ");

enum Dir {
  N,
  E,
  S,
  W,
  R = "R",
  L = "L",
}
let dir = Dir.N;
const right = new Map<Dir, Dir>();
right.set(Dir.N, Dir.E);
right.set(Dir.E, Dir.S);
right.set(Dir.S, Dir.W);
right.set(Dir.W, Dir.N);
const left = new Map<Dir, Dir>();
left.set(Dir.N, Dir.W);
left.set(Dir.W, Dir.S);
left.set(Dir.S, Dir.E);
left.set(Dir.E, Dir.N);

let px = 0;
let py = 0;
let seen: Set<string> = new Set<string>();
seen.add(`${px},${py}`);
for (const turn of ins) {
  const t = turn.substring(0, 1);
  const l = parseInt(turn.substring(1), 10);
  if (t === Dir.R) {
    dir = right.get(dir)!!;
  } else if (t === Dir.L) {
    dir = left.get(dir)!!;
  }
  switch (dir) {
    case Dir.N:
      for (let i = 1; i <= l; i++) {
        py--;
        const k = `${px},${py}`;
        if (seen.has(k)) {
          console.log(
            `already seen ${px},${py}!!`,
            Math.abs(px) + Math.abs(py)
          );
        }
        seen.add(k);
      }
      break;
    case Dir.E:
      for (let i = 1; i <= l; i++) {
        px++;
        const k = `${px},${py}`;
        if (seen.has(k)) {
          console.log(
            `already seen ${px},${py}!!`,
            Math.abs(px) + Math.abs(py)
          );
        }
        seen.add(k);
      }
      break;
    case Dir.S:
      for (let i = 1; i <= l; i++) {
        py++;
        const k = `${px},${py}`;
        if (seen.has(k)) {
          console.log(
            `already seen ${px},${py}!!`,
            Math.abs(px) + Math.abs(py)
          );
        }
        seen.add(k);
      }
      break;
    case Dir.W:
      for (let i = 1; i <= l; i++) {
        px--;
        const k = `${px},${py}`;
        if (seen.has(k)) {
          console.log(
            `already seen ${px},${py}!!`,
            Math.abs(px) + Math.abs(py)
          );
        }
        seen.add(k);
      }
      break;
  }
  // console.log(turn, t, l, `Now at ${px},${py}`);
}

console.log(Math.abs(px) + Math.abs(py));

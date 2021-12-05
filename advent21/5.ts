#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input5.txt", "utf8");
const test = fs.readFileSync("test5.txt", "utf8");

function part1(input: string): number {
  const lines = input.split("\n");
  const ventLines: [number, number, number, number][] = [];
  lines.forEach((l) => {
    const [left, right] = l.split(" -> ");
    const [x1, y1] = left.split(",").map((x) => parseInt(x.trim(), 10));
    const [x2, y2] = right.split(",").map((y) => parseInt(y.trim(), 10));
    if (x1 === x2 || y1 === y2) ventLines.push([x1, y1, x2, y2]);
  });
  const counts: { [key: string]: number } = {};
  ventLines.forEach(([x1, y1, x2, y2]) => {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        const coord = `${x},${y}`;
        if (!counts[coord]) counts[coord] = 0;
        counts[coord]++;
      }
    }
  });

  return Object.values(counts).filter((x) => x >= 2).length;
}

const t1 = part1(test);
if (t1 === 5) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const ventLines: [number, number, number, number][] = [];
  lines.forEach((l) => {
    const [left, right] = l.split(" -> ");
    const [x1, y1] = left.split(",").map((x) => parseInt(x.trim(), 10));
    const [x2, y2] = right.split(",").map((y) => parseInt(y.trim(), 10));
    ventLines.push([x1, y1, x2, y2]);
  });

  const counts: { [key: string]: number } = {};
  ventLines.forEach(([x1, y1, x2, y2]) => {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));

    let x = x1;
    let y = y1;
    for (let s = 0; s <= steps; s++) {
      const coord = `${x},${y}`;
      if (!counts[coord]) counts[coord] = 0;
      counts[coord]++;
      const xDiff = x1 === x2 ? 0 : x2 > x1 ? 1 : -1;
      const yDiff = y1 === y2 ? 0 : y2 > y1 ? 1 : -1;
      x += xDiff;
      y += yDiff;
    }
  });

  return Object.values(counts).filter((x) => x >= 2).length;
}

const t2 = part2(test);
if (t2 === 12) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

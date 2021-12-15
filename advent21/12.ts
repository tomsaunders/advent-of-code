#!/usr/bin/env ts-node
import * as fs from "fs";

const input = fs.readFileSync("input12.txt", "utf8");
const testA = fs.readFileSync("test12a.txt", "utf8");
const testB = fs.readFileSync("test12b.txt", "utf8");
const testC = fs.readFileSync("test12c.txt", "utf8");

class Cave {
  constructor(public name: string) {}

  public get isSmall(): boolean {
    return this.name === this.name.toLowerCase();
  }
}

function isSmall(cave: string): boolean {
  return cave === cave.toLowerCase();
}

function part1(input: string): number {
  const lines = input.split("\n");
  const options = lines;
  lines.forEach((l) => {
    const [left, right] = l.split("-");
    options.push(`${right}-${left}`);
  });
  const start = "start";
  const end = "end";

  const paths: string[] = [];
  const queue: string[][] = [[start]];
  while (queue.length) {
    const current = queue.pop() as string[];
    const lastCave = current[current.length - 1];
    if (lastCave === end) {
      paths.push(current.join(","));
      continue;
    }

    const options = lines
      .filter((l) => l.startsWith(lastCave))
      .map((l) => l.split("-")[1]);
    options.forEach((o) => {
      if (isSmall(o) && current.includes(o)) {
        // already been, skip.
      } else {
        const next = current.slice(0);
        next.push(o);
        queue.push(next);
      }
    });
  }

  return paths.length;
}

const t1a = part1(testA);
const t1b = part1(testB);
const t1c = part1(testC);
if (t1a === 10 && t1b === 19 && t1c === 226) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1a, t1b, t1c);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const options = lines;
  lines.forEach((l) => {
    const [left, right] = l.split("-");
    options.push(`${right}-${left}`);
  });
  const start = "start";
  const end = "end";

  const paths: string[] = [];
  const queue: string[][] = [[start]];
  while (queue.length) {
    const current = queue.pop() as string[];
    const lastCave = current[current.length - 1];
    if (lastCave === end) {
      paths.push(current.join(","));
      continue;
    }

    const options = lines
      .filter((l) => l.startsWith(lastCave))
      .map((l) => l.split("-")[1]);
    options.forEach((o) => {
      const next = current.slice(0);
      if (o === start) {
        // cant go back to start
      } else if (isSmall(o) && current.includes(o)) {
        // already been to this cave. Can we go again?
        if (next[0] === "start2") {
          // no, a cave has already been twice
        } else {
          // this option can be the one thing thats done twice
          next[0] = "start2";
          next.push(o);
          queue.push(next);
        }
      } else {
        next.push(o);
        queue.push(next);
      }
    });
  }

  return paths.length;
}

const t2a = part2(testA);
const t2b = part2(testB);
const t2c = part2(testC);
if (t2a === 36 && t2b === 103 && t2c === 3509) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test fail: ", t2a, t2b, t2c);
}

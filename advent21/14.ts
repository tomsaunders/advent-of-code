#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input14.txt", "utf8");
const test = fs.readFileSync("test14.txt", "utf8");

function part1(input: string): number {
  const lines = input.split("\n");
  const start = lines.shift() as string;
  lines.shift(); // spacers
  let current = start;
  let next: string[] = [];
  let map: { [key: string]: string } = {};
  lines.forEach((l) => {
    const [find, right] = l.split(" -> ");
    const replace = `${find[0]}${right}`;
    map[find] = replace;
  });

  for (let i = 0; i < 10; i++) {
    next = [];
    for (let i = 0; i < current.length; i++) {
      const pair = current.substring(i, i + 2);
      if (map[pair]) {
        next.push(map[pair]);
      } else {
        next.push(current[i]);
      }
    }
    current = next.join("");
  }

  const c = current.split("") as string[];
  let counts = [];
  for (let l = 65; l < 65 + 26; l++) {
    counts.push(c.filter((x) => x === String.fromCharCode(l)).length);
  }
  counts = counts.filter((c) => !!c);

  return Math.max(...counts) - Math.min(...counts);
}

const t1 = part1(test);
if (t1 === 1588) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

type P = { [key: string]: number };

function part2(input: string): number {
  const lines = input.split("\n");
  const start = lines.shift() as string;
  lines.shift(); // spacers

  let map: { [key: string]: [string, string] } = {};
  const polymer: P = {};
  lines.forEach((l) => {
    const [find, right] = l.split(" -> ");
    map[find] = [`${find[0]}${right}`, `${right}${find[1]}`];
    polymer[find] = 0;
  });

  let current: P = { ...polymer };

  for (let i = 0; i < start.length - 1; i++) {
    const pair = start.substring(i, i + 2);
    current[pair]++;
  }

  for (let i = 0; i < 40; i++) {
    const next: P = { ...polymer };
    Object.entries(current).forEach(([pair, count]) => {
      const [a, b] = map[pair];
      next[a] += count;
      next[b] += count;
    });
    current = next;
  }

  let counts: P = {};
  Object.entries(current).forEach(([pair, count]) => {
    const a = pair[0];
    const b = pair[1];
    if (!counts[a]) {
      counts[a] = 0;
    }
    if (!counts[b]) {
      counts[b] = 0;
    }
    counts[a] += count;
    counts[b] += count;
  });
  counts[start[0]]++;
  counts[start[start.length - 1]]++;

  const vals = Object.values(counts);
  return (Math.max(...vals) - Math.min(...vals)) / 2;
}

const t2 = part2(test);
if (t2 === 2188189693529) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

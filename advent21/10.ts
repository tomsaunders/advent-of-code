#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input10.txt", "utf8");
const test = fs.readFileSync("test10.txt", "utf8");

const scoreMap: { [key: string]: number } = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const incompleteScoreMap: { [key: string]: number } = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const pairMap: { [key: string]: string } = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

function isOpen(c: string): boolean {
  return ["(", "[", "{", "<"].includes(c);
}

function isClose(c: string): boolean {
  return [")", "]", "}", ">"].includes(c);
}

function pair(c: string): string {
  return pairMap[c] as string;
}

function corruptionScore(line: string): number {
  const chunkQueue: string[] = [];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (isOpen(c)) {
      chunkQueue.push(c);
    } else if (isClose(c)) {
      const expected = chunkQueue.pop();
      if (pair(c) === expected) {
        // fine, as expected
      } else {
        return scoreMap[c];
      }
    }
  }
  return 0;
}

function incomplete(line: string): string[] {
  const chunkQueue: string[] = [];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (isOpen(c)) {
      chunkQueue.push(c);
    } else if (isClose(c)) {
      const expected = chunkQueue.pop();
      if (pair(c) === expected) {
        // fine, as expected
      } else {
        return [];
      }
    }
  }
  return chunkQueue.map(pair).reverse();
}

function part1(input: string): number {
  const lines = input.split("\n");
  let sum = 0;

  lines.forEach((l) => {
    sum += corruptionScore(l);
  });

  return sum;
}

const t1 = part1(test);
if (t1 === 26397) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n");

  const x = lines
    .filter((l) => corruptionScore(l) === 0)
    .map(incomplete)
    .map((queue: string[]) =>
      queue.reduce(
        (carry, letter) => (carry = carry * 5 + incompleteScoreMap[letter]),
        0
      )
    )
    .sort((a, b) => b - a);

  return x[Math.floor(x.length / 2)];
}

const t2 = part2(test);
if (t2 === 288957) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

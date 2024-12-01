#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input1.txt", "utf8");
const test = `3   4
4   3
2   5
1   3
3   9
3   3`;

function parseInput(input: string): [number[], number[]] {
  const lines = input.split("\n");
  const left: number[] = [];
  const right: number[] = [];
  lines.forEach((line) => {
    const bits = line.split(" ").filter(Boolean);
    left.push(parseInt(bits[0]));
    right.push(parseInt(bits[1]));
  });
  return [left, right];
}

function part1(input: string): number {
  const [leftCol, rightCol] = parseInput(input);
  leftCol.sort((a, b) => a - b);
  rightCol.sort((a, b) => a - b);

  return leftCol.reduce(
    (sum, left, i) => sum + Math.abs(rightCol[i] - left),
    0
  );
}

function part2(input: string): number {
  const [leftCol, rightCol] = parseInput(input);

  return leftCol.reduce((sum, left) => {
    const similarityCount = rightCol.filter((right) => right === left).length;
    return sum + similarityCount * left;
  }, 0);
}

const t = part1(test);
if (t == 11) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 31) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input2.txt", "utf8");
const test = `A Y
B X
C Z`;

// rock paper scissors a b c, x y z.
// x y z 1 2 3 points.
// outcomes 0 loss 3 draw 6 win

function getPoints(input: string): number[] {
  const lines = input.split("\n");
  const options: Record<string, number> = {
    "A X": 1 + 3,
    "A Y": 2 + 6,
    "A Z": 3 + 0,
    "B X": 1 + 0,
    "B Y": 2 + 3,
    "B Z": 3 + 6,
    "C X": 1 + 6,
    "C Y": 2 + 0,
    "C Z": 3 + 3,
  };
  return input.split("\n").map((l) => options[l] as number);
}

function part1(input: string): number {
  const pts = getPoints(input);
  return arrSum(pts);
}

function part2(input: string): number {
  // X lose Y draw Z win
  const options: Record<string, number> = {
    "A X": 0 + 3,
    "A Y": 3 + 1,
    "A Z": 6 + 2,
    "B X": 0 + 1,
    "B Y": 3 + 2,
    "B Z": 6 + 3,
    "C X": 0 + 2,
    "C Y": 3 + 3,
    "C Z": 6 + 1,
  };
  return arrSum(input.split("\n").map((l) => options[l] as number));
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

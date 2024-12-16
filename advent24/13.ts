#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 13
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, mapNum, XYCoord } from "./util";
const input = fs.readFileSync("input13.txt", "utf8");
const test = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

function isRound(n: number): boolean {
  return n === Math.round(n);
}

class Prize {
  A: XYCoord;
  B: XYCoord;
  P: XYCoord;
  constructor(lines: string[]) {
    const [a, b, p] = lines;
    this.A = a
      .replace("Button A: X", "")
      .replace(" Y", "")
      .split(",")
      .map(mapNum) as XYCoord;
    this.B = b
      .replace("Button B: X", "")
      .replace(" Y", "")
      .split(",")
      .map(mapNum) as XYCoord;
    this.P = p
      .replace("Prize: X=", "")
      .replace(" Y=", "")
      .split(",")
      .map(mapNum) as XYCoord;
  }

  getMin(): number {
    const [ax, ay] = this.A;
    const [bx, by] = this.B;
    const [px, py] = this.P;

    const bPresses = (ax * py - ay * px) / (ax * by - ay * bx);
    const aPresses = (px - bx * bPresses) / ax;

    if (isRound(bPresses) && isRound(aPresses)) {
      const cost = aPresses * 3 + bPresses;
      return cost;
    }

    return 0;
  }
}

function parseInput(input: string): Prize[] {
  const lines = input.split("\n");
  const prizes: Prize[] = [];
  for (let i = 0; i < lines.length; i += 4) {
    const subs = lines.slice(i);
    prizes.push(new Prize(subs));
  }
  return prizes;
}

function part1(input: string): number {
  const prizes = parseInput(input);
  return arrSum(prizes.map((p) => p.getMin()));
}

function part2(input: string): number {
  const prizes = parseInput(input);
  prizes.forEach((p) => {
    p.P[0] += 10000000000000;
    p.P[1] += 10000000000000;
  });
  return arrSum(prizes.map((p) => p.getMin()));
}

const t = part1(test);
if (t == 480) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
console.log("part 2 answer", part2(input));

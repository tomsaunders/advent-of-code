#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day 1
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *
 * Keywords:
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");
const test = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

function parseInput(input: string): string[] {
  return input.split("\n");
}

function part1(input: string): number {
  const moves = parseInput(input);

  let dial = 1000050;
  let zeroes = 0;

  moves.forEach((move) => {
    const direction = move[0];
    const amount = parseInt(move.slice(1), 10);

    if (direction === "L") {
      dial -= amount;
    } else if (direction === "R") {
      dial += amount;
    }
    if (dial % 100 === 0) {
      zeroes += 1;
    }
  });
  return zeroes;
}

function part2(input: string): number {
  const moves = parseInput(input);

  let dial = 1000050;
  let zeroes = 0;

  moves.forEach((move) => {
    const direction = move[0];
    const amount = parseInt(move.slice(1), 10);

    for (let i = 0; i < amount; i++) {
      if (direction === "L") {
        dial--;
      } else if (direction === "R") {
        dial++;
      }
      if (dial % 100 === 0) {
        zeroes += 1;
      }
    }
  });
  return zeroes;
}

const t = part1(test);
if (t == 3) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 6) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

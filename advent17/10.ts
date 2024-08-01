#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 10
 *
 * Summary: Rearrange an array according to some rules
 * Escalation: Loop 64 times and format the output into hexadecimal
 * Solution: Create a new array and handle the subreverse by a second loop
 *
 *
 *
 * Keywords:
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");

function part1(len: number, input: string): number {
  let list = new Array(len).fill(0).map((v, i) => i);

  let skipSize = 0;
  let idx = 0;

  const instructions = input.split(",").map(mapNum);
  for (let i = 0; i < instructions.length; i++) {
    const length = instructions[i];
    const nu = list.slice(0);
    for (let j = 0; j < length; j++) {
      const jdx = idx + j;
      const rdx = idx + length - 1 - j;
      nu[jdx % list.length] = list[rdx % list.length];
    }
    list = nu;
    idx += length + skipSize;
    skipSize++;
  }
  return list[0] * list[1];
}

function part2(input: string): string {
  const instructions = input
    .split("")
    .map((x) => x.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);

  let list = new Array(256).fill(0).map((v, i) => i);

  let skipSize = 0;
  let idx = 0;

  for (let r = 0; r < 64; r++) {
    for (let i = 0; i < instructions.length; i++) {
      const length = instructions[i];
      const nu = list.slice(0);
      for (let j = 0; j < length; j++) {
        const jdx = idx + j;
        const rdx = idx + length - 1 - j;
        nu[jdx % list.length] = list[rdx % list.length];
      }
      list = nu;
      idx += length + skipSize;
      skipSize++;
    }
  }

  const sparseHash = list;
  const denseHash = [];
  for (let i = 0; i < 16; i++) {
    const sub = sparseHash.slice(i * 16, (i + 1) * 16);
    const xor = sub.reduce((prev, curr) => prev ^ curr, 0);
    denseHash[i] = xor;
  }

  return denseHash.map((n) => n.toString(16).padStart(2, "0")).join("");
}

const test2: Record<string, string> = {
  "": "a2582a3a0e66e6e86e3812dcb672a272",
  "AoC 2017": "33efeb34ea91902bb2f59c9920caa6cd",
  "1,2,3": "3efbe78a8d82f29979031a4aa0b16a9d",
  "1,2,4": "63960835bcdc130f0b66d7ff4f6a5a8e",
};

const t = part1(5, "3, 4, 1, 5");
if (t === 12) {
  console.log("part 1 answer", part1(256, input));
  if (Object.entries(test2).every(([input, result]) => part2(input) === result)) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log(
      "part 2 test fail",
      Object.entries(test2).map(([input, result]) => [part2(input), "=", result])
    );
  }
} else {
  console.log("part 1 test fail", t);
}

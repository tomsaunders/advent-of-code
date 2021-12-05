#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input3.txt", "utf8");
const test = fs.readFileSync("test3.txt", "utf8");

function part1(input: string): number {
  const lines = input.split("\n");
  const len = lines[0].length;
  const half = lines.length / 2;

  let gammaStr = "";
  let epsilonStr = "";

  for (let i = 0; i < len; i++) {
    const ones = lines.filter((l) => l[i] === "1");
    if (ones.length > half) {
      gammaStr += "1";
      epsilonStr += "0";
    } else {
      gammaStr += "0";
      epsilonStr += "1";
    }
  }

  return parseInt(gammaStr, 2) * parseInt(epsilonStr, 2);
}

const t1 = part1(test);
if (t1 === 198) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n");
  let current = lines.slice();

  let oxygenStr = "";
  let co2Str = "";

  let bit = 0;
  while (current.length > 1) {
    const half = current.length / 2;
    const ones = current.filter((l) => l[bit] === "1");
    const zeros = current.filter((l) => l[bit] === "0");
    if (ones.length >= half) {
      current = ones;
    } else {
      current = zeros;
    }
    bit++;
  }
  oxygenStr = current.pop() as string;

  bit = 0;
  current = lines.slice();
  while (current.length > 1) {
    const half = current.length / 2;
    const ones = current.filter((l) => l[bit] === "1");
    const zeros = current.filter((l) => l[bit] === "0");
    if (ones.length >= half) {
      current = zeros;
    } else {
      current = ones;
    }
    bit++;
  }
  co2Str = current.pop() as string;

  return parseInt(oxygenStr, 2) * parseInt(co2Str, 2);
}

const t2 = part2(test);
if (t2 === 230) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

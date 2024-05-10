#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input1.txt", "utf8");
const test = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const test2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

function part1(input: string): number {
  const lines = input.split("\n");
  const numbers = lines
    .map((l) => l.match(/[0-9]/g) as string[])
    .map((nums) => `${nums[0]}${nums[nums.length - 1]}`)
    .map((s) => parseInt(s, 10));
  return arrSum(numbers);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const lookup: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  const pukool: Record<string, string> = {
    eno: "1",
    owt: "2",
    eerht: "3",
    ruof: "4",
    evif: "5",
    xis: "6",
    neves: "7",
    thgie: "8",
    enin: "9",
  };
  const numbers = lines
    .map((l) => [
      l.replace(/(one|two|three|four|five|six|seven|eight|nine)/g, (match) => lookup[match] as string),
      l
        .split("")
        .reverse()
        .join("")
        .replace(/(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/g, (match) => pukool[match] as string),
    ])
    .map(([l, r]) => [l.match(/[0-9]/g) as string[], r.match(/[0-9]/g) as string[]])
    .map(([lums, rums]) => `${lums[0]}${rums[0]}`)
    .map((s) => parseInt(s, 10));
  return arrSum(numbers);
}

const t = part1(test);
if (t == 142) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test2);
if (t2 == 281) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input1.txt", "utf8");
const test = ``;

const test2 = ``;

function part1(input: string): number {
  const lines = input.split("\n");
  return 0;
}

function part2(input: string): number {
  const lines = input.split("\n");
  return 0;
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

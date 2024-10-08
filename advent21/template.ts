#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell } from './util';
const input = fs.readFileSync("inputX.txt", "utf8");
const test = fs.readFileSync("testX.txt", "utf8");

function part1(input: string): number {
  const lines = input.split("\n");
  const numbers = lines.map((l) => parseInt(l, 10));

  lines.forEach((l) => {
    const [left, right] = l.split(" | ");
    const bits = right.split(" ");
  });

  return 0;
}

const t1 = part1(test);
if (t1 === 1) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n") ;

  return 0;
}

const t2 = part2(test);
if (t2 === 2) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

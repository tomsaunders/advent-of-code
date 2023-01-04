#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Grid } from "./util";
const input = fs.readFileSync("input21.txt", "utf8");

const test = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

function parse(input: string): Grid {
  const grid = new Grid();
  input.split("\n").forEach((l) => {});

  return grid;
}

function part1(input: string): number {
  const grid = parse(input);
  return 0;
}

function part2(input: string): number {
  const grid = parse(input);
  return 0;
}

const t1 = part1(test);
if (t1 === 64) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 58) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

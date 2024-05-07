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

function parse(input: string): Record<string, string> {
  const map: Record<string, string> = {};
  input
    .split("\n")
    .map((l) => l.split(": "))
    .forEach(([key, op]) => {
      const num = parseInt(op, 10);
      map[key] = op;
    });
  return map;
}

function eeval(op: string): string | number {
  const bits = op.split(" ") as any[];
  bits[0] = parseInt(bits[0], 10);
  if (bits.length === 1) {
    return parseInt(bits[0], 10);
  }
  bits[2] = parseInt(bits[2], 10);
  if (!isNaN(bits[0]) && !isNaN(bits[2])) {
    return eval(op);
  } else {
    return NaN;
  }
}

function part1(input: string): number {
  const monkeys = parse(input);
  let root = -1;
  while (root === -1) {
    Object.keys(monkeys).forEach((key) => {
      const op = monkeys[key];
      const num = eeval(op as string);
      if (!isNaN(num as number)) {
        if (key === "root") root = num as number;
        Object.keys(monkeys).forEach((key2) => {
          if (monkeys[key2].includes(key)) {
            monkeys[key2] = monkeys[key2].replace(key, num.toString());
          }
        });
        delete monkeys[key];
      }
    });
  }

  return root;
}

function part2(input: string): number {
  const grid = parse(input);
  return 0;
}

const t1 = part1(test);
if (t1 === 152) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 301) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 25
 *
 * Summary: Convert to and from a new numbering system - base 5 but the values range from -2 -1 0 1 2
 * Escalation: None. It's Christmas! (Actually it's 18 months later...)
 * Solution: Nothing satisfying popped to mind, so I decided to implement a mutation approach from reddit
 *
 * Keywords: SNAFU, mutation
 * References: https://old.reddit.com/r/adventofcode/comments/zwqd2f/2022_day_25_part_1_4_working_approaches_to_day_25/
 */

import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input25.txt", "utf8");

const test = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

type Num = "2" | "1" | "0" | "-" | "=";

function getCoeff(n: Num): number {
  if (n === "-") {
    return -1;
  } else if (n === "=") {
    return -2;
  }
  return parseInt(n, 10);
}

class Snafu {
  public bits: Num[];

  constructor(public line: string) {
    this.bits = line.split("") as Num[];
  }

  public get decimal(): number {
    let total = 0;
    let power = 0;
    const bits = this.bits.slice(0);
    while (bits.length) {
      const coeff = getCoeff(bits.pop() as Num);
      total += coeff * Math.pow(5, power++);
    }
    return total;
  }

  static toDecimal(str: string): number {
    const s = new Snafu(str);
    return s.decimal;
  }
}

function parse(input: string): Snafu[] {
  return input.split("\n").map((l) => new Snafu(l));
}

function decimalToSnafu(input: number): string {
  const value = new Array(input.toString().length * 2).fill("0");
  // find the first index that 5^i > desired input and then go one back
  let diff = Math.abs(input - Snafu.toDecimal(value.join("")));
  while (diff) {
    let i = 0;
    let p = Math.pow(5, i);
    while (p < diff) {
      p = Math.pow(5, ++i);
    }
    const slot = value.length - i;
    let e = value[slot];
    while (e === value[slot]) {
      value[slot] = ["=", "-", "0", "1", "2"][Math.floor(Math.random() * 5)];
    }

    diff = Math.abs(input - Snafu.toDecimal(value.join("")));
    // console.log("progress is", value.join(""), "diff is ", diff);
  }
  while (value[0] === "0") {
    value.shift();
  }

  return value.join("");
}

function part1(input: string): string {
  const sum = arrSum(parse(input).map((s) => s.decimal));

  return decimalToSnafu(sum);
}

const t1 = part1(test);
if (t1 === "2=-1=0") {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

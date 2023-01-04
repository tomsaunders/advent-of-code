#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Grid } from "./util";
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
}

function parse(input: string): Snafu[] {
  return input.split("\n").map((l) => new Snafu(l));
}

function decimalToSnafu(input: number): string {
  return "";
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

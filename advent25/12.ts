#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day x
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid, mapNum } from "./util";
const input = fs.readFileSync("input12.txt", "utf8");
const test = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

type Situation = {
  presents: Present[];
  regions: Region[];
};

type Shape = [string, string, string];

class Present {
  public permutations: string[][] = [];
  constructor(public index: number, public shape: Shape) {
    const [one, two, three] = shape;
    const [a, b, c] = one.split("");
    const [d, e, f] = two.split("");
    const [g, h, i] = three.split("");

    this.permutations = [
      [`${a}${b}${c}`, `${d}${e}${f}`, `${g}${h}${i}`],
      [`${g}${d}${a}`, `${h}${e}${b}`, `${i}${f}${c}`],
      [`${i}${h}${g}`, `${f}${e}${d}`, `${c}${b}${a}`],
      [`${c}${f}${i}`, `${b}${e}${h}`, `${a}${d}${g}`],
    ];
  }
  public toString(): string {
    return [`${this.index}:`, ...this.shape].join("\n");
  }
  public get squares(): number {
    return (this.shape[0] + this.shape[1] + this.shape[2])
      .split("")
      .filter((c) => c === "#").length;
  }
}

class Region {
  constructor(
    public index: number,
    public width: number,
    public height: number,
    public presentCounts: number[],
  ) {}

  public get totalRequired(): number {
    return arrSum(this.presentCounts);
  }

  public get area(): number {
    return this.width * this.height;
  }

  public get noOverlapAccomodate(): number {
    return Math.floor(this.width / 3) * Math.floor(this.height / 3);
  }

  static fromLine(index: number, line: string): Region {
    const [size, presents] = line.split(": ");
    const [w, h] = size.split("x").map(mapNum);
    const presentCounts = presents.split(" ").map(mapNum);
    return new Region(index, w, h, presentCounts);
  }
}

function parseInput(input: string): Situation {
  const lines = input.split("\n");
  const presents: Present[] = [];
  const regions: Region[] = [];

  while (lines.length) {
    const line = lines.shift() as string;
    if (line.includes("x")) {
      regions.push(Region.fromLine(regions.length, line));
    } else if (line.includes(":")) {
      const idx = parseInt(line.split(":")[0]);
      const shape = [lines.shift(), lines.shift(), lines.shift()] as Shape;
      presents.push(new Present(idx, shape));
    }
  }

  return {
    presents,
    regions,
  };
}

function part1(input: string): number {
  const s = parseInput(input);

  // s.regions.forEach((r) => {
  //   console.log([
  //     r.index,
  //     "area",
  //     r.area,
  //     arrSum(r.presentCounts.map((v, i) => s.presents[i].squares * v)),
  //   ]);
  // });

  return s.regions.filter((r) => {
    const sum = arrSum(
      r.presentCounts.map((v, i) => s.presents[i].squares * v),
    );
    return sum < r.area;
  }).length;
}

function part2(input: string): number {
  const x = parseInput(input);
  return 0;
}

const t = part1(test);
// if (t == 2) {
console.log("part 1 answer", part1(input));
// } else {
//   console.log("part 1 test fail", t);
// }
const t2 = part2(test);
if (t2 == 9) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

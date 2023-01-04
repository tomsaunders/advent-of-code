#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Grid } from "./util";
const input = fs.readFileSync("input22.txt", "utf8");

const test = `        ...#
.#..
#...
....
...#.......#
........#...
..#....#....
..........#.
...#....
.....#..
.#......
......#.

10R5L5R10L4R5L5`;

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

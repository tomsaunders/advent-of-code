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
import { Cell, Grid, mapNum } from "./util";
const input = fs.readFileSync("input9.txt", "utf8");
const test = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

function parseInput(input: string): number[][] {
  return input.split("\n").map((l) => l.split(",").map(mapNum));
}

function part1(input: string): number {
  const points = parseInput(input);
  let maxArea = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const [x, y] = points[i];
      const [ex, why] = points[j];
      const area = (Math.abs(why - y) + 1) * (Math.abs(ex - x) + 1);
      // console.log("point", points[i], "to", points[j], "is ", area);
      maxArea = Math.max(maxArea, area);
    }
  }
  return maxArea;
}

function part2(input: string): number {
  const points = parseInput(input);
  const g = new Grid();
  for (const [x, y] of points) {
    g.addCell(new Cell(g, x, y, 0, "#"));
  }
  g.draw();
  return 0;
}

const t = part1(test);
if (t == 50) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 24) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

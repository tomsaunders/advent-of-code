#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
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
import { arrProd, Cell, Grid, mapNum, WALL, XYCoord } from "./util";
const input = fs.readFileSync("input14.txt", "utf8");
const test = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

type Robot = {
  p: XYCoord;
  v: XYCoord;
};

function parseInput(input: string): Robot[] {
  return input.split("\n").map((line) => {
    const [px, py, vx, vy] = line
      .replace("p=", "")
      .replace(" v=", ",")
      .split(",")
      .map(mapNum);
    return {
      p: [px, py],
      v: [vx, vy],
    };
  });
}

function part1(input: string, width = 101, height = 103): number {
  const robots = parseInput(input);
  for (let i = 0; i < 100; i++) {
    robots.forEach((r) => {
      r.p[0] += r.v[0];
      r.p[1] += r.v[1];
      if (r.p[0] >= width) r.p[0] %= width;
      else if (r.p[0] < 0) r.p[0] += width;
      if (r.p[1] >= height) r.p[1] %= height;
      else if (r.p[1] < 0) r.p[1] += height;
    });
  }
  // width 11 want to select first 5 which is 0 1 2 3 4
  // next 5 is 6 7 8 9 10
  const middleX = Math.floor(width / 2);
  const middleY = Math.floor(height / 2);
  const tl = robots.filter((r) => r.p[0] < middleX && r.p[1] < middleY).length;
  const tr = robots.filter((r) => r.p[0] > middleX && r.p[1] < middleY).length;
  const bl = robots.filter((r) => r.p[0] < middleX && r.p[1] > middleY).length;
  const br = robots.filter((r) => r.p[0] > middleX && r.p[1] > middleY).length;
  return arrProd([tl, tr, bl, br]);
}

function part2(input: string, width = 101, height = 103): number {
  const robots = parseInput(input);
  let min = 9999999999;
  let minS = 0;
  for (let i = 0; i < 100000; i++) {
    const g = new Grid();
    let dt = 0;
    robots.forEach((r) => {
      r.p[0] += r.v[0];
      r.p[1] += r.v[1];
      if (r.p[0] >= width) r.p[0] %= width;
      else if (r.p[0] < 0) r.p[0] += width;
      if (r.p[1] >= height) r.p[1] %= height;
      else if (r.p[1] < 0) r.p[1] += height;

      const [px, py] = r.p;
      const dx = Math.abs(width / 2 - px);
      const dy = Math.abs(height / 2 - py);
      dt += dx + dy;

      g.addCell(new Cell(g, r.p[0], r.p[1], 0, WALL));
    });
    if (dt < min) {
      console.log("after ", i + 1, "seconds");
      g.draw();
      min = dt;
      minS = i + 1;
    }
  }

  return minS;
}

const t = part1(test, 11, 7);
if (t == 12) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
console.log("part 2 answer", part2(input));

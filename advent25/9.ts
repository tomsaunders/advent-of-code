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

type Point = [number, number];

function parseInput(input: string): Point[] {
  return input.split("\n").map((l) => l.split(",").map(mapNum)) as Point[];
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

type Area = {
  from: Point;
  to: Point;
  area: number;
};

type Line = {
  from: Point;
  to: Point;
  length: number;
};

function part2(input: string): number {
  const points = parseInput(input);
  const areas: Area[] = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const from = points[i];
      const to = points[j];
      const [x, y] = from;
      const [ex, why] = to;
      const w = Math.abs(ex - x) + 1;
      const h = Math.abs(why - y) + 1;
      if (w > 1 && h > 1) {
        const area = w * h;
        areas.push({
          from,
          to,
          area,
        });
      }
    }
  }

  areas.sort((a, b) => b.area - a.area);
  // first item has the biggest potential area

  const greenLines: Line[] = [];
  const l = points.length;
  points.push(points[0]);
  for (let i = 0; i < l; i++) {
    const from = points[i];
    const to = points[i + 1];
    const [x, y] = from;
    const [ex, why] = to;
    const length = (Math.abs(why - y) + 1) * (Math.abs(ex - x) + 1);
    greenLines.push({ from, to, length });
  }

  greenLines.sort((a, b) => b.length - a.length);

  const biggest = areas.find((area) => {
    // find if there are any green lines through this area.
    const maxX = Math.max(area.from[0], area.to[0]);
    const minX = Math.min(area.from[0], area.to[0]);
    const maxY = Math.max(area.from[1], area.to[1]);
    const minY = Math.min(area.from[1], area.to[1]);

    console.log("comparing ", area);
    const intersect = greenLines.find((line) => {
      const maxLX = Math.max(line.from[0], line.to[0]);
      const minLX = Math.min(line.from[0], line.to[0]);
      const maxLY = Math.max(line.from[1], line.to[1]);
      const minLY = Math.min(line.from[1], line.to[1]);
      return minLX < maxX && minLY < maxY && maxLX > minX && maxLY > minY;
    });
    if (intersect) return false;
    return true;
  });

  return biggest?.area || 0;
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

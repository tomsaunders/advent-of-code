#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 18
 *
 * Summary: parse a series of direction (U/D/L/R) & distances instructions to form a shape, then calculate its area
 * Escalation: Parse in a different way that massively increases the distances
 * Naive: Treat the instructions as applying to a Grid, create individual cells, fill the interior space, count.
 * Solution: Instructions parse to coordinates of a polygon - get area using 'Shoelace formula'
 *
 * Keywords: Shoelace Formula
 * References: https://en.wikipedia.org/wiki/Shoelace_formula
 */
import * as fs from "fs";
import {
  Cell,
  Direction,
  Grid,
  PURP,
  RED,
  RESET,
  SPACE,
  WALL,
  XYCoord,
  YELLOW,
  arrSum,
  perimeter,
  picksTheoremArea,
  shoelaceArea,
} from "./util";
const input = fs.readFileSync("input18.txt", "utf8");
const test = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

interface PathStep {
  position: Cell;
  direction: Direction;
  consecutiveMoves: number;
  heatLoss: number;
  distToEnd: number;
}

function areaFromCoordinatesAndPerimeter(coordinates: XYCoord[]): number {
  const area = shoelaceArea(coordinates);
  const boundary = perimeter(coordinates);

  // https://old.reddit.com/r/adventofcode/comments/18l0qtr/2023_day_18_solutions/kg4t5ns/
  // picks theorem Area = internal + boundary / 2 - 1
  // we want internal + boundary as the answer
  // so Area + 1 + boundary /2 = internal + boundary
  return area + 1 + boundary / 2;
}

function part1(input: string): number {
  const lines = input.split("\n");
  // parse input into an array of coordinates
  const vectMap: Record<string, XYCoord> = {
    D: [0, 1],
    U: [0, -1],
    L: [-1, 0],
    R: [1, 0],
  };
  const coordinates: XYCoord[] = [[0, 0]];
  let x = 0;
  let y = 0;
  let xd = 0;
  let yd = 0;
  lines.forEach((line) => {
    const [dir, c] = line.split(" ");
    const count = parseInt(c);
    [xd, yd] = vectMap[dir];
    x += xd * count;
    y += yd * count;
    coordinates.push([x, y]);
  });

  return areaFromCoordinatesAndPerimeter(coordinates);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const hexDirMap: string[] = ["R", "D", "L", "U"];
  const vectMap: Record<string, [number, number]> = {
    D: [0, 1],
    U: [0, -1],
    L: [-1, 0],
    R: [1, 0],
  };

  const coordinates: [number, number][] = [[0, 0]];
  let x = 0;
  let y = 0;
  let xd = 0;
  let yd = 0;
  lines.forEach((line) => {
    const hexStr = line.split(" ")[2];
    const count = parseInt(hexStr.substring(2, 7), 16);
    const dir = hexDirMap[parseInt(hexStr[7])];
    [xd, yd] = vectMap[dir];
    x += xd * count;
    y += yd * count;
    coordinates.push([x, y]);
  });

  return areaFromCoordinatesAndPerimeter(coordinates);
}

const t = part1(test);
if (t == 62) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 952408144115) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

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
import { arrSum, Cell, Grid, SPACE } from "./util";
const input = fs.readFileSync("input7.txt", "utf8");
const test = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

const SPLITTER = "^";
const BEAM = "|";

function part1(input: string): number {
  const g = parseInput(input);
  const beams = [g.cells.find((c) => c.type === "S")!];
  let splits = 0;
  while (beams.length) {
    const beamCell = beams.shift()!;
    const next = beamCell.south;
    if (next?.type === SPACE) {
      next.type = BEAM;
      beams.push(next);
    } else if (next?.type === SPLITTER) {
      splits++;
      if (next.west) beams.push(next.west);
      if (next.east) beams.push(next.east);
    }
  }
  return splits;
}

function part2(input: string): number {
  const g = parseInput(input);
  const start = g.cells.find((c) => c.type === "S")!;
  g.cells.forEach((c) => {
    c.cost = 0;
  });
  start.cost = 1;
  const beams = [start];
  while (beams.length) {
    const beamCell = beams.shift()!;
    const next = beamCell.south;
    if (next?.type === SPACE) {
      next.type = BEAM;
      next.cost += beamCell.cost;
      beams.push(next);
    } else if (next?.type === SPLITTER) {
      if (next.west) {
        next.west.cost += beamCell.cost;
        beams.push(next.west);
      }
      if (next.east) {
        next.east.cost += beamCell.cost;
        beams.push(next.east);
      }
    }
  }
  g.cells.forEach((c) => {
    if (c.cost) {
      c.type = c.cost.toString();
    }
  });
  return arrSum(g.cells.filter((c) => c.y === g.maxY).map((c) => c.cost));
}

const t = part1(test);
if (t == 21) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 40) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 22
 *
 * Summary: Movement and actions on a grid
 * Escalation: Additional states & rules & iterations
 * Solution: Model the movements and actions with the grid utility class , but could just as easily be in a big hashmap.
 *
 * Keywords: Grid
 * References:
 */
import * as fs from "fs";
import { Grid } from "./util";
const input = fs.readFileSync("input22.txt", "utf8");
const test: string = `..#
#..
...`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

const directions = "URDL";
const v: Record<string, [number, number]> = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
};
const CLEAN = ".";
const INFECTED = "#";
const FLAGGED = "F";
const WEAKENED = "W";

function part2(input: string): number {
  const grid = parseInput(input);

  let pos = grid.getCell(grid.maxX / 2, grid.maxY / 2)!;
  let dirIdx = directions.length * 1000;

  let infects = 0;
  for (let i = 0; i < 10000000; i++) {
    if (pos.type === WEAKENED) {
      // no turn and infect
      pos.type = INFECTED;
      infects++;
    } else if (pos.type === FLAGGED) {
      // reverse direction and clean
      dirIdx += 2;
      pos.type = CLEAN;
    } else if (pos.type === INFECTED) {
      dirIdx++; // turn right and flag
      pos.type = FLAGGED;
    } else {
      // clean - turn left, become weakended
      dirIdx--;
      pos.type = WEAKENED;
    }
    const [dx, dy] = v[directions[dirIdx % directions.length]];
    pos = pos.getNext(dx, dy, true)!;
  }

  return infects;
}

function part1(input: string): number {
  const grid = parseInput(input);

  let pos = grid.getCell(grid.maxX / 2, grid.maxY / 2)!;
  let dirIdx = directions.length * 1000;

  let infects = 0;
  for (let i = 0; i < 10000; i++) {
    if (pos.type === INFECTED) {
      dirIdx++; // turn right and clean
      pos.type = CLEAN;
    } else {
      // clean becomes infected, turn left
      dirIdx--;
      pos.type = INFECTED;
      infects++;
    }
    const [dx, dy] = v[directions[dirIdx % directions.length]];
    pos = pos.getNext(dx, dy, true)!;
  }

  return infects;
}

const t1 = part1(test);
if (t1 === 5587) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 2511944) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t1);
}

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
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input25.txt", "utf8");
const test = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;

type Lock = number[];
type Key = number[];

function parseInput(input: string): { locks: Lock[]; keys: Key[] } {
  const lines = input.split("\n");
  const locks: Lock[] = [];
  const keys: Key[] = [];
  for (let i = 0; i < lines.length; i += 8) {
    const set = lines.slice(i, i + 7);
    const g = Grid.fromLines(set);
    const nums = [0, 0, 0, 0, 0];
    for (let i = 0; i < nums.length; i++) {
      nums[i] = g.cells.filter((c) => c.x === i && c.isWall).length - 1;
    }
    if (g.getCell(0, 0)?.isWall) {
      locks.push(nums);
    } else {
      keys.push(nums);
    }
  }

  return { locks, keys };
}

function part1(input: string): number {
  const { locks, keys } = parseInput(input);
  const valids = locks.map((lock) => {
    return keys.filter((key) => key.every((k, i) => k + lock[i] < 6)).length;
  });
  return arrSum(valids);
}

const t = part1(test);
if (t == 3) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}

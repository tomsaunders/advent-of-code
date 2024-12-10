#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 10
 *
 * Summary: Given a 2D map with digits, find all paths that go from 0,1,2... 9 and count the different 9s that can be reached
 * Escalation: Count the unique paths from each 0 to each 9
 * Naive:  N/A
 * Solution:
 *  1. Parse to grid and follow neighbours in the right sequence. Count unique 9s reached.
 *  2. Keep a count of each time a path reaches a 9, regardless of whether it's been already reached or not.
 *
 * Keywords: grid
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");

const test = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

const TRAILHEAD = "0";
const TRAILTAIL = "9";

function possibleTails(head: Cell): Cell[] {
  const tails: Cell[] = [];
  const queue: Cell[] = [head];
  while (queue.length) {
    const curr = queue.pop() as Cell;
    if (curr.type === TRAILTAIL) {
      tails.push(curr);
    } else {
      const seekNextStep = (curr.int + 1).toString();
      curr.directNeighbours
        .filter((n) => n.type === seekNextStep)
        .forEach((n) => {
          queue.push(n);
        });
    }
  }
  return tails;
}

function part1(input: string): number {
  const g = parseInput(input);
  const heads = g.cells.filter((c) => c.type === TRAILHEAD);

  return arrSum(
    heads.map((h) => new Set(possibleTails(h).map((t) => t.xy)).size),
  );
}

function part2(input: string): number {
  const g = parseInput(input);
  const heads = g.cells.filter((c) => c.type === "0");

  return arrSum(heads.map((h) => possibleTails(h).length));
}

const t = part1(test);
if (t == 36) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 81) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

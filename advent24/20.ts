#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 20
 *
 * Summary: Given a grid where there's only one path from start to end, identify shortcuts that are possible if 1 wall can be skipped through
 * Escalation: 19 walls can be skipped through
 * Naive:  N/A
 * Solution:
 *  1. Work out the path from start to end, keeping track of distance from start.
 * For each point along the path, try the 4 directions to see if there's a nearer point on the path that counts as a shortcut.
 *  2. Change the approach from 1 so that instead of looking 2 ahead so that a single wall can be skipped, find all cells within the manhattan distance of 20 because they can be reached in 19 skipps
 *
 * Keywords: grid
 * References: N/A
 */
import * as fs from "fs";
import { Cell, Grid, SPACE } from "./util";
const input = fs.readFileSync("input20.txt", "utf8");
const test = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

function getHonestPath(from: Cell, to: Cell): Cell[] {
  const path: Cell[] = [];
  let curr: Cell | undefined = from;
  while (curr) {
    curr.visited = true;
    curr.tentativeDist = path.length;
    path.push(curr);

    const next: Cell | undefined = curr.openNeighbours.find((n) => !n.visited);
    if (!next) {
      curr = undefined;
    } else {
      curr = next!;
    }
  }
  return path;
}

function getAllShortcuts(
  path: Cell[],
  maxCheatSize: number,
): Record<string, number> {
  const cheats: Record<string, number> = {};
  const k = (a: Cell, b: Cell) => [a.xy, b.xy].join(" : ");
  const cells = path[0].grid.cells;
  path.forEach((c) => {
    const time = c.tentativeDist;
    ["n", "e", "s", "w"].forEach((d) => {
      const nearEnough = cells.filter(
        (n) => n.getDistance(c) <= maxCheatSize && n.isSpace,
      );
      nearEnough.forEach((n) => {
        const i = n.getDistance(c);
        const saving = n.tentativeDist - time - i;
        if (saving > 0) {
          cheats[k(c, n)] = saving;
        }
      });
    });
  });
  return cheats;
}

function part1(input: string, savingThreshold: number): number {
  const g = parseInput(input);
  const from = g.cells.find((c) => c.type === "S")!;
  const to = g.cells.find((c) => c.type === "E")!;
  to.type = SPACE;
  g.init();

  const path = getHonestPath(from, to);
  const cheats = getAllShortcuts(path, 2);

  return Object.values(cheats).filter((n) => n >= savingThreshold).length;
}

function part2(input: string, savingThreshold: number): number {
  const g = parseInput(input);
  const from = g.cells.find((c) => c.type === "S")!;
  const to = g.cells.find((c) => c.type === "E")!;
  to.type = SPACE;
  g.init();

  const path = getHonestPath(from, to);
  const cheats = getAllShortcuts(path, 20);

  return Object.values(cheats).filter((n) => n >= savingThreshold).length;
}

const t = part1(test, 64);
if (t == 1) {
  console.log("part 1 answer", part1(input, 100));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test, 74);
if (t2 == 7) {
  console.log("part 2 answer", part2(input, 100));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 21
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
import { arrSum, Cell, Direction, Grid } from "./util";
const input = fs.readFileSync("input21.txt", "utf8");
const test = `029A
980A
179A
456A
379A`;

function parseInput(input: string): string[] {
  return input.split("\n");
}

const shortestPathCache: Record<string, string[]> = {};

function findShortestPath(from: Cell, to: Cell): string[] {
  const k = `${from}:::${to}`;
  if (!shortestPathCache[k]) {
    const directions = ["n", "s", "e", "w"] as Direction[];
    const queue: { at: Cell; seen: Cell[]; dirs: string }[] = [
      { at: from, seen: [], dirs: "" },
    ];

    let min = 999;
    let shortestPaths: string[] = [];
    while (queue.length) {
      const { at, seen, dirs } = queue.pop()!;
      const cost = dirs.length;

      const nextSeen = seen.slice(0);
      nextSeen.push(at);

      if (at === to) {
        if (cost < min) {
          min = cost;
          shortestPaths = [];
        }
        if (cost === min) {
          shortestPaths.push(dirs);
        }
        continue;
      }

      if (cost >= min) continue;

      directions.forEach((dir) => {
        const next = at.getDirection(dir);
        if (next && !next.isWall && !seen.includes(next)) {
          queue.push({ at: next, seen: nextSeen, dirs: dirs + dir });
        }
      });
    }
    shortestPathCache[k] = shortestPaths;
  }
  return shortestPathCache[k];
}

function codeToCells(g: Grid, code: string): Cell[] {
  return code.split("").map((x) => g.findByType(x)) as Cell[];
}

const numpadGrid = Grid.fromLines(["789", "456", "123", "#0A"]);
const dirpadGrid = Grid.fromLines(["#nA", "wse"]);

const dirpadCache: Record<string, number> = {};
function shortestDirpad(path: string, level: number, maxLevel: number): number {
  const k = `${path}:${level}:${maxLevel}`;
  if (!dirpadCache[k]) {
    // add A on the end to send command
    const dirRoute = codeToCells(dirpadGrid, path + "A");
    let d = 0;
    for (let i = 1; i <= path.length; i++) {
      const [from, to] = dirRoute.slice(i - 1);
      const options = findShortestPath(from, to);
      const costs = options.map(
        (o) =>
          level === maxLevel
            ? o.length + 1
            : shortestDirpad("A" + o, level + 1, maxLevel) // prepend A to reflect starting point
      );
      const min = Math.min(...costs);
      d += min;
    }
    dirpadCache[k] = d;
  }
  return dirpadCache[k];
}

function shortestSequence(code: string, dirpadCount: number): number {
  const numpadRoute = codeToCells(numpadGrid, "A" + code);

  let d = 0;
  for (let i = 1; i <= code.length; i++) {
    const [from, to] = numpadRoute.slice(i - 1);
    const numpadMoveOptions = findShortestPath(from, to);
    const costs = numpadMoveOptions.map((o) => {
      return shortestDirpad("A" + o, 1, dirpadCount);
    });
    d += Math.min(...costs);
  }

  return d;
}

function part1(input: string): number {
  const codes = parseInput(input);

  return arrSum(
    codes.map((code) => {
      const shortest = shortestSequence(code, 2);
      const numericValue = parseInt(code.substring(0, 3), 10);
      return shortest * numericValue;
    })
  );
}

function part2(input: string): number {
  const codes = parseInput(input);

  return arrSum(
    codes.map((code) => {
      const shortest = shortestSequence(code, 25);
      const numericValue = parseInt(code.substring(0, 3), 10);
      return shortest * numericValue;
    })
  );
}

const t = part1(test);
if (t == 126384) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}

console.log("part 2 answer", part2(input));

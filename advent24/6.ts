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
import { Cell, Direction, Grid, WALL } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");
const test = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

const dxdy: Record<Direction, [number, number]> = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  North: [0, 1],
  East: [1, 0],
  South: [0, 1],
  West: [-1, 0],
};
const nextDir: Record<Direction, Direction> = {
  n: "e",
  e: "s",
  s: "w",
  w: "n",
  North: "e",
  East: "s",
  South: "w",
  West: "n",
};

function part1(input: string): number {
  const grid = parseInput(input);
  const guard = grid.cells.find((c) => c.type === "^");
  let dir: Direction = "n";

  let curr = guard;
  while (curr) {
    curr.visited = true;
    let [dx, dy] = dxdy[dir];
    let next = curr.getCell(dx, dy);
    if (next?.isWall) {
      dir = nextDir[dir];
      [dx, dy] = dxdy[dir];
      next = curr.getCell(dx, dy);
    }
    curr = next;
  }
  return grid.cells.filter((c) => c.visited).length;
}

function isLoop(grid: Grid): boolean {
  const guard = grid.cells.find((c) => c.type === "^");
  let dir: Direction = "n";

  let curr = guard;
  const seen = new Set<string>();
  while (curr) {
    if (seen.has(`${dir}${curr.xy}`)) {
      return true;
    }
    seen.add(`${dir}${curr.xy}`);
    curr.visited = true;
    let [dx, dy] = dxdy[dir];
    let next = curr.getCell(dx, dy);
    if (next?.isWall) {
      dir = nextDir[dir];
      [dx, dy] = dxdy[dir];
      next = curr.getCell(dx, dy);
    }
    curr = next;
  }
  return false;
}

function part2(input: string): number {
  const grid = parseInput(input);
  const guard = grid.cells.find((c) => c.type === "^");
  let dir: Direction = "n";

  let curr = guard;
  const seen: string[] = [];
  while (curr) {
    seen.push([dir, curr.x, curr.y].join(":"));
    curr.visited = true;
    let [dx, dy] = dxdy[dir];
    let next = curr.getCell(dx, dy);
    if (next?.isWall) {
      dir = nextDir[dir];
      [dx, dy] = dxdy[dir];
      next = curr.getCell(dx, dy);
    }
    curr = next;
  }

  // return seen.filter((s, i, a) => {
  //   console.log("l2", i, a.length);
  //   return isLoop2(i, a.slice(0, i + 1), parseInput(input));
  // }).length;

  const x2 = new Set<string>();
  seen
    .filter((c, i, a) => {
      const [dir, x, y] = c.split(":");
      console.log(i, a.length);
      const g = parseInput(input);
      const n = g.getCell(parseInt(x), parseInt(y))!;
      n.type = WALL;
      return isLoop(g);
    })
    .forEach((c) => {
      const [dir, x, y] = c.split(":");
      x2.add(`${x},${y}`);
    });
  return x2.size;
}

const t = part1(test);
if (t == 41) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 6) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
// 1834 too high
// 1830 too low
// not 1833 / 1832

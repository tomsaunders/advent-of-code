#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 21
 *
 * Summary: Breadth-first expansion of a grid to find cells reachable in n steps
 * Escalation: Infinitely repeating grid with very large n
 * Naive:  Pathfinding. The solution ran poorly until some insights into how to reduce the search space - if something was reachable in an even number of steps < n , it could always be backtracked to.
 * Solution: Reddit. The reference has diagrams that explain how to evaluate the different kinds of repeating tile
 *
 * Keywords: Grid, Infinite geometry
 * References: https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21
 */
import * as fs from "fs";
import { Cell, Grid, SPACE } from "./util";
const input = fs.readFileSync("input21.txt", "utf8");
const test = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

interface Path {
  count: number;
  cell: Cell;
}

function part1(input: string, stepCount: number): number {
  const grid = parseInput(input);
  const start = grid.cells.find((c) => c.type === "S")!;
  start.type = SPACE;
  grid.init();
  const paths: Path[] = [{ count: 0, cell: start }];
  const valid = new Set<string>();
  while (paths.length) {
    const { count, cell } = paths.shift() as Path;

    if (count % 2 === 0) {
      // any cell reachable in an even number of steps can be backtracked to - so it is valid
      valid.add(cell.xy);
    }
    if (count < stepCount) {
      cell.openNeighbours.forEach((n) => {
        if (!n.visited) {
          n.visited = true;
          paths.push({ count: count + 1, cell: n });
        }
      });
    }
  }
  grid.draw();

  return valid.size;
}

function part2(input: string, stepCount: number): number {
  const grid = parseInput(input);
  const start = grid.cells.find((c) => c.type === "S")!;
  start.type = SPACE;
  grid.init();
  const distFromStartMap: Record<string, number> = {};
  const paths: Path[] = [{ count: 0, cell: start }];
  while (paths.length) {
    const { count, cell } = paths.shift() as Path;
    distFromStartMap[cell.coord] = count;
    cell.openNeighbours.forEach((n) => {
      if (!n.visited) {
        n.visited = true;
        paths.push({ count: count + 1, cell: n });
      }
    });
  }

  const distValues = Object.values(distFromStartMap);

  const stepsToEdge = Math.floor(grid.maxX / 2);

  // the following comments are from the reference link at the top of the page.

  // Visited is a HashMap<Coord, usize> which maps tiles in the input-square to their distance from the starting tile
  // So read this as "even_corners is the number of tiles which have a distance that is even and greater than 65"
  // let even_corners = visited.values().filter(|v| **v % 2 == 0 && **v > 65).count();
  const evenCorners = distValues.filter((v) => v % 2 === 0 && v > stepsToEdge).length;
  // let odd_corners = visited.values().filter(|v| **v % 2 == 1 && **v > 65).count();
  const oddCorners = distValues.filter((v) => v % 2 === 1 && v > stepsToEdge).length;

  // let even_full = visited.values().filter(|v| **v % 2 == 0).count();
  const evenFull = distValues.filter((v) => v % 2 === 0).length;
  // let odd_full = visited.values().filter(|v| **v % 2 == 1).count();
  const oddFull = distValues.filter((v) => v % 2 === 1).length;

  // This is 202300 but im writing it out here to show the process
  // let n = ((26501365 - (env.dim.0 / 2)) / env.dim.0) as usize;
  const n = (stepCount - stepsToEdge) / (grid.maxX + 1);

  return (n + 1) * (n + 1) * oddFull + n * n * evenFull - (n + 1) * oddCorners + n * evenCorners;
}

const t = part1(test, 6);
if (t == 16) {
  console.log("part 1 answer", part1(input, 64));
  // the input has different properties which means the part2 solution works for it but not the test input.
  console.log("part 2 answer", part2(input, 26501365));
} else {
  console.log("part 1 test fail", t);
}

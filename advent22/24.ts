#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 24
 *
 * Summary: Pathfind through a moving grid where the free cells change every tick (t)
 * Escalation: Go back to the start, then go to the end again
 * Naive:
 * Solution: Got a hint from reddit that it's not necessary to compute the blizzards moving on the fly -
 *  because they're consistently cycling on either the x or y axis, there's a period which is the lowest common multiple of width and height
 *  For each t % period, know which free cells are available.
 *  For each path's next options, look up whether the available moves (N S E W 0) will be free at that t
 *  For part 2, refactor so that part 1 can accept a start time allowing the multi step process. Calculate each step individually rather than making a very big search space
 *
 * Keywords: Cycle, Path finding
 * References:
 */
import * as fs from "fs";
import { arrSum, Grid, lcm, SPACE, WALL } from "./util";
const input = fs.readFileSync("input24.txt", "utf8");

const test = `#E######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

const vectors: Record<string, [number, number]> = {
  ">": [1, 0],
  v: [0, 1],
  "<": [-1, 0],
  "^": [0, -1],
};

interface Blizzard {
  type: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const moveOptions: [number, number][] = [
  [-1, 0],
  [0, 1],
  [0, 0],
  [1, 0],
  [0, -1],
];

interface PathOption {
  x: number;
  y: number;
  t: number;
}

function getFreeCells(grid: Grid, period: number): Set<string>[] {
  const freeCells: Set<string>[] = new Array(period);
  const width = grid.maxX - 1;
  const height = grid.maxY - 1;

  const blizzards: Blizzard[] = grid.cells
    .filter((c) => ![SPACE, WALL, "E"].includes(c.type))
    .map((b) => {
      const x = b.x - 1;
      const y = b.y - 1;
      const [dx, dy] = vectors[b.type];
      return { x, y, dx, dy, type: b.type };
    });

  for (let i = 0; i < period; i++) {
    freeCells[i] = new Set<string>();
    // reset grid
    for (let x = 1; x <= width; x++) {
      for (let y = 1; y <= height; y++) {
        grid.getCell(x, y)!.type = SPACE;
      }
    }
    blizzards.forEach((b) => {
      let bx = (b.x + i * b.dx) % width;
      let by = (b.y + i * b.dy) % height;
      if (bx < 0) bx += width;
      if (by < 0) by += height;
      grid.getCell(bx + 1, by + 1)!.type = b.type;
    });
    grid.cells.filter((c) => c.isSpace).forEach((c) => freeCells[i].add(c.xy));
    // console.log(freeCells[i]);
    // grid.draw();
  }

  return freeCells;
}

function part1(input: string, startT: number = 1): number {
  const grid = parseInput(input);
  const width = grid.maxX - 1;
  const height = grid.maxY - 1;
  const period = lcm([width, height]); // all possible combinations of blizzard states will be reached in this period.

  const freeCells = getFreeCells(grid, period);

  function key({ x, y, t }: PathOption): string {
    return `${x},${y}@${t}`;
  }

  function h({ x, y, t }: PathOption): number {
    return width - x + height - y;
  }

  const paths: PathOption[] = [{ x: 1, y: 1, t: startT }];

  let shortest = Infinity;
  const seen = new Set<string>();
  while (paths.length) {
    const { x, y, t } = paths.pop()!;
    if (x === width && y === height) {
      // at end
      shortest = Math.min(shortest, t + 1);
      // console.log("shortest path", shortest, "remaining", paths.length);
      continue;
    }
    const bt = h({ x, y, t }) + t;
    if (bt >= shortest) {
      continue;
    }
    const nt = t + 1;
    const freeCellOptions = freeCells[nt % period];
    moveOptions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      const k = key({ x: nx, y: ny, t: nt });
      if (freeCellOptions.has(`${nx}, ${ny}`) && !seen.has(k)) {
        seen.add(k);
        paths.push({ x: nx, y: ny, t: nt });
      }
    });

    paths.sort((a, b) => h(b) - h(a));
  }

  return shortest;
}

function part2(input: string, startT: number): number {
  const grid = parseInput(input);
  const width = grid.maxX - 1;
  const height = grid.maxY - 1;
  const period = lcm([width, height]); // all possible combinations of blizzard states will be reached in this period.

  const freeCells = getFreeCells(grid, period);

  function key({ x, y, t }: PathOption): string {
    return `${x},${y}@${t}`;
  }

  function h({ x, y, t }: PathOption): number {
    return x + y;
  }

  const paths: PathOption[] = [{ x: width, y: height + 1, t: startT }];

  let shortest = Infinity;
  const seen = new Set<string>();
  while (paths.length) {
    const { x, y, t } = paths.pop()!;
    if (x === 1 && y === 1) {
      // at end
      shortest = Math.min(shortest, t + 1);
      // console.log("shortest path", shortest, "remaining", paths.length);
      continue;
    }
    const bt = h({ x, y, t }) + t;
    if (bt >= shortest) {
      continue;
    }
    const nt = t + 1;
    const freeCellOptions = freeCells[nt % period];
    moveOptions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      const k = key({ x: nx, y: ny, t: nt });
      if (freeCellOptions.has(`${nx}, ${ny}`) && !seen.has(k)) {
        seen.add(k);
        paths.push({ x: nx, y: ny, t: nt });
      }
    });

    paths.sort((a, b) => h(b) - h(a));
  }

  return shortest;
}

const t1 = part1(test);
if (t1 === 18) {
  const p1 = part1(input);
  console.log("Part 1: ", p1);
  const t2a = part2(test, t1);
  const t2b = part1(test, t2a);
  if (t2a === 41 && t2b === 54) {
    const p2 = part2(input, p1);
    const p2b = part1(input, p2);
    console.log("Part 2a: ", p2);
    console.log("Part 2b: ", p2b);
  } else {
    console.log("Test2 fail: ", t2a, t2b);
  }
} else {
  console.log("Test fail: ", t1);
}

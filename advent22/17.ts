#!/usr/bin/env ts-node
import { X_OK } from "constants";
import * as fs from "fs";
import { Cell, Grid, SPACE, WALL } from "./util";
const input = fs.readFileSync("input17.txt", "utf8");

const test = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;
const ROCK = "@";
const CORN = "+";
const FLOR = "-";
const SIDE = "|";

type Rock = Cell[];

function init(): Grid {
  const grid = new Grid();
  grid.createCell(0, 0, 0, CORN);
  grid.createCell(1, 0, 0, FLOR);
  grid.createCell(2, 0, 0, FLOR);
  grid.createCell(3, 0, 0, FLOR);
  grid.createCell(4, 0, 0, FLOR);
  grid.createCell(5, 0, 0, FLOR);
  grid.createCell(6, 0, 0, FLOR);
  grid.createCell(7, 0, 0, FLOR);
  grid.createCell(8, 0, 0, CORN);
  grid.createCell(0, -1, 0, SIDE);
  grid.createCell(8, -1, 0, SIDE);

  return grid;
}

function addRock(grid: Grid, rockNum: number): Rock {
  const topWall = Math.min(
    ...grid.cells.filter((c) => [WALL, FLOR].includes(c.type)).map((c) => c.y)
  );

  const startY = topWall - 4;
  const startX = 3;

  for (let y = topWall; y > topWall - 8; y--) {
    grid.getCell(0, y, 0, true)!.type = SIDE;
    grid.getCell(8, y, 0, true)!.type = SIDE;
  }

  if (rockNum % 5 === 0) {
    // @@@@
    return [
      grid.createCell(startX + 0, startY - 0, 0, ROCK),
      grid.createCell(startX + 1, startY - 0, 0, ROCK),
      grid.createCell(startX + 2, startY - 0, 0, ROCK),
      grid.createCell(startX + 3, startY - 0, 0, ROCK),
    ] as Rock;
  } else if (rockNum % 5 === 1) {
    // .@.
    // @@@
    // .@.
    return [
      grid.createCell(startX + 1, startY - 0, 0, ROCK), //bottom
      grid.createCell(startX + 0, startY - 1, 0, ROCK),
      grid.createCell(startX + 1, startY - 1, 0, ROCK),
      grid.createCell(startX + 2, startY - 1, 0, ROCK),
      grid.createCell(startX + 1, startY - 2, 0, ROCK), // top
    ] as Rock;
  } else if (rockNum % 5 === 2) {
    // ..@
    // ..@
    // @@@
    return [
      grid.createCell(startX + 0, startY - 0, 0, ROCK),
      grid.createCell(startX + 1, startY - 0, 0, ROCK),
      grid.createCell(startX + 2, startY - 0, 0, ROCK),
      grid.createCell(startX + 2, startY - 1, 0, ROCK),
      grid.createCell(startX + 2, startY - 2, 0, ROCK),
    ] as Rock;
  } else if (rockNum % 5 === 3) {
    // @
    // @
    // @
    // @
    return [
      grid.createCell(startX + 0, startY - 0, 0, ROCK),
      grid.createCell(startX + 0, startY - 1, 0, ROCK),
      grid.createCell(startX + 0, startY - 2, 0, ROCK),
      grid.createCell(startX + 0, startY - 3, 0, ROCK),
    ] as Rock;
  } else if (rockNum % 5 === 4) {
    // @@
    // @@
    return [
      grid.createCell(startX + 0, startY - 0, 0, ROCK),
      grid.createCell(startX + 1, startY - 0, 0, ROCK),
      grid.createCell(startX + 0, startY - 1, 0, ROCK),
      grid.createCell(startX + 1, startY - 1, 0, ROCK),
    ] as Rock;
  }
  return [] as Rock;
}

function isOpen(c: Cell): boolean {
  if (c.x === 0 || c.x === 8) return false;
  if (c.type === WALL || c.type === FLOR || c.type === CORN) return false;

  if (c.type === ROCK) return true; // part of same rock
  // else air
  return true;
}

function dropRock(
  grid: Grid,
  rock: Rock,
  fallen: number,
  input: string,
  j: number
): [Rock, number, number] {
  let stopped = false;
  while (!stopped) {
    // jet move
    const jet = input[j++ % input.length];
    if (jet === ">" && rock.every((c) => isOpen(c.getEast(true)!))) {
      rock.forEach((c) => {
        c!.type = SPACE;
      });
      rock = rock.map((c) => {
        const n = c.getEast(true);
        n!.type = ROCK;
        return n;
      }) as Rock;
    } else if (jet === "<" && rock.every((c) => isOpen(c.getWest(true)!))) {
      rock.forEach((c) => {
        c!.type = SPACE;
      });
      rock = rock.map((c) => {
        const n = c.getWest(true);
        n!.type = ROCK;
        return n;
      }) as Rock;
    }

    // drop
    if (rock.every((c) => isOpen(c.getSouth(true)!))) {
      rock.forEach((c) => {
        c!.type = SPACE;
      });
      rock = rock.map((c) => {
        const n = c.getSouth(true);
        n!.type = ROCK;
        return n;
      }) as Rock;
    } else {
      rock.forEach((c) => {
        c!.type = WALL;
      });
      rock = addRock(grid, ++fallen);
      stopped = true;
    }
  }
  return [rock, fallen, j];
}

function getHeight(grid: Grid): number {
  return Math.max(
    ...grid.cells.filter((c) => c.isWall).map((c) => Math.abs(c.y))
  );
}

function part1(input: string): number {
  const grid = init();
  let fallen = 0;
  let j = 0;
  let rock = addRock(grid, fallen);

  while (fallen < 2022) {
    [rock, fallen, j] = dropRock(grid, rock, fallen, input, j);
  }
  return getHeight(grid);
}

function part2(input: string): number {
  const grid = init();
  let fallen = 0;
  let j = 0;
  let rock = addRock(grid, fallen);

  const seen: Record<string, number> = {};
  const heights: Record<number, number> = {};

  let extra = 0;
  while (fallen < 1000000000000) {
    [rock, fallen, j] = dropRock(grid, rock, fallen, input, j);
    const fk = fallen % 5;
    const jk = j % input.length;
    const key = `${fk}:${jk}`;

    heights[fallen] = getHeight(grid);
    if (seen[key] && fallen > 2000 && !extra) {
      const old = seen[key];
      const rockDiff = fallen - old;
      const highDiff = heights[fallen] - heights[old];
      // console.log(
      //   `- last saw ${key} at ${old}, now ${fallen}, rock diff is ${rockDiff}, height diff is ${highDiff}`
      // );
      const millDiff = 1000000000000 - fallen;
      const rounds = Math.floor(millDiff / rockDiff);
      fallen += rounds * rockDiff;
      extra = highDiff * rounds;
      // console.log("- jumping to ", fallen, "with extra", extra);
    }
    seen[key] = fallen;
  }
  return getHeight(grid) + extra;
}

const t1 = part1(test);
if (t1 === 3068) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 1514285714288) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}
// 1595362318837 too high

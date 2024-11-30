#!/usr/bin/env ts-node

import { arrSum, Cell, Grid } from "./util";

/**
 * Advent of Code 2017 - Day 3
 *
 * Summary: Given an infinite two dimensional grid where the cells are numbered in a spiral from the center, calculate the distance a given number is from the start
 * Escalation: The numbers written for a cell depend on the neighbours
 * Solution: Part 1 - rather than writing out every value, shortcut the method by identifying a formula to get the corners of each spiral 'loop' and minimise the iterations required to find the coordinates in a pseudo grid.
 * Part 2 - well rats, would have been better off writing the coordinates in a grid... _now_ use the grid util to make getting the neighbours easy.
 *
 * Keywords: Grid
 * References: N/A
 */
const input = 325489;
const test: Record<string, number> = {
  "1": 0,
  "12": 3,
  "23": 2,
  "1024": 31,
};
const test2: Record<string, number> = {
  "1212": 6,
  "1221": 0,
  "123425": 4,
  "123123": 12,
  "12131415": 4,
};

function part1(input: number): number {
  let i = 0;
  for (i = 0; Math.pow(2 * i + 1, 2) <= input; i++) {}
  const complete = i - 1;
  const completeSquare = Math.pow(2 * complete + 1, 2);

  if (completeSquare === input) {
    return complete + complete;
  }
  const cornerOffset = 2 * i;
  const ne = completeSquare + cornerOffset;
  const nw = ne + cornerOffset;
  const sw = nw + cornerOffset;
  let cell = 0,
    x = 0,
    y = 0,
    dx = 0,
    dy = 0;
  if (input >= sw) {
    cell = sw;
    x = -i;
    y = i;
    dx = 1;
  } else if (input >= nw) {
    cell = nw;
    x = -i;
    y = -i;
    dy = 1;
  } else if (input >= ne) {
    cell = ne;
    x = i;
    y = -i;
    dx = -1;
  } else {
    cell = completeSquare + 1;
    x = i;
    y = complete;
    dy = -1;
  }
  while (cell < input) {
    x += dx;
    y += dy;
    cell++;
  }

  return Math.abs(x) + Math.abs(y);
}

function part2(input: number): number {
  const grid = new Grid();
  let loop = 0,
    x = 0,
    y = 0,
    dx = 0,
    dy = 0,
    cell = 1;
  grid.createCell(x, y, 1, cell.toString());

  function makeCell(x: number, y: number): number {
    const c = grid.createCell(x, y, 1, "");
    c.init();
    const neighbours = c.allNeighbours.map((n) => n.int);

    const nextValue = arrSum(neighbours);
    c.type = nextValue.toString();
    return nextValue;
  }

  let lastValue = 1;
  while (lastValue < input) {
    if (x === loop && y === loop) {
      // at corner
      x++;
      dy = -1;
      lastValue = makeCell(x, y);
      loop++;
    } else if (dy === -1 && y > -loop) {
      y--;
      lastValue = makeCell(x, y);
    } else if (dy === -1 && y === -loop) {
      // corner, start going west
      dx = -1;
      dy = 0;
    } else if (dx === -1 && x > -loop) {
      x--;
      lastValue = makeCell(x, y);
    } else if (dx === -1 && x === -loop) {
      // corner, start going south
      dx = 0;
      dy = 1;
    } else if (dy === 1 && y < loop) {
      y++;
      lastValue = makeCell(x, y);
    } else if (dy === 1 && y === loop) {
      // corner, start going east
      dx = 1;
      dy = 0;
    } else if (dx === 1 && x < loop) {
      x++;
      lastValue = makeCell(x, y);
    }
  }
  grid.draw(1, false, (c?: Cell) => ` ${(c?.int.toString() || "").padStart(input.toString().length, " ")} `);

  return lastValue;
}

if (Object.entries(test).every(([input, result]) => part1(parseInt(input)) === result)) {
  console.log("part 1 answer", part1(input));
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 1 test fail");
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 23
 *
 * Summary: Game of life type simulation - simulate to a certain point
 * Escalation: Work out when the movement stops.
 * Naive:
 * Solution: Model the moves on a grid. Part 2 took 13s to run but reducing the number of cell lookups cut it in half
 *
 * Keywords: Game of Life
 * References:
 */
import * as fs from "fs";
import { arrSum, Cell, Grid, SPACE, WALL } from "./util";
const input = fs.readFileSync("input23.txt", "utf8");

const test = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

// elf #

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

interface Move {
  elf: Cell;
  to: Cell;
  valid: boolean;
}

function getProposedMoves(grid: Grid, roundNumber: number): Record<string, Move> {
  const elves = grid.cells.filter((c) => c.isWall);
  const proposals: Record<string, Move> = {};
  elves.forEach((elf) => {
    const nw = elf.getNorthWest(true);
    const nn = elf.getNorth(true);
    const ne = elf.getNorthEast(true);
    const ee = elf.getEast(true);
    const se = elf.getSouthEast(true);
    const ss = elf.getSouth(true);
    const sw = elf.getSouthWest(true);
    const ww = elf.getWest(true);

    const options: (Cell | undefined)[] = new Array(8);
    if ([nw, nn, ne, ee, se, ss, sw, ww].find((n) => n?.isWall)) {
      // can move
      if ([ne, nn, nw].every((n) => !n?.isWall)) {
        options[0] = options[4] = nn;
      }
      if ([se, ss, sw].every((n) => !n?.isWall)) {
        options[1] = options[5] = ss;
      }
      if ([nw, ww, sw].every((n) => !n?.isWall)) {
        options[2] = options[6] = ww;
      }
      if ([se, ee, ne].every((n) => !n?.isWall)) {
        options[3] = options[7] = ee;
      }
    }
    const proposedTo = options.find((x, idx) => !!x && idx >= roundNumber % 4);
    if (proposedTo) {
      if (proposals[proposedTo.coord]) {
        proposals[proposedTo.coord].valid = false;
      } else {
        proposals[proposedTo.coord] = { elf, to: proposedTo, valid: true };
      }
    }
  });
  return proposals;
}

function doMoves(moves: Move[]): void {
  moves.forEach(({ elf, to, valid }) => {
    if (!valid) return;

    elf.type = SPACE;
    to.type = WALL;
  });
}

function part1(input: string, turns = 10): number {
  const grid = parseInput(input);

  for (let i = 0; i <= turns; i++) {
    const proposedMoves = Object.values(getProposedMoves(grid, i));
    doMoves(proposedMoves);
  }

  // calculate the bounding rectangle ... xy is min, XY is max
  let x = 99,
    y = 99,
    X = 0,
    Y = 0;
  const elves = grid.cells.filter((c) => c.isWall);
  elves.forEach((elf) => {
    x = Math.min(x, elf.x);
    X = Math.max(X, elf.x);
    y = Math.min(y, elf.y);
    Y = Math.max(Y, elf.y);
  });
  const rectArea = (X - x + 1) * (Y - y + 1);
  return rectArea - elves.length;
}

function part2(input: string): number {
  console.time("part2");
  const grid = parseInput(input);

  let i = 0;
  while (true) {
    const proposedMoves = Object.values(getProposedMoves(grid, i));
    i++;
    doMoves(proposedMoves);
    if (proposedMoves.length === 0) {
      console.timeEnd("part2");
      return i;
    }
  }
}

const t1 = part1(test);
if (t1 === 110) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 20) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

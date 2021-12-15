#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell } from "./util";

const input = fs.readFileSync("input11.txt", "utf8");
const test = fs.readFileSync("test11.txt", "utf8");

function up(c: Cell): void {
  c.type = (c.int + 1).toString();
}

function part1(input: string): number {
  const grid = Grid.fromLines(input);
  let steps = 0;
  let flashed = 0;
  while (steps < 100) {
    grid.cells.forEach((c) => {
      up(c);
      c.reset();
    });
    let flashable = grid.cells.filter((c) => c.int > 9 && !c.visited);
    while (flashable.length) {
      flashable.forEach((f) => {
        f.allNeighbours.forEach((n) => up(n));
        f.visited = true;
      });
      flashable = grid.cells.filter((c) => c.int > 9 && !c.visited);
    }
    const flashedCells = grid.cells.filter((c) => c.visited);
    flashedCells.forEach((c) => (c.type = "0"));
    flashed += flashedCells.length;

    steps++;
  }

  return flashed;
}

const t1 = part1(test);
if (t1 === 1656) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const grid = Grid.fromLines(input);

  let steps = 0;
  let flashed = 0;
  while (flashed < 100) {
    grid.cells.forEach((c) => {
      up(c);
      c.reset();
    });
    let flashable = grid.cells.filter((c) => c.int > 9 && !c.visited);
    while (flashable.length) {
      flashable.forEach((f) => {
        f.allNeighbours.forEach((n) => up(n));
        f.visited = true;
      });
      flashable = grid.cells.filter((c) => c.int > 9 && !c.visited);
    }
    const flashedCells = grid.cells.filter((c) => c.visited);
    flashedCells.forEach((c) => (c.type = "0"));
    flashed = flashedCells.length;

    steps++;
  }

  return steps;
}

const t2 = part2(test);
if (t2 === 195) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

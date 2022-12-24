#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Cell, Grid, WALL } from "./util";
const input = fs.readFileSync("input14.txt", "utf8");

const test = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

function parse(input: string): Grid {
  const grid = new Grid();

  input.split("\n").forEach((line) => {
    const bits = line
      .split(" -> ")
      .map((b) => b.split(",").map((n) => parseInt(n, 10)));
    // [x,y] []
    for (let i = 1; i < bits.length; i++) {
      const [ax, ay] = bits[i - 1];
      const [bx, by] = bits[i];
      const minX = Math.min(ax, bx);
      const minY = Math.min(ay, by);
      const maxX = Math.max(ax, bx);
      const maxY = Math.max(ay, by);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          grid.createCell(x, y, 0, WALL);
        }
      }
    }
  });
  // grid.draw();
  return grid;
}

const SAND = "O";
function part1(input: string): number {
  const grid = parse(input);
  const maxY = grid.maxY; // once sand drops past here
  const [startX, startY] = [500, 0];

  const start = grid.getCell(startX, startY, 0, true) as Cell;
  let current = start;
  // console.log(maxY);
  // console.log("current is", current.coord);
  let z = 0;
  while (current.y < maxY) {
    // console.log("current is", current.coord);
    const options = [
      current.getSouth(true),
      current.getSouthWest(true),
      current.getSouthEast(true),
    ] as Cell[];
    let o = 0;
    for (; o < 3; o++) {
      const option = options[o];

      if (option.isSpace) {
        current = option;
        o = 99;
      }
    }
    if (o < 99) {
      // unable to move, mark this as sand
      current.type = SAND;
      current = start;
    }
  }

  return grid.cells.filter((c) => c.type === SAND).length;
}

function part2(input: string): number {
  const grid = parse(input);
  const maxY = grid.maxY; // once sand drops past here

  const maxX = grid.maxX + 1000;
  for (let x = grid.minX - 1000; x < maxX; x++) {
    grid.createCell(x, maxY + 2, 0, WALL);
  }

  const [startX, startY] = [500, 0];

  const start = grid.getCell(startX, startY, 0, true) as Cell;
  let current = start;
  // console.log(maxY);
  // console.log("current is", current.coord);
  let z = 0;
  console.log(z);
  while (start.type !== SAND) {
    // console.log("current is", current.coord);
    // grid.draw();
    const options = [
      current.getSouth(true),
      current.getSouthWest(true),
      current.getSouthEast(true),
    ] as Cell[];
    let o = 0;
    for (; o < 3; o++) {
      const option = options[o];

      if (option.isSpace) {
        current = option;
        o = 99;
      }
    }
    if (o < 99) {
      // unable to move, mark this as sand
      current.type = SAND;
      current = start;
    }
  }
  grid.draw();
  return grid.cells.filter((c) => c.type === SAND).length;
}

const t1 = part1(test);
if (t1 === 24) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 93) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

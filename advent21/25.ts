#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell, SPACE } from "./util";
const input = fs.readFileSync("input25.txt", "utf8");
const test = fs.readFileSync("test25.txt", "utf8");

function part1(input: string): number {
  const grid = Grid.fromLines(input);

  const HERD_EAST = ">";
  const HERD_SOUTH = "v";

  let moved = true;
  let turns = 0;
  while (moved) {
    moved = false;

    grid.cells
      .filter((c) => c.type === HERD_EAST)
      .filter((c) => {
        let next = c.x === grid.maxX ? grid.getCell(0, c.y) : c.east;
        if (next?.isSpace) {
          next.next = c.type;
          c.next = SPACE;
        }
      });
    grid.cells.forEach((c) => {
      if (c.next) {
        moved = true;
        c.type = c.next;
        c.next = undefined;
      }
    });
    grid.cells
      .filter((c) => c.type === HERD_SOUTH)
      .filter((c) => {
        let next = c.y === grid.maxY ? grid.getCell(c.x, 0) : c.south;
        if (next?.isSpace) {
          next.next = c.type;
          c.next = SPACE;
        }
      });
    grid.cells.forEach((c) => {
      if (c.next) {
        moved = true;
        c.type = c.next;
        c.next = undefined;
      }
    });

    turns++;
  }

  grid.draw(0, false);
  return turns;
}

const t1 = part1(test);
if (t1 === 58) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

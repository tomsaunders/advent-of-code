#!/usr/bin/env ts-node
import { X_OK } from "constants";
import * as fs from "fs";
import { arrSum, Cell, Grid, SPACE, WALL } from "./util";
const input = fs.readFileSync("input18.txt", "utf8");

const test = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

function parse(input: string): Grid {
  const grid = new Grid();
  input.split("\n").forEach((l) => {
    const bits = l.split(",").map((i) => parseInt(i, 10));
    grid.createCell(bits[0], bits[1], bits[2], WALL);
  });

  return grid;
}

function part1(input: string): number {
  const grid = parse(input);
  return arrSum(grid.cells.map((c) => 6 - c.getCubeNeighbours().length));
}

function inBounds(c: Cell): boolean {
  return (
    c.x >= -1 &&
    c.x <= 21 &&
    c.y >= -1 &&
    c.y <= 21 &&
    c.z >= -1 &&
    c.z <= 21 &&
    !c.isWall &&
    !c.visited
  );
}

const STEAM = "%";

function part2(input: string): number {
  const grid = parse(input);
  const queue: Cell[] = [grid.getCell(0, 0, 0, true) as Cell];
  while (queue.length) {
    const next = queue.shift() as Cell;
    next.init(false, true);
    if (!next.isWall) {
      next.type = STEAM;
    }
    for (const n of next.getCubeNeighbours(true)) {
      if (inBounds(n)) {
        queue.push(n);
        n.visited = true;
      }
    }
  }
  // }
  grid.drawAll();
  return arrSum(
    grid.cells
      .filter((c) => c.isWall)
      .map((c) => c.getCubeNeighbours().filter((n) => n.type === STEAM).length)
  );
}

const t1 = part1(test);
if (t1 === 64) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 58) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}
// 1595362318837 too high

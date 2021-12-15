#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell } from "./util";
const input = fs.readFileSync("input15.txt", "utf8");
const test = fs.readFileSync("test15.txt", "utf8");

function part1(input: string): number {
  const grid = Grid.fromLines(input);
  grid.cells.forEach((c) => {
    c.init();
    c.openNeighbours = c.directNeighbours;
    c.cost = c.int;
  });

  const shortestPath = grid.aStar(
    grid.getCell(grid.minX, grid.minY) as Cell,
    grid.getCell(grid.maxX, grid.maxY) as Cell
  );

  return shortestPath.pop()!.tentativeDist;
}

const t1 = part1(test);
if (t1 === 40) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 315) {
    console.log("Test2 pass");
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const grid = Grid.fromLines(input);

  const w = grid.maxX + 1;
  const h = grid.maxY + 1;
  const cells = grid.cells.slice(0);

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const diff = r + c;
      cells.forEach((x) => {
        let i = x.int + diff;
        if (i > 9) i -= 9;
        grid.createCell(x.x + c * w, x.y + r * h, 0, `${i}`);
      });
    }
  }

  grid.cells.forEach((c) => {
    c.init();
    c.openNeighbours = c.directNeighbours;
    c.cost = c.int;
  });

  const shortestPath = grid.aStar(
    grid.getCell(grid.minX, grid.minY) as Cell,
    grid.getCell(grid.maxX, grid.maxY) as Cell
  );

  return shortestPath.pop()!.tentativeDist;
}

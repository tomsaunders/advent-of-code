#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell, OFF } from "./util";
const input = fs.readFileSync("input20.txt", "utf8");
const test = fs.readFileSync("test20.txt", "utf8");

function part1(input: string): number {
  return run(input);
}

function run(input: string, enhanceCount: number = 2) {
  const lines = input.split("\n");
  const alg = lines.shift() as string;
  lines.shift();

  const grid = Grid.fromLines(lines);
  let newType = OFF;

  const w = enhanceCount * 2 + 10;
  const minX = grid.minX - w;
  const maxX = grid.maxX + w;
  const minY = grid.minY - w;
  const maxY = grid.maxY + w;

  function getCells(): Cell[] {
    const cells: Cell[] = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        let c = grid.getCell(x, y);
        if (!c) {
          c = grid.createCell(x, y, 0, newType);
        }
        cells.push(c as Cell);
      }
    }
    return cells;
  }

  function update(c: Cell): void {
    let binary: string = "";
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const n = grid.getCell(c.x + dx, c.y + dy, c.z);
        binary += n && n.isOn ? "1" : "0";
      }
    }
    const dec = parseInt(binary, 2);
    c.next = alg[dec];
  }

  for (let i = 0; i < enhanceCount; i++) {
    let cells = getCells();

    cells.forEach(update);
    cells.forEach((c) => {
      c.type = c.next || OFF;
      c.next = "";
    });
  }

  return grid.cells.filter(
    (c) =>
      c.isOn &&
      c.y < grid.maxY - enhanceCount &&
      c.y > grid.minY + enhanceCount &&
      c.x < grid.maxX - enhanceCount &&
      c.x > grid.minX + enhanceCount
  ).length;
}

const t1 = part1(test);
if (t1 === 35) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 3351) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  return run(input, 50);
}

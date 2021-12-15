#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell, ON, OFF } from "./util";
const input = fs.readFileSync("input13.txt", "utf8");
const test = fs.readFileSync("test13.txt", "utf8");

function part1(input: string): number {
  const lines = input.split("\n");
  const grid = new Grid();

  let first: string = "";
  lines.forEach((l) => {
    if (l.trim() === "") {
      return;
    } else if (l.startsWith("fold")) {
      if (!first) {
        first = l.replace("fold along ", "");
      }
    } else {
      const [x, y] = l.split(",").map((l) => parseInt(l, 10));
      grid.addCell(new Cell(grid, x, y, 0, ON));
    }
  });

  const axis: "x" | "y" = first[0] as "x" | "y";
  const num = parseInt(first.substring(2), 10);
  grid.cells
    .filter((c) => c[axis] === num && c.isOn)
    .forEach((c) => (c.type = OFF));
  grid.cells
    .filter((c) => c[axis] > num && c.isOn)
    .forEach((c) => {
      const diff = c[axis] - num;

      const d =
        axis === "y"
          ? (grid.getCell(c.x, num - diff, 0, true) as Cell)
          : (grid.getCell(num - diff, c.y, 0, true) as Cell);
      d.type = ON;
      c.type = OFF;
    });

  return grid.cells.filter((c) => c.isOn).length;
}

const t1 = part1(test);
if (t1 === 17) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const grid = new Grid();

  const instructions: string[] = [];
  lines.forEach((l) => {
    if (l.trim() === "") {
      return;
    } else if (l.startsWith("fold")) {
      instructions.push(l.replace("fold along ", ""));
    } else {
      const [x, y] = l.split(",").map((l) => parseInt(l, 10));
      grid.addCell(new Cell(grid, x, y, 0, ON));
    }
  });

  instructions.forEach((instruction) => {
    const axis: "x" | "y" = instruction[0] as "x" | "y";
    const num = parseInt(instruction.substring(2), 10);

    grid.cells
      .filter((c) => c[axis] === num && c.isOn)
      .forEach((c) => (c.type = OFF));
    grid.cells
      .filter((c) => c[axis] > num && c.isOn)
      .forEach((c) => {
        const diff = c[axis] - num;

        const d =
          axis === "y"
            ? (grid.getCell(c.x, num - diff, 0, true) as Cell)
            : (grid.getCell(num - diff, c.y, 0, true) as Cell);
        d.type = ON;
        c.type = OFF;
      });
  });

  grid.updateBoundaries(ON);
  // grid.maxY = 30;
  // grid.maxX = 100;
  grid.draw(0, false);
  return 0;
}

console.log("Part 2:");
part2(input);

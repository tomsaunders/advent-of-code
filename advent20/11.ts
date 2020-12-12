#!/usr/bin/env ts-node
import { arrSum, test, Grid, Cell } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input11.txt", "utf8");
const testIn = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`.split("\n");

const lines = input.split("\n");
const numbers = lines.map((l) => parseInt(l, 10));

const EMPTY = "L";
const FLOOR = ".";
const TAKEN = "#";

function countOccupied(lines: string[]): number {
  const g = Grid.fromLines(lines);
  for (const cell of g.cells) {
    cell.next = cell.type;
  }

  let changed = true;
  while (changed) {
    changed = false;
    const cells = g.cells;
    for (const cell of cells) {
      const occupiedNeighbours = cell.allNeighbours.filter(
        (c) => c.type === TAKEN
      );
      if (cell.type === EMPTY && occupiedNeighbours.length === 0) {
        cell.next = TAKEN;
        changed = true;
      } else if (cell.type === TAKEN && occupiedNeighbours.length >= 4) {
        cell.next = EMPTY;
        changed = true;
      }
    }
    for (const cell of cells) {
      cell.type = cell.next as string;
    }
    // g.draw();
  }
  return g.cells.filter((c) => c.type === TAKEN).length;
}

function seatInDir(cell: Cell, xOff: number, yOff: number): Cell {
  let n = 1;
  let start: Cell = cell.grid.getCell(
    cell.x + n * xOff,
    cell.y + n * yOff,
    cell.z
  ) as Cell;
  while (start && start.type === FLOOR) {
    n++;
    start = cell.grid.getCell(
      cell.x + n * xOff,
      cell.y + n * yOff,
      cell.z
    ) as Cell;
  }
  return start;
}

function visibleSeats(cell: Cell): Cell[] {
  const visible: Cell[] = [
    seatInDir(cell, 1, 1),
    seatInDir(cell, 1, 0),
    seatInDir(cell, 1, -1),
    seatInDir(cell, -1, 1),
    seatInDir(cell, -1, 0),
    seatInDir(cell, -1, -1),
    seatInDir(cell, 0, 1),
    seatInDir(cell, 0, -1),
  ].filter((c) => !!c);

  return visible;
}

function countOccupied2(lines: string[]): number {
  const g = Grid.fromLines(lines);
  for (const cell of g.cells) {
    cell.next = cell.type;
  }

  let changed = true;
  while (changed) {
    changed = false;
    const cells = g.cells;
    for (const cell of cells) {
      const occupiedNeighbours = visibleSeats(cell).filter(
        (c) => c.type === TAKEN
      );
      if (cell.type === EMPTY && occupiedNeighbours.length === 0) {
        cell.next = TAKEN;
        changed = true;
      } else if (cell.type === TAKEN && occupiedNeighbours.length >= 5) {
        cell.next = EMPTY;
        changed = true;
      }
    }
    for (const cell of cells) {
      cell.type = cell.next as string;
    }
    // g.draw();
  }
  return g.cells.filter((c) => c.type === TAKEN).length;
}

test(37, countOccupied(testIn));
console.log("Part One", countOccupied(lines));

test(26, countOccupied2(testIn));
console.log("Part Two", countOccupied2(lines));

#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input12.txt", "utf8");

const test = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

function parse(input: string): Grid {
  return Grid.fromLines(input);
}

interface Path {
  current: Cell;
  cost: number;
  estimate: number;
}

const score = (cell: Cell): number => {
  if (cell.type === "S") return "a".charCodeAt(0);
  if (cell.type === "E") return "z".charCodeAt(0);
  return cell.charCode;
};

function part1(input: string): number {
  const grid = parse(input);
  const start = grid.cells.find((c) => c.type === "S")!;
  const end = grid.cells.find((c) => c.type === "E")!;

  const possibleMoves = (cell: Cell): Cell[] => {
    const limit = score(cell) + 1;
    return cell.directNeighbours.filter((o) => score(o) <= limit);
  };

  return grid.shortestPath(start, end, possibleMoves);
}

function part2(input: string): number {
  const grid = parse(input);
  const end = grid.cells.find((c) => c.type === "E")!;

  const possibleMoves = (cell: Cell): Cell[] => {
    const limit = score(cell) - 1;
    return cell.directNeighbours.filter((o) => score(o) >= limit);
  };

  grid.breadthFirst(end, possibleMoves);

  return Math.min(
    ...grid.cells.filter((c) => c.type === "a").map((c) => c.tentativeDist)
  );
}
// abcdefgh going up from d - <= e
// reversing from d - >= c

const t1 = part1(test);
if (t1 === 31) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 29) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

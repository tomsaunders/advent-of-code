#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, PURP, RED, RESET, SPACE, YELLOW, arrSum } from "./util";
const input = fs.readFileSync("input16.txt", "utf8");
const test = String.raw`.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....`;

const MIRROR1 = "/";
const MIRROR2 = `\\`;
const SPLITH = "-";
const SPLITV = "|";

type CellType = "." | "/" | "\\" | "-" | "|";
type Velocity = -1 | 0 | 1;

function energisedCount(grid: Grid, start: Cell, startXDir: Velocity, startYDir: Velocity): number {
  grid.reset();
  const paths: [Cell | undefined, Velocity, Velocity][] = [[start, startXDir, startYDir]];
  let seen: Record<string, true> = {};
  while (paths.length) {
    // console.log(paths.length, " paths ");
    // grid.draw();
    let [beamCell, xDir, yDir] = paths.shift()!;
    const key = beamCell + `${xDir}:${yDir}`;
    if (!beamCell || seen[key]) {
      continue;
    }

    beamCell.visited = true;
    seen[key] = true;
    const cellType: CellType = beamCell.type as CellType;

    const nextCell: Cell | undefined = grid.getCell(beamCell.x + xDir, beamCell.y + yDir);
    if (beamCell?.isSpace) {
      paths.push([nextCell, xDir, yDir]);
    } else {
      if (xDir == 1) {
        // east
        if (cellType == "-") {
          // continue
          paths.push([nextCell, xDir, yDir]);
        } else if (cellType == "|") {
          // split
          paths.push([beamCell.north, 0, -1]);
          paths.push([beamCell.south, 0, 1]);
        } else if (cellType == "/") {
          paths.push([beamCell.north, 0, -1]);
        } else if (cellType == "\\") {
          paths.push([beamCell.south, 0, 1]);
        }
      } else if (yDir == 1) {
        // south
        if (cellType == "-") {
          // split
          paths.push([beamCell.west, -1, 0]);
          paths.push([beamCell.east, 1, 0]);
        } else if (cellType == "|") {
          // continue
          paths.push([nextCell, xDir, yDir]);
        } else if (cellType == "/") {
          paths.push([beamCell.west, -1, 0]);
        } else if (cellType == "\\") {
          paths.push([beamCell.east, 1, 0]);
        }
      } else if (xDir == -1) {
        // west
        if (cellType == "-") {
          // continue
          paths.push([nextCell, xDir, yDir]);
        } else if (cellType == "|") {
          // split
          paths.push([beamCell.north, 0, -1]);
          paths.push([beamCell.south, 0, 1]);
        } else if (cellType == "/") {
          paths.push([beamCell.south, 0, 1]);
        } else if (cellType == "\\") {
          paths.push([beamCell.north, 0, -1]);
        }
      } else if (yDir == -1) {
        // north
        if (cellType == "-") {
          // split
          paths.push([beamCell.west, -1, 0]);
          paths.push([beamCell.east, 1, 0]);
        } else if (cellType == "|") {
          // continue
          paths.push([nextCell, xDir, yDir]);
        } else if (cellType == "/") {
          paths.push([beamCell.east, 1, 0]);
        } else if (cellType == "\\") {
          paths.push([beamCell.west, -1, 0]);
        }
      }
    }
  }
  // grid.draw();

  return grid.cells.filter((c) => c.visited).length;
}

function part1(input: string): number {
  const grid = Grid.fromLines(input);
  return energisedCount(grid, grid.getCell(0, 0)!, 1, 0);
}

function part2(input: string): number {
  const grid = Grid.fromLines(input);

  const counts: number[] = [];
  for (let x = grid.minX; x <= grid.maxX; x++) {
    counts.push(energisedCount(grid, grid.getCell(x, grid.minY)!, 0, 1));
    counts.push(energisedCount(grid, grid.getCell(x, grid.maxY)!, 0, -1));
  }

  for (let y = grid.minY; y <= grid.maxY; y++) {
    counts.push(energisedCount(grid, grid.getCell(grid.minX, y)!, 1, 0));
    counts.push(energisedCount(grid, grid.getCell(grid.maxX, y)!, -1, 0));
  }

  return Math.max(...counts);
}

const t = part1(test);
if (t == 46) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 51) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

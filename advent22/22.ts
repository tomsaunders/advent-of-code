#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 22
 *
 * Summary: Move through a grid where going off an edge wraps around
 * Escalation: The grid is actually a cube so the wrapping around behaviour is different
 * Naive: Step by step , wrap around the flat map.
 * Solution: There was a lot of reference to reddit for ideas or debugging. I even cut a cube out of paper to map the transitions.
 *  Ultimately I had to compare to a known good solution to find the problem (moving to wrong square in 1 out of 14 hardcoded jumps)
 *  The _best_ solution involved modelling the transitions off the edges using complex numbers and 3d geometry things that I couldn't get my head around.
 *
 * Keywords: Grid, 3D geometry,
 * References:
 */
import * as fs from "fs";
import { arrSum, Cell, Grid, SPACE, WALL } from "./util";
const input = fs.readFileSync("input22.txt", "utf8");

const test = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

const test2 = `    ...#.#..
    .#......
    #.....#.
    ........
    ...#
    #...
    ....
    ..#.
..#....#
........
.....#..
........
#...
..#.
....
....

10R5L5R10L4R5L5`; // from reddit https://old.reddit.com/r/adventofcode/comments/zst7z3/2022_day_22_part_2_improved_example_input_working/

type Step = "L" | "R" | number;

const directions = [">", "v", "<", "^"];
const vectors = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]; //dx dy

function parseInput(input: string): [Grid, Step[]] {
  const lines = input.split("\n");
  const stepStr = lines.pop()!;
  lines.pop(); // spacer
  const grid = Grid.fromLines(lines);
  const steps: Step[] = [];

  let buffer = "";
  for (let i = 0; i < stepStr.length; i++) {
    if (stepStr[i] === "L" || stepStr[i] === "R") {
      steps.push(parseInt(buffer));
      steps.push(stepStr[i] as "L" | "R");
      buffer = "";
    } else {
      buffer += stepStr[i];
    }
  }
  if (buffer) {
    steps.push(parseInt(buffer));
  }

  return [grid, steps];
}

function part1(input: string): number {
  const [grid, steps] = parseInput(input);

  let start = grid.cells.find((c) => c.y === grid.minY && c.isSpace)!;
  // start!.visited = true;
  // grid.draw();
  let dirIdx = directions.length * 100;

  let current = start;
  current.visited = true;
  steps.forEach((s) => {
    // console.log(s);
    if (s === "L") {
      dirIdx--;
    } else if (s === "R") {
      dirIdx++;
    } else {
      const [dx, dy] = vectors[dirIdx % directions.length];
      for (let i = 0; i < s; i++) {
        let next = grid.getCell(current.x + dx, current.y + dy);
        if (next && (next.isWall || next.isSpace)) {
          if (next.isWall) {
            continue;
          }
          // else is space
          next.visited = true;
          // console.log("at", next.label);
          current = next;
        } else {
          // wrap around
          // console.log("need to wrap around, cant find", current.x + dx, current.y + dy);
          let prev: Cell = current as Cell;
          // console.log("prev is", prev.label);
          let p = grid.getCell(prev.x - dx, prev.y - dy);
          while (p && (p.isWall || p.isSpace)) {
            prev = p;
            p = grid.getCell(prev.x - dx, prev.y - dy);
            // console.log("prev is", prev.label);
          }
          // console.log("found", prev.label);
          if (prev.isWall) {
            continue;
          }
          prev.visited = true;
          current = prev;
        }
      }
    }
  });
  current.type = directions[dirIdx % directions.length];
  // grid.draw();

  return (current.y + 1) * 1000 + (current.x + 1) * 4 + (dirIdx % directions.length);
}

class Square {
  public minX = 0;
  public maxX = 0;
  public minY = 0;
  public maxY = 0;

  constructor(public size: number, public row: number, public col: number) {
    this.minX = size * col;
    this.maxX = this.minX + size - 1;
    this.minY = size * row;
    this.maxY = this.minY + size - 1;
  }

  public contains(x: number, y: number): boolean {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  public relativeXY(x: number, y: number): [number, number] {
    return [x - this.minX, y - this.minY];
  }

  public absoluteXY(x: number, y: number): [number, number] {
    return [this.minX + x, this.minY + y];
  }
}

function part2(input: string): number {
  const [grid, steps] = parseInput(input);

  let start = grid.cells.find((c) => c.y === grid.minY && c.isSpace)!;
  let dirIdx = directions.length * 100;

  const squareSize = (Math.max(grid.maxX, grid.maxY) + 1) / 4;
  // grid layout is
  // .12    meaning 1 is row 0 col 1, 2 is r0c2
  // .3.    3 - r1c1
  // 45.    4 - r2c0 5 - r2c1
  // 6..    6 - r3c0
  const square1 = new Square(squareSize, 0, 1);
  const square2 = new Square(squareSize, 0, 2);
  const square3 = new Square(squareSize, 1, 1);
  const square4 = new Square(squareSize, 2, 0);
  const square5 = new Square(squareSize, 2, 1);
  const square6 = new Square(squareSize, 3, 0);

  function mirror(coord: number): number {
    return squareSize - 1 - coord;
  }

  function getWrap(x: number, y: number, dirIdx: number): [Cell, number] {
    // directions are right down left up
    const direction = directions[dirIdx % directions.length];

    let nx = x;
    let ny = y;
    let nDir = dirIdx;

    if (square1.contains(x, y)) {
      const [sx, sy] = square1.relativeXY(x, y);
      if (direction === "^") {
        // becomes going right in square 6
        [nx, ny] = square6.absoluteXY(sy, sx);
        nDir++;
      } else if (direction === "<") {
        // becomes going right in square 4
        [nx, ny] = square4.absoluteXY(sx, mirror(sy));
        nDir += 2;
      }
    } else if (square2.contains(x, y)) {
      const [sx, sy] = square2.relativeXY(x, y);
      if (direction === ">") {
        // becomes going left in square 5
        [nx, ny] = square5.absoluteXY(sx, mirror(sy));
        nDir += 2; // > to < is 2 steps
      } else if (direction === "v") {
        // becomes going left in square 3
        [nx, ny] = square3.absoluteXY(sy, sx);
        nDir++;
      } else if (direction === "^") {
        // becomes going up in square 6
        [nx, ny] = square6.absoluteXY(sx, squareSize - 1);
      }
    } else if (square3.contains(x, y)) {
      const [sx, sy] = square3.relativeXY(x, y);
      if (direction === ">") {
        // going up in square 2
        [nx, ny] = square2.absoluteXY(sy, sx);
        nDir--;
      } else if (direction === "<") {
        // becomes down in square 4
        [nx, ny] = square4.absoluteXY(sy, sx);
        nDir--;
      }
    } else if (square4.contains(x, y)) {
      const [sx, sy] = square4.relativeXY(x, y);
      if (direction === "<") {
        // becomes right in square 1
        [nx, ny] = square1.absoluteXY(sx, mirror(sy));
        nDir += 2;
      } else if (direction === "^") {
        // becomes right in square 3
        [nx, ny] = square3.absoluteXY(sy, sx);
        nDir++;
      }
    } else if (square5.contains(x, y)) {
      const [sx, sy] = square5.relativeXY(x, y);
      if (direction === "v") {
        // becomes going left in square 6
        [nx, ny] = square6.absoluteXY(sy, sx);
        nDir++;
      } else if (direction === ">") {
        // becomes going left in square 2
        [nx, ny] = square2.absoluteXY(sx, mirror(sy));
        nDir += 2;
      }
    } else if (square6.contains(x, y)) {
      const [sx, sy] = square6.relativeXY(x, y);
      if (direction === "<") {
        // becomes down on 1
        [nx, ny] = square1.absoluteXY(sy, sx);
        nDir--;
      } else if (direction === "v") {
        // becomes down on 2
        [nx, ny] = square2.absoluteXY(sx, 0);
      } else if (direction === ">") {
        // becomes up on 5
        [nx, ny] = square5.absoluteXY(sy, sx);
        nDir--;
      }
    }
    // console.log(`Turned ${x},${y}, ${direction} into ${nx},${ny} ${directions[nDir % 4]}`);
    return [grid.getCell(nx, ny)!, nDir];
  }

  let current = start;
  current.visited = true;
  steps.forEach((s, stepCount) => {
    console.log(s);
    if (s === "L") {
      dirIdx--;
    } else if (s === "R") {
      dirIdx++;
    } else {
      let [dx, dy] = vectors[dirIdx % directions.length];
      for (let i = 0; i < s; i++) {
        const next = grid.getCell(current.x + dx, current.y + dy);
        if (next && (next.isWall || next.isSpace)) {
          if (next.isWall) {
            continue;
          }
          // else is space
          next.visited = true;
          current = next;
        } else {
          // wrap around
          // console.log("wrapping time");
          const [wrap, nuDir] = getWrap(current.x, current.y, dirIdx);
          if (wrap.isWall) {
            continue;
          }
          // else is space
          wrap.visited = true;
          current = wrap;
          dirIdx = nuDir;
          [dx, dy] = vectors[dirIdx % directions.length];
        }
      }
    }
    console.log(current.y, current.x, dirIdx % 4);
  });
  current.type = directions[dirIdx % directions.length];
  // grid.draw();

  return (current.y + 1) * 1000 + (current.x + 1) * 4 + (dirIdx % directions.length);

  return 0;
}

const t1 = part1(test);
if (t1 === 6032) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test2);
  if (t2 === 10006) {
    // not the real test2 answer because its not the real input
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

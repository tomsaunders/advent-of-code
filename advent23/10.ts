#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, PURP, RED, RESET, YELLOW } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");
const test = `.....
.S-7.
.|.|.
.L-J.
.....`;

const testB = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

const test2 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const test2B = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const test2C = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

class PipeCell extends Cell {
  // | ns
  // - ew
  // L ne
  // J nw
  // 7 sw
  // F se
  // . ground
  // S start

  constructor(grid: Grid, x: number, y: number, z: number, type: string) {
    super(grid, x, y, 0, type);
  }

  public get isStart(): boolean {
    return this.type === "S";
  }

  public get pipeNeighbours(): PipeCell[] {
    const n = this.north as PipeCell;
    const e = this.east as PipeCell;
    const s = this.south as PipeCell;
    const w = this.west as PipeCell;

    if (this.isStart) {
      return [n, e, w, s].filter((n: PipeCell) => n?.pipeNeighbours.includes(this));
    }

    switch (this.type) {
      case ".":
        return [];
      case "|":
        return [n, s];
      case "-":
        return [e, w];
      case "L":
        return [n, e];
      case "J":
        return [n, w];
      case "7":
        return [s, w];
      case "F":
        return [s, e];
    }
    console.log("Error neighbours", this.label);
    return [];
  }
}

function part1(input: string): number {
  const grid = Grid.fromLines(
    input,
    (g: Grid, x: number, y: number, z: number, type: string) => new PipeCell(g, x, y, z, type)
  );
  const start = (grid.cells as PipeCell[]).find((c: PipeCell) => c.isStart) as PipeCell;
  grid.breadthFirst(start, (c) => (c as PipeCell).pipeNeighbours.filter((n) => !n.visited));

  const visited = grid.cells.filter((c) => c.visited);
  grid.draw();
  return Math.max(...visited.map((v) => v.tentativeDist));
}

function part2(input: string, borderX = 0, borderY = 0): number {
  const grid = Grid.fromLines(
    input,
    (g: Grid, x: number, y: number, z: number, type: string) => new PipeCell(g, x, y, z, type)
  );
  const start = (grid.cells as PipeCell[]).find((c: PipeCell) => c.isStart) as PipeCell;
  grid.breadthFirst(start, (c) => (c as PipeCell).pipeNeighbours.filter((n) => !n.visited));

  // from the outside, do a neighbour crawl to mark things as spaces.
  let outsideSet = grid.cells.filter((c) => !c.visited).filter((c) => c.onBorder);
  const X = `${RED}0${RESET}`;
  const I = `I`;
  while (outsideSet.length) {
    let c = outsideSet.pop() as PipeCell;
    for (const n of c.allNeighbours) {
      if (n.type !== X && !n.visited) {
        n.type = X;
        outsideSet.push(n);
      }
    }
  }

  // ray casting algorithm
  grid.cells
    .filter((c) => !c.visited && c.type != X)
    .forEach((c) => {
      // go right until the edge of the grid.
      // if it crosses the edge of the polygon made by the pipes an even number of times, it is outside
      // if odd, inside. This is the ray casting algorithm
      // not fully in my head yet - why check only for | L and J ?
      let crosses = 0;
      for (let i = c.x; i <= grid.maxX; i++) {
        const test = grid.getCell(i, c.y);
        if (test?.visited && ["|", "L", "J"].includes(test?.type)) {
          crosses++;
        }
      }
      if (crosses % 2 == 0) {
        // even
        c.type = X;
      } else {
        c.type = I;
      }
    });

  const contained: Cell[] = grid.cells.filter((c) => c.type === I);

  grid.draw();

  return contained.length;
}

const t = part1(test);
const tB = part1(testB);
if (t == 4 && tB == 8) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test2);
  const t2B = part2(test2B);
  const t2C = part2(test2C);
  if (t2 == 4 && t2B == 8 && t2C == 10) {
    console.log("part 2 answer", part2(input, 72, 72));
  } else {
    console.log("part 2 test fail", t2, t2B, t2C);
  }
} else {
  console.log("part 1 test fail", t, tB);
}

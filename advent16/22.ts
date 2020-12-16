#!/usr/bin/env ts-node
import * as fs from "fs";
import { test, Grid, Cell, SPACE } from "./util";

const input = fs.readFileSync("input22.txt", "utf8");
const lines = input.split("\n");

const grid = new Grid();

class Node extends Cell {
  constructor(
    grid: Grid,
    x: number,
    y: number,
    public size: number,
    public used: number
  ) {
    super(grid, x, y, 1, SPACE);
  }

  public get empty(): boolean {
    return !this.used;
  }

  public get avail(): number {
    return this.size - this.used;
  }

  public print(): string {
    return `x${this.x}-y${this.y} size ${this.size} used ${this.used} avail ${this.avail}`;
  }

  public static fromLine(line: string, grid: Grid): Node {
    const [name, size, avail, used, pct] = line.split(" ").filter((x) => !!x);
    const [x, y] = name.replace("/dev/grid/node-", "").split("-");

    return new Node(
      grid,
      parseInt(x.replace("x", ""), 10),
      parseInt(y.replace("y", ""), 10),
      parseInt(size.replace("T", ""), 10),
      parseInt(avail.replace("T", ""), 10)
    );
  }
}

for (const line of lines) {
  const n = Node.fromLine(line, grid);
  grid.addCell(n);
}
grid.init();

const cells = grid.cells;
let viable = 0;
for (let a = 0; a < cells.length; a++) {
  const x = cells[a] as Node;
  if (x.empty) {
    continue;
  }
  for (let b = 0; b < cells.length; b++) {
    if (a === b) continue;

    const y = cells[b] as Node;
    if (y.avail > x.used) {
      viable++;
    }
  }
}

// const viable = grid.cells.reduce((carry: number, cell: Cell): number => {
//   const node = cell as Node;
//   if (node.empty) {
//     return carry;
//   }
//   let v = 0;
//   for (const n of node.neighbours) {
//     const a = (n as Node).avail;
//     if (a > node.used) {
//       console.log(
//         "node",
//         node.print(),
//         " can go to neighbour",
//         (n as Node).print()
//       );
//       v++;
//     }
//   }

//   return carry + v;
// }, 0);
console.log("Part One", viable);

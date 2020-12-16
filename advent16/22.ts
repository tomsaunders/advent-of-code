#!/usr/bin/env ts-node
import * as fs from "fs";
import { test, Grid, Cell, SPACE, YELLOW, RESET, GREEN, RED } from "./util";

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
    super(grid, x, y, 0, SPACE);
  }

  public get empty(): boolean {
    return !this.used;
  }

  public get avail(): number {
    return this.size - this.used;
  }

  public get code(): string {
    if (this.empty) {
      return `${GREEN}    0${RESET}`;
    }
    if (this.size > 400) {
      return `${RED}    #${RESET}`;
    }
    if (this.x === 29 && this.y === 0) {
      return `${YELLOW}${this.size.toString(10).padStart(5, " ")}${RESET}`;
    }
    return this.avail.toString(10).padStart(5, " ");
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

console.log("Part One", viable);
grid.draw();
console.log("Part Two", 4 + 25 + 28 + 28 * 5 + 1);
// The ~500 size cells are effectively walls.
// The game is to get the empty cell next to the goal cell, then 'leap-frog' it to the destination
// It takes 4 (left), 25 (up), 28 (right) moves to get the empty around the wall and to the goal
// It takes 5 moves for each sequence of leap frog
// It takes a final move to get the goal to the destination (the leap frog can be omitted for the final step)
// Lesson: every pair from part one actually joined the empty cell.
// It can be good to print the output to verify that

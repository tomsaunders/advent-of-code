#!/usr/bin/env npx ts-node
import { Grid, SPACE, WALL, Cell, PathStep } from "./util";

const input = 1350;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

function makeGrid(seed: number, range: number): Grid {
  function cell(x: number, y: number): string {
    const num = x * x + 3 * x + 2 * x * y + y + y * y + seed;
    const bin = num.toString(2);
    const ones = bin.split("").filter(c => c === "1");
    return ones.length % 2 === 0 ? SPACE : WALL;
  }

  const grid = new Grid();
  for (let y = 0; y < range; y++) {
    for (let x = 0; x < range; x++) {
      grid.addCell(x, y, 0, cell(x, y));
    }
  }
  return grid;
}

function cubicle(seed: number, range: number, ex: number, ey: number): number {
  const grid = makeGrid(seed, range).init();
  grid.draw();

  const start = grid.getCell(1, 1) as Cell;
  const end = grid.getCell(ex, ey) as Cell;

  return grid.shortestPath(start, end);
}

test(11, cubicle(10, 10, 7, 4));
console.log("Answer", cubicle(input, 100, 31, 39));
console.log("\nPart 2\n");

function steps(seed: number, limit: number): number {
  const grid = makeGrid(seed, limit + 5).init();
  const start = grid.getCell(1, 1) as Cell;

  const queue: PathStep[] = [[start, 0]];
  while (queue.length) {
    const [current, steps] = queue.pop() as PathStep;
    current.visited = true;
    if (steps === limit) {
      continue;
    }
    for (const n of current.unexplored) {
      queue.push([n, steps + 1]);
    }
    queue.sort((a, b) => b[1] - a[1]);
  }
  grid.draw();
  return grid.cells.filter(c => c.visited).length;
}

console.log("Answer", steps(input, 50));

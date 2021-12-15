#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell } from "./util";
const input = fs.readFileSync("input9.txt", "utf8");
const test = fs.readFileSync("test9.txt", "utf8");

function part1(input: string): number {
  const grid = Grid.fromLines(input);
  const lows = grid.cells.filter((c) =>
    c.directNeighbours.every((n) => n.int > c.int)
  );

  return lows.reduce((carry, c) => (carry += c.int + 1), 0);
}

const t1 = part1(test);
if (t1 === 15) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const grid = Grid.fromLines(input);
  const lows = grid.cells.filter((c) =>
    c.directNeighbours.every((n) => n.int > c.int)
  );

  lows.forEach((from) => {
    grid.init();
    from.visited = true;
    let queue: Cell[] = [from];
    let basin: Cell[] = [];
    while (queue.length) {
      const c = queue.pop() as Cell;
      basin.push(c);
      for (const n of c.directNeighbours) {
        if (!n.visited) {
          n.visited = true;
          if (n.int < 9) {
            queue.push(n);
          }
        }
      }
    }

    from.value = basin.length;
  });

  const top3 = lows.sort((a, b) => b.value - a.value).slice(0, 3);

  return top3.reduce((carry, cell) => (carry *= cell.value), 1);
}

const t2 = part2(test);
if (t2 === 1134) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

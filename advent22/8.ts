#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input8.txt", "utf8");
const test = `30373
25512
65332
33549
35390`;

function parse(input: string): Grid {
  return Grid.fromLines(input);
}

function part1(input: string): number {
  const grid = parse(input);
  let max = -1;
  for (let x = grid.minX; x <= grid.maxX; x++) {
    max = -1;
    for (let y = grid.minY; y <= grid.maxY; y++) {
      const tree = grid.getCell(x, y) as Cell;
      if (tree.int > max) {
        max = tree.int;
        tree.visited = true;
      }
    }
    max = -1;
    for (let y = grid.maxY; y >= grid.minY; y--) {
      const tree = grid.getCell(x, y) as Cell;
      if (tree.int > max) {
        max = tree.int;
        tree.visited = true;
      }
    }
  }
  for (let y = grid.minY; y <= grid.maxY; y++) {
    max = -1;
    for (let x = grid.minX; x <= grid.maxX; x++) {
      const tree = grid.getCell(x, y) as Cell;
      if (tree.int > max) {
        max = tree.int;
        tree.visited = true;
      }
    }
    max = -1;
    for (let x = grid.maxX; x >= grid.minX; x--) {
      const tree = grid.getCell(x, y) as Cell;
      if (tree.int > max) {
        max = tree.int;
        tree.visited = true;
      }
    }
  }
  // grid.draw();
  return grid.cells.filter((c) => c.visited).length;
}

function part2(input: string): number {
  const grid = parse(input);
  return Math.max(
    ...grid.cells.map((c) => {
      let u = 0;
      let d = 0;
      let l = 0;
      let r = 0;
      let tree = c.int;
      let curr: Cell | undefined = c.east;
      while (curr) {
        // console.log(curr.label, "comparing to", tree, "l=", l);
        r++;
        if (curr.int < tree) {
          curr = curr.east;
        } else if (curr.int >= tree) {
          curr = undefined;
        }
      }
      curr = c.west;
      while (curr) {
        l++;
        if (curr.int < tree) {
          curr = curr.west;
        } else if (curr.int >= tree) {
          curr = undefined;
        }
      }
      curr = c.north;
      while (curr) {
        u++;
        if (curr.int < tree) {
          curr = curr.north;
        } else if (curr.int >= tree) {
          curr = undefined;
        }
      }
      curr = c.south;
      while (curr) {
        d++;
        if (curr.int < tree) {
          curr = curr.south;
        } else if (curr.int >= tree) {
          curr = undefined;
        }
      }

      return u * d * l * r;
    })
  );
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

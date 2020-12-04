#!/usr/bin/env npx ts-node
import * as fs from "fs";
import { Cell, Grid, OFF, ON, test } from "./util";

const input = fs.readFileSync("input18.txt", "utf8") as string;

const testIn = `.#.#.#
...##.
#....#
..#...
#.#..#
####..`;

function lightStep(
  input: string,
  steps: number,
  cornersOn: boolean = false
): number {
  function lightCorners(g: Grid) {
    (g.getCell(g.minX, g.minY, 0) as Cell).type = ON;
    (g.getCell(g.minX, g.maxY, 0) as Cell).type = ON;
    (g.getCell(g.maxX, g.minY, 0) as Cell).type = ON;
    (g.getCell(g.maxX, g.maxY, 0) as Cell).type = ON;
  }

  let g = Grid.fromLines(input);
  if (cornersOn) lightCorners(g);

  for (let i = 0; i < steps; i++) {
    const newGrid = g.clone();
    for (const c of g.cells) {
      const count = countLights(c.allNeighbours);
      const newCell = newGrid.getByCoord(c.coord) as Cell;

      newCell.type = count === 3 || (c.isOn && count === 2) ? ON : OFF;
    }
    g = newGrid;
    if (cornersOn) lightCorners(g);
  }

  return countLights(g.cells);
}

function countLights(cells: Cell[]): number {
  return cells.filter((c) => c.isOn).length;
}

test(4, lightStep(testIn, 4));
console.log("Part One", lightStep(input, 100));
test(17, lightStep(testIn, 5, true));
console.log("Part Two", lightStep(input, 100, true));

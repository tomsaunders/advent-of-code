#!/usr/bin/env ts-node
import * as fs from "fs";
import { test, Grid, Cell, SPACE, WALL, permute } from "./util";

const input = fs.readFileSync("input24.txt", "utf8");

const testGrid = Grid.fromLines(`###########
#0.1.....2#
#.#######.#
#4.......3#
###########`);
testGrid.draw();

const grid = Grid.fromLines(input);
// grid.draw();

function shortestRoute(grid: Grid, returnToStart: boolean = false): number {
  const nodes = grid.cells.filter((c) => c.type !== WALL && c.type !== SPACE);

  const distances = new Map<string, number>();
  for (let a = 0; a < nodes.length; a++) {
    grid.distancesFrom(nodes[a]);
    for (let b = a + 1; b < nodes.length; b++) {
      const x = nodes[a].type;
      const y = nodes[b].type;
      const d = nodes[b].tentativeDist;
      distances.set(`${x}-${y}`, d);
      distances.set(`${y}-${x}`, d);
    }
  }

  const options = nodes.map((c) => c.type).filter((x) => x !== "0"); // exclude start

  const permutations: any[][] = [];
  permute(permutations, options, ["0"]);
  const distanceArr = permutations.map((steps: string[]) => {
    let d = 0;
    if (returnToStart) {
      steps.push("0");
    }
    for (let i = 1; i < steps.length; i++) {
      const last = steps[i - 1];
      const step = steps[i];
      d += distances.get(`${last}-${step}`) as number;
    }
    return d;
  });
  return Math.min(...distanceArr);
}

test(shortestRoute(testGrid), 14);
console.log("Part One", shortestRoute(grid));
console.log("Part Two", shortestRoute(grid, true));

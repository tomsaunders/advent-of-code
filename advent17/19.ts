#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 19
 *
 * Summary: Paths on a grid - what letters are picked up while following the path?
 * Escalation: How many steps were taken?
 * Solution: Grid utility FTW.
 *
 * Keywords: Grid
 * References:
 */
import * as fs from "fs";
import { Cell, Grid } from "./util";
const input = fs.readFileSync("input19.txt", "utf8");
const test: string = `     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ 
`;

function parseInput(input: string): Grid {
  const g = Grid.fromLines(input);
  return g;
}

const DOWN = "|";
const ACRS = "-";
const CRNR = "+";

function cellExists(cell?: Cell): boolean {
  return !!cell && cell.type !== " ";
}

function walkTheLine(input: string): [string, number] {
  const grid = parseInput(input);
  const start = grid.cells.find((c) => c.y === grid.minY && c.type === DOWN);
  let activeCell = start;
  let dy = 1;
  let dx = 0;

  const foundLetters = [""];
  let stepCount = 0;

  while (activeCell) {
    activeCell.visited = true;
    stepCount++;
    const next = activeCell.getNext(dx, dy);

    if (!cellExists(next)) {
      // end game
      activeCell = undefined;
    } else if ([DOWN, ACRS].includes(next!.type)) {
      // continue
      activeCell = next;
    } else if (next?.type === CRNR) {
      if (!dx && cellExists(next.east)) {
        dx = 1;
        dy = 0;
      } else if (!dx && cellExists(next.west)) {
        dx = -1;
        dy = 0;
      } else if (!dy && cellExists(next.south)) {
        dy = 1;
        dx = 0;
      } else if (!dy && cellExists(next.north)) {
        dy = -1;
        dx = 0;
      }
      activeCell = next;
    } else if (next?.type != " ") {
      foundLetters.push(next!.type);
      // add letter
      activeCell = next;
    }
  }

  return [foundLetters.join(""), stepCount];
}

const [t1, t2] = walkTheLine(test);
if (t1 === "ABCDEF") {
  const [p1, p2] = walkTheLine(input);
  console.log("part 1 answer", p1);
  if (t2 === 38) {
    console.log("part 2 answer", p2);
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t1);
}

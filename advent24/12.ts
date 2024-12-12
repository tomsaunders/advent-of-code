#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 12
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { arrProd, arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input12.txt", "utf8");
const test = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

// fence prices is area * perimeter
// total price = arrSum all fences

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

type Area = Cell[];
function getAreas(grid: Grid): Area[] {
  let unvisited = grid.cells.find((c) => !c.visited);
  const areas: Area[] = [];
  while (unvisited) {
    const letter = unvisited.type;
    const cells = [unvisited];
    const queue = [unvisited];
    while (queue.length) {
      const curr = queue.pop() as Cell;
      curr.directNeighbours
        .filter((n) => n.type === letter)
        .forEach((n) => {
          if (!cells.includes(n)) {
            cells.push(n);
            queue.push(n);
          }
        });
    }
    cells.forEach((c) => (c.visited = true));
    areas.push(cells);
    unvisited = grid.cells.find((c) => !c.visited);
  }
  return areas;
}

function part1(input: string): number {
  const plt = parseInput(input);
  const areas = getAreas(plt);

  const fences = areas.map((cells) => {
    const area = cells.length;
    let perimeterFence = 0;
    cells.forEach((c) => {
      perimeterFence +=
        4 - c.directNeighbours.filter((n) => n.type === c.type).length;
    });
    return area * perimeterFence;
  });
  return arrSum(fences);
}

function part2(input: string): number {
  const plt = parseInput(input);
  const areas = getAreas(plt);
  const fences = areas.map((cells) => {
    const area = cells.length;
    let sides = 0;
    cells.forEach((c) => {
      const northFence = c.north?.type !== c.type;
      const eastFence = c.east?.type !== c.type;
      const southFrence = c.south?.type !== c.type;
      const westFence = c.west?.type !== c.type;

      // add the north side if the west neighbour is in region doesnt have a north fence
      const westIsNeighbour = c.west?.type === c.type;
      const westHasNorthFence = c.west?.north?.type !== c.type;
      if (c.type === "C")
        console.log(
          "adding north for " + c,
          "?? because",
          northFence,
          westIsNeighbour,
          westHasNorthFence,
        );
      if (
        northFence &&
        (!westIsNeighbour || (westIsNeighbour && !westHasNorthFence))
      ) {
        sides++;
      }
      // east side if the north neighbour didnt
      const northIsNeighbour = c.north?.type === c.type;
      const northHasEastFence = c.north?.east?.type !== c.type;
      if (
        eastFence &&
        (!northIsNeighbour || (northIsNeighbour && !northHasEastFence))
      ) {
        if (c.type === "C")
          console.log(
            "adding east for " + c,
            "because",
            eastFence,
            northIsNeighbour,
            northHasEastFence,
          );
        sides++;
      }
      //south side if the east neighbour didnt
      const eastIsNeighbour = c.east?.type === c.type;
      const eastHasSouthFence = c.east?.south?.type !== c.type;
      if (
        southFrence &&
        (!eastIsNeighbour || (eastIsNeighbour && !eastHasSouthFence))
      ) {
        if (c.type === "C")
          console.log(
            "adding south for " + c,
            "because",
            southFrence,
            eastIsNeighbour,
            eastHasSouthFence,
          );
        sides++;
      }
      // and west if the south didnt
      const southIsNeighbour = c.south?.type === c.type;
      const southHasWestFence = c.south?.west?.type !== c.type;
      if (
        westFence &&
        (!southIsNeighbour || (southIsNeighbour && !southHasWestFence))
      ) {
        if (c.type === "C")
          console.log(
            "adding west for " + c,
            "because",
            westFence,
            southIsNeighbour,
            southHasWestFence,
          );
        sides++;
      }
      c.visited = true;
    });

    console.log(cells[0].type, "has ", area, "*", sides);
    return area * sides;
  });
  plt.draw();

  return arrSum(fences);
}

const t = part1(test);
if (t == 1930) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 1206) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

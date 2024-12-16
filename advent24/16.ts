#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
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
import { Cell, Direction, Grid } from "./util";
const input = fs.readFileSync("input16.txt", "utf8");
const test = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

const test2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

type Edge = {
  to: Intersection;
  cost: number;
  route: Cell[];
};

class Intersection {
  public edges: Edge[] = [];
  constructor(public cell: Cell, public direction: Direction) {}

  public connect(
    to: Intersection,
    cost: number,
    route: Cell[],
    reciprocate = false,
  ) {
    this.edges.push({ to, cost, route });
    if (reciprocate) {
      to.edges.push({ to: this, cost, route });
    }
  }

  public toString(): string {
    return `${this.cell.xy} ${this.direction.toUpperCase()}`;
  }
}

function buildIntersections(start: Cell, end: Cell): Intersection[] {
  const g = start.grid;
  const intersections: Intersection[] = [new Intersection(start, "e")];
  if (start.north?.isSpace) {
    const sn = new Intersection(start, "n");
    intersections[0].connect(sn, 1000, [start]);
    intersections.push(sn);
  }
  handleIntersection(end);

  function handleIntersection(cell: Cell) {
    let e: Intersection | undefined = new Intersection(cell, "e");
    let w: Intersection | undefined = new Intersection(cell, "w");
    let s: Intersection | undefined = new Intersection(cell, "s");
    let n: Intersection | undefined = new Intersection(cell, "n");

    // east is wall, cant approach from east
    if (cell.east?.isWall && cell.west?.isWall) {
      e = undefined;
      w = undefined;
    }
    if (cell.north?.isWall && cell.south?.isWall) {
      n = undefined;
      s = undefined;
    }

    if (e) {
      intersections.push(e);
      if (s) e.connect(s, 1000, [cell], true);
      if (n) e.connect(n, 1000, [cell], true);
    }
    if (w) {
      intersections.push(w);
      if (s) w.connect(s, 1000, [cell], true);
      if (n) w.connect(n, 1000, [cell], true);
    }

    if (s) {
      intersections.push(s);
    }
    if (n) {
      intersections.push(n);
    }
  }

  g.cells.filter((c) => c.isIntersection).forEach((c) => handleIntersection(c));

  intersections.forEach((inter) => {
    let cost = 1;
    let dir = inter.direction;
    let cell = inter.cell.getDirection(dir);
    const route: Cell[] = [];

    while (cell?.isSpace) {
      route.push(cell);
      let next = cell.getDirection(dir);
      if (next?.isSpace || next?.type === "E") {
        cost++;
        if (next.isIntersection || next.type === "E") {
          route.push(next);
          const outer = intersections.find(
            (i) => i.cell === next && i.direction === dir,
          );
          if (outer) {
            inter.connect(outer, cost, route);
          } else {
            console.warn("couldnt find path from " + inter + " to " + next.xy);
          }
          cell = undefined;
        } else {
          cell = next;
        }
      } else if (next?.isWall) {
        if ((dir === "e" || dir === "w") && cell.north?.isSpace) dir = "n";
        else if ((dir === "e" || dir === "w") && cell.south?.isSpace) dir = "s";
        else if ((dir === "n" || dir === "s") && cell.east?.isSpace) dir = "e";
        else if ((dir === "n" || dir === "s") && cell.west?.isSpace) dir = "w";
        else {
          // console.log("nothing doing!", cell.xy);
          // cell.visited = true;
          // g.draw();
          cell = undefined;
        }
        cost += 1000;
        // console.log(" now", dir, cost);
      } else {
        // console.log("else " + next);
        cell = undefined;
      }
    }
  });

  return intersections;
}

function part1(input: string): number {
  const g = parseInput(input);
  const start = g.cells.find((c) => c.type === "S")!;
  const end = g.cells.find((c) => c.type === "E")!;

  const intersections = buildIntersections(start, end);

  const queue: { intersection: Intersection; cost: number; seen: string[] }[] =
    [{ intersection: intersections[0], cost: 0, seen: [] }];

  let min = 99999;
  let minTo: Record<string, number> = {};
  while (queue.length) {
    const { intersection, cost, seen } = queue.pop()!;

    const k = intersection.toString();
    seen.push(k);
    if (intersection.cell === end) {
      min = Math.min(min, cost);
      console.log("found ", cost, " to end, min is ", min);
    }
    if (minTo[k] && cost > minTo[k]) continue;
    else minTo[k] = cost;
    if (cost >= min) continue;

    intersection.edges.forEach((option) => {
      if (!seen.includes(option.to.toString())) {
        queue.push({
          intersection: option.to,
          cost: cost + option.cost,
          seen: seen.slice(0),
        });
      }
    });
  }

  return min;
}

function part2(input: string, min: number): number {
  const g = parseInput(input);
  const start = g.cells.find((c) => c.type === "S")!;
  const end = g.cells.find((c) => c.type === "E")!;

  const intersections = buildIntersections(start, end);

  const queue: {
    intersection: Intersection;
    cost: number;
    seen: string[];
    cells: Cell[];
  }[] = [{ intersection: intersections[0], cost: 0, seen: [], cells: [start] }];

  const goodCells = new Set<string>();
  let minTo: Record<string, number> = {};
  while (queue.length) {
    const { intersection, cost, seen, cells } = queue.pop()!;

    const k = intersection.toString();
    seen.push(k);
    if (intersection.cell === end && cost === min) {
      // console.log("adding good cells from path", cost, min);
      cells.forEach((c) => {
        goodCells.add(c.xy);
        // c.visited = true;
      });
      // g.draw();
    }
    if (minTo[k] && cost > minTo[k]) continue;
    else minTo[k] = cost;
    if (cost >= min) continue;

    intersection.edges.forEach((option) => {
      if (!seen.includes(option.to.toString())) {
        queue.push({
          intersection: option.to,
          cost: cost + option.cost,
          seen: seen.slice(0),
          cells: cells.concat(option.route),
        });
      }
    });
  }
  return goodCells.size;
}

// console.log(part1(test2));

const t = part1(test);
const ta2 = part1(test2);
let p1 = 0;
if (t == 7036 && ta2 === 11048) {
  p1 = part1(input);
  console.log("part 1 answer", p1);
} else {
  console.log("part 1 test fail", t, ta2);
}
const t2 = part2(test, t);
const tb2 = part2(test2, ta2);
if (t2 == 45 && tb2 === 64) {
  console.log("part 2 answer", part2(input, p1));
} else {
  console.log("part 2 test fail", t2, tb2);
}

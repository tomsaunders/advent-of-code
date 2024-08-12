#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 6
 *
 * Summary: Work out the distance to a multiple location co-ordinates and determine which location is closest to the most points.
 * Escalation: Find the number of points that are within a threshold of all locations.
 * Solution: Implement a Location class for convenience and just loop through the space defined between the min & max X & Y
 *
 * Keywords: Manhattan
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, mapNum } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");
const test = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`;

class Location {
  public finite = true;
  public closestPoints: string[] = [];
  constructor(public x: number, public y: number) {}
  public get key(): string {
    return `${this.x}:${this.y}`;
  }

  public dist(x: number, y: number): number {
    return Math.abs(x - this.x) + Math.abs(y - this.y);
  }

  public addPoint(x: number, y: number): void {
    this.closestPoints.push(`${x}:${y}`);
  }
}

function parseInput(input: string): Location[] {
  return input.split("\n").map((line) => {
    const [x, y] = line.split(", ").map(mapNum);
    return new Location(x, y);
  });
}

function part1(input: string): number {
  const locations = parseInput(input);
  const minX = Math.min(...locations.map((l) => l.x));
  const maxX = Math.max(...locations.map((l) => l.x));
  const minY = Math.min(...locations.map((l) => l.y));
  const maxY = Math.max(...locations.map((l) => l.y));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      let min = 9999;
      let minL: Location | undefined;
      locations.forEach((l) => {
        const d = l.dist(x, y);
        if (d < min) {
          min = d;
          minL = l;
        } else if (d === min) {
          minL = undefined; // a tie, so there is no longer a minimum location
        }
      });

      if (minL) {
        minL.addPoint(x, y);
        if (x === minX || x === maxX || y === minY || y === maxY) {
          // if this point is on the edge, we can assume it extends into infinity
          minL.finite = false;
        }
      }
    }
  }

  return Math.max(...locations.filter((l) => l.finite).map((l) => l.closestPoints.length));
}

function part2(input: string, safeDistance: number): number {
  const locations = parseInput(input);
  const minX = Math.min(...locations.map((l) => l.x));
  const maxX = Math.max(...locations.map((l) => l.x));
  const minY = Math.min(...locations.map((l) => l.y));
  const maxY = Math.max(...locations.map((l) => l.y));

  let safeSpots = 0;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dSum = arrSum(locations.map((l) => l.dist(x, y)));
      if (dSum < safeDistance) {
        safeSpots++;
      }
    }
  }

  return safeSpots;
}

const t = part1(test);
if (t === 17) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test, 32);
  if (t2 === 16) {
    console.log("part 2 answer", part2(input, 10000));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

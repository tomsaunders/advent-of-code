#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Cell, Grid, WALL } from "./util";
const input = fs.readFileSync("input15.txt", "utf8");

const test = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

class Sensor {
  public sx: number;
  public sy: number;
  public bx: number;
  public by: number;

  constructor(public line: string) {
    const [all, sx, sy, bx, by] = line.match(
      /Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)/
    ) as RegExpMatchArray;
    this.sx = parseInt(sx, 10);
    this.sy = parseInt(sy, 10);
    this.bx = parseInt(bx, 10);
    this.by = parseInt(by, 10);
  }

  public get distance(): number {
    return Math.abs(this.sx - this.bx) + Math.abs(this.sy - this.by);
  }

  public getRemaining(yCoord: number): number {
    const yDist = Math.abs(yCoord - this.sy);
    return this.distance - yDist;
  }
}

function parse(input: string): Sensor[] {
  return input.split("\n").map((l) => new Sensor(l));
}

function part1(input: string, row: number): number {
  const sensors = parse(input);
  const rowCoords = new Set<number>();
  sensors.forEach((s) => {
    const rem = s.getRemaining(row);
    for (let i = 0; i <= rem; i++) {
      rowCoords.add(s.sx + i);
      rowCoords.add(s.sx - i);
    }
  });
  sensors.forEach((s) => {
    if (s.by === row) {
      rowCoords.delete(s.bx);
    }
  });
  return rowCoords.size;
}

function part2(input: string, max: number): number {
  const sensors = parse(input);
  for (let y = 0; y <= max; y++) {
    const rowCoords = new Set<number>();
    sensors.forEach((s) => {
      const rem = s.getRemaining(y);
      for (let i = 0; i <= rem; i++) {
        rowCoords.add(s.sx + i);
        rowCoords.add(s.sx - i);
      }
    });
    if (rowCoords.size !== max) {
      for (let x = 0; x <= max; x++) {
        if (!rowCoords.has(x)) {
          return x * 4000000 + y;
        }
      }
    }
  }
  return 0;
}

const t1 = part1(test, 10);
if (t1 === 26) {
  console.log("Part 1: ", part1(input, 2000000));
  const t2 = part2(test, 20);
  if (t2 === 56000011) {
    console.log("Part 2: ", part2(input, 4000000));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

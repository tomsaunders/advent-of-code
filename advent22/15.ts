#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 15
 *
 * Summary: 'Sensor's and their closest 'beacon' on a cartesian plane. Knowing the closest beacon creates a bunch of coordinates where we know there is not one any closer: count the spaces we know are empty for a particular row.
 * Escalation: Find the one square where there can be a mystery beacon which is not closest to any sensor.
 * Naive:  Account for ovelap between sensors by counting every coordinate in a Set.
 * Solution:
 *  1: Turn each sensor's interaction with the target row into a two number range - reduce the ranges by accounting for overlap then sum. Orders of magnitude faster.
 *  2: Insight from reddit - the fact there's only one square in a constrained range means that it's a one away from two sensor's boundaries. Compute points of intersection for each sensor's n+1 lines.
 *    And then check that any found intersection point is not within the boundary of another sensor
 *
 * Keywords: Geometry
 * References: Reddit
 */
import * as fs from "fs";
interface Coord {
  x: number;
  y: number;
}
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

  public isWithinRange(point: Coord): boolean {
    const pointDist = Math.abs(this.sx - point.x) + Math.abs(this.sy - point.y);
    return pointDist <= this.distance;
  }

  public getNorth(offset: number): Coord {
    return {
      x: this.sx,
      y: this.sy - offset,
    };
  }

  public getSouth(offset: number): Coord {
    return {
      x: this.sx,
      y: this.sy + offset,
    };
  }

  public getEast(offset: number): Coord {
    return {
      x: this.sx + offset,
      y: this.sy,
    };
  }

  public getWest(offset: number): Coord {
    return {
      x: this.sx - offset,
      y: this.sy,
    };
  }

  public intersects(other: Sensor, maxCoordinate: number): Coord[] {
    const offset = this.distance + 1;
    const n = this.getNorth(offset);
    const s = this.getSouth(offset);
    const e = this.getEast(offset);
    const w = this.getWest(offset);

    const OFFSET = other.distance + 1;
    const N = other.getNorth(OFFSET);
    const S = other.getSouth(OFFSET);
    const E = other.getEast(OFFSET);
    const W = other.getWest(OFFSET);

    const intersectionPoint = (pointa: Coord, pointb: Coord, POINTA: Coord, POINTB: Coord): Coord | false => {
      const { x: x1, y: y1 } = pointa;
      const { x: x2, y: y2 } = pointb;
      const { x: x3, y: y3 } = POINTA;
      const { x: x4, y: y4 } = POINTB;

      const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

      if (denominator === 0) {
        return false;
      }

      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
      let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

      // Return a object with the x and y coordinates of the intersection
      let x = x1 + ua * (x2 - x1);
      let y = y1 + ua * (y2 - y1);

      // is the intersection along the segments
      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
      }

      if (x <= maxCoordinate && y <= maxCoordinate && x >= 0 && y >= 0) {
        return { x, y };
      }

      return false;
    };

    // lines = this NE, SW to other NW SE
    // this SE, NW to other SW NE
    const combos: (Coord | false)[] = [
      [n, e, N, W],
      [n, e, S, E],
      [s, w, N, W],
      [s, w, S, E],
      [s, e, S, W],
      [s, e, N, E],
      [n, w, S, W],
      [n, w, N, E],
    ].map(([p1, p2, p3, p4]) => intersectionPoint(p1, p2, p3, p4));

    return combos.filter((coord) => !!coord) as Coord[];
  }
}

function parseInput(input: string): Sensor[] {
  return input.split("\n").map((l) => new Sensor(l));
}

interface Range {
  from: number;
  to: number;
}

function part1(input: string, row: number): number {
  // console.time("part1");

  const sensors = parseInput(input);

  const ranges: Range[] = [];
  const sensorsOnRow = new Set<number>();
  sensors.forEach((s) => {
    const rem = s.getRemaining(row);
    if (rem > 0) {
      ranges.push({ from: s.sx - rem, to: s.sx + rem });
    }
    if (s.by === row) {
      sensorsOnRow.add(s.bx);
    }
  });

  // combine ranges if they overlap
  ranges.sort((a, b) => a.from - b.from);
  // ranges are now sorted by minimum x
  const combinedRanges = ranges.reduce((carry: Range[], { from, to }: Range, idx: number): Range[] => {
    const { to: lastTo } = carry[carry.length - 1];
    if (from <= lastTo) {
      // this range overlaps, we know from > lastFrom because it's a sorted array
      // just
      carry[carry.length - 1].to = Math.max(to, lastTo);
    } else {
      carry.push({ from, to });
    }
    return carry;
  }, ranges.slice(0, 1));

  const rangeSum = combinedRanges.reduce((sum, { from, to }) => (sum += to - from + 1), 0);

  // console.timeEnd("part1");
  return rangeSum - sensorsOnRow.size;
}

function part2(input: string, max: number): number {
  const sensors = parseInput(input);

  for (let i = 0; i < sensors.length; i++) {
    for (let j = i + 1; j < sensors.length; j++) {
      const a = sensors[i];
      const b = sensors[j];

      const results = a.intersects(b, max);
      const result = results.find(({ x, y }) => sensors.every((s) => !s.isWithinRange({ x, y: y })));

      if (result) {
        return result.x * 4000000 + result.y;
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

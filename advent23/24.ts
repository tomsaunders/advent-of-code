#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 24
 *
 * Summary: Calculate the intersection of moving objects given initial xyz positions and dx dy dz velocities
 * Escalation: Find a position & velocity that would collide with all input objects
 * Naive:  N/A
 * Solution:
 *   1. Research: find a function for determining if two lines intersect
 *   2. ??!!??: // start with visualisation , then defer to reddit explanations.
 *  From the visualisation (24.html) it is clear that the velocity is +dx -dy +dz
 *  An approach suggested on reddit which did make sense to me was based on identifying matching velocities in the input ... but this was not present in my input.
 *  Really don't understand this, just implementing a solution I saw.
 *
 *
 * Keywords:
 * References: https://paulbourke.net/geometry/pointlineplane/
 * https://old.reddit.com/r/adventofcode/comments/18pnycy/2023_day_24_solutions/kxqjg33/
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input24.txt", "utf8");
const test = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

interface XYZ {
  x: number;
  y: number;
  z: number;
}

class Hailstone {
  public position: XYZ;
  constructor(public key: string, public start: XYZ, public velocity: XYZ) {
    this.position = start;
  }
  public nextPosition(ticks: number): XYZ {
    return {
      x: this.position.x + this.velocity.x * ticks,
      y: this.position.y + this.velocity.y * ticks,
      z: this.position.z + this.velocity.z * ticks,
    };
  }
  public intersectionPoint(other: Hailstone): number[] {
    // this this.x Y1
    const x1 = this.position.x;
    const y1 = this.position.y;
    const x2 = this.nextPosition(100000000000000).x;
    const y2 = this.nextPosition(100000000000000).y;
    const x3 = other.position.x;
    const y3 = other.position.y;
    const x4 = other.nextPosition(100000000000000).x;
    const y4 = other.nextPosition(100000000000000).y;

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
      return [-1, -1, -1];
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments (doesnt require going in the past)
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return [-1, -1, -1];
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return [x, y];
  }
}

function parseInput(input: string): Hailstone[] {
  const lines = input.split("\n");
  return lines.map((line) => {
    const [left, right] = line.split(" @ ");
    const [x, y, z] = left.split(", ").map(mapNum);
    const [dx, dy, dz] = right.split(", ").map(mapNum);
    return new Hailstone(line, { x, y, z }, { x: dx, y: dy, z: dz });
  });
}

function part1(input: string, areaMin: number, areaMax: number): number {
  const hailstones = parseInput(input);
  let inArea = 0;
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const coords = hailstones[i].intersectionPoint(hailstones[j]);

      if (coords.every((c) => c >= areaMin && c <= areaMax)) {
        // console.log(hailstones[i].key + " and " + hailstones[j].key + " intersect at ", coords);
        // console.log("in area!");
        inArea++;
      }
    }
  }
  return inArea;
}

function part2(input: string): number {
  const hailstones = parseInput(input).slice(-3);
  const h0 = hailstones[0];
  const h1 = hailstones[1];
  const h2 = hailstones[2];

  // had to look up what this cross product actually is.
  // these functions based heavily on https://github.com/taddeus/advent-of-code/blob/master/2023/24_hail.py
  function crossProduct(u: XYZ, v: XYZ): XYZ {
    const { x: a, y: b, z: c } = u;
    const { x: d, y: e, z: f } = v;
    const x = b * f - c * e;
    const y = c * d - a * f;
    const z = a * e - b * d;
    return { x, y, z };
  }

  function multiplyXYZ(u: XYZ, v: XYZ): number {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }

  function addXYZ(u: XYZ, v: XYZ): XYZ {
    return {
      x: u.x + v.x,
      y: u.y + v.y,
      z: u.z + v.z,
    };
  }

  function subtractXYZ(u: XYZ, v: XYZ): XYZ {
    return {
      x: u.x - v.x,
      y: u.y - v.y,
      z: u.z - v.z,
    };
  }

  function scaleXYZ(scalar: number, v: XYZ): XYZ {
    return {
      x: scalar * v.x,
      y: scalar * v.y,
      z: scalar * v.z,
    };
  }

  const p1 = subtractXYZ(h1.position, h0.position);
  const p2 = subtractXYZ(h2.position, h0.position);
  const v1 = subtractXYZ(h1.velocity, h0.velocity);
  const v2 = subtractXYZ(h2.velocity, h0.velocity);
  // # now there exist some t1 and t2 such that p1+t1v1 and p2+t2v2 are
  // # collinear, meaning their cross-product is zero:
  // #   0 = p1+t1v1 x p2+t2v2
  // #     = p1 x p2 + p1 x t2v2 + t1v1 x p2 + t1v1 x t2v2
  // #     = p1 x p2 + t2(p1 x v2) + t1(v1 x p2) + t1t2(v1 x v2)
  // # given that (a x b)*a = (a x b)*b = 0, take dot product with v2 to get t1:
  // #   0 = v2*(p1 x p2) + t1v2*(v1 x p2)
  // #   t1 = v2*(p2 x p1) / v2*(v1 x p2)
  // # take dot product with v1 to get t2:
  // #   0 = v1*(p1 x p2) + t2v1*(p1 x v2)
  // #   t2 = v1*(p2 x p1) / v1*(p1 x v2)
  const t1 = multiplyXYZ(v2, crossProduct(p2, p1)) / multiplyXYZ(v2, crossProduct(v1, p2));
  const t2 = multiplyXYZ(v1, crossProduct(p2, p1)) / multiplyXYZ(v1, crossProduct(p1, v2));

  //   c1 = position_1 + t1 * velocity_1
  // c2 = position_2 + t2 * velocity_2
  const collision1 = addXYZ(h1.position, scaleXYZ(t1, h1.velocity));
  const collision2 = addXYZ(h2.position, scaleXYZ(t2, h2.velocity));

  // draw a line back through the intersection coordinates to get the origin:
  // v = (c2 - c1) / (t2 - t1)
  // p = c1 - t1 * v
  const velocity = scaleXYZ(1 / (t2 - t1), subtractXYZ(collision2, collision1));
  const origin = subtractXYZ(collision1, scaleXYZ(t1, velocity));

  console.log({ p1, p2, v1, v2, t1, t2, intersect1: collision1, intersect2: collision2, velocity, origin });

  return origin.x + origin.y + origin.z;
}

const t = part1(test, 7, 27);
if (t == 2) {
  console.log("part 1 answer", part1(input, 200000000000000, 400000000000000));
  const t2 = part2(test);
  if (t2 == 47) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

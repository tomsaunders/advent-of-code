#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input25.txt", "utf8");
const test = `0,0,0,0
3,0,0,0
0,3,0,0
0,0,3,0
0,0,0,3
0,0,0,6
9,0,0,0
12,0,0,0`;

const test2 = `-1,2,2,0
0,0,2,-2
0,0,0,-2
-1,2,0,0
-2,-2,-2,2
3,0,2,-1
-1,3,2,2
-1,0,-1,0
0,2,1,-2
3,0,0,0`;

const test3 = `1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2`;

const test4 = `1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2`;

// 2 4 3 8

class Point {
  public constellation: Constellation | undefined;

  public constructor(
    public x: number,
    public y: number,
    public z: number,
    public t: number
  ) {}

  public dist(other: Point): number {
    return (
      Math.abs(this.x - other.x) +
      Math.abs(this.y - other.y) +
      Math.abs(this.z - other.z) +
      Math.abs(this.t - other.t)
    );
  }

  public toString(): string {
    return `${this.x}, ${this.y}, ${this.z}, ${this.t}`;
  }
}

class Constellation {
  public points: Point[] = [];
}

const tests = [test, test2, test3, test4, input];
// const tests = [test2];
for (const test of tests) {
  // console.log(test);
  const lines = test.split("\n");

  const points: Point[] = [];

  for (const line of lines) {
    const [x, y, z, t] = line.split(",").map((v) => parseInt(v, 10));
    points.push(new Point(x, y, z, t));
  }

  let constellations: Constellation[] = [];
  let unassigned = points.filter((p) => !p.constellation);

  while (unassigned.length) {
    let c = new Constellation();
    const first = unassigned.shift() as Point;
    c.points.push(first);
    first.constellation = c;
    // console.log(`new const ${first}`);
    let process: Point[] = [first];
    while (process.length) {
      let current = process.shift() as Point;
      for (const point of unassigned) {
        const d = current.dist(point);
        // console.log(`${current} to ${point} is ${d}`);
        if (current.dist(point) <= 3) {
          c.points.push(point);
          point.constellation = c;
          process.push(point);
        }
      }
      unassigned = unassigned.filter((p) => !p.constellation);
    }
    constellations.push(c);
  }

  console.log(constellations.length);
}

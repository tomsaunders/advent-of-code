#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input10.txt", "utf8") as string;

function asteroid(input: any): number {
  const grid = input.split("\n");
  const h = grid.length;
  const w = grid[0].length;

  let max = 0;
  const lookup = new Map<number, string>();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (grid[y][x] === ".") {
        continue;
      }
      const visible = canSee(y, x, grid);
      lookup.set(visible, `${x},${y}`);
      max = Math.max(max, visible);
    }
  }
  console.log(`${max} found at `, lookup.get(max));
  return max;
}

function canSee(y: number, x: number, grid: string[]): number {
  const h = grid.length;
  const w = grid[0].length;
  let anglesUsed = new Set<string>();
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      if (x === gx && y === gy) {
        continue;
      }
      if (grid[gy][gx] === ".") {
        continue;
      }
      const a = bearing(x, y, gx, gy);
      if (anglesUsed.has(`${a}`)) {
        // console.log("already seen this ange", a);
      }
      anglesUsed.add(`${a}`);
    }
  }

  return Array.from(anglesUsed).length;
}

function dist(ax: number, ay: number, gx: number, gy: number): number {
  const dx = ax - gx;
  const dy = ay - gy;
  return Math.sqrt(dx * dx + dy * dy);
}

function bearing(ax: number, ay: number, gx: number, gy: number): number {
  const TWOPI = 6.2831853071795865;
  const RAD2DEG = 57.2957795130823209;
  let theta = -Math.atan2(ax - gx, ay - gy);
  if (theta < 0.0) theta += TWOPI;
  const bear = RAD2DEG * theta;
  // console.log(`From ${ax}, ${ay} to ${gx}, ${gy} is ${bear}`);
  return bear;
}

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

const test1a = `.#..#
.....
#####
....#
...##`;
test(8, canSee(4, 3, test1a.split("\n")));
test(8, asteroid(test1a));

const test1b = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;
test(33, asteroid(test1b));

const test1c = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;
test(210, asteroid(test1c));

console.log("Answer", asteroid(input));

console.log("\nPART 2\n");

const test2a = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##`;

function laser(input: any, bx: number, by: number): void {
  console.log(`Laser from ${bx},${by}`);
  const grid = input.split("\n");
  const h = grid.length;
  const w = grid[0].length;

  const targets = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (grid[y][x] === "." || (x === bx && y === by)) {
        continue;
      }
      const target = new Target(
        x,
        y,
        bearing(bx, by, x, y),
        dist(bx, by, x, y)
      );
      targets.push(target);
    }
  }
  let destroyed = 0;
  const ordered = targets.sort((a, b) =>
    a.bearing === b.bearing ? a.dist - b.dist : a.bearing - b.bearing
  );
  let rest = ordered.slice(0);
  while (destroyed < ordered.length) {
    rest = rest.filter(t => !t.exploded);
    let b = -1;
    for (let i = 0; i < rest.length; i++) {
      const t = rest[i];
      if (b === t.bearing) {
        continue;
      } else {
        b = t.bearing;
        destroyed++;
        t.index = destroyed;
        t.exploded = true;
        console.log(destroyed, t.score, t.label);
      }
    }
  }
}

class Target {
  public exploded: boolean = false;
  public index: number = 0;
  constructor(
    public x: number,
    public y: number,
    public bearing: number,
    public dist: number
  ) {}
  public get score(): number {
    return this.x * 100 + this.y;
  }
  public get label(): string {
    return `${this.x}, ${this.y} - ${this.dist} dist at ${this.bearing}`;
  }
}

laser(test2a, 8, 3);
laser(test1c, 11, 13);
console.log("Answer");
laser(input, 20, 21);

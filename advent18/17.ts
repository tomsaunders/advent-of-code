#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input17.txt", "utf8");
const test = `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`;

const CLAY = "#";
const OPEN = " ";
const WATER = "~";
const DRIP = "|";
const SPRING = "+";

const lines = input.split("\n");

class Map {
  public grid: string[][];
  public minX = 999;
  public maxX = 0;
  public minY = 0;
  public maxY = 0;

  public constructor(width: number, height: number, lines: string[]) {
    this.grid = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(OPEN);
      }
      this.grid.push(row);
    }

    for (const line of lines) {
      const [fixed, range] = line.split(", ");
      let [fvar, fval] = fixed.split("=") as any[];
      fval = parseInt(fval, 10);
      const [rvar, valrange] = range.split("=");
      const [from, to] = valrange.split("..").map((n) => parseInt(n, 10));

      if (fvar == "x") {
        this.minX = Math.min(this.minX, fval);
        this.maxX = Math.max(this.maxX, fval);
        this.maxY = Math.max(this.maxY, from, to);

        let x = fval;
        for (let y = from; y <= to; y++) {
          this.grid[y][x] = CLAY;
        }
      } else {
        this.minX = Math.min(this.minX, from, to);
        this.maxX = Math.max(this.maxX, from, to);
        this.maxY = Math.max(this.maxY, fval);

        let y = fval;
        for (let x = from; x <= to; x++) {
          this.grid[y][x] = CLAY;
        }
      }
    }
  }

  public print() {
    let out = [];
    let wcount = 0;
    let dcount = 0;
    for (let y = 0; y <= this.maxY; y++) {
      let row = "";
      for (let x = this.minX - 10; x <= this.maxX + 10; x++) {
        const c = this.grid[y][x];
        row += c;
        if (c === WATER) {
          wcount++;
        } else if (c === DRIP) {
          dcount++;
        }
      }
      row += ` ${y} ${wcount + dcount}`;
      out.push(row);
    }

    console.log(out.join("\n"));
    console.log(`${wcount + dcount}`);
    console.log(`${wcount}`);
  }
}

type Coord = [number, number];

class WaterPath {
  public get down(): string {
    return this.cell(this.x, this.y + 1);
  }
  public get up(): string {
    return this.cell(this.x, this.y - 1);
  }
  public get left(): string {
    return this.cell(this.x - 1, this.y);
  }
  public get right(): string {
    return this.cell(this.x + 1, this.y);
  }
  public get leftBoundary(): number {
    let x = this.x - 1;
    let y = this.y;
    let dy = y + 1;
    let c = this.cell(x, y);
    let d = this.cell(x, dy);
    while (c !== CLAY && (d !== OPEN && d !== DRIP)) {
      x--;
      c = this.cell(x, y);
      d = this.cell(x, dy);
    }
    return x;
  }
  public get rightBoundary(): number {
    let x = this.x + 1;
    let y = this.y;
    let dy = y + 1;
    let c = this.cell(x, y);
    let d = this.cell(x, dy);
    while (c !== CLAY && (d !== OPEN && d !== DRIP)) {
      x++;
      c = this.cell(x, y);
      d = this.cell(x, dy);
    }
    return x;
  }
  public leftWall: boolean = false;
  public rightWall: boolean = false;
  public constructor(public x: number, public y: number, private map: Map) {}

  public run(): Coord[] {
    while ((this.down === OPEN || this.down === DRIP) && this.y < this.map.maxY) {
      this.y++;
      this.drip();
      this.rightWall = this.leftWall = false;
    }
    this.drip();
    while (this.y < this.map.maxY && this.y) {
      const l = this.leftBoundary;
      const r = this.rightBoundary;
      const leftWall = this.cell(l, this.y) === CLAY;
      const rightWall = this.cell(r, this.y) === CLAY;

      if (leftWall && rightWall) {
        // fill and go up
        this.fill(l + 1, r - 1, WATER);
        this.y--;
      } else if (leftWall) {
        // fall right
        this.fill(l + 1, r, DRIP);
        return [[r, this.y]];
      } else if (rightWall) {
        // fall left
        this.fill(l, r - 1, DRIP);
        return [[l, this.y]];
      } else {
        // fall both
        this.fill(l, r, DRIP);
        return [[l, this.y], [r, this.y]];
      }
    }
    return [[this.x, this.y]];
  }

  public fill(from: number, to: number, w: string): void {
    for (let x = from; x <= to; x++) {
      this.map.grid[this.y][x] = w;
    }
  }

  public drip(): void {
    this.map.grid[this.y][this.x] = DRIP;
  }

  public cell(x: number, y: number): string {
    return this.map.grid[y][x];
  }
}

const spring: Coord = [500, 0];
const [sx, sy] = spring;
const map = new Map(650, 2000, lines);
map.grid[sy][sx] = SPRING;

const stack: Coord[] = [];
stack.push(spring);

const seen: Set<string> = new Set<string>();

while (stack.length && stack.length < 55) {
  const coord = stack.shift()!!;
  let k = coord.join(":");
  if (seen.has(k)) {
    continue;
  }
  seen.add(k);

  // console.log(`Processing path ${coord[0]},${coord[1]} stack ${stack.length}`);
  const w = new WaterPath(coord[0], coord[1], map);
  const ret = w.run();
  for (const r of ret) {
    const [rx, ry] = r;
    k = r.join(":");
    if (ry < map.maxY && !seen.has(k)) {
      // console.log(`Adding path ${k}`);
      stack.push(r);
    }
  }
}

map.print();
// 31955 too high

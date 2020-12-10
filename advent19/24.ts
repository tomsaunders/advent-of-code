#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input24.txt", "utf8") as string;

const BUG: string = "#";
const SPACE: string = ".";

class Cell {
  public next: string = "";
  public get label(): string {
    return `${this.type} @ ${this.coord}`;
  }
  public get code(): string {
    return this.type;
  }

  constructor(
    public grid: Grid,
    public x: number,
    public y: number,
    public z: number,
    public type: string
  ) {
    if (this.x > 4 || this.y > 4 || this.x < 0 || this.y < 0) {
      throw new Error(`wtf ${x} ${y}`);
    }
  }
  public get coord(): string {
    return `${this.x}:${this.y}:${this.z}`;
  }
  public get isBug(): boolean {
    return this.type === BUG;
  }
  public get north(): Cell | undefined {
    return this.grid.getCell(this.x, this.y - 1, this.z);
  }
  public get south(): Cell | undefined {
    return this.grid.getCell(this.x, this.y + 1, this.z);
  }
  public get east(): Cell | undefined {
    return this.grid.getCell(this.x + 1, this.y, this.z);
  }
  public get west(): Cell | undefined {
    return this.grid.getCell(this.x - 1, this.y, this.z);
  }
  public clone(): Cell {
    return new Cell(this.grid, this.x, this.y, this.z, this.type);
  }

  public tick(): void {
    const bugs = [this.north, this.south, this.east, this.west].filter(
      (c) => !!c && c.isBug
    ) as Cell[];
    this.next = this.type;
    if (this.isBug && bugs.length !== 1) {
      this.next = SPACE;
    } else if (!this.isBug && (bugs.length === 1 || bugs.length === 2)) {
      this.next = BUG;
    }
  }

  public tick2(): void {
    this.next = this.type;
    if (this.x === 2 && this.y === 2) {
      return;
    }

    const bugs = this.grid
      .getNeighbours(this)
      .filter((c) => !!c && c.isBug) as Cell[];
    if (this.isBug && bugs.length !== 1) {
      this.next = SPACE;
    } else if (!this.isBug && (bugs.length === 1 || bugs.length === 2)) {
      this.next = BUG;
    }
  }
}

class Grid {
  public lookup: Map<string, Cell>;
  constructor() {
    this.lookup = new Map<string, Cell>();
  }

  public tick(): void {
    for (const c of this.cells) {
      c.tick();
    }
    for (const c of this.cells) {
      c.type = c.next;
    }
  }

  public tick2(): void {
    for (const c of this.cells) {
      c.tick2();
    }
    for (const c of this.cells) {
      c.type = c.next;
    }
  }

  public getNeighbours(c: Cell): Cell[] {
    function match(from: Cell, x?: number, y?: number): boolean {
      if (x === undefined) x = from.x;
      if (y === undefined) y = from.y;
      return from.x === x && from.y === y;
    }
    function row(y: number, z: number): number[][] {
      const out = [];
      for (let x = 0; x < 5; x++) {
        out.push([x, y, z]);
      }
      return out;
    }
    function col(x: number, z: number): number[][] {
      const out = [];
      for (let y = 0; y < 5; y++) {
        out.push([x, y, z]);
      }
      return out;
    }
    let u = [[c.x, c.y - 1, c.z]];
    let d = [[c.x, c.y + 1, c.z]];
    let l = [[c.x - 1, c.y, c.z]];
    let r = [[c.x + 1, c.y, c.z]];

    if (match(c, 2, 1)) {
      d = row(0, c.z - 1);
    } else if (match(c, 2, 3)) {
      u = row(4, c.z - 1);
    } else if (match(c, 1, 2)) {
      r = col(0, c.z - 1);
    } else if (match(c, 3, 2)) {
      l = col(4, c.z - 1);
    }
    if (match(c, 0)) {
      l = [[1, 2, c.z + 1]];
    } else if (match(c, 4)) {
      r = [[3, 2, c.z + 1]];
    }
    if (match(c, undefined, 0)) {
      u = [[2, 1, c.z + 1]];
    } else if (match(c, undefined, 4)) {
      d = [[2, 3, c.z + 1]];
    }
    return [...u, ...d, ...l, ...r].map(
      (coord: number[]) => this.getCell(coord[0], coord[1], coord[2]) as Cell
    );
  }

  public get key(): string {
    let key = "";
    const [minX, minY, minZ, maxX, maxY, maxZ] = this.bounds;
    for (let z = minZ; z <= maxZ; z++) {
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const coord = `${x}:${y}:${z}`;
          const cell = this.lookup.get(coord) as Cell;
          key += cell.type;
        }
      }
    }
    return key;
  }

  public get bugs(): number {
    return this.cells.filter((c) => c.isBug).length;
  }

  public get biodiversity(): number {
    let exp = 0;
    let total = 0;

    const [minX, minY, minZ, maxX, maxY, maxZ] = this.bounds;
    for (let z = minZ; z <= maxZ; z++) {
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const coord = `${x}:${y}:${z}`;
          const cell = this.lookup.get(coord) as Cell;
          if (cell.isBug) {
            total += Math.pow(2, exp);
          }
          exp++;
        }
      }
    }
    return total;
  }

  public get cells(): Cell[] {
    return Array.from(this.lookup.values());
  }

  public addCell(x: number, y: number, z: number, type: string): Cell {
    const c = new Cell(this, x, y, z, type);
    this.lookup.set(c.coord, c);

    return c;
  }

  public getCell(x: number, y: number, z: number): Cell {
    const coord = `${x}:${y}:${z}`;
    return this.lookup.get(coord) as Cell;
  }

  public get bounds(): number[] {
    const bounds = [0, 0, 0, 4, 4, 0];
    this.cells
      .filter((c) => c.isBug)
      .forEach((c) => {
        bounds[2] = Math.min(bounds[2], c.z);
        bounds[5] = Math.max(bounds[5], c.z);
      });
    return bounds;
  }

  public draw(): void {
    const [minX, minY, minZ, maxX, maxY, maxZ] = this.bounds;
    console.log("drawing", minX, minY, minZ, " to", maxX, maxY, maxZ);
    for (let z = minZ; z <= maxZ; z++) {
      console.log("Level", z);
      for (let y = minY; y <= maxY; y++) {
        let line = ``;
        for (let x = minX; x <= maxX; x++) {
          const c = `${x}:${y}:${z}`;
          const cell = this.lookup.get(c);
          line += cell ? cell.code : ".";
        }
        console.log(line);
      }
    }
    console.log("");
  }
}

const input1a = `....#
#..#.
#..##
..#..
#....`;

function part1(input: string): number {
  const map = new Grid();
  const lines = input.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const code = line[x];
      map.addCell(x, y, 0, code);
    }
  }
  let key = map.key;
  const seen = new Set<string>();
  while (!seen.has(key)) {
    seen.add(key);
    map.tick();
    key = map.key;
  }
  map.draw();
  return map.biodiversity;
}

console.log(part1(input1a));
console.log("Part 1: ", part1(input));

function part2(input: string, minutes: number): number {
  const map = new Grid();
  for (let z = -minutes; z < minutes; z++) {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        map.addCell(x, y, z, x === 2 && y === 2 ? "?" : SPACE);
      }
    }
  }
  const lines = input.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const code = line[x];
      map.addCell(x, y, 0, code);
    }
  }
  for (let m = 0; m < minutes; m++) {
    map.tick2();
  }
  map.draw();
  return map.bugs;
}

const input2a = `....#
#..#.
#.?##
..#..
#....`;
console.log(part2(input2a, 10));
console.log("Part 2: ", part2(input, 200));

#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input18.txt", "utf8") as string;

function test(a: number, b: number): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

const WALL: string = "#";
const SPACE: string = ".";

class Cell {
  public visited = false;
  public tentativeDist = 9999;
  public get label(): string {
    return `${this.type} @ ${this.coord}`;
  }
  public get code(): number {
    return this.type.charCodeAt(0);
  }
  constructor(
    public grid: Grid,
    public x: number,
    public y: number,
    public type: string
  ) {}
  public get coord(): string {
    return `${this.x}:${this.y}`;
  }
  public get isWall(): boolean {
    return this.type === WALL;
  }
  public get isSpace(): boolean {
    return this.type === SPACE;
  }
  public get isGate(): boolean {
    return this.code >= 65 && this.code <= 90;
  }
  public get isKey(): boolean {
    return this.code >= 97 && this.code <= 122;
  }
  public get north(): Cell | undefined {
    return this.grid.getCell(this.x, this.y - 1);
  }
  public get south(): Cell | undefined {
    return this.grid.getCell(this.x, this.y + 1);
  }
  public get east(): Cell | undefined {
    return this.grid.getCell(this.x + 1, this.y);
  }
  public get west(): Cell | undefined {
    return this.grid.getCell(this.x - 1, this.y);
  }

  public move(dir: number): [string, Cell] {
    if (dir === 1) {
      if (this.north && this.north.isWall) return ["", this.north];
      else if (this.east && this.east.isWall) return ["R", this.east];
      else if (this.west && this.west.isWall) return ["L", this.west];
    }
    if (dir === 2) {
      if (this.south && this.south.isWall) return ["", this.south];
      else if (this.east && this.east.isWall) return ["L", this.east];
      else if (this.west && this.west.isWall) return ["R", this.west];
    }
    if (dir === 3) {
      if (this.east && this.east.isWall) return ["", this.east];
      else if (this.north && this.north.isWall) return ["L", this.north];
      else if (this.south && this.south.isWall) return ["R", this.south];
    }
    if (dir === 4) {
      if (this.west && this.west.isWall) return ["", this.west];
      else if (this.north && this.north.isWall) return ["R", this.north];
      else if (this.south && this.south.isWall) return ["L", this.south];
    }

    return ["", this];
  }
  public isUnknown(dir: number) {
    if (dir === 1 && !this.north) return true;
    if (dir === 2 && !this.south) return true;
    if (dir === 3 && !this.east) return true;
    if (dir === 4 && !this.west) return true;
    return false;
  }
  public get explore(): number {
    if (!this.north) {
      return 1;
    } else if (!this.south) {
      return 2;
    } else if (!this.east) {
      return 3;
    } else if (!this.west) {
      return 4;
    }
    return 0;
  }
  public get options(): number[] {
    let options = [];
    if (!this.north) {
      options.push(1);
    }
    if (!this.south) {
      options.push(2);
    }
    if (!this.east) {
      options.push(3);
    }
    if (!this.west) {
      options.push(4);
    }
    return options;
  }
  public get neighbours(): Cell[] {
    return [this.north, this.south, this.east, this.west].filter(
      c => !!c && !c.isWall
    ) as Cell[];
  }

  public get randomDir(): number {
    const e = this.explore;
    const o = this.options;
    const r = Math.floor(Math.random() * o.length);
    return e ? e : o[r];
  }
}

class Grid {
  public lookup: Map<string, Cell>;
  public minY: number = 0;
  public minX: number = 0;
  public maxY: number = 0;
  public maxX: number = 0;
  constructor() {
    this.lookup = new Map<string, Cell>();
  }

  public get cells(): Cell[] {
    return Array.from(this.lookup.values());
  }

  public addCell(x: number, y: number, type: string): Cell {
    const c = new Cell(this, x, y, type);
    this.lookup.set(c.coord, c);
    this.minY = Math.min(this.minY, y);
    this.minX = Math.min(this.minX, x);
    this.maxY = Math.max(this.maxY, y);
    this.maxX = Math.max(this.maxX, x);
    return c;
  }

  public getCell(x: number, y: number) {
    return this.lookup.get(`${x}:${y}`);
  }

  public draw(): void {
    let xRow = "   ";
    for (let x = this.minX; x <= this.maxX; x++) {
      xRow += x % 10 === 0 ? Math.round(x / 10) : " ";
    }
    console.log(xRow);
    xRow = "   ";
    for (let x = this.minX; x <= this.maxX; x++) {
      xRow += x % 10;
    }
    console.log(xRow);

    for (let y = this.minY; y <= this.maxY; y++) {
      const yPos = y < 10 ? `0${y}` : `${y}`;
      let line = `${yPos} `;
      for (let x = this.minX; x <= this.maxX; x++) {
        const c = `${x}:${y}`;
        const cell = this.lookup.get(c);
        line += cell ? cell.code : " ";
      }
      console.log(line);
    }
    console.log("drawn from ", this.minX, this.minY, this.maxX, this.maxY);
  }

  public shortestPath(from: Cell, to: Cell): number {
    let unvisitedSet: Cell[] = Array.from(this.lookup.values());
    from.tentativeDist = 0;
    let current: Cell = from;

    while (!to.visited && unvisitedSet.length) {
      const d = current.tentativeDist + 1;
      for (const n of current.neighbours) {
        n.tentativeDist = Math.min(d, n.tentativeDist);
      }
      current.visited = true;
      unvisitedSet = unvisitedSet.filter(c => !c.visited);
      unvisitedSet.sort((a, b) => b.tentativeDist - a.tentativeDist);
      current = unvisitedSet.pop() as Cell;
    }
    return to.tentativeDist;
  }

  public longestPath(from: Cell): number {
    let unvisitedSet: Cell[] = Array.from(this.lookup.values()).map(c => {
      c.tentativeDist = 9999;
      c.visited = false;
      return c;
    });
    from.tentativeDist = 0;
    let current: Cell = from;

    while (unvisitedSet.length) {
      const d = current.tentativeDist + 1;
      for (const n of current.neighbours) {
        n.tentativeDist = Math.min(d, n.tentativeDist);
      }
      current.visited = true;
      unvisitedSet = unvisitedSet.filter(c => !c.visited);
      unvisitedSet.sort((a, b) => b.tentativeDist - a.tentativeDist);
      current = unvisitedSet.pop() as Cell;
    }
    const visitedSet: Cell[] = Array.from(this.lookup.values()).filter(
      c => !c.isWall
    );
    visitedSet.sort((a, b) => b.tentativeDist - a.tentativeDist);
    const longest = visitedSet.shift() as Cell;
    return longest.tentativeDist;
  }
}

const input1a = `#########
#b.A.@.a#
#########`;
const input1b = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`;
const input1c = `########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`;
const input1d = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`;
const input1e = `########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`;

function steps(input: string): number {
  const map = new Grid();
  const lines = input.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const code = line[x];
      map.addCell(x, y, code);
    }
  }
  map.draw();
  const start = map.cells.find(c => c.type === "@");

  return 99;
}

test(8, steps(input1a));
// test(86, steps(input1b));
// test(132, steps(input1c));
// test(136, steps(input1d));
// test(81, steps(input1e));

// console.log("Answer", steps(input));
// console.log("\nPART 2\n");

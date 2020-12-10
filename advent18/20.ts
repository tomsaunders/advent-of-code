#!/usr/bin/env ts-node
import * as fs from "fs";
import { stringify } from "querystring";
const input = fs
  .readFileSync("input20.txt", "utf8")
  .replace("^", "")
  .replace("$", "");
const test = `#####
#.|.#
#-###
#.|X#
#####`;

const ROOM = ".";
const WALL = "#";
const DOOR = "|";
const DOOR2 = "-";
const POS = "X";
const UNK = "?";

function key(x: number, y: number) {
  return `${x}:${y}`;
}

class Grid {
  public cells: Map<string, Cell>;

  public minY: number = 9;
  public minX: number = 9;
  public maxY: number = 0;
  public maxX: number = 0;
  public get yRange(): number {
    return this.maxY - this.minY;
  }
  public get xRange(): number {
    return this.maxX - this.minX;
  }

  public constructor() {
    this.cells = new Map<string, Cell>();
  }

  public getCell(x: number, y: number) {
    const k = key(x, y);
    if (!this.cells.has(k)) {
      const cell = new Cell(x, y, this);
      this.cells.set(cell.key, cell);
      // console.log("making cell at ", k);
      this.maxX = Math.max(this.maxX, x);
      this.maxY = Math.max(this.maxY, y);
      this.minX = Math.min(this.minX, x);
      this.minY = Math.min(this.minY, y);
    }
    return this.cells.get(k) as Cell;
  }

  public finish(): void {
    let max = 0;
    let thouCount = 0;
    this.cells.forEach((cell) => {
      if (cell.i === UNK) cell.icon(WALL);
      if (cell.i === ROOM) {
        max = Math.max(cell.dist, max);
        if (cell.dist >= 1000) thouCount++;
      }
    });
    console.log("Maximum distance is", max);
    console.log("Exceed 1000:", thouCount); //8580 too low
  }
}

class Cell {
  public get key(): string {
    return key(this.x, this.y);
  }
  private _up: Cell | undefined;
  public get up(): Cell {
    if (!this._up) {
      const up = this.map.getCell(this.x, this.y - 1);
      up.down = this;
      this._up = up;
    }
    return this._up;
  }
  public set up(cell) {
    this._up = cell;
  }
  public get hasUp(): boolean {
    return !!this._up;
  }

  private _down: Cell | undefined;
  public get down(): Cell {
    if (!this._down) {
      const down = this.map.getCell(this.x, this.y + 1);
      down.up = this;
      this._down = down;
    }
    return this._down;
  }
  public set down(cell) {
    this._down = cell;
  }
  public get hasDown(): boolean {
    return !!this._down;
  }

  private _left: Cell | undefined;
  public get left(): Cell {
    if (!this._left) {
      const left = this.map.getCell(this.x - 1, this.y);
      left.right = this;
      this._left = left;
    }
    return this._left;
  }
  public set left(cell) {
    this._left = cell;
  }
  public get hasLeft(): boolean {
    return !!this._left;
  }

  private _right: Cell | undefined;
  public get right(): Cell {
    // console.log("cell right");
    if (!this._right) {
      const right = this.map.getCell(this.x + 1, this.y);
      right.left = this;
      this._right = right;
    }
    return this._right;
  }
  public set right(cell) {
    this._right = cell;
  }
  public get hasRight(): boolean {
    return !!this._right;
  }

  public get isDoor(): boolean {
    return this.i === DOOR || this.i === DOOR2;
  }

  public i: string = UNK;
  public dist: number = 99999;

  public constructor(public x: number, public y: number, public map: Grid) {}

  public icon(i: string): this {
    this.i = i;
    return this;
  }

  public wall(): this {
    return this.icon(WALL);
  }

  public room(oldDist: number): this {
    this.map.getCell(this.x - 1, this.y - 1).wall();
    this.map.getCell(this.x + 1, this.y - 1).wall();
    this.map.getCell(this.x - 1, this.y + 1).wall();
    this.map.getCell(this.x + 1, this.y + 1).wall();
    this.left;
    this.right;
    this.up;
    this.down;
    this.dist = Math.min(this.dist, oldDist + 1);

    return this.icon(ROOM);
  }

  public follow(regex: string[], context: Cell[] = []): void {
    // console.log("following ", regex);
    let current = this as Cell;
    while (regex.length) {
      // console.log("\n", regex.join(""), "context ", context.map((cell) => cell.key).join(", "));
      print(this.map);
      let c = regex.shift() as string;
      if (c.match(/[NSEW]/)) {
        current = current.move(c);
        // console.log("match ", c, " now ", current.key);
      } else if (c === "(") {
        context = [...context, current];
        // console.log("new branch from ", current.key);
      } else if (c === "|") {
        const last = context.pop() as Cell;
        // console.log("switch - back to ", last.key);
        last.follow([...regex], [...context, last]);
        // skip ahead until we're at the correct depth for this path
        // console.log("skipping ahead from ", regex.length);
        let depth = 1;
        while (depth) {
          let d = regex.shift() as string;
          if (d === "(") depth++;
          if (d === ")") depth--;
        }
        // console.log("to ", regex.length);
      } else if (c === ")") {
        // console.log("pop)");
        context.pop();
      }
    }
  }

  public cheat(regex: string[]): void {
    let current = this as Cell;
    let stack: Cell[] = [current];
    for (const c of regex) {
      print(this.map);
      if (c.match(/[NSEW]/)) {
        current = current.move(c);
      } else if (c === "(") {
        stack.push(current);
      } else if (c === ")") {
        current = stack.pop() as Cell;
      } else if (c === "|") {
        current = stack[stack.length - 1];
      }
    }
  }

  public move(dir: string): Cell {
    switch (dir) {
      case "N":
        return this.upDoor();
      case "E":
        // console.log("move e");
        return this.rightDoor();
      case "S":
        return this.downDoor();
      case "W":
        return this.leftDoor();
    }
    return this; // just to shut up TypeScript
  }

  public upDoor(): Cell {
    const door = this.up.icon(DOOR2);
    door.left.wall();
    door.right.wall();
    return door.up.room(this.dist);
  }

  public downDoor(): Cell {
    const door = this.down.icon(DOOR2);
    door.left.wall();
    door.right.wall();
    return door.down.room(this.dist);
  }

  public leftDoor(): Cell {
    const door = this.left.icon(DOOR);
    door.up.wall();
    door.down.wall();
    return door.left.room(this.dist);
  }

  public rightDoor(): Cell {
    const door = this.right.icon(DOOR);
    door.up.wall();
    door.down.wall();
    return door.right.room(this.dist);
  }
}

function print(map: Grid) {
  let out: string[][] = [];
  for (let y = 0; y <= map.yRange; y++) {
    let row = [];
    for (let x = 0; x <= map.xRange; x++) {
      row.push(" ");
    }
    out.push(row);
  }
  map.cells.forEach((cell) => {
    let x = cell.x - map.minX;
    let y = cell.y - map.minY;
    out[y][x] = cell.i;
  });
  out.unshift([]);
  out.push([]);
  console.log(out.map((row) => row.join("")).join("\n"));
}

const tests = [
  "^WNE$",
  "ENWWW(NEEE|SSE(EE|N))",
  "ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN",
  "^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$",
  "^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$",
  input,
];
for (let test of tests) {
  test = test.replace("^", "").replace("$", "");
  console.log(test.substr(0, 100));
  const map = new Grid();
  const start = map.getCell(0, 0).room(0).icon(POS);
  start.dist = 0;
  start.cheat(test.split(""));
  map.finish();
  // print(map);
}

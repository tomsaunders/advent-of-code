#!/usr/bin/env npx ts-node
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

  public constructor() {
    this.cells = new Map<string, Cell>();
  }

  public getCell(x: number, y: number) {
    const k = key(x, y);
    if (!this.cells.has(k)) {
      this.cells.set(k, new Cell(x, y, this));
      console.log("making cell at ", k);
      this.maxX = Math.max(this.maxX, x);
      this.maxY = Math.max(this.maxY, y);
      this.minX = Math.min(this.minX, x);
      this.minY = Math.min(this.minY, y);
    }
    return this.cells.get(k) as Cell;
  }
}

class Cell {
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
    console.log("cell right");
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

  public i: string = "";

  public constructor(public x: number, public y: number, public map: Grid) {}

  public icon(i: string): this {
    this.i = i;
    return this;
  }

  public follow(regex: string): void {
    console.log("following ", regex);
    let current = this as Cell;
    for (let i = 0; i < regex.length; i++) {
      const c = regex[i];
      console.log(c);
      if (c.match(/[NSEW]/)) {
        console.log("match ", c);
        current = current.move(c);
      }
    }
  }

  public move(dir: string): Cell {
    this.i = ROOM;
    switch (dir) {
      case "N":
        return this.up.icon(DOOR2).up.icon(POS);
      case "E":
        console.log("move e");
        return this.right.icon(DOOR).right.icon(POS);
      case "S":
        return this.down.icon(DOOR2).down.icon(POS);
      case "W":
        return this.left.icon(DOOR).left.icon(POS);
    }
    return this; // just to shut up TypeScript
  }
}

function print(map: Grid) {
  console.log(map.minX, ", ", map.minY, " to ", map.maxX, ", ", map.maxY);
  // let current = start;
  // while (current.hasUp) {
  //   current = current.up;
  // }
  // while (current.hasLeft) {
  //   current = current.left;
  // }
  // let out = current.i;
  // while (current.hasDown) {
  //   let rowStart = current;
  //   while (current.hasRight) {
  //     current = current.right;
  //     out += current.i;
  //   }
  //   out += "\n";
  //   current = rowStart.down;
  // }
  // console.log(out);
}

const map = new Grid();
const start = new Cell(0, 0, map).icon(POS);
print(map);
start.follow("EEE");
print(map);

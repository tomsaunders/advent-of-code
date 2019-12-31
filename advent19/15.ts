#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input15.txt", "utf8") as string;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

export class IntcodeProcessor {
  public position: number = 0;
  public relativeBase: number = 0;
  public input: number[] = [];
  public output: number[] = [];
  public halted: boolean = false;
  public next!: IntcodeProcessor;

  constructor(public codes: number[]) {}

  public thread(): IntcodeProcessor {
    const p = new IntcodeProcessor(this.codes.slice(0));
    p.relativeBase = this.relativeBase;
    p.position = this.position;
    return p;
  }

  public run(): number {
    const val = (instruction: string, offset: number): number => {
      const param = this.codes[this.position + offset];
      const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
      if (mode === 0) {
        return this.codes[param];
      } else if (mode === 1) {
        return param;
      } else if (mode === 2) {
        // relative
        return this.codes[param + this.relativeBase] || 0;
      }
      return 99;
    };
    const setval = (instruction: string, offset: number): number => {
      const param = this.codes[this.position + offset];
      const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
      if (mode === 0 || mode === 1) {
        // position
        return param || 0;
      } else if (mode === 2) {
        // relative
        return param + this.relativeBase || 0;
      }
      return 99;
    };

    let code = this.codes[this.position];
    let codeStr = `00000000000${code}`;
    let op = parseInt(codeStr.substr(codeStr.length - 2), 10);

    while (op !== 99) {
      let a = val(codeStr, 1);
      let b = val(codeStr, 2);
      if (op === 1) {
        let c = setval(codeStr, 3);
        this.codes[c] = a + b;
        this.position += 4;
      } else if (op === 2) {
        let c = setval(codeStr, 3);
        this.codes[c] = a * b;
        this.position += 4;
      } else if (op === 3) {
        a = setval(codeStr, 1);
        const inputVal = this.input.shift();
        // console.log("got input ", inputVal);
        this.codes[a] = inputVal || 0;
        this.position += 2;
      } else if (op === 4) {
        const output = val(codeStr, 1);
        this.output.push(output);
        // this.next.input.push(output);
        this.position += 2;
        return output;
      } else if (op === 5) {
        if (a !== 0) {
          this.position = b;
        } else {
          this.position += 3;
        }
      } else if (op === 6) {
        if (a === 0) {
          this.position = b;
        } else {
          this.position += 3;
        }
      } else if (op === 7) {
        let c = setval(codeStr, 3);
        this.codes[c] = a < b ? 1 : 0;
        this.position += 4;
      } else if (op === 8) {
        let c = setval(codeStr, 3);
        this.codes[c] = a == b ? 1 : 0;
        this.position += 4;
      } else if (op === 9) {
        this.relativeBase += a;
        this.position += 2;
      }
      code = this.codes[this.position];
      codeStr = `00000000000${code}`;
      op = parseInt(codeStr.substr(codeStr.length - 2), 10);
    }
    this.halted = true;
    return -1;
  }
}

class Cell {
  public visited = false;
  public tentativeDist = 9999;
  public north?: Cell;
  public south?: Cell;
  public east?: Cell;
  public west?: Cell;
  public get label(): string {
    return `${this.code} @ ${this.coord}`;
  }
  public get code(): string {
    if (this.type === 0) {
      return "#";
    } else if (this.type === 1) {
      return ".";
    } else {
      return "G";
    }
  }
  constructor(
    public grid: Grid,
    public x: number,
    public y: number,
    public type: number
  ) {}
  public get coord(): string {
    return `${this.x}:${this.y}`;
  }
  public get isWall(): boolean {
    return this.type === WALL;
  }
  public get isGoal(): boolean {
    return this.type === GOAL;
  }
  public wall(dir: number): Cell {
    if (dir === 1) {
      this.north = this.grid.addCell(this.x, this.y - 1, WALL);
    } else if (dir === 2) {
      this.south = this.grid.addCell(this.x, this.y + 1, WALL);
    } else if (dir === 3) {
      this.east = this.grid.addCell(this.x + 1, this.y, WALL);
    } else if (dir === 4) {
      this.west = this.grid.addCell(this.x - 1, this.y, WALL);
    }

    return this;
  }
  public space(dir: number): Cell {
    if (dir === 1) {
      this.north = this.grid.addCell(this.x, this.y - 1, SPACE);
      this.north.south = this;
      return this.north;
    } else if (dir === 2) {
      this.south = this.grid.addCell(this.x, this.y + 1, SPACE);
      this.south.north = this;
      return this.south;
    } else if (dir === 3) {
      this.east = this.grid.addCell(this.x + 1, this.y, SPACE);
      this.east.west = this;
      return this.east;
    } else if (dir === 4) {
      this.west = this.grid.addCell(this.x - 1, this.y, SPACE);
      this.west.east = this;
      return this.west;
    }
    return this; // shouldnt happen
  }
  public goal(dir: number): Cell {
    if (dir === 1) {
      this.north = this.grid.addCell(this.x, this.y - 1, GOAL);
      this.north.south = this;
      return this.north;
    } else if (dir === 2) {
      this.south = this.grid.addCell(this.x, this.y + 1, GOAL);
      this.south.north = this;
      return this.south;
    } else if (dir === 3) {
      this.east = this.grid.addCell(this.x + 1, this.y, GOAL);
      this.east.west = this;
      return this.east;
    } else if (dir === 4) {
      this.west = this.grid.addCell(this.x - 1, this.y, GOAL);
      this.west.east = this;
      return this.west;
    }
    return this; // shouldnt happen
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

  public addCell(x: number, y: number, type: number): Cell {
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
    for (let y = this.minY; y <= this.maxY; y++) {
      let line = "";
      for (let x = this.minX; x <= this.maxX; x++) {
        const c = `${x}:${y}`;
        const cell = this.lookup.get(c);
        if (x === 0 && y === 0) line += "S";
        else line += cell ? cell.code : " ";
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

const WALL = 0;
const SPACE = 1;
const GOAL = 2;

function droid(codes: number[]): number {
  const intcode = new IntcodeProcessor(codes);
  let n = 0;

  const map = new Grid();
  const start = map.addCell(0, 0, SPACE);
  const threads: [Cell, number, IntcodeProcessor][] = [];
  for (const d of start.options) {
    threads.push([start, d, intcode.thread()]);
  }

  let found: Cell;
  while (threads.length) {
    n++;
    let [cell, dir, thread] = threads.pop() as [Cell, number, IntcodeProcessor];
    if (!cell.isUnknown(dir)) {
      continue;
    }

    thread.input.push(dir);
    const move = thread.run();
    if (move === 0) {
      cell = cell.wall(dir);
    } else if (move === 1) {
      cell = cell.space(dir);
    } else if (move === 2) {
      cell = cell.goal(dir);
      found = cell;
    }

    if (move) {
      const o = cell.options;
      for (const d of o) {
        threads.push([cell, d, thread.thread()]);
      }
    }
  }
  map.draw();
  console.log("after", n, "rem threads", threads.length);
  const shortest = map.shortestPath(start, found!);
  console.log("Part 2", map.longestPath(found!));
  return shortest;
}
const codes = input.split(",").map(s => parseInt(s, 10));
console.log("Answer", droid(codes.slice(0)));
// console.log("\n Part 2");

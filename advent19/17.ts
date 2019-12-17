#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input17.txt", "utf8") as string;

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
  public get label(): string {
    return `${this.code} @ ${this.coord}`;
  }
  public get code(): string {
    if (this.isIntersection) {
      return "O";
    } else if (this.type === SCAF) {
      return "#";
    } else if (this.type === SPACE) {
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
    return this.type === SCAF;
  }
  public get isGoal(): boolean {
    return this.type === BOT;
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
  public get isIntersection(): boolean {
    const n = this.north;
    const s = this.south;
    const e = this.east;
    const w = this.west;

    return (
      this.isWall &&
      !!n &&
      n.isWall &&
      !!s &&
      s.isWall &&
      !!e &&
      e.isWall &&
      !!w &&
      w.isWall
    );
  }

  public get alignment(): number {
    return this.x * this.y;
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

const SCAF = 35;
const SPACE = 46;
const BOT = 94;

function vacuum(codes: number[]): number {
  const intcode = new IntcodeProcessor(codes);
  const map = new Grid();

  while (!intcode.halted) {
    intcode.run();
  }

  let x = 0;
  let y = 0;
  for (let i = 0; i < intcode.output.length; i++) {
    const code = intcode.output[i];
    if (code === 10) {
      y++;
      x = -1;
    } else {
      map.addCell(x, y, code);
    }
    x++;
  }

  // map.draw();

  return Array.from(map.lookup.values())
    .filter(c => c.isIntersection)
    .map(c => c.alignment)
    .reduce((p, c) => c + p, 0);
}
const codes = input.split(",").map(s => parseInt(s, 10));
console.log("Answer", vacuum(codes.slice(0)));

function clean(codes: number[]): number {
  const mapper = new IntcodeProcessor(codes.slice(0));
  const map = new Grid();

  while (!mapper.halted) {
    mapper.run();
  }

  let x = 0;
  let y = 0;
  for (let i = 0; i < mapper.output.length; i++) {
    const code = mapper.output[i];
    if (code === 10) {
      y++;
      x = -1;
    } else {
      map.addCell(x, y, code);
    }
    x++;
  }

  map.draw();

  codes[0] = 2;
  let cells = Array.from(map.lookup.values()) as Cell[];
  const start = cells.find(c => c.isGoal) as Cell;
  cells = cells.filter(c => c.isWall);
  start.visited = true;
  let dir = 1;
  let turn: string = "";
  let cell: Cell = start;
  let n = 0;
  let count = 0;
  const instruction: string[] = [];
  while (cells.length) {
    [turn, cell] = cell.move(dir);
    cell.visited = true;
    if (!turn) {
      count++;
    } else {
      if (count) {
        instruction.push(`${count}`);
      }
      instruction.push(turn);
      if (turn === "L") {
        if (dir === 1) dir = 4;
        else if (dir === 2) dir = 3;
        else if (dir === 3) dir = 1;
        else if (dir === 4) dir = 2;
      } else if (turn === "R") {
        if (dir === 1) dir = 3;
        else if (dir === 2) dir = 4;
        else if (dir === 3) dir = 2;
        else if (dir === 4) dir = 1;
      }
      count = 1;
    }
    // console.log(turn, cell.coord, dir, cells[0].coord);
    cells = cells.filter(c => !c.visited);
  }
  instruction.push(`${count}`);
  let instr = instruction.join(",");
  console.log(instr);
  const A = "L,12,L,12,L,6,L,6";
  console.log("A", A);
  while (instr.indexOf(A) != -1) {
    instr = instr.replace(A, "A");
  }
  const B = "L,12,L,6,R,12,R,8";
  console.log("B", B);
  while (instr.indexOf(B) != -1) {
    instr = instr.replace(B, "B");
  }
  const C = "R,8,R,4,L,12";
  console.log("C", C);
  while (instr.indexOf(C) != -1) {
    instr = instr.replace(C, "C");
  }
  const main = instr;
  const commands: string[] = [main, A, B, C, "n"];

  console.log(instr);

  const cleaner = new IntcodeProcessor(codes);
  for (const cmd of commands) {
    for (let c = 0; c < cmd.length; c++) {
      cleaner.input.push(cmd.charCodeAt(c));
    }
    cleaner.input.push(10);
  }
  console.log("all inputs provided", cleaner.input.length);
  let nx = 0;
  let l = "";
  while (!cleaner.halted) {
    const o = cleaner.run();
    if (o > 1000) {
      console.log("BIG", o);
    }
    if (o === 10) {
      console.log(l);
      l = "";
    } else {
      l += String.fromCharCode(o);
    }
    nx++;
  }
  console.log("all inputs provided", nx, cleaner.input.length);

  return 99;
}

console.log("\n Part 2");
console.log("Answer", clean(codes.slice(0)));

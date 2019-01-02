#!/usr/bin/env npx ts-node
import * as fs from "fs";

const ROCKY = ".";
const WET = "=";
const NARROW = "|";
const MOUTH = "M";
const TARGET = "T";

const TORCH = "H";
const GEAR = "G";
const NEITHER = "O";

// INPUT
// const depth = 4080;
// const target = [14, 785];

// TEST
const depth = 510;
const target = [10, 10];

class Cave {
  public cells: Cell[][];
  public constructor(public depth: number, public targetX: number, public targetY: number) {
    this.cells = [];
    let risk = 0;
    for (let y = 0; y <= targetY + 20; y++) {
      this.cells.push([]);
      for (let x = 0; x <= targetX + 100; x++) {
        const cell = new Cell(x, y, this);
        this.cells[y].push(cell);
        risk += cell.risk;
      }
    }
    this.print();
  }

  public getCell(x: number, y: number): Cell | undefined {
    if (!this.cells[y] || !this.cells[y][x]) {
      return undefined;
    }
    return this.cells[y][x];
  }

  public getMove(cell: Cell, cost: number, tool: string) {
    // todo cache??
    return new Move(cell, cost, tool);
  }

  public print(): void {
    const out = [];
    for (const row of this.cells) {
      let r = [];
      for (const cell of row) {
        r.push(cell.icon);
      }
      out.push(r.join(""));
    }
    out.push("");
    console.log(out.join("\n"));
  }
}

class Cell {
  public geologic: number;

  public get erosion(): number {
    return (this.geologic + this.cave.depth) % 20183;
  }

  public get type(): string {
    switch (this.erosion % 3) {
      case 0:
        return ROCKY;
      case 1:
        return WET;
      case 2:
        return NARROW;
    }
    return "";
  }

  public get icon(): string {
    if (this.x === 0 && this.y === 0) {
      return MOUTH;
    } else if (this.x === this.cave.targetX && this.y === this.cave.targetY) {
      return TARGET;
    }
    return this.type;
  }

  public get risk(): number {
    return this.erosion % 3;
  }

  public constructor(public x: number, public y: number, public cave: Cave) {
    let g = 0;
    if (this.x === 0 && this.y === 0) {
      g = 0;
    } else if (this.x === this.cave.targetX && this.y === this.cave.targetY) {
      g = 0;
    } else if (this.y === 0) {
      g = this.x * 16807;
    } else if (this.x === 0) {
      g = this.y * 48271;
    } else {
      g = this.cave.getCell(this.x - 1, this.y)!!.erosion * this.cave.getCell(this.x, this.y - 1)!!.erosion;
    }
    this.geologic = g;
  }

  public canAccess(tool: string): boolean {
    switch (this.erosion % 3) {
      case 0:
        return tool === GEAR || tool === TORCH;
      case 1:
        return tool === GEAR || tool === NEITHER;
      case 2:
        return tool === TORCH || tool === NEITHER;
    }
    return false;
  }

  public get validTools(): string[] {
    switch (this.erosion % 3) {
      case 0:
        return [TORCH, GEAR];
      case 1:
        return [GEAR, NEITHER];
      case 2:
        return [TORCH, NEITHER];
    }
    return [];
  }

  public toString(): string {
    return `${this.x},${this.y}`;
  }

  public equals(other: Cell): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public get d(): string {
    const t = this.validTools.join(",");
    return `${this.icon} @ ${this.toString()} (${t})`;
  }

  public get neighbours(): Cell[] {
    const cave = this.cave;
    const x = this.x;
    const y = this.y;
    return [cave.getCell(x, y + 1), cave.getCell(x + 1, y), cave.getCell(x, y - 1), cave.getCell(x - 1, y)].filter(
      (cell) => !!cell
    ) as Cell[];
  }
}

class Move {
  public get neighbours(): Move[] {
    const moves: Move[] = [];

    const cells = this.cell.neighbours;
    for (const cell of cells) {
      if (!cell) {
        continue;
      }
      if (cell.canAccess(this.tool)) {
        moves.push(cave.getMove(cell, 1, this.tool));
      } else {
        for (const valid of cell.validTools) {
          moves.push(cave.getMove(cell, 7, valid));
        }
      }
    }
    return moves;
  }

  public static getOptions(start: Cell, tool: string): Move[] {
    const moves: Move[] = [];

    const cells = start.neighbours;
    for (const cell of cells) {
      if (!cell) {
        continue;
      }
      if (cell.canAccess(tool)) {
        moves.push(new Move(cell, 1, tool));
      } else {
        for (const valid of cell.validTools) {
          moves.push(new Move(cell, 7, valid));
        }
      }
    }
    return moves;
  }

  public constructor(public cell: Cell, public cost: number, public tool: string) {}

  public dist(other: Move) {
    return Math.abs(this.cell.y - other.cell.y) + Math.abs(this.cell.x - other.cell.x);
  }

  public canAccess(other: Move) {
    return other.cell.canAccess(this.tool);
  }

  public heuristic(other: Move) {
    const dist = this.dist(goal); // optimistic manhattan
    if (!this.canAccess(goal)) {
      // cant access with the current tool, would have to switch at least once
      return dist + 7;
    }
    {
      return dist;
    }
  }

  public toString(): string {
    return `Moving to ${this.cell.d} with ${this.tool} and cost ${this.cost}\n`;
  }

  public equals(other: Move) {
    return this.cell.equals(other.cell) && this.tool === other.tool;
  }

  public get key(): string {
    return `${this.cell} - ${this.tool}`;
  }

  public get tup(): MoveTup {
    return [this.cell, this.tool];
  }
}

class MoveSet {
  public arr: Move[] = [];

  public add(value: Move): this {
    let found = this.has(value);

    if (!found) {
      this.arr.push(value);
    }

    return this;
  }

  public has(value: Move): boolean {
    let found = false;
    this.arr.forEach((move) => {
      if (move.equals(value)) {
        found = true;
      }
    });
    return found;
  }

  public delete(value: Move): this {
    this.arr = this.arr.filter((move) => !move.equals(value));
    return this;
  }

  public get size(): number {
    return this.arr.length;
  }
}

const tx = 10;
const ty = 10;
const cave = new Cave(depth, tx, ty);

function reconstructPath(cameFrom: Map<Move, Move>, current: Move): Move[] {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current) as Move;
    path.push(current);
  }
  return path.reverse();
}

const start = new Move(cave.getCell(0, 0)!!, 0, TORCH);
const goal = new Move(cave.getCell(tx, ty)!!, 1, TORCH);

const pathScore = (path: Move[]): number => {
  return path.reduce((cost: number, move: Move) => cost + move.cost, 0);
};

type MoveTup = [Cell, string];

function aStar(start: Move, goal: Move): Move[][] {
  const closed = new Set<MoveTup>();
  const open = new Set<MoveTup>();
  open.add(start.tup);
  const cameFrom = new Map<Move, Move>();
  const gScore = new Map<Move, number>();
  gScore.set(start, 0);
  const fScore = new Map<Move, number>();
  fScore.set(start, start.heuristic(goal));

  const getNext = (fScore: Map<Move, number>, open: Set): Move => {
    let min = 9999;
    let mm: Move;
    open.forEach((move) => {
      const value = fScore.get(move)!!;
      if (value < min) {
        mm = move;
        min = value;
      }
    });
    return mm!!;
  };

  const paths = [];
  let minFound = 9999;
  let e = 0;
  while (open.size) {
    e++;
    const current = getNext(fScore, open) as Move;
    const cg = gScore.get(current);
    console.log(`\n\ncurrentlyon ${current} score ${cg} stack ${open.size}`);
    if (current.cell.equals(goal.cell)) {
      const path = reconstructPath(cameFrom, current);
      const score = pathScore(path);
      if (score < minFound) {
        minFound = score + 7;
      }
      paths.push(path);
    }

    open.delete(current);
    closed.add(current);

    for (const n of current.neighbours) {
      const tmpG = gScore.get(current)!! + current.heuristic(n);
      const tmpF = tmpG + n.heuristic(goal);
      // console.log(`considering ${n} with tmpG${tmpG}`);
      if (closed.has(n)) {
        // console.log("- closed has n already!");
        continue;
      }

      if (!open.has(n)) {
        open.add(n);
        // console.log(`- adding to stack`);
      } else if (tmpG + 7 > gScore.get(n)!! || tmpG > minFound) {
        // console.log(`- aborting too fat`);
        continue;
      }

      // console.log("- adding cum g f");
      if (cameFrom.has(n)) {
        console.log(`======= already came from${n}`);
      }
      if (gScore.has(n)) {
        console.log(`======= already gscore from${n}`);
      }
      if (fScore.has(n)) {
        console.log(`======= already fscore from${n}`);
      }
      cameFrom.set(n, current);
      gScore.set(n, tmpG);
      fScore.set(n, tmpF);
    }
    // throw new Error('die');
  }
  console.log(`${e} +++`);
  return paths;
}

class Path {
  public arr: Move[] = [];
  public get end(): Move {
    return this.arr[this.arr.length - 1];
  }
  public get heuristic(): number {
    return this.end.dist(this.goal);
  }
  public get score(): number {
    return this.arr.reduce((cost: number, move: Move) => cost + move.cost, 0);
  }
  public get goalScore(): number {
    let score = this.score;
    if (this.end.tool !== TORCH) {
      score += 7;
    }
    return score;
  }
  public get optimistic(): number {
    return this.score + this.end.heuristic(this.goal);
  }
  public get short(): string {
    let prevTool = "";
    let out = `${this.arr.length} move path with cost ${this.score}\n `;
    for (const move of this.arr) {
      let c = "";
      if (prevTool !== move.tool) {
        prevTool = move.tool;
        c = move.tool + " ";
      }
      c += `(${move.cell.x},${move.cell.y})`;
      out += c;
    }
    return out;
  }

  public get vshort(): string {
    return `${this.arr.length} move path with cost ${this.score}`;
  }

  public constructor(public start: Move, public goal: Move) {
    this.arr.push(start);
  }

  public toString(): string {
    return `${this.arr.length} move path with cost ${this.score}\n` + this.arr.join("->");
  }

  public move(next: Move): Path | undefined {
    let found = false;
    this.arr.forEach((move) => {
      if (move.equals(next)) {
        found = true;
      }
    });
    if (found) {
      return undefined;
    }

    const np = new Path(this.start, this.goal);
    np.arr = [...this.arr, next];
    return np;
  }
}
const nav = (start: Move, goal: Move): Path[] => {
  const closed = new Set();
  const open = new Set();
  open.add(new Path(start, goal));
  const prev = new Map<string, number>();
  prev.set(start.key, 0);

  const getNext = (open: Set<Path>): Path => {
    let min = 9999;
    let mm: Path;
    open.forEach((path) => {
      // console.log(`${path}`);
      const value = path.heuristic;
      if (value < min) {
        mm = path;
        min = value;
      }
    });
    return mm!!;
  };

  let e = 0;
  let minFound = 9999;
  let paths: Path[] = [];

  while (open.size) {
    e++;
    const path = getNext(open) as Path;
    // console.log(`${e} ${path} ...  H ${path.heuristic} M ${minFound}`);
    const current = path.end;

    open.delete(path);
    closed.add(path);

    if (current.cell.equals(goal.cell)) {
      let score = path.goalScore;
      if (score < minFound) {
        minFound = score;
      }
      paths.push(path);
      continue;
    }

    for (const n of current.neighbours) {
      const np = path.move(n);

      if (!np || closed.has(np)) {
        continue;
      }

      const previousToHere = prev.has(n.key) ? prev.get(n.key)!! : 9999;
      if (np.optimistic < minFound && np.score < previousToHere) {
        open.add(np);
        prev.set(n.key, np.score);
      }
    }
  }

  return paths;
};

// const paths = nav(start, goal);
// paths.forEach((path: Path) => {
//   console.log(`${path.vshort} To goal ${path.goalScore}`);
// });

const moves = aStar(start, goal);
moves.forEach((marray: Move[]) => {
  const cost = pathScore(marray);
  console.log(`${marray.length} moves with cost ${cost}`);
});

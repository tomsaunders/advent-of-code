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
const depth = 4080;
const target = [14, 785];

// TEST
// const depth = 510;
// const target = [10, 10];

class Cave {
  public cells: Cell[][];
  public moves: Map<string, Move> = new Map<string, Move>();

  public constructor(public depth: number, public targetX: number, public targetY: number) {
    this.cells = [];
    let risk = 0;

    for (let y = 0; y <= targetY + 50; y++) {
      this.cells.push([]);
      for (let x = 0; x <= targetX * 5; x++) {
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

  public getMove(cell: Cell, tool: string): Move {
    const mk = `${cell.x},${cell.y},${tool}`;
    if (!this.moves.has(mk)) {
      this.moves.set(mk, [cell.x, cell.y, tool]);
    }
    return this.moves.get(mk) as Move;
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

  public dist(other: Cell) {
    return Math.abs(this.y - other.y) + Math.abs(this.x - other.x);
  }

  public moveOptions(currentTool: string): Move[] {
    const moves: Move[] = [];
    for (const cell of this.neighbours) {
      if (cell.canAccess(currentTool)) {
        moves.push(this.cave.getMove(cell, currentTool));
      } else {
        for (const valid of cell.validTools) {
          if (this.canAccess(valid)) {
            moves.push(this.cave.getMove(cell, valid));
          }
        }
      }
    }
    return moves;
  }
}

type Move = [number, number, string];

const tx = target[0];
const ty = target[1];
const cave = new Cave(depth, tx, ty);

const start = cave.getMove(cave.getCell(0, 0)!!, TORCH) as Move;
const goal = cave.getMove(cave.getCell(tx, ty)!!, TORCH) as Move;

const paths = aStar(start, goal);
paths.forEach((path: Move[]) => {
  console.log(`${path.length} To goal ${goalScore(path)}`);
});

function goalScore(path: Move[]): number {
  let prev: string = "";
  let score = 0;
  for (const move of path) {
    const [x, y, tool] = move;

    if (!prev) {
      prev = tool;
      continue;
    }

    if (tool == prev) {
      score += 1;
    } else {
      score += 8;
      prev = tool;
    }
  }
  if (prev != TORCH) {
    score += 7;
  }
  return score;
}

function heuristic(ax: number, bx: number, ay: number, by: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function getNext(fScore: Map<Move, number>, open: Set<Move>): Move {
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
}

function reconstructPath(cameFrom: Map<Move, Move>, current: Move): Move[] {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current) as Move;
    path.push(current);
  }
  return path.reverse();
}

function moveCost(a: Move, b: Move) {
  return a[2] !== b[2] ? 8 : 1;
}

function aStar(start: Move, goal: Move): Move[][] {
  const goalCell = cave.getCell(goal[0], goal[1]);

  const closed = new Set<Move>();
  const open = new Set<Move>();
  open.add(start);
  const cameFrom = new Map<Move, Move>();
  const gScore = new Map<Move, number>();
  gScore.set(start, 0);
  const fScore = new Map<Move, number>();
  fScore.set(start, heuristic(start[0], goal[0], start[1], goal[1]));

  const paths: Move[][] = [];
  let minFound = 9999;
  let e = 0;
  while (open.size) {
    e++;
    const current = getNext(fScore, open) as Move;
    const currentCell = cave.getCell(current[0], current[1]) as Cell;
    const currentTool = current[2];
    const cf = fScore.get(current);

    // console.log(`\nTrying ${current[0]},${current[1]} with ${current[2]} ... est was ${cf} stack is ${open.size}`);

    if (currentCell === goalCell) {
      const path = reconstructPath(cameFrom, current);
      const score = goalScore(path);
      minFound = Math.min(minFound, score);
      paths.push(path);
      // console.log(`================================ Found ${path.length} path to goal ${score} min now ${minFound}`);
    } else if (current[0] === goal[0] && current[1] === goal[1]) {
      console.log(current);
      console.log(goal);
      console.log(currentCell);
      console.log(goalCell);
      throw new Error("w t f");
    }

    open.delete(current);
    closed.add(current);

    for (const n of currentCell.moveOptions(currentTool)) {
      const pG = gScore.get(n)!!;
      const tmpG = gScore.get(current)!! + moveCost(current, n);
      const tmpF = tmpG + heuristic(n[0], goal[0], n[1], goal[1]);
      // console.log(` Option ${n[0]},${n[1]} with ${n[2]} has score ${tmpG} and est ${tmpF}`);

      if (closed.has(n)) {
        continue;
      }

      if (!open.has(n)) {
        // console.log("   unprocessed to open");
        open.add(n);
      } else if (tmpG > gScore.get(n)!! || tmpF > minFound) {
        // console.log("   not the cheapest way to get to n or slower than goal");
        continue;
      }

      // console.log("    valid");
      cameFrom.set(n, current);
      gScore.set(n, tmpG);
      fScore.set(n, tmpF);
    }
  }
  // console.log(`${e} +++`);
  return paths;
}

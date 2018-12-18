#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input18.txt", "utf8");
const test = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`;

const size = 50;

const OPEN = ".";
const TREE = "|";
const YARD = "#";

class Cell {
  public next: string = "";

  public get neighbours(): Cell[] {
    const ns = [];
    for (let dy = -1; dy < 2; dy++) {
      for (let dx = -1; dx < 2; dx++) {
        if (dy !== 0 || dx !== 0) {
          const n = this.grid.getCell(this.x + dx, this.y + dy);
          if (n) {
            ns.push(n);
          }
        }
      }
    }
    return ns;
  }

  public constructor(public x: number, public y: number, public icon: string, public grid: Grid) {}

  public move(): void {
    const neighbours = this.neighbours;
    // console.log("moving " + this, " ... neighbours are" + neighbours.join(" : "));
    const trees = neighbours.filter(n => n.icon === TREE).length;
    const yards = neighbours.filter(n => n.icon === YARD).length;
    // const opens = neighbours.filter(n => n.icon === OPEN).length;
    // console.log("there are ", trees, " trees and ", yards, " yards out of ", neighbours.length);

    this.next = this.icon;
    if (this.icon === OPEN && trees >= 3) {
      this.next = TREE;
    } else if (this.icon === TREE && yards >= 3) {
      this.next = YARD;
    } else if (this.icon === YARD) {
      if (yards >= 1 && trees >= 1) {
        // stay
        this.next = YARD;
      } else {
        this.next = OPEN;
      }
    }
    // console.log("moving from ", this.icon, " to ", this.next);
  }

  public toString(): string {
    return `${this.icon}@ ${this.x},${this.y}`;
  }
}

class Grid {
  public arr: Cell[][] = [];
  public cells: Cell[] = [];
  public minutes = 0;
  public areadySeen = new Map<number, number>();
  public get score(): number {
    const trees = this.cells.filter(n => n.icon === TREE).length;
    const yards = this.cells.filter(n => n.icon === YARD).length;
    return trees * yards;
  }

  public constructor(lines: string[]) {
    this.arr = [];
    for (let y = 0; y < lines.length; y++) {
      const row: Cell[] = [];
      const line = lines[y];
      for (let x = 0; x < line.length; x++) {
        const cell = new Cell(x, y, line[x], this);
        this.cells.push(cell);
        row.push(cell);
      }
      this.arr.push(row);
    }
  }

  public getCell(x: number, y: number) {
    if (this.arr[y] && this.arr[y][x]) {
      return this.arr[y][x];
    } else {
      return null;
    }
  }

  public play(count: number, part2: boolean = false): void {
    while (this.minutes < count) {
      this.cells.forEach(cell => cell.move());
      this.cells.forEach(cell => (cell.icon = cell.next));
      this.minutes++;
      if (part2) {
        const score = this.score;
        if (this.minutes > 1000 && this.minutes < 3000) {
          if (this.areadySeen.has(score)) {
            const wasAt = this.areadySeen.get(score) as number;
            const diff = this.minutes - wasAt;
            const toGo = count - this.minutes;
            const fullRoundsToSkip = Math.floor(toGo / diff) * diff;
            this.minutes += fullRoundsToSkip;
          } else {
            this.areadySeen.set(score, this.minutes);
          }
        }
      } else {
        this.p();
      }
    }
  }

  public p(): void {
    let out = `After ${this.minutes} minutes:\n`;
    for (const row of this.arr) {
      for (const cell of row) {
        out += cell.icon;
      }
      out += "\n";
    }
    out += "\n";
    console.log(out);
  }
}

const testGrid = new Grid(test.split("\n"));
// testGrid.p();
testGrid.play(10);
console.log("Final score test", testGrid.score);

let grid = new Grid(input.split("\n"));
// grid.p();
grid.play(10);
console.log("Final score part 1", grid.score);

grid = new Grid(input.split("\n"));
// grid.p();
grid.play(1000000000, true);
console.log("Final score part 2", grid.score);

grid = new Grid(input.split("\n"));
grid.play(1000);

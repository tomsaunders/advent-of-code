#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input4.txt", "utf8");
const test = fs.readFileSync("test4.txt", "utf8");

class BingoBoard {
  private cells: { marked: boolean; col: number; row: number; value: string }[];
  constructor(rows: string[]) {
    this.cells = [];
    const marked = false;
    rows.forEach((rowString, row) => {
      while (rowString.includes("  ")) {
        rowString = rowString.replace("  ", " ");
      }
      this.cells.push(
        ...rowString
          .trim()
          .split(" ")
          .map((value, col) => {
            return { marked, value, col, row };
          })
      );
    });
  }

  public play(num: string): void {
    const cell = this.cells.find((c) => c.value === num);
    if (cell) cell.marked = true;
  }

  public get score(): number {
    return this.cells.reduce(
      (carry, cell) => (cell.marked ? carry : carry + parseInt(cell.value, 10)),
      0
    );
  }

  public get isWon(): boolean {
    for (let i = 0; i < 5; i++) {
      if (this.cells.filter((c) => c.row === i && c.marked).length === 5) {
        return true;
      } else if (
        this.cells.filter((c) => c.col === i && c.marked).length === 5
      ) {
        return true;
      }
    }
    return false;
  }
}

function part1(input: string): number {
  const lines = input.split("\n");
  const numbers = lines.shift()?.split(",");

  const boards: BingoBoard[] = [];
  for (let i = 0; i < lines.length / 6; i++) {
    boards.push(new BingoBoard(lines.slice(i * 6 + 1, i * 6 + 6)));
  }

  let win = boards.find((b) => b.isWon);
  let next: string = "";
  while (!win) {
    next = numbers?.shift() as string;

    boards.forEach((b) => b.play(next!));
    win = boards.find((b) => b.isWon);
  }

  return parseInt(next, 10) * win.score;
}

const t1 = part1(test);
if (t1 === 4512) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const numbers = lines.shift()?.split(",");

  let boards: BingoBoard[] = [];
  for (let i = 0; i < lines.length / 6; i++) {
    boards.push(new BingoBoard(lines.slice(i * 6 + 1, i * 6 + 6)));
  }

  let lastWon: BingoBoard;
  let next: string = "";
  while (boards.length) {
    next = numbers?.shift() as string;

    boards.forEach((b) => {
      b.play(next!);
      if (b.isWon) {
        lastWon = b;
      }
    });
    boards = boards.filter((b) => !b.isWon);
  }

  return parseInt(next, 10) * lastWon!.score;
}

const t2 = part2(test);
if (t2 === 1924) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

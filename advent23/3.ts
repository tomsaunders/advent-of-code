#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, arrProd, arrSum, isNumeric } from "./util";
const input = fs.readFileSync("input3.txt", "utf8");
const test = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

class NumberSet {
  public partNumber: number = 0;
  public cells: Cell[] = [];

  public static createOrNil(cell: Cell): NumberSet | null {
    if (isNumeric(cell.type) && !isNumeric(cell.west?.type)) {
      // this is a starting cell. So make a number set;
      const ns = new NumberSet();
      let c: Cell | undefined = cell;
      while (c && isNumeric(c?.type)) {
        ns.cells.push(c);
        c = c.east;
      }
      ns.partNumber = Number.parseInt(ns.cells.map((c) => c.type).join(""), 10);
      // is next to symbol
      if (ns.cells.find((c) => c.allNeighbours.find((n) => !n.isSpace && !isNumeric(n.type)))) {
        return ns;
      }
    }
    return null;
  }

  public adjacentTo(cell: Cell): boolean {
    return !!this.cells.find((c) => c.allNeighbours.includes(cell));
  }
}

function part1(input: string): number {
  const grid = Grid.fromLines(input);
  const sets = grid.cells.map((c) => NumberSet.createOrNil(c)?.partNumber).filter((ns) => !!ns) as number[];
  return arrSum(sets);
}

function part2(input: string): number {
  const grid = Grid.fromLines(input);
  const sets = grid.cells.map((c) => NumberSet.createOrNil(c)).filter((ns) => !!ns);
  const stars = grid.cells.filter((c) => c.type === "*");
  const gears = stars.filter((s) => sets.filter((set) => set?.adjacentTo(s)).length === 2);
  const ratios = gears.map((g) =>
    arrProd(sets.filter((set) => set?.adjacentTo(g)).map((set) => set?.partNumber) as number[])
  );
  return arrSum(ratios);
}

const t = part1(test);
if (t == 4361) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 467835) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

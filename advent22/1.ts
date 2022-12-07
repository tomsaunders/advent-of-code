#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");
const lines = input;
const test = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

class Elf {
  public items: number[] = [];

  constructor() {}

  public addItem(item: string): void {
    this.items.push(parseInt(item.trim(), 10));
  }

  public get total(): number {
    return this.items.reduce((prev, curr) => prev + curr, 0);
  }
}

function getElves(input: string): Elf[] {
  const lines = input.split("\n");
  const elves: Elf[] = [];
  let elf = new Elf();
  elves.push(elf);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line) {
      elf.addItem(line);
    } else {
      elf = new Elf();
      elves.push(elf);
    }
  }
  return elves;
}

function part1(input: string): number {
  const elves = getElves(input);
  return Math.max(...elves.map((e): number => e.total));
}

function part2(input: string): number {
  const elves = getElves(input);
  const cals = elves.map((e) => e.total).sort((a, b) => b - a);
  return [cals.shift()!, cals.shift()!, cals.shift()!].reduce(
    (c, p) => c + p,
    0
  );
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

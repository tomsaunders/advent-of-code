#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input5.txt", "utf8");
const test = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

class Stack {
  public crates: string[] = [];
}

class Move {
  public count = 0;
  public from = 0;
  public to = 0;
  public constructor(public line: string) {
    const bits = line.split(" ");
    this.count = parseInt(bits[1], 10);
    this.from = parseInt(bits[3], 10) - 1;
    this.to = parseInt(bits[5], 10) - 1;
  }
}

function parse(input: string): [Stack[], Move[]] {
  const lines = input.split("\n");
  let stacks: Stack[] = [];
  let moves: Move[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim()[0] === "1") {
      const max = parseInt(l.trim()[l.trim().length - 1], 10);
      for (let c = 0; c < max; c++) {
        const stack = new Stack();
        for (let s = i - 1; s >= 0; s--) {
          const pos = c * 4 + 1;
          if (lines[s][pos] !== " ") {
            stack.crates.push(lines[s][pos]);
          }
        }
        stacks.push(stack);
      }
      for (let m = i + 2; m < lines.length; m++) {
        moves.push(new Move(lines[m]));
      }
    }
  }
  // console.log(stacks);
  // console.log(moves);
  return [stacks, moves];
}

function applyMoves(stacks: Stack[], moves: Move[]) {
  // move a from b to c
  moves.forEach((move) => {
    for (let i = 0; i < move.count; i++) {
      const from = stacks[move.from];
      const to = stacks[move.to];
      const crate = from.crates.pop();
      if (crate) {
        to.crates.push(crate);
      }
    }
  });
}

function part1(input: string): string {
  const [stacks, moves] = parse(input);
  applyMoves(stacks, moves);
  return stacks.map((s) => s.crates.pop() as string).join("");
}

function applyMoves2(stacks: Stack[], moves: Move[]) {
  // move a from b to c
  moves.forEach((move) => {
    const from = stacks[move.from];
    const to = stacks[move.to];

    let temp: string[] = [];
    for (let i = 0; i < move.count; i++) {
      const crate = from.crates.pop();
      if (crate) {
        temp.unshift(crate);
      }
    }
    to.crates.push(...temp);
  });
}

function part2(input: string): string {
  const [stacks, moves] = parse(input);
  applyMoves2(stacks, moves);
  return stacks.map((s) => s.crates.pop() as string).join("");
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

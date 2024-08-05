#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 23
 *
 * Summary: CPU instructions, building on day 18
 * Escalation: Many many loops
 * Solution: Part 1 - tweak day 18
 * Part 2 - adopt old PHP solution which was adopted from Reddit.
 * Basically... turn assembler code into an optimised loop.
 *
 * Keywords: CPU
 * References: Reddit 2017 Day 17
 */
import * as fs from "fs";
import { isNumeric } from "./util";
const input = fs.readFileSync("input23.txt", "utf8");

type Op = "mul" | "set" | "sub" | "jnz";

class Program {
  public store: Record<string, number> = {};
  public idx = 0;
  public output: number = 0;
  public paused = false;

  constructor(public instructions: string[][]) {}

  public val(str: string): number {
    if (isNumeric(str)) {
      return parseInt(str);
    }
    if (!this.store[str]) this.store[str] = 0;
    return this.store[str];
  }

  public run(): void {
    while (this.active) {
      this.step();
    }
  }

  public step(): void {
    if (this.idx > this.instructions.length) {
      return;
    }

    const [o, reg, v] = this.instructions[this.idx];
    const op = o as Op;
    if (op === "sub") {
      this.store[reg] -= this.val(v);
    } else if (op === "mul") {
      this.store[reg] *= this.val(v);
      this.output++;
    } else if (op === "set") {
      this.store[reg] = this.val(v);
    } else if (op === "jnz") {
      if (this.val(reg) != 0) {
        this.idx += this.val(v);
        return;
      }
    }
    if (!this.paused) {
      this.idx++;
    }
  }

  public get active(): boolean {
    return this.idx < this.instructions.length && !this.paused;
  }
}

function parseInput(input: string): string[][] {
  return input.split("\n").map((line) => {
    return line.split(" ");
  });
}

function part1(input: string): number {
  const instructions = parseInput(input);
  const program = new Program(instructions);
  program.run();

  return program.output;
}

function part2(): number {
  let a = 0,
    b = 0,
    c = 0,
    h = 0;
  a = 1;
  b = 7900 + 100000;
  c = b + 17000;

  while (b <= c) {
    const s = Math.sqrt(b);
    let i = 2;
    while (i <= s) {
      if (b % i === 0) {
        h++;
        i += s;
      }
      i++;
    }
    b += 17;
  }

  return h;
}

console.log("part 1 answer", part1(input));
console.log("part 2 answer", part2());

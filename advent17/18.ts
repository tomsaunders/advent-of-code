#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 18
 *
 * Summary: CPU instructions
 * Escalation: Run two at the same time which interact with each other
 * Solution: CPU operation handling, but lots of fiddling to parse the instructions correctly.
 *
 * Keywords: CPU
 * References:
 */
import * as fs from "fs";
import { isNumeric } from "./util";
const input = fs.readFileSync("input18.txt", "utf8");
const test: string = `set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`;

const test2: string = `snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d`;

type Op = "add" | "mul" | "mod" | "snd" | "set" | "rcv" | "jgz";

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
    if (op === "add") {
      this.store[reg] += this.val(v);
    } else if (op === "mod") {
      this.store[reg] %= this.val(v);
    } else if (op === "mul") {
      this.store[reg] *= this.val(v);
    } else if (op === "rcv") {
      this.rcv(reg);
    } else if (op === "set") {
      this.store[reg] = this.val(v);
    } else if (op === "snd") {
      this.snd(this.val(reg));
    } else if (op === "jgz") {
      if (this.val(reg) > 0) {
        this.idx += this.val(v);
        return;
      }
    }
    if (!this.paused) {
      this.idx++;
    }
  }

  public snd(val: number) {
    this.output = val;
  }

  public rcv(reg: string): void {
    this.idx = 999;
  }

  public get active(): boolean {
    return this.idx < this.instructions.length && !this.paused;
  }
}

class Program2 extends Program {
  public sendTarget!: Program2;
  private queue: number[] = [];

  constructor(public instructions: string[][], public id: number) {
    super(instructions);
    this.store["p"] = id;
  }

  public enqueue(val: number): void {
    this.queue.push(val);
  }

  public snd(val: number) {
    this.sendTarget.enqueue(val);
    this.output++;
  }

  public rcv(reg: string): void {
    if (this.queue.length) {
      this.store[reg] = this.queue.shift()!;
      this.paused = false;
    } else {
      this.paused = true;
      return;
    }
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

function part2(input: string): number {
  const instructions = parseInput(input);
  const program0 = new Program2(instructions, 0);
  const program1 = new Program2(instructions, 1);
  program0.sendTarget = program1;
  program1.sendTarget = program0;

  while ((program0.active || program1.active) && program1.output < 8000) {
    program0.step();
    program1.step();
  }

  return program1.output;
}

const t1 = part1(test);
if (t1 === 4) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test2);
  if (t2 === 3) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t1);
}

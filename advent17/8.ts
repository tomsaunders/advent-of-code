#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 8
 *
 * Summary: Parse instructions to change the values of registers, find the highest value at the end
 * Escalation: Find the highest value at any point
 * Solution:
 *  define types in an external file for potential reuse ;)
 *  parse instructions into a class representation,
 *  implement Registers as a singleton class to wrap the initialisation behaviour.
 *  Implement each comparison. These classes may be able to be reused for later days.
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { Operator, Comparison } from "./util/cpu";
const input = fs.readFileSync("input8.txt", "utf8");
const test = `b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`;

class Registers {
  public store: Record<string, number> = {};
  public getRegister(key: string): number {
    if (!this.store[key]) this.store[key] = 0;
    return this.store[key];
  }
  public setRegister(key: string, value: number): void {
    this.store[key] = value;
  }
}

class Operation {
  constructor(
    public register: string,
    public op: Operator,
    public value: number,
    public ifRegister: string,
    public comparison: Comparison,
    public compareValue: number | string
  ) {}

  public ifApplies(registers: Registers) {
    const left = registers.getRegister(this.ifRegister);
    const right = this.compareValue as number;

    switch (this.comparison) {
      case "!=":
        return left !== right;
      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case "==":
        return left === right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;
    }
  }

  public execute(registers: Registers) {
    const current = registers.getRegister(this.register);
    let next = current;
    if (this.ifApplies(registers)) {
      if (this.op === "dec") {
        next -= this.value;
      } else if (this.op === "inc") {
        next += this.value;
      }
      registers.setRegister(this.register, next);
    }
  }
}

function parseInput(input: string): Operation[] {
  return input.split("\n").map((line) => {
    const [register, op, value, _if, ifRegister, comparison, compareValue] =
      line.split(" ");
    return new Operation(
      register,
      op as Operator,
      parseInt(value),
      ifRegister,
      comparison as Comparison,
      parseInt(compareValue)
    );
  });
}

function part1(input: string): number {
  const registers = new Registers();
  const instructions = parseInput(input);
  instructions.forEach((operation) => {
    operation.execute(registers);
  });

  return Math.max(...Object.values(registers.store));
}

function part2(input: string): number {
  const registers = new Registers();
  const instructions = parseInput(input);
  let max = 0;
  instructions.forEach((operation) => {
    operation.execute(registers);
    max = Math.max(max, ...Object.values(registers.store));
  });

  return max;
}

const t = part1(test);
if (t === 1) {
  console.log("part 1 answer", part1(input)); // 7296
  const t2 = part2(test);
  if (t2 === 10) {
    console.log("part 2 answer", part2(input)); // 8186
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

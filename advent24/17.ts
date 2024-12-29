#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 17
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input17.txt", "utf8");
const test = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;

const test2 = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;

function parseInput(input: string): {
  registers: number[];
  program: string;
} {
  const lines = input.split("\n");
  const [a, b, c, empty, p] = lines;

  const registers = [
    parseInt(a.split(":")[1]),
    parseInt(b.split(":")[1]),
    parseInt(c.split(":")[1]),
  ];
  const program = p.replace("Program: ", "");

  return { registers, program };
}

function part1(input: string): string {
  const { registers, program } = parseInput(input);
  let [a, b, c] = registers;

  return executeProgram(a, b, c, program);
}

enum Op {
  ADV,
  BXL,
  BST,
  JNZ,
  BXC,
  OUT,
  BDV,
  CDV,
}

const mod = (n: number, m: number) => ((n % m) + m) % m;
function executeProgram(
  a: number,
  b: number,
  c: number,
  instructions: string
): string {
  const program = instructions.split(",").map(mapNum);

  let ptr = 0;
  const output: number[] = [];
  while (program[ptr] !== undefined && output.length < 30) {
    const code = program[ptr];
    const operand = program[ptr + 1];
    // array access stolen from reddit, very nice
    const combo = [0, 1, 2, 3, a, b, c, 9999][operand];
    const adv = Math.floor(a / Math.pow(2, combo));

    if (code === Op.ADV) {
      a = adv;
    } else if (code === Op.BXL) {
      b = (b ^ operand) >>> 0; //js xor unsigned
    } else if (code === Op.BST) {
      b = mod(combo, 8);
    } else if (code === Op.JNZ) {
      if (a !== 0) {
        ptr = operand - 2; // offset usual jump with -2
      }
    } else if (code === Op.BXC) {
      b = (b ^ c) >>> 0;
    } else if (code === Op.OUT) {
      output.push(mod(combo, 8));
    } else if (code === Op.BDV) {
      b = adv;
    } else if (code === Op.CDV) {
      c = adv;
    }

    ptr += 2;
  }
  return output.join(",");
}

type Queue = {
  progress: number;
  digit: number;
};

function part2(input: string): number {
  const { registers, program } = parseInput(input);
  let [a, b, c] = registers;

  const goalDigits = program.split(",").map(mapNum);
  const maxDigit = goalDigits.length;

  const answers: number[] = [];
  const queue: Queue[] = [{ progress: 0, digit: 0 }];
  while (queue.length) {
    const { progress, digit } = queue.shift()!;

    if (digit === maxDigit) {
      // console.log("Found something!", progress);
      answers.push(progress);
      continue;
    }

    const seek = goalDigits.slice(-(digit + 1)).join(",");

    // move on to the next octal digit by adding 3 empty bits
    // reddit said progress <<< 0 should work but it stopped at higher number sizes for meee
    const progressShift = parseInt(progress.toString(2) + "000", 2);
    for (let i = 0; i < 8; i++) {
      const x = progressShift + i;
      const output = executeProgram(x, b, c, program);
      if (output === seek) {
        queue.push({ progress: x, digit: digit + 1 });
      }
    }
  }

  return Math.min(...answers);
}

const t = part1(test);
if (t == "4,6,3,5,6,3,5,2,1,0") {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test2);
if (t2 == 117440) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

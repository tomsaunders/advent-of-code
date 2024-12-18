#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
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

function executeProgram(
  a: number,
  b: number,
  c: number,
  instructions: string,
): string {
  const program = instructions.split(",").map(mapNum);

  function combo(op: number): number {
    // stolen from reddit, very nice
    return [0, 1, 2, 3, a, b, c, 9999][op];
  }

  let ptr = 0;
  let out: string[] = [];
  while (ptr < program.length - 1) {
    const instruction = program[ptr];
    const operand = program[ptr + 1];
    const comboOperand = combo(operand);
    const adv = Math.floor(a / Math.pow(2, comboOperand));

    if (instruction === Op.ADV) {
      a = adv;
    } else if (instruction === Op.BXL) {
      b ^= operand;
    } else if (instruction === Op.BST) {
      b = comboOperand % 8;
    } else if (instruction === Op.JNZ) {
      if (a !== 0) {
        ptr = operand - 2; // offset usual jump
      }
    } else if (instruction === Op.BXC) {
      b = b ^ c;
    } else if (instruction === Op.OUT) {
      const v = comboOperand % 8;
      out.push(v.toString());
    } else if (instruction === Op.BDV) {
      b = adv;
    } else if (instruction === Op.CDV) {
      c = adv;
    }

    ptr += 2;
  }
  return out.join(",");
}

function part2(input: string, start = 0, inc = 1): number {
  const { registers, program } = parseInput(input);
  let [a, b, c] = registers;

  const bits = program.split(",").map(mapNum);
  const reverse = bits.slice(0).reverse();

  console.log("seeking output of ", bits);
  console.log("reverse is ", reverse);

  let found = 0;
  let ans = 0;
  // while (found < bits.length){
  for (let i = 0; i < 8; i++) {
    a = ans + i;
    let o = executeProgram(a, b, c, program);
    let oBits = o.split(",").map(mapNum).reverse();
    if (oBits[found] === reverse[found]) {
      console.log("got ", o, "from a", a);
      const jSeek = bits.slice(-2).join(",");

      for (let j = 0; j < 8; j++) {
        let aa = a << (3 + j);
        o = executeProgram(aa, b, c, program);
        if (o === jSeek) {
          oBits = o.split(",").map(mapNum).reverse();
          console.log("got ", o, "from a", aa, "wanted", jSeek);
          const kSeek = bits.slice(-3).join(",");

          for (let k = 0; k < 8; k++) {
            let aaa = aa << (3 + k);
            o = executeProgram(aaa, b, c, program);
            if (o === kSeek) {
              oBits = o.split(",").map(mapNum).reverse();
              console.log("got ", o, "from a", aaa, "wanted", kSeek);
            }
          }
        }
      }
    }
  }
  // }

  // a = 0;
  // let o = executeProgram(a, b, c, program);
  // while (o.length <= program.length) {
  //   a++;
  //   o = executeProgram(a, b, c, program);
  //   if (o === program) {
  //     console.log(
  //       a,
  //       "is an answer",
  //       a.toString(8),
  //       parseInt(a.toString(8)).toString(2),
  //       o,
  //     );
  //   }
  // }

  return a;
}

const t = part1(test);
if (t == "4,6,3,5,6,3,5,2,1,0") {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test2);
if (t2 == 117440) {
  // console.log("part 2 answer", part2(input, 72000215712, 1752033));
} else {
  console.log("part 2 test fail", t2);
}
// didnt find 0 - 7198590000

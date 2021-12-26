#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input24.txt", "utf8");

/*
inp a - Read an input value and write it to variable a.
add a b - Add the value of a to the value of b, then store the result in variable a.
mul a b - Multiply the value of a by the value of b, then store the result in variable a.
div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. (Here, "truncate" means to round the value toward zero.)
mod a b - Divide the value of a by the value of b, then store the remainder in variable a. (This is also called the modulo operation.)
eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.
*/

type Instruction = "inp" | "add" | "mul" | "div" | "mod" | "eql";
type Registers = { [key: string]: number };

function processInstructions(lines: string[], inputs: number[]): Registers {
  const registers: { [key: string]: number } = { w: 0, x: 0, y: 0, z: 0 };

  lines.forEach((l) => {
    const bits = l.trim().split(" ");
    const inst: Instruction = bits[0] as Instruction;
    const a = bits[1];

    if (inst === "inp") {
      registers[a] = inputs.shift() as number;
      // console.log(`\n${a} = inputs.shift();`);
    } else {
      const b = bits[2];
      const valB = ["x", "y", "z", "w"].includes(b)
        ? registers[b]
        : parseInt(b, 10);

      // const strB = ["x", " y", "z", "w"].includes(b) ? b : parseInt(b, 10);

      if (inst === "add") {
        registers[a] += valB;
        // console.log(`${a} += ${strB};`);
      } else if (inst === "mul") {
        registers[a] *= valB;
        // console.log(`${a} *= ${strB};`);
      } else if (inst === "div") {
        registers[a] = Math.floor(registers[a] / valB);
        // console.log(`${a} = Math.floor(${a} / ${strB});`);
      } else if (inst === "mod") {
        registers[a] %= valB;
        // console.log(`${a} %= ${strB};`);
      } else if (inst === "eql") {
        registers[a] = registers[a] === valB ? 1 : 0;
        // console.log(`${a} = ${a} === ${strB} ? 1 : 0;`);
      }
    }
  });

  return registers;
}

// having implemented the ALU, it becomes obvious that brute-force checking all the numbers is not viable.
// with a lot of help from the subreddit, especially https://github.com/mrphlip/aoc/blob/master/2021/24.md
// it became clear that the instructions are 14 sections of 18 lines each that operate in pairs
// the delta of the y variable in the first part of the pair and the x variable in the second defines the
// distance between the two numbers.

const LINE_DISCRIM = 4;
const LINE_X = 5;
const LINE_Y = 15;

function getBValue(line: string): number {
  const [_inst, _a, b] = line.trim().split(" ");
  return parseInt(b, 10);
}

class InstructionSet {
  public pair?: InstructionSet;
  public value = 0;

  constructor(public index: number, public lines: string[]) {}
  public get isFirstPart(): boolean {
    // if the first pair of a number if it does z/1 on the discriminating line
    return this.lines[LINE_DISCRIM] === "div z 1";
  }

  public get isSecondPart(): boolean {
    return this.lines[LINE_DISCRIM] === "div z 26";
  }

  public get y(): number {
    return getBValue(this.lines[LINE_Y]);
  }

  public get x(): number {
    return getBValue(this.lines[LINE_X]);
  }

  public get delta(): number {
    return this.y + this.pair!.x;
  }

  public setPair(other: InstructionSet): void {
    other.pair = this;
    this.pair = other;
  }
}

const sets: InstructionSet[] = [];
const setStack: InstructionSet[] = [];
const lines = input.split("\n");
for (let i = 0; i < 14; i++) {
  const slice = lines.slice(i * 18, (i + 1) * 18);
  const set = new InstructionSet(i, slice);
  sets.push(set);

  if (set.isFirstPart) {
    setStack.push(set);
  } else {
    const first = setStack.pop() as InstructionSet;
    set.setPair(first);
  }
}

const firsts = sets.filter((s) => s.isFirstPart);

function part1(): number {
  // max
  // for each number pair, work out which can be maximised and use the delta to calculate the second
  firsts.forEach((f) => {
    if (f.delta > 0) {
      f.pair!.value = 9;
      f.value = 9 - f.delta;
    } else {
      f.value = 9;
      f.pair!.value = 9 + f.delta;
    }
  });
  return parseInt(sets.map((s) => s.value).join(""), 10);
}

function part2(): number {
  // min
  firsts.forEach((f) => {
    if (f.delta > 0) {
      f.value = 1;
      f.pair!.value = 1 + f.delta;
    } else {
      f.pair!.value = 1;
      f.value = 1 - f.delta;
    }
  });
  return parseInt(sets.map((s) => s.value).join(""), 10);
}

console.log("Part 1:", part1(), part1() === 49917929934999);
console.log("Part 2:", part2(), part2() === 11911316711816);

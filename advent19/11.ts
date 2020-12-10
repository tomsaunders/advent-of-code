#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input11.txt", "utf8") as string;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

export class IntcodeProcessor {
  public position: number = 0;
  public relativeBase: number = 0;
  public input: number[] = [];
  public output: number[] = [];
  public halted: boolean = false;
  public next!: IntcodeProcessor;

  constructor(public codes: number[]) {}

  public run(): void {
    const val = (instruction: string, offset: number): number => {
      const param = this.codes[this.position + offset];
      const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
      if (mode === 0) {
        return this.codes[param];
      } else if (mode === 1) {
        return param;
      } else if (mode === 2) {
        // relative
        return this.codes[param + this.relativeBase] || 0;
      }
      return 99;
    };
    const setval = (instruction: string, offset: number): number => {
      const param = this.codes[this.position + offset];
      const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
      if (mode === 0 || mode === 1) {
        // position
        return param || 0;
      } else if (mode === 2) {
        // relative
        return param + this.relativeBase || 0;
      }
      return 99;
    };

    let code = this.codes[this.position];
    let codeStr = `00000000000${code}`;
    let op = parseInt(codeStr.substr(codeStr.length - 2), 10);

    while (op !== 99) {
      let a = val(codeStr, 1);
      let b = val(codeStr, 2);
      if (op === 1) {
        let c = setval(codeStr, 3);
        this.codes[c] = a + b;
        this.position += 4;
      } else if (op === 2) {
        let c = setval(codeStr, 3);
        this.codes[c] = a * b;
        this.position += 4;
      } else if (op === 3) {
        a = setval(codeStr, 1);
        const inputVal = this.input.shift();
        // console.log("got input ", inputVal);
        this.codes[a] = inputVal || 0;
        this.position += 2;
      } else if (op === 4) {
        const output = val(codeStr, 1);
        this.output.push(output);
        // this.next.input.push(output);
        this.position += 2;
        // console.log("sent output ", output);
        return;
      } else if (op === 5) {
        if (a !== 0) {
          this.position = b;
        } else {
          this.position += 3;
        }
      } else if (op === 6) {
        if (a === 0) {
          this.position = b;
        } else {
          this.position += 3;
        }
      } else if (op === 7) {
        let c = setval(codeStr, 3);
        this.codes[c] = a < b ? 1 : 0;
        this.position += 4;
      } else if (op === 8) {
        let c = setval(codeStr, 3);
        this.codes[c] = a == b ? 1 : 0;
        this.position += 4;
      } else if (op === 9) {
        this.relativeBase += a;
        this.position += 2;
      }
      code = this.codes[this.position];
      codeStr = `00000000000${code}`;
      op = parseInt(codeStr.substr(codeStr.length - 2), 10);
    }
    this.halted = true;
  }
}

enum DIR {
  U,
  R,
  D,
  L,
}

function paint(input: string, startWhite: boolean = false): number {
  const codes = input.split(",").map((s) => parseInt(s, 10));
  const robot = new IntcodeProcessor(codes);
  let x = 0;
  let y = 0;
  let dir: string = "U";
  let coord = `${x}:${y}`;
  const white = new Set<string>();
  if (startWhite) {
    white.add(coord);
  }
  const painted = new Set<string>();
  const turnLookup: { [key: string]: string }[] = [
    {
      U: "L",
      L: "D",
      D: "R",
      R: "U",
    },
    {
      U: "R",
      R: "D",
      D: "L",
      L: "U",
    },
  ];
  let n = 0;
  while (!robot.halted) {
    coord = `${x}:${y}`;
    let inputValue = white.has(coord) ? 1 : 0;
    robot.input.push(inputValue);
    robot.run();
    if (!robot.halted) {
      const whitePaint = robot.output.pop();
      robot.run();
      const turn = robot.output.pop() as number;
      if (whitePaint) {
        white.add(coord);
      } else {
        white.delete(coord);
      }
      painted.add(coord);
      const look = turnLookup[turn];
      dir = look[dir];
      if (dir === "U") {
        y--;
      } else if (dir === "D") {
        y++;
      } else if (dir === "L") {
        x--;
      } else if (dir === "R") {
        x++;
      }
    }
  }

  let o = "";
  for (y = 0; y < 10; y++) {
    for (x = -0; x < 60; x++) {
      const c = `${x}:${y}`;
      o += white.has(c) ? "#" : " ";
    }
    o += "\n";
  }
  if (startWhite) {
    console.log(o);
  }
  return painted.size;
}

console.log("Answer", paint(input));
console.log("\n Part 2");
console.log("Answer", paint(input, true));

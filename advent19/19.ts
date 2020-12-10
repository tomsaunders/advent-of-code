#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input19.txt", "utf8") as string;

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

  public thread(): IntcodeProcessor {
    const p = new IntcodeProcessor(this.codes.slice(0));
    p.relativeBase = this.relativeBase;
    p.position = this.position;
    return p;
  }

  public run(): number {
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
        return output;
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
    return -1;
  }
}

function tractor(codes: number[]): number {
  const size = 50;
  let affected = 0;
  for (let y = 0; y < size; y++) {
    let line = "";
    for (let x = 0; x < size; x++) {
      const intcode = new IntcodeProcessor(codes.slice(0));
      intcode.input.push(x);
      intcode.input.push(y);
      const result = intcode.run();
      if (result) {
        affected++;
        line += "#";
      } else {
        line += ".";
      }
    }
    // console.log(line);
  }
  return affected;
}
const codes = input.split(",").map((s) => parseInt(s, 10));
console.log("Answer", tractor(codes.slice(0)));

function tractor2(codes: number[]): number {
  const lookup = new Map<string, boolean>();
  function valid(x: number, y: number): boolean {
    const key = `${x}:${y}`;
    if (!lookup.has(key)) {
      const intcode = new IntcodeProcessor(codes.slice(0));
      intcode.input.push(x);
      intcode.input.push(y);
      const result = intcode.run();
      lookup.set(key, !!result);
    }
    return lookup.get(key) as boolean;
  }

  let found = false;
  let size = 100;
  let x = 0;
  let y = size;
  while (!found) {
    while (!valid(x, y)) {
      x++;
    }
    // found valid x
    if (valid(x + 99, y)) {
      // bottom row is wide enough
      if (valid(x, y - 99) && valid(x + 99, y - 99)) {
        // left column is tall enough, top right is still in play
        let ok = true;
        for (let ty = y - 99; ty <= y; ty++) {
          for (let tx = x; tx <= x + 99; tx++) {
            if (!valid(tx, ty)) {
              ok = false;
              tx = ty = tx * ty;
            }
          }
        }
        if (ok) {
          return x * 10000 + y - 99;
        }
      }
    }
    y++;
  }

  return 99;
}
console.log("Answer", tractor2(codes.slice(0)));

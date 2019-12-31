#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input21.txt", "utf8") as string;

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

  public inputAscii(a: string): void {
    for (let c = 0; c < a.length; c++) {
      this.input.push(a.charCodeAt(c));
    }
    this.input.push(10);
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

function springdroid(codes: number[]): number {
  const droid = new IntcodeProcessor(codes.slice(0));
  let t: boolean = false;
  let j: boolean = false;

  let nx = 0;
  let l = "";
  droid.inputAscii("NOT C J");
  droid.inputAscii("AND D J"); // J says 3 hole 4 ground
  droid.inputAscii("NOT A T"); // T says next is unsafe
  droid.inputAscii("OR T J");
  // droid.inputAscii("NOT A J");
  droid.inputAscii("WALK");
  while (!droid.halted) {
    const o = droid.run();
    if (o > 1000) {
      console.log("BIG", o);
    }
    if (o === 10) {
      console.log(l);
      l = "";
    } else {
      l += String.fromCharCode(o);
    }
    nx++;
  }

  return 99;
}

const codes = input.split(",").map(s => parseInt(s, 10));
console.log("Answer", springdroid(codes.slice(0)));

function springdroid2(codes: number[]): number {
  const droid = new IntcodeProcessor(codes.slice(0));
  let t: boolean = false;
  let j: boolean = false;

  let nx = 0;
  let l = "";

  // part 1
  droid.inputAscii("NOT C T");
  droid.inputAscii("OR T J");
  droid.inputAscii("NOT A T");
  droid.inputAscii("OR T J");
  droid.inputAscii("NOT B T");
  droid.inputAscii("OR T J");
  droid.inputAscii("AND D J");

  // part 2 - if jump and then either 5 or 8 must be okay
  droid.inputAscii("NOT E T");
  droid.inputAscii("NOT T T");
  droid.inputAscii("OR H T");
  droid.inputAscii("AND T J");

  droid.inputAscii("RUN");
  while (!droid.halted) {
    const o = droid.run();
    if (o > 1000) {
      console.log("BIG", o);
    }
    if (o === 10) {
      console.log(l);
      l = "";
    } else {
      l += String.fromCharCode(o);
    }
    nx++;
  }

  return 99;
}

console.log("Answer", springdroid2(codes.slice(0)));

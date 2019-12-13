#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input13.txt", "utf8") as string;

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
        console.log("got input ", inputVal);
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

function game(codes: number[]): number {
  const game = new IntcodeProcessor(codes);
  while (!game.halted) {
    game.run();
  }
  const out = game.output;
  let blocks = 0;
  let score = 0;
  for (let i = 0; i < out.length; i += 3) {
    const x = out[i];
    const y = out[i + 1];
    const t = out[i + 2];
    if (x === -1 && y === 0) {
      score = t;
      // console.log("Score", score);
    } else if (t === 2) {
      blocks++;
    }
  }
  console.log("Blocks", blocks);
  return blocks;
}
const codes = input.split(",").map(s => parseInt(s, 10));
console.log("Answer", game(codes.slice(0)));
console.log("\n Part 2");

function highScore(codes: number[]): number {
  codes[0] = 2; // quarters
  const game = new IntcodeProcessor(codes);

  let bx = 0;
  let by = 0;
  let px = 0;
  let py = 0;
  let blocks = 0;
  let score = 0;

  while (!game.halted) {
    const x = game.run() as number;
    const y = game.run();
    const t = game.run();
    if (x === -1 && y === 0) {
      score = t;
      console.log("Score", score);
    } else if (t === 2) {
      blocks++;
    } else if (t === 3) {
      // paddle
      px = x;
      py = y;
    } else if (t === 4) {
      // ball
      bx = x;
      by = y;
      if (bx < px) {
        game.input.push(-1); // left
      } else if (bx > px) {
        game.input.push(1); // right;
      } else {
        game.input.push(0);
      }
    }
  }
  // console.log("Blocks", blocks);
  return score;
}

highScore(codes.slice(0));

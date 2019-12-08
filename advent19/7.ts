#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input7.txt", "utf8") as string;

export class IntcodeProcessor {
  public position: number = 0;
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
      }
      return 99;
    };

    let code = this.codes[this.position];
    let codeStr = `00000000000${code}`;
    let op = parseInt(codeStr.substr(codeStr.length - 2), 10);

    while (op !== 99) {
      if (op === 1) {
        const a = val(codeStr, 1);
        const b = val(codeStr, 2);
        const c = this.codes[this.position + 3];
        this.codes[c] = a + b;
        this.position += 4;
      } else if (op === 2) {
        const a = val(codeStr, 1);
        const b = val(codeStr, 2);
        const c = this.codes[this.position + 3];
        this.codes[c] = a * b;
        this.position += 4;
      } else if (op === 3) {
        const a = this.codes[this.position + 1];
        const inputVal = this.input.shift();
        // console.log("got input ", inputVal);
        this.codes[a] = inputVal || 0;
        this.position += 2;
      } else if (op === 4) {
        const output = val(codeStr, 1);
        this.output.push(output);
        this.next.input.push(output);
        this.position += 2;
        // console.log("sent output ", output);
        return;
      } else if (op === 5) {
        const a = val(codeStr, 1);
        const b = val(codeStr, 2);
        if (a !== 0) {
          this.position = b;
        } else {
          this.position += 3;
        }
      } else if (op === 6) {
        const a = val(codeStr, 1);
        const b = val(codeStr, 2);
        if (a === 0) {
          this.position = b;
        } else {
          this.position += 3;
        }
      } else if (op === 7) {
        const a = val(codeStr, 1);
        const b = val(codeStr, 2);
        const c = this.codes[this.position + 3];
        this.codes[c] = a < b ? 1 : 0;
        this.position += 4;
      } else if (op === 8) {
        const a = val(codeStr, 1);
        const b = val(codeStr, 2);
        const c = this.codes[this.position + 3];
        this.codes[c] = a == b ? 1 : 0;
        this.position += 4;
      }
      code = this.codes[this.position];
      codeStr = `00000000000${code}`;
      op = parseInt(codeStr.substr(codeStr.length - 2), 10);
    }
    this.halted = true;
  }
}

function val(instruction: string, pos: number, offset: number, codes: number[]): number {
  const param = codes[pos + offset];
  const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
  if (mode === 0) {
    return codes[param];
  } else if (mode === 1) {
    return param;
  }
  return 99;
}

function op(codes: number[], inputResult: number[]): number {
  let pos = 0;
  let code = codes[pos];
  let codeStr = `00000000000${code}`;
  let op = parseInt(codeStr.substr(codeStr.length - 2), 10);

  while (op !== 99) {
    if (op === 1) {
      const a = val(codeStr, pos, 1, codes);
      const b = val(codeStr, pos, 2, codes);
      const c = codes[pos + 3];
      codes[c] = a + b;
      pos += 4;
    } else if (op === 2) {
      const a = val(codeStr, pos, 1, codes);
      const b = val(codeStr, pos, 2, codes);
      const c = codes[pos + 3];
      codes[c] = a * b;
      pos += 4;
    } else if (op === 3) {
      const a = codes[pos + 1];
      const inputVal = inputResult.shift();
      codes[a] = inputVal || 0;
      pos += 2;
    } else if (op === 4) {
      const output = val(codeStr, pos, 1, codes);
      if (output !== 0) {
        return output;
      }
      pos += 2;
    } else if (op === 5) {
      const a = val(codeStr, pos, 1, codes);
      const b = val(codeStr, pos, 2, codes);
      if (a !== 0) {
        pos = b;
      } else {
        pos += 3;
      }
    } else if (op === 6) {
      const a = val(codeStr, pos, 1, codes);
      const b = val(codeStr, pos, 2, codes);
      if (a === 0) {
        pos = b;
      } else {
        pos += 3;
      }
    } else if (op === 7) {
      const a = val(codeStr, pos, 1, codes);
      const b = val(codeStr, pos, 2, codes);
      const c = codes[pos + 3];
      codes[c] = a < b ? 1 : 0;
      pos += 4;
    } else if (op === 8) {
      const a = val(codeStr, pos, 1, codes);
      const b = val(codeStr, pos, 2, codes);
      const c = codes[pos + 3];
      codes[c] = a == b ? 1 : 0;
      pos += 4;
    }
    code = codes[pos];
    codeStr = `00000000000${code}`;
    op = parseInt(codeStr.substr(codeStr.length - 2), 10);
  }
  // return codes.join(",");
  return 0;
}

function permute(finished: any[][], options: any[], progress: any[]): void {
  if (options.length === 0) {
    finished.push(progress);
    return;
  }
  for (let i = 0; i < options.length; i++) {
    const next = options[i];
    const branch = [...progress];
    branch.push(next);

    const rest = [...options];
    rest.splice(i, 1);

    permute(finished, rest, branch);
  }
}
function permutations(arr: any[]): any[][] {
  const all: any[][] = [];
  permute(all, arr, []);

  return all;
}

const phases = [0, 1, 2, 3, 4];
const perms = permutations(phases);

function thruster(codes: number[], phases: number[]): number {
  let ampOutput = 0;
  for (const phase of phases) {
    ampOutput = op(codes, [phase, ampOutput]);
  }
  return ampOutput;
}

function maxThruster(input: string, permutations: number[][]): number {
  let max = 0;
  const codes = input.split(",").map((s) => parseInt(s, 10));
  for (const perm of permutations) {
    const thrust = thruster(codes, perm);
    max = Math.max(max, thrust);
  }
  return max;
}

function thrust2(codes: number[], phases: number[]): number {
  const amps: IntcodeProcessor[] = [];
  for (const phase of phases) {
    const amp = new IntcodeProcessor([...codes]);
    amp.input.push(phase);
    amps.push(amp);
  }
  const loop = [...amps];
  loop.push(amps[0]);
  for (let i = 0; i < phases.length; i++) {
    const next = loop[i + 1];
    amps[i].next = next;
  }
  amps[0].input.push(0);
  const last = amps[4];
  last.next = amps[0];

  while (!last.halted) {
    for (let i = 0; i < phases.length; i++) {
      const amp = amps[i];
      // console.log("running amp ", i);
      amp.run();
    }
  }

  return last.output.pop()!;
}

function maxThrust2(input: string, permutations: number[][]): number {
  let max = 0;
  const codes = input.split(",").map((s) => parseInt(s, 10));
  for (const perm of permutations) {
    const thrust = thrust2(codes, perm);
    max = Math.max(max, thrust);
  }
  return max;
}

function test(a: any, b: any): void {
  console.log(a == b ? `Test pass, got ${a}` : `!!Test fail, wanted ${a} but got ${b}`);
}

test(
  43210,
  thruster(
    "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0".split(",").map((s) => parseInt(s, 10)),
    [4, 3, 2, 1, 0]
  )
);
test(
  54321,
  thruster(
    "3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0".split(",").map((s) => parseInt(s, 10)),
    [0, 1, 2, 3, 4]
  )
);
const test3 = "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0";
test(
  65210,
  thruster(
    test3.split(",").map((s) => parseInt(s, 10)),
    [1, 0, 4, 3, 2]
  )
);
test(43210, maxThruster("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0", perms));
test(54321, maxThruster("3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0", perms));
test(65210, maxThruster(test3, perms));

console.log("\n\nAnswer", maxThruster(input, perms));

console.log("\n\nPART 2\n\n");
const perm2 = permutations([5, 6, 7, 8, 9]);

const test2a = "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";
const test2b =
  "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10";
test(
  139629729,
  thrust2(
    test2a.split(",").map((s) => parseInt(s, 10)),
    [9, 8, 7, 6, 5]
  )
);
test(139629729, maxThrust2(test2a, perm2));
test(
  18216,
  thrust2(
    test2b.split(",").map((s) => parseInt(s, 10)),
    [9, 7, 8, 5, 6]
  )
);
test(18216, maxThrust2(test2b, perm2));

console.log("Answer", maxThrust2(input, perm2));

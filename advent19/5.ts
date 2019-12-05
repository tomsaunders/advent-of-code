#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input5.txt", "utf8") as string;

function val(
  instruction: string,
  pos: number,
  offset: number,
  codes: number[]
): number {
  const param = codes[pos + offset];
  const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
  // console.log("val!~", param, mode);
  if (mode === 0) {
    // position
    return codes[param];
  } else if (mode === 1) {
    // immediate
    return param;
  }
  return 99;
}

function op(line: string, inputResult: number = 1) {
  // console.log(line);
  const codes = line.split(",").map(l => parseInt(l, 10));
  let pos = 0;
  let code = codes[pos];
  let codeStr = `00000000000${code}`;
  let op = parseInt(codeStr.substr(codeStr.length - 2), 10);
  // console.log(`pos ${pos} code ${code} str ${codeStr} op ${op}`);

  let x = 0;
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
      // console.log(`multiplying ${a} * ${b} into ${c}`);
      codes[c] = a * b;
      pos += 4;
    } else if (op === 3) {
      const a = codes[pos + 1];
      codes[a] = inputResult;
      pos += 2;
    } else if (op === 4) {
      const output = val(codeStr, pos, 1, codes);
      console.log(output);
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
      // console.log(`@${pos} Does ${a} == ${b} ? write to ${c}`);
      codes[c] = a == b ? 1 : 0;
      pos += 4;
    }
    code = codes[pos];
    codeStr = `00000000000${code}`;
    op = parseInt(codeStr.substr(codeStr.length - 2), 10);
    // console.log(`pos ${pos} code ${code} str ${codeStr} op ${op}`);
  }
  return codes.join(",");
}

function test(a: any, b: any): void {
  const o = a == b ? "Test pass" : "Test fail";
  console.log(o, a);
}

test("1002,4,3,4,99", op("1002,4,3,4,33"));
test("1101,100,-1,4,99", op("1101,100,-1,4,0"));

op(input);

console.log("\n\nPART 2\n\n");
// For example, here are several programs that take one input, compare it to the value 8, and then produce one output:

const testInput = 7;
// 3,9,8,9,10,9,4,9,99,-1,8 - Using position mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
op("3,9,8,9,10,9,4,9,99,-1,8", testInput);
// 3,9,7,9,10,9,4,9,99,-1,8 - Using position mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
op("3,9,7,9,10,9,4,9,99,-1,8", testInput);
// 3,3,1108,-1,8,3,4,3,99 - Using immediate mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
op("3,3,1108,-1,8,3,4,3,99", testInput);
// 3,3,1107,-1,8,3,4,3,99 - Using immediate mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
op("3,3,1107,-1,8,3,4,3,99", testInput);

// Here are some jump tests that take an input, then output 0 if the input was zero or 1 if the input was non-zero:

// 3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9 (using position mode)
op("3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9", 12);
// 3,3,1105,-1,9,1101,0,0,12,4,12,99,1 (using immediate mode)
op("3,3,1105,-1,9,1101,0,0,12,4,12,99,1", 12);

// Here's a larger example:

// 3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
// 1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
// 999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
op(
  "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99",
  1
);
// The above example program uses an input instruction to ask for a single number. The program will then output 999 if the input value is below 8, output 1000 if the input value is equal to 8, or output 1001 if the input value is greater than 8.

console.log("Answer");
op(input, 5);

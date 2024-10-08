#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input9.txt", "utf8") as string;

function val(
  instruction: string,
  pos: number,
  offset: number,
  codes: number[],
  relativeBase: number
): number {
  const param = codes[pos + offset];
  const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
  // console.log("val!~", param, mode);
  if (mode === 0) {
    // position
    return codes[param] || 0;
  } else if (mode === 1) {
    // immediate
    return param;
  } else if (mode === 2) {
    // relative
    return codes[param + relativeBase] || 0;
  }
  return 99;
}

function setval(
  instruction: string,
  pos: number,
  offset: number,
  codes: number[],
  relativeBase: number
): number {
  const param = codes[pos + offset];
  const mode = parseInt(instruction[instruction.length - 2 - offset], 10);
  if (mode === 0 || mode === 1) {
    // position
    return param || 0;
  } else if (mode === 2) {
    // relative
    return param + relativeBase || 0;
  }
  return 99;
}

function op(line: string, inputResult: number = 1, rb: number = 0) {
  // console.log("===op", line.substr(0, 400000));
  const codes = line.split(",").map((l) => parseInt(l, 10));
  let pos = 0;
  let code = codes[pos];
  let codeStr = `00000000000${code}`;
  let op = parseInt(codeStr.substr(codeStr.length - 2), 10);
  let relativeBase = rb;

  let x = 0;
  while (op !== 99) {
    // console.log(`pos ${pos} code ${code} str ${codeStr} op ${op}`);
    let a = val(codeStr, pos, 1, codes, relativeBase);
    let b = val(codeStr, pos, 2, codes, relativeBase);
    if (op === 1) {
      let c = setval(codeStr, pos, 3, codes, relativeBase);
      codes[c] = a + b;
      pos += 4;
    } else if (op === 2) {
      let c = setval(codeStr, pos, 3, codes, relativeBase);
      // console.log(`multiplying ${a} * ${b} into ${c}`);
      codes[c] = a * b;
      pos += 4;
    } else if (op === 3) {
      a = setval(codeStr, pos, 1, codes, relativeBase);
      codes[a] = inputResult;
      pos += 2;
    } else if (op === 4) {
      const output = val(codeStr, pos, 1, codes, relativeBase);
      console.log(output);
      pos += 2;
      // return output;
    } else if (op === 5) {
      if (a !== 0) {
        pos = b;
      } else {
        pos += 3;
      }
    } else if (op === 6) {
      if (a === 0) {
        pos = b;
      } else {
        pos += 3;
      }
    } else if (op === 7) {
      let c = setval(codeStr, pos, 3, codes, relativeBase);
      codes[c] = a < b ? 1 : 0;
      pos += 4;
    } else if (op === 8) {
      let c = setval(codeStr, pos, 3, codes, relativeBase);
      codes[c] = a == b ? 1 : 0;
      pos += 4;
    } else if (op === 9) {
      relativeBase += a;
      pos += 2;
      // console.log("relative base now", relativeBase);
    }
    code = codes[pos];
    codeStr = `00000000000${code}`;
    op = parseInt(codeStr.substr(codeStr.length - 2), 10);
  }
  console.log("halt");
  return codes.join(",");
}

function test(a: any, b: any): void {
  const o = a == b ? `Test pass - ${a}` : `!!Test fail - got ${b} wanted ${a}`;
  console.log(o);
}

// op("109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"); // takes no input and produces a copy of itself as output.
// op("1102,34915192,34915192,7,4,7,99,0"); // should output a 16-digit number.
// op("104,1125899906842624,99"); // should output the large number in the middle.
op(input);
console.log("Part 2");
op(input, 2);

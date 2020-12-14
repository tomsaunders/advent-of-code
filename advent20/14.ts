#!/usr/bin/env ts-node
import { arrSum, test, Grid, Cell } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input14.txt", "utf8");
const testIn = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`.split("\n");

function binStr(num: number): string {
  return num.toString(2).padStart(36, "0");
}

function partOne(lines: string[]): number {
  const memory = new Map<number, number>();
  let mask: string[] = [];

  for (const line of lines) {
    if (line.startsWith("mask")) {
      mask = line.replace("mask = ", "").split("");
    } else {
      const bits = line.split(" = ");
      const pos = parseInt(bits[0].replace("mem[", "").replace("]", ""), 10);
      const val = parseInt(bits[1], 10);
      const binaryStr = binStr(val);
      const binArr = binaryStr.split("");
      // console.log(val, binaryStr, mask.length, binArr.length);
      for (let i = 0; i < 36; i++) {
        if (mask[i] !== "X") {
          binArr[i] = mask[i];
        }
      }
      const maskedVal = parseInt(binArr.join(""), 2);
      // console.log(val, maskedVal);
      memory.set(pos, maskedVal);
    }
  }

  return arrSum(Array.from(memory.values()));
}

test(165, partOne(testIn));
console.log("Part One", partOne(input.split("\n")));

function partTwo(lines: string[]): number {
  const memory = new Map<number, number>();
  let mask: string[] = [];

  for (const line of lines) {
    if (line.startsWith("mask")) {
      mask = line.replace("mask = ", "").split("");
    } else {
      const bits = line.split(" = ");
      const pos = parseInt(bits[0].replace("mem[", "").replace("]", ""), 10);
      const val = parseInt(bits[1], 10);

      const binaryPos = binStr(pos);
      const binArr = binaryPos.split("");

      const memQ: string[][] = [binArr];
      for (let i = 0; i < 36; i++) {
        if (mask[i] === "1") {
          for (const a of memQ) {
            a[i] = "1";
          }
        } else if (mask[i] === "X") {
          let q = memQ.length;
          for (let n = 0; n < q; n++) {
            const a = memQ[n];
            const b = a.slice();
            a[i] = "1";
            b[i] = "0";
            memQ.push(b);
          }
        }
      }
      for (const a of memQ) {
        const mem = parseInt(a.join(""), 2);
        memory.set(mem, val);
      }
    }
  }

  return arrSum(Array.from(memory.values()));
}

test(
  208,
  partTwo(
    `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`.split("\n")
  )
);
console.log("Part Two", partTwo(input.split("\n")));

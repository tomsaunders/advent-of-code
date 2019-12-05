#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input2.txt", "utf8") as string;
const lines = input.split("\n");

function op(line: string) {
  const codes = line.split(",").map(l => parseInt(l, 10));
  let pos = 0;
  let op = codes[pos];
  while (op !== 99) {
    if (op === 1) {
      const aPos = codes[pos + 1];
      const bPos = codes[pos + 2];
      const savePos = codes[pos + 3];
      const sum = codes[aPos] + codes[bPos];
      codes[savePos] = sum;
      pos += 4;
      op = codes[pos];
    } else if (op === 2) {
      const aPos = codes[pos + 1];
      const bPos = codes[pos + 2];
      const savePos = codes[pos + 3];
      const product = codes[aPos] * codes[bPos];
      codes[savePos] = product;
      pos += 4;
      op = codes[pos];
    }
  }
  return codes.join(",");
}

function test(a: any, b: any): void {
  const o = a == b ? "Test pass" : "Test fail";
  console.log(o, a);
}

test("3500,9,10,70,2,3,11,0,99,30,40,50", op("1,9,10,3,2,3,11,0,99,30,40,50"));
test("2,0,0,0,99", op("1,0,0,0,99"));
test("2,3,0,6,99", op("2,3,0,3,99"));
test("2,4,4,5,99,9801", op("2,4,4,5,99,0"));
test("30,1,1,4,2,5,6,0,99", op("1,1,1,4,99,5,6,0,99"));

const codes = input.split(",").map(l => parseInt(l, 10));
const immutable = codes.slice(0);
codes[1] = 12;
codes[2] = 2;
const start = codes.join(",");
const out = op(start);
const end = out.split(",");

console.log("Answer", end[0]);

console.log("PART 2");
const want = 19690720;

function op2(immutable: number[], noun: number, verb: number): number {
  const codes = immutable.slice(0);
  codes[1] = noun;
  codes[2] = verb;
  const start = codes.join(",");
  const out = op(start);
  const end = out.split(",");
  return parseInt(end[0], 10);
}

for (let x = 0; x < 100; x++) {
  for (let y = 0; y < 100; y++) {
    const o = op2(immutable, x, y);
    if (o === want) {
      console.log(
        `Found ${want} at ${x} and ${y} the answer is ${x * 100 + y}`
      );
      x = y = 200;
    }
  }
}

// console.log("Answer", 0);

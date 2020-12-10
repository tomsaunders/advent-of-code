#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8") as string;

function fuel(mass: number) {
  return Math.floor(mass / 3) - 2;
}

function test(a: any, b: any): void {
  const o = a == b ? "Test pass" : "Test fail";
  console.log(o, a);
}

test(2, fuel(12));
test(2, fuel(14));
test(654, fuel(1969));
test(33583, fuel(100756));

const nums = input.split("\n").map((l) => fuel(parseInt(l, 10)));
const sum = nums.reduce((a, b) => a + b, 0);
console.log("Answer", sum);

console.log("PART 2");

function fuel2(mass: number) {
  let f = fuel(mass);
  let m = 0;

  let i = 0;
  while (f > 0 && i++ < 10) {
    m += f;
    f = fuel(f);
  }

  return m;
}

test(2, fuel2(14));
test(966, fuel2(1969));
test(50346, fuel2(100756));

const nums2 = input.split("\n").map((l) => fuel2(parseInt(l, 10)));
const sum2 = nums2.reduce((a, b) => a + b, 0);
console.log("Answer", sum2);

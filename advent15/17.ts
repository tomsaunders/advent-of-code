#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input17.txt", "utf8") as string;
const tests = [5, 5, 10, 15, 20];
const containers = input.split("\n").map((l) => parseInt(l, 10));

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}
const arrSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

function isThisTheWay(
  finished: number[][],
  seek: number,
  remainder: number[],
  current: number[]
): void {
  const sum = arrSum(current);
  //console.log("is this the way", current, sum, seek, remainder);
  if (sum === seek) {
    finished.push(current);
    return;
  } else if (sum > seek) {
    return;
  }

  for (let i = 0; i < remainder.length; i++) {
    const branch = [...current, remainder[i]];
    const rem = remainder.slice(i + 1);
    //rem.splice(i, 1);
    isThisTheWay(finished, seek, rem, branch);
  }
}
function waysToStore(conts: number[], seek: number): number {
  const all: number[][] = [];
  isThisTheWay(all, seek, conts, []);
  return all.length;
}
function minToStore(conts: number[], seek: number): number {
  const all: number[][] = [];
  isThisTheWay(all, seek, conts, []);
  const lengs = all.map((a) => a.length);
  const min = Math.min(...lengs);
  return all.filter((a) => a.length === min).length;
}
test(4, waysToStore(tests, 25));
console.log("Part One; ", waysToStore(containers, 150));
test(3, minToStore(tests, 25));
console.log("Part Two", minToStore(containers, 150));

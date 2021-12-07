#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input7.txt", "utf8");
const test = fs.readFileSync("test7.txt", "utf8");

function part1(input: string): number {
  const numbers = input.split(",").map((n) => parseInt(n, 10));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  let minSteps = 999999999999999999999;
  for (let i = min; i <= max; i++) {
    let steps = 0;
    numbers.forEach((n) => (steps += Math.abs(n - i)));

    minSteps = Math.min(steps, minSteps);
  }

  return minSteps;
}

const t1 = part1(test);
if (t1 === 37) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const numbers = input.split(",").map((n) => parseInt(n, 10));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  function cost(n: number): number {
    n = Math.abs(n);
    return (n * (n + 1)) / 2;
  }

  let minSteps = 999999999999999999999;
  for (let i = min; i <= max; i++) {
    let steps = 0;
    numbers.forEach((n) => (steps += cost(n - i)));

    minSteps = Math.min(steps, minSteps);
  }

  return minSteps;
}

const t2 = part2(test);
if (t2 === 168) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input2.txt", "utf8");
const test = fs.readFileSync("test2.txt", "utf8");

function part1(input: string): number {
  let x = 0;
  let y = 0;
  const lines = input.split("\n");
  lines.forEach((l) => {
    const [dir, num] = l.split(" ");
    const n = parseInt(num, 10);
    switch (dir) {
      case "forward":
        x += n;
        break;
      case "down":
        y += n;
        break;
      case "up":
        y -= n;
        break;
    }
  });
  return x * y;
}

const t1 = part1(test);
if (t1 === 150) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  let x = 0;
  let y = 0;
  let a = 0;
  const lines = input.split("\n");
  lines.forEach((l) => {
    const [dir, num] = l.split(" ");
    const n = parseInt(num, 10);
    switch (dir) {
      case "forward":
        x += n;
        y += a * n;
        break;
      case "down":
        a += n;
        break;
      case "up":
        a -= n;
        break;
    }
  });
  return x * y;
}

const t2 = part2(test);
if (t2 === 900) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Grid } from "./util";
const input = fs.readFileSync("input20.txt", "utf8");

const test = `1
2
-3
3
-2
0
4`;

function parse(input: string): number[] {
  return input.split("\n").map((l) => parseInt(l, 10));
}

function part1(input: string): number {
  const nums = parse(input);
  let sorted = nums.slice(0);
  nums.forEach((n) => {
    const idx = sorted.indexOf(n);
    // console.log(n, "from idx ", idx);
    sorted.splice(idx, 1);

    let newdx = idx + n;
    if (newdx >= nums.length) {
      // console.log("newd", newdx);
      newdx %= nums.length;
      newdx += 1;
    } else if (newdx <= -nums.length) {
      newdx %= nums.length;
      // newdx -= 1;
    }
    // console.log("newd", newdx);
    // if (newdx === 0) {
    // sorted.push(n);
    // } else {
    sorted.splice(newdx, 0, n);
    // }
    // console.log(sorted.join(", "), "\n");
  });

  const zPos = sorted.indexOf(0);
  console.log([
    sorted[(zPos + 1000) % sorted.length],
    sorted[(zPos + 2000) % sorted.length],
    sorted[(zPos + 3000) % sorted.length],
  ]);
  console.log(sorted);
  console.log("zpos", zPos);
  return arrSum([
    sorted[(zPos + 1000) % sorted.length],
    sorted[(zPos + 2000) % sorted.length],
    sorted[(zPos + 3000) % sorted.length],
  ]);
  return 0;
}

function part2(input: string): number {
  const grid = parse(input);
  return 0;
}

const t1 = part1(test);
if (t1 === 3) {
  // 2953 too low
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 58) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

// numbers arent unique this doesnt work

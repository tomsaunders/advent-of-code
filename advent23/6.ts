#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, arrProd, arrSum, isNumeric, lineToNumbers, mapNum } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");
const test = `Time:      7  15   30
Distance:  9  40  200`;

function part1(input: string): number {
  const lines = input.split("\n");
  const times = lineToNumbers(lines[0]);
  const distances = lineToNumbers(lines[1])

  const races: number[] = new Array(times.length);
  times.forEach((time, i) => {
    const distance = distances[i];

    races[i] = 0;
    for (let s = 1; s < time; s++){
      const rest = time - s;
      const travel = s * rest;
      if (travel > distance){
        races[i]++;
        // console.log(`To beat ${distance} in ${time}, you can hold for ${s} and then travel for ${rest} to reach ${travel}`);
      }
    }
  })

  return arrProd(races);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const time = lineToNumbers(lines[0].replace(/\s/g, '')).pop() as number;
  const distance = lineToNumbers(lines[1].replace(/\s/g, '')).pop() as number;

  let min = 1; let max = time -1;
  for (; min < time; min++){
    const rest = time - min;
    const travel = min * rest;
    if (travel > distance){
      break;
    }
  }

  for (; max > min; max--){
    const rest = time - max;
    const travel = max * rest;
    if (travel > distance){
      break;
    }
  }

  return max - min + 1;
}

const t = part1(test);
if (t == 288) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 71503) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";

const input = 36000000;
function sumOfFactors(
  goal: number,
  presents: number = 10,
  houseLimit: number = Infinity
): number {
  const max = goal / presents;
  for (let i = 1; i <= max; i++) {
    let sum = 0;
    for (let n = Math.floor(Math.sqrt(i)); n > 0; n--) {
      if (i % n === 0) {
        const m = i / n;
        if (m < houseLimit) sum += n;

        if (m !== n && n < houseLimit) sum += m;
      }
    }
    if (sum >= max) {
      return i;
    }
    // if (i % 10000 === 0) console.log(`Sum of factors for ${i} is ${sum}`);
  }
  return 0;
}

test(1, sumOfFactors(10));
test(8, sumOfFactors(150));
console.log("Part 1", sumOfFactors(input));

console.log("Part 2", sumOfFactors(input, 11, 50));

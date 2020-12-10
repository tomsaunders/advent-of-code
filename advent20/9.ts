#!/usr/bin/env ts-node
import { arrSum, test } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input9.txt", "utf8");

const testIn = ``;

const lines = input.split("\n");

const numbers = lines.map((l) => parseInt(l, 10));

function isValid(source: number[], goal: number): boolean {
  for (let i = 0; i < source.length; i++) {
    for (let n = i + 1; n < source.length; n++) {
      if (source[i] + source[n] === goal) return true;
    }
  }
  return false;
}

function firstInvalid(numbers: number[], preLength: number): number {
  const preamble = numbers.splice(0, preLength);
  while (numbers.length) {
    const test = numbers.shift() as number;
    if (!isValid(preamble, test)) {
      return test;
    }
    preamble.shift();
    preamble.push(test);
  }
  return 0;
}

test(
  127,
  firstInvalid(
    [
      35,
      20,
      15,
      25,
      47,
      40,
      62,
      55,
      65,
      95,
      102,
      117,
      150,
      182,
      127,
      219,
      299,
      277,
      309,
      576,
    ],
    5
  )
);
console.log("Part One", firstInvalid(numbers.slice(), 25));

const partOne = 258585477;

function findWeakness(numbers: number[], goal: number): number {
  for (let i = 0; i < numbers.length; i++) {
    let sum = numbers[i];
    let arr = [sum];
    for (let n = i + 1; n < numbers.length; n++) {
      sum += numbers[n];
      arr.push(numbers[n]);
      if (sum === goal) {
        return Math.max(...arr) + Math.min(...arr);
      } else if (sum > goal) {
        n += goal;
      }
    }
  }
  return 0;
}
test(
  62,
  findWeakness(
    [
      35,
      20,
      15,
      25,
      47,
      40,
      62,
      55,
      65,
      95,
      102,
      117,
      150,
      182,
      127,
      219,
      299,
      277,
      309,
      576,
    ],
    127
  )
);

console.log("Part Two", findWeakness(numbers, partOne));

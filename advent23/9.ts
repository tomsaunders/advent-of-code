#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, arrProd, arrSum, isNumeric, lineToNumbers, mapNum } from "./util";
const input = fs.readFileSync("input9.txt", "utf8");
const test = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

function getStacks(row: number[]): number[][] {
  const stacks = [row];
  let current = row;
  while (!current.every(c => c === 0)){
    const next = [];
    for (let i = 1; i < current.length; i++){
      const diff = current[i] - current[i-1];
      next.push(diff);
    }
    stacks.push(next);
    current = next;
  }
  return stacks;
}

function part1(input: string): number {
  const lines = input.split("\n");
  const rows = lines.map(lineToNumbers);

  const nextValues = [] as number[];
  rows.forEach((row, r) => {
    const stacks = getStacks(row);
    let next = 0;

    while (stacks.length){
      const last = stacks.pop();
      const left = last?.pop() as number;
      next += left;
    }

    nextValues.push(next);
  })
 
  return arrSum(nextValues);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const rows = lines.map(lineToNumbers);

  const prevValues = [] as number[];
  rows.forEach((row, r) => {
    const stacks = getStacks(row);
    let prev = 0;
    while (stacks.length){
      const last = stacks.pop();
      const right = last?.shift() as number;
      prev = right - prev;
    }

    prevValues.push(prev);
  })
 
  return arrSum(prevValues);
}

const t = part1(test);
if (t == 114) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 2) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

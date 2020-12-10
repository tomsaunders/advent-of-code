#!/usr/bin/env ts-node
import { arrSum, test } from "./util";
import * as fs from "fs";
import { exit } from "process";
let input = fs.readFileSync("input10.txt", "utf8");

const lines = input.split("\n");
const numbers = lines.map((l) => parseInt(l, 10));

const testN = `16
10
15
5
1
11
7
19
6
12
4`
  .split("\n")
  .map((l) => parseInt(l, 10));

const testNo = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`
  .split("\n")
  .map((l) => parseInt(l, 10));

function partOne(numbers: number[]): number {
  const device = Math.max(...numbers) + 3;
  const start = 0;
  numbers.sort((a, b) => a - b);

  let last = start;
  numbers.push(device);

  let ones = 0;
  let threes = 0;
  for (const n of numbers) {
    if (n - last === 1) {
      ones++;
    } else if (n - last === 3) {
      threes++;
    }
    last = n;
  }
  return ones * threes;
}

test(220, partOne(testNo.slice()));
console.log("Part 1", partOne(numbers.slice()));

function partTwo(numbers: number[]): number {
  const device = Math.max(...numbers) + 3;
  const start = 0;
  numbers.sort((a, b) => a - b);
  // console.log(numbers);
  numbers.push(device);

  const keys: number[] = [];
  let last = start;
  for (const n of numbers) {
    if (n - last === 3) {
      keys.push(n);
    }
    last = n;
  }

  const possibles: number[] = [];
  last = start;
  let keyStart = start;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] <= keyStart) continue;
    const keyEnd = keys.shift() as number;
    // console.log("sorting out chain from", keyStart, keyEnd);
    const chain = [keyStart];
    for (let x = i; numbers[x] <= keyEnd; x++) {
      const n = numbers[x];
      chain.push(n);
    }

    console.log("Chain", chain);
    possibles.push(permuteChain(chain));

    keyStart = keyEnd;
  }
  let mult = 1;
  for (const p of possibles) mult *= p;
  return mult;
}

function permuteChain(chain: number[]): number {
  if (chain.length === 2) return 1;

  const all = new Set<string>();
  permute(all, chain, [chain.shift() as number]);

  // console.log("permute chain", chain, all);

  return all.size;
}

function permute(
  finished: Set<string>,
  options: number[],
  progress: number[]
): void {
  if (options.length === 0) {
    finished.add(progress.join("-"));
    return;
  }
  const last = progress[progress.length - 1] as number;
  for (let i = 0; i < options.length; i++) {
    const next = options[i] as number;
    if (next - last <= 3) {
      //valid choice
      const branch = [...progress, next];
      const rest = [...options];
      rest.splice(i, 1);
      permute(finished, rest.slice(i), branch);
    }
  }
}

console.log("Part test", partOne(testN.slice()));
test(8, partTwo(testN.slice()));
test(19208, partTwo(testNo.slice()));
console.log("Part 2", partTwo(numbers.slice()));

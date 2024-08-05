#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 24
 *
 * Summary: Permutations - find combination with maximum score
 * Escalation: Find max score of the longest combination
 * Solution: Model a simple class to represent each option, do a simple iteration through all possible options.
 *
 * Keywords: Permutations
 * References:
 */
import * as fs from "fs";
import { Grid } from "./util";
const input = fs.readFileSync("input24.txt", "utf8");
const test: string = `0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10`;

class Port {
  public numbers: number[] = [];
  public value: number = 0;
  constructor(public key: string) {
    const [a, b] = key.split("/");
    this.numbers.push(parseInt(a), parseInt(b));
    this.value = this.numbers[0] + this.numbers[1];
  }

  public getNextNumber(prevNumber: number): number {
    const [a, b] = this.numbers;
    if (prevNumber === a) {
      return b;
    }
    return a;
  }
}

function parseInput(input: string): Port[] {
  return input.split("\n").map((l) => new Port(l));
}

interface Queue {
  steps: string[];
  prevPort: number;
  value: number;
}
function part1(input: string): number {
  const ports = parseInput(input);
  const queue: Queue[] = [{ steps: [], prevPort: 0, value: 0 }];
  let max = 0;
  while (queue.length) {
    const current = queue.pop()!;
    if (current.value > max) {
      max = current.value;
    }
    const nextOptions = ports.filter((p) => p.numbers.includes(current.prevPort) && !current.steps.includes(p.key));
    nextOptions.forEach((o) => {
      queue.push({
        steps: current.steps.concat([o.key]),
        prevPort: o.getNextNumber(current.prevPort),
        value: current.value + o.value,
      });
    });
  }

  return max;
}

function part2(input: string): number {
  const ports = parseInput(input);
  const queue: Queue[] = [{ steps: [], prevPort: 0, value: 0 }];
  let max = 0;
  let maxLength = 0;
  while (queue.length) {
    const current = queue.pop()!;
    if (current.steps.length > maxLength) {
      maxLength = current.steps.length;
      max = current.value;
    } else if (current.steps.length == maxLength && current.value > max) {
      max = current.value;
    }
    const nextOptions = ports.filter((p) => p.numbers.includes(current.prevPort) && !current.steps.includes(p.key));
    nextOptions.forEach((o) => {
      queue.push({
        steps: current.steps.concat([o.key]),
        prevPort: o.getNextNumber(current.prevPort),
        value: current.value + o.value,
      });
    });
  }

  return max;
}

const t1 = part1(test);
if (t1 === 31) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 19) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t1);
}

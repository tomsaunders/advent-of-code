#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 11
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid, mapNum } from "./util";
const input = fs.readFileSync("input11.txt", "utf8");
const test = `125 17`;

function parseInput(input: string): StoneManager {
  return new StoneManager(input);
}

class StoneManager {
  state: Record<string, number> = {};
  memo: Record<string, number[]> = {};

  constructor(input: string) {
    const bits = input.split(" ").map(mapNum);
    bits.forEach((b) => {
      this.state[b] = 1;
    });
  }

  public get length(): number {
    return arrSum(Object.values(this.state));
  }

  public blink(): void {
    const nu: Record<number, number> = {};
    function add(num: number, count: number) {
      if (!nu[num]) nu[num] = 0;
      nu[num] += count;
    }

    Object.entries(this.state).forEach(([num, count]) => {
      const [a, b] = this.getNextMemo(num);
      add(a, count);
      if (b !== undefined) add(b, count);
    });

    this.state = nu;
  }

  public getNextMemo(num: string): number[] {
    if (!this.memo[num]) {
      this.memo[num] = this.getNext(num);
    }
    return this.memo[num];
  }

  public getNext(str: string): number[] {
    const s = parseInt(str);
    const l = str.length;

    if (s === 0) {
      return [1];
    } else if (l % 2 === 0) {
      return [
        parseInt(str.substring(0, l / 2)),
        parseInt(str.substring(l / 2)),
      ];
    } else {
      return [s * 2024];
    }
  }
}

function part1(input: string, iterations = 25): number {
  let stones = parseInput(input);
  for (let i = 0; i < iterations; i++) {
    const n: number[] = [];
    stones.blink();
  }
  return stones.length;
}

function part2(input: string): number {
  return part1(input, 75);
}

const t = part1(test);
if (t == 55312) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
console.log("part 2 answer", part2(input));

#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input6.txt", "utf8");
const test = fs.readFileSync("test6.txt", "utf8");

class LanternFish {
  public timer: number;
  constructor(start: string, public pool: LanternFish[]) {
    this.timer = parseInt(start, 10);
    this.pool.push(this);
  }

  public tick(): void {
    if (this.timer === 0) {
      new LanternFish("8", this.pool);
      this.timer = 6;
    } else {
      this.timer--;
    }
  }
}

function part1(input: string): number {
  const lines = input.split(",");
  const pool: LanternFish[] = [];
  lines.forEach((l) => new LanternFish(l, pool));

  let time = 0;
  while (time < 80) {
    const c = pool.length;
    for (let i = 0; i < c; i++) {
      pool[i].tick();
    }
    time++;
  }

  return pool.length;
}

const t1 = part1(test);
if (t1 === 5934) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function notfactorialize(num: number): number {
  var result = num;
  if (num === 0 || num === 1) return 1;
  while (num > 1) {
    num--;
    result += num;
  }
  return result;
}

function part2(input: string): number {
  const numbers = input.split(",").map((n) => parseInt(n, 10));
  let map: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 9; i++) map[i] = 0;

  numbers.forEach((n) => map[n]++);

  for (let t = 0; t < 256; t++) {
    let nuMap: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 9; i++) {
      if (i === 0) {
        nuMap[6] = map[i];
        nuMap[8] = map[i];
      } else {
        nuMap[i - 1] += map[i];
      }
    }
    map = nuMap;
  }
  return map.reduce((sum, n) => sum + n, 0);
}

const t2 = part2(test);
if (t2 === 26984457539) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

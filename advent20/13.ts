#!/usr/bin/env ts-node
import { arrSum, test, Grid, Cell } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input13.txt", "utf8");
const testIn = `F10
N3
F7
R90
F11`.split("\n");

const lines = input.split("\n");

const inputTime = 1001612;
const inputBuses = "19,x,x,x,x,x,x,x,x,41,x,x,x,37,x,x,x,x,x,821,x,x,x,x,x,x,x,x,x,x,x,x,13,x,x,x,17,x,x,x,x,x,x,x,x,x,x,x,29,x,463,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23"
  .split(",")
  .filter((x) => x !== "x")
  .map((x) => parseInt(x, 10));

const b = inputBuses.map((x) => Math.ceil(inputTime / x) * x);
b.sort((a, b) => a - b);

let min = 99999;
let minB = 0;
for (const b of inputBuses) {
  const first = Math.ceil(inputTime / b) * b;
  const wait = first - inputTime;
  if (wait < min) {
    min = wait;
    minB = b;
  }
}

console.log(min * minB);

function part2(input: string): number {
  const arr = input.split(",");
  const pairs: [number, number][] = [];

  let max = 0;
  let maxMod = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== "x") {
      const n = parseInt(arr[i]);
      const m = i ? n - (i % n) : 0;
      if (n > max) {
        max = n;
        maxMod = m;
      }
      pairs.push([n, m]);
    }
  }

  let mult = max;
  const start = max + maxMod;
  console.log("mult", mult);

  let running = true;
  let num = start;
  const seen = new Set<number>();
  seen.add(max);
  while (running) {
    num += mult;
    const match = pairs.every((v) => {
      const [bus, mod] = v;
      const m = num % bus;
      if (m === mod && !seen.has(bus)) {
        console.log("at ", num, "bus ", bus, "is correct", m, mod);
        mult *= bus;
        seen.add(bus);
      }

      return m === mod;
    });
    running = !match;
  }
  return num;
}

// test(1068781, part2("7,13,x,x,59,x,31,19"));
test(3417, part2("17,x,13,19"));

test(754018, part2("67,7,59,61"));
test(779210, part2("67,x,7,59,61"));
test(1261476, part2("67,7,x,59,61"));
test(1202161486, part2("1789,37,47,1889"));
console.log(
  "Part 2",
  part2(
    "19,x,x,x,x,x,x,x,x,41,x,x,x,37,x,x,x,x,x,821,x,x,x,x,x,x,x,x,x,x,x,x,13,x,x,x,17,x,x,x,x,x,x,x,x,x,x,x,29,x,463,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23"
  )
);

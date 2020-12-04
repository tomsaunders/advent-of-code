#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input13.txt", "utf8");
function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

function permute(finished: any[][], options: any[], progress: any[]): void {
  if (options.length === 0) {
    finished.push(progress);
    return;
  }
  for (let i = 0; i < options.length; i++) {
    const next = options[i];
    const branch = [...progress];
    branch.push(next);

    const rest = [...options];
    rest.splice(i, 1);

    permute(finished, rest, branch);
  }
}
function permutations(arr: any[]): any[][] {
  const all: any[][] = [];
  permute(all, arr, []);

  return all;
}

const names = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eric",
  "Frank",
  "George",
  "Mallory"
];
const testNames = names.slice(0, 4);
const test1 = `Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.`;

function happyMap(input: string): Map<string, number> {
  const m = new Map<string, number>();
  input.split("\n").forEach(line => {
    const bits = line
      .replace("would ", "")
      .replace("happiness units by sitting next to ", "")
      .replace(".", "")
      .split(" ");
    let value = parseInt(bits[2], 10);
    if (bits[1] === "lose") value *= -1;

    const key = `${bits[0]}-${bits[3]}`;
    m.set(key, value);
  });
  return m;
}

function mostHappy(names: string[], map: Map<string, number>): number {
  let maxHappy = 0;
  const perms = permutations(names);

  for (const perm of perms) {
    let happy = 0;
    const l = perm.length;
    perm.push(perm[0]);
    for (let i = 0; i < l; i++) {
      const a = perm[i];
      const b = perm[i + 1];
      const k1 = `${a}-${b}`;
      const k2 = `${b}-${a}`;
      happy += map.get(k1) || 0;
      happy += map.get(k2) || 0;
    }
    maxHappy = Math.max(maxHappy, happy);
  }

  return maxHappy;
}

const testMap = happyMap(test1);
test(330, mostHappy(testNames, testMap));
console.log("Part 1: ", mostHappy(names, happyMap(input)));
console.log("Part 2: ", mostHappy([...names, "Me"], happyMap(input)));
// console.log(testNames);
// console.log(permutations(testNames));

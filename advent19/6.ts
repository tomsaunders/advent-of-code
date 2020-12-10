#!/usr/bin/env ts-node
import * as fs from "fs";
import { stringify } from "querystring";
const input = fs.readFileSync("input6.txt", "utf8") as string;

const testInput: string = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;

function orbits(input: string): number {
  const lines = input.split("\n");
  let count = 0;
  const com = "COM";
  const map: Map<string, string> = new Map<string, string>();
  const points: Set<string> = new Set<string>();
  for (const line of lines) {
    const bits = line.split(")");
    map.set(bits[1], bits[0]);
    points.add(bits[1]);
  }
  const planets = Array.from(points);
  for (const planet of planets) {
    let orbit = map.get(planet) as string;
    // console.log(`${count}... ${planet} to ${orbit}`);
    count++;
    while (orbit !== com) {
      orbit = map.get(orbit) as string;
      count++;
    }
  }

  return count;
}

function test(a: any, b: any): void {
  const o = a == b ? "Test pass" : "Test fail";
  console.log(o, a);
}

test(42, orbits(testInput));

console.log("Answer");
console.log(orbits(input));

console.log("\n\nPART 2\n\n");

function transfer(input: string): number {
  const lines = input.split("\n");
  let count = 0;
  const com = "COM";
  const you = "YOU";
  const san = "SAN";
  const map: Map<string, string> = new Map<string, string>();
  const points: Set<string> = new Set<string>();
  for (const line of lines) {
    const bits = line.split(")");
    map.set(bits[1], bits[0]);
    points.add(bits[1]);
  }
  let orbit = map.get(you) as string;
  const youMap: Map<string, number> = new Map<string, number>();
  count = 0;
  while (orbit !== com) {
    orbit = map.get(orbit) as string;
    count++;
    youMap.set(orbit, count);
    // console.log(`from you, ${orbit} .. ${count}`);
  }
  orbit = map.get(san) as string;
  count = 0;
  while (orbit !== com) {
    orbit = map.get(orbit) as string;
    count++;
    if (youMap.has(orbit)) {
      const youCount = youMap.get(orbit) as number;
      // console.log(
      //   "YOU path to ",
      //   orbit,
      //   "was",
      //   youCount,
      //   "sanpath was",
      //   count,
      //   "total is",
      //   count + youCount
      // );
      return count + youCount;
    }
  }
  return 9999;
}

const test2Input: string = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`;

test(4, transfer(test2Input));

console.log("Answer", transfer(input));

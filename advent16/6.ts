#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");

const testIn = `eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`.split("\n");
const lines = input.split("\n");

function mostFreq(lines: string[]): string {
  const count = lines[0].trim().length;
  const dists: string[][] = [];

  while (dists.length < count) dists.push([]);
  for (const line of lines) {
    for (let i = 0; i < count; i++) {
      dists[i].push(line[i]);
    }
  }
  let freq = "";
  const letters = "abcdefghilmnopqrstuvwxyz".split("");

  for (const d of dists) {
    let max = 0;
    let maxL = "";
    for (const l of letters) {
      const c = d.filter((x) => x === l).length;
      if (c > max) {
        max = c;
        maxL = l;
      }
    }
    freq += maxL;
  }

  return freq;
}

function leastFreq(lines: string[]): string {
  const count = lines[0].trim().length;
  const dists: string[][] = [];

  while (dists.length < count) dists.push([]);
  for (const line of lines) {
    for (let i = 0; i < count; i++) {
      dists[i].push(line[i]);
    }
  }
  let freq = "";
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  for (const d of dists) {
    let min = 999;
    let minL = "";
    for (const l of letters) {
      const c = d.filter((x) => x === l).length;
      if (c > 0 && c < min) {
        min = c;
        minL = l;
      }
    }
    freq += minL;
  }

  return freq;
}

test("easter", mostFreq(testIn));
console.log("Part One", mostFreq(lines));
test("advent", leastFreq(testIn));
console.log("Part Two", leastFreq(lines));

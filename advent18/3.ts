#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 3
 *
 * Summary:
 * Escalation:
 * Solution:
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input3.txt", "utf8");
const test = `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`;

interface Fabric {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  overlap: boolean;
}

function parseInput(input: string): Fabric[] {
  return input.split("\n").map((line) => {
    const [id, at, coord, dim] = line.split(" ");
    const [left, top] = coord.split(",").map(mapNum);
    const [width, height] = dim.split("x").map(mapNum);
    return { id, left, top, width, height, overlap: false };
  });
}

function part1(input: string): number {
  const things = parseInput(input);
  const m: Record<string, number> = {};

  function place(x: number, y: number) {
    const k = `${x}:${y}`;
    if (!m[k]) m[k] = 0;
    m[k]++;
  }

  things.forEach((f) => {
    for (let i = 0; i < f.width; i++) {
      for (let j = 0; j < f.height; j++) {
        place(f.left + i, f.top + j);
      }
    }
  });
  return Object.values(m).filter((m) => m > 1).length;
}

function part2(input: string): number {
  const things = parseInput(input);
  const m: Record<string, number> = {};
  const mf: Record<string, Fabric> = {};

  function place2(x: number, y: number, f: Fabric) {
    const k = `${x}:${y}`;
    if (!m[k]) m[k] = 0;
    m[k]++;
    if (mf[k]) {
      mf[k].overlap = f.overlap = true;
    }
    mf[k] = f;
  }

  things.forEach((f) => {
    for (let i = 0; i < f.width; i++) {
      for (let j = 0; j < f.height; j++) {
        place2(f.left + i, f.top + j, f);
      }
    }
  });
  return parseInt(things.find((f) => !f.overlap)?.id.replace("#", "")!);
}

const t = part1(test);
if (t === 4) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 3) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
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
const input = fs.readFileSync("input9.txt", "utf8");
const test = `2333133121414131402`;

type File = {
  id: number;
  blocks: number;
};

function parseInput(input: string): number[] {
  const bits = input.split("").map(mapNum);
  const sum = arrSum(bits);
  const filesystem = new Array(sum);

  let id = 0;
  let fs = 0;
  for (let i = 0; i < bits.length; i++) {
    const num = bits[i];
    if (i % 2 === 0) {
      // file
      for (let x = 0; x < num; x++) filesystem[fs++] = id;
      id++;
    } else {
      // space
      for (let x = 0; x < num; x++) filesystem[fs++] = undefined;
    }
  }
  return filesystem;
}

function part1(input: string): number {
  const fs = parseInput(input);
  for (let i = 0; i < fs.length; i++) {
    if (fs[i] === undefined) {
      let j = fs.length - 1;
      while (fs[j] === undefined) j--;
      fs[i] = fs[j];
      fs[j] = undefined as any;
    }
  }
  return arrSum(fs.filter((x) => x !== undefined).map((x, i) => x * i));
}

function parseInput2(input: string): File[] {
  const bits = input.split("").map(mapNum);
  const files = bits.map((blocks, i) => {
    const id = Math.floor(i / 2);
    if (i % 2 === 0) {
      return { id, blocks };
    } else {
      return { id: -99, blocks };
    }
  });
  return files;
}

function part2(input: string): number {
  const fs = parseInput2(input);
  const other = [] as number[];
  for (let i = 0; i < fs.length; i++) {
    if (fs[i].id === -99) {
      let rem = fs[i].blocks;
      let j = fs.length - 1;
      while (rem && j > i) {
        if (fs[j].id !== -99 && fs[j].blocks <= rem) {
          for (let x = 0; x < fs[j].blocks; x++) {
            other.push(fs[j].id);
          }
          fs[j].id = -99;
          rem -= fs[j].blocks;
        }
        j--;
      }
      for (let x = 0; x < rem; x++) other.push(0);
    } else {
      for (let x = 0; x < fs[i].blocks; x++) {
        other.push(fs[i].id);
      }
    }
  }
  return arrSum(other.map((x, i) => (x || 0) * i));
}

const t = part1(test);
if (t == 1928) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 2858) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

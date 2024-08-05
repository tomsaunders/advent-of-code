#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 21
 *
 * Summary: Game of life style projection where the size expands every loop
 * Escalation: Do more loops
 * Solution: Lots of array transposing and flipping, then fiddly logic to create the expanded grid. Slow but only 10s to get to the part 2 answer.
 *
 * Keywords:
 * References:
 */
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input21.txt", "utf8");
const test: string = `../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#`;

const startPattern = `.#.
..#
###`;

// turn   into
// 123    741
// 456    852
// 789    963
function transpose(input: string[]): string[] {
  const size = input.length;
  const out: string[] = new Array(size).fill("");
  for (let j = 0; j < size; j++) {
    for (let i = 1; i <= size; i++) {
      out[j] += input[size - i][j];
    }
  }
  return out;
}

// turn   into
// 123    321
// 456    654
// 789    987
function flip(input: string[]): string[] {
  return input.map((row) => row.split("").reverse().join(""));
}

// turn   into
// 123    123/456/789
// 456
// 789
function key(input: string[]): string {
  return input.join("/");
}

function parseInput(input: string): Record<string, string> {
  const rules: Record<string, string> = {};
  input.split("\n").forEach((line) => {
    const [i, o] = line.split(" => ");
    rules[i] = o;
  });
  return rules;
}

function fractalArt(input: string, iterations = 5): number {
  const rules = parseInput(input);

  function matchRule(slice: string[]): string[] {
    const permuations = [];
    permuations.push(slice, flip(slice));
    slice = transpose(slice);
    permuations.push(slice, flip(slice));
    slice = transpose(slice);
    permuations.push(slice, flip(slice));
    slice = transpose(slice);
    permuations.push(slice, flip(slice));
    for (let p = 0; p < permuations.length; p++) {
      const k = key(permuations[p]);
      if (rules[k]) {
        return rules[k].split("/");
      }
    }
    return [];
  }

  let grid = startPattern.split("\n");
  for (let i = 0; i < iterations; i++) {
    const nuGrid: string[] = [];
    let size = 3;
    if (grid.length % 2 === 0) {
      size = 2;
    }

    const squares = grid.length / size;
    for (let a = 0; a < squares; a++) {
      for (let b = 0; b < squares; b++) {
        const slice: string[] = new Array(size).fill("");
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            slice[y] += grid[a * size + y][b * size + x];
          }
        }
        const converted = matchRule(slice);
        if (b === 0) {
          nuGrid.push(...converted);
        } else {
          for (let c = 0; c < converted.length; c++) {
            nuGrid[nuGrid.length - converted.length + c] += converted[c];
          }
        }

        // console.log(a, b, slice.join("\n"));
      }
    }

    grid = nuGrid;
    console.log(i, "|", arrSum(grid.map((r) => r.split("").filter((c) => c === "#").length)));
  }
  return arrSum(grid.map((r) => r.split("").filter((c) => c === "#").length));
}

const t1 = fractalArt(test, 2);
if (t1 === 12) {
  console.log("part 1 answer", fractalArt(input));
  console.log("part 2 answer", fractalArt(input, 18));
} else {
  console.log("part 1 test fail", t1);
}

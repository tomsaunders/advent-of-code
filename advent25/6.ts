#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day x
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
import { arrProd, arrSum, Cell, Grid, mapNum } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");
const test = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

type Problem = {
  nums: number[];
  strings: string[];
  operation: "+" | "*";
};

function parseInput(input: string): Problem[] {
  const lines = input.split("\n");
  const o = lines.length - 1;
  const problems: Problem[] = [];
  const magicMap = new Array(o).fill(0).map((v, i) => i);

  const operationLine = lines[o].split("");
  let colStart = 0;
  let operation: "+" | "*" = operationLine[0] as any;
  for (let i = 0; i < operationLine.length; i++) {
    const c = operationLine[i];
    if (c === "+" || c === "*") {
      // this is an operation, lets make problems
      if (i - colStart > 0) {
        const strings = magicMap.map((l) =>
          lines[l].substring(colStart, i - 1),
        );

        const problem: Problem = {
          nums: strings.map(mapNum),
          strings,
          operation,
        };
        problems.push(problem);
        operation = c;
      }

      colStart = i;
    }
  }
  // handle the last number
  const strings = magicMap.map((l) => lines[l].substring(colStart));

  const problem: Problem = {
    nums: strings.map(mapNum),
    strings,
    operation,
  };
  problems.push(problem);
  return problems;
}

function part1(input: string): number {
  const problems = parseInput(input);
  return arrSum(
    problems.map((problem) => {
      if (problem.operation === "+") {
        return arrSum(problem.nums);
      } else if (problem.operation === "*") {
        return arrProd(problem.nums);
      }
      return 0;
    }),
  );
}

function getNums(problem: Problem): number[] {
  const nums: string[] = [];
  for (let i = 0; i < problem.strings[0].length; i++) {
    let num = "";
    for (let s = 0; s < problem.strings.length; s++) {
      num += problem.strings[s][i];
    }
    nums.push(num);
  }
  return nums.map((n) => parseInt(n));
}

function part2(input: string): number {
  const problems = parseInput(input);
  return arrSum(
    problems.map((problem) => {
      const nums = getNums(problem);
      if (problem.operation === "+") {
        return arrSum(nums);
      } else if (problem.operation === "*") {
        return arrProd(nums);
      }
      return 0;
    }),
  );
}

const t = part1(test);
if (t == 4277556) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 3263827) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

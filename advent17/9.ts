#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 9
 *
 * Summary: String parsing - calculate score of a string based on its nesting of brackets
 * Escalation: Count the ignored 'garbage' in a string
 * Solution: Basic parsing and looping - keeping track of the nesting level in p1 and just counting chars in p2
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input9.txt", "utf8");
const test: Record<string, number> = {
  "{}": 1,
  "{{{}}}": 6,
  "{{},{}}": 5,
  "{{{},{},{{}}}}": 16,
  "{<a>,<a>,<a>,<a>}": 1,
  "{{<ab>},{<ab>},{<ab>},{<ab>}}": 9,
  "{{<!!>},{<!!>},{<!!>},{<!!>}}": 9,
  "{{<a!>},{<a!>},{<a!>},{<ab>}}": 3,
};

const test2: Record<string, number> = {
  "<>": 0,
  "<random characters>": 17,
  "<<<<>": 3,
  "<{!>}>": 2,
  "<!!>": 0,
  "<!!!>>": 0,
  '<{o"i!a,<{i<a>': 10,
};

function parseInput(input: string): string[] {
  return input.split("\n").map((line) => {
    let cleanLine: string[] = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "!") {
        i++;
      } else {
        cleanLine.push(line[i]);
      }
    }
    return cleanLine.join("");
  });
}

function part1(input: string): number {
  const lines = parseInput(input);
  return arrSum(
    lines.map((line) => {
      let stack = [];
      let score = 0;
      let garbage = false;
      const arr = line.split("");
      while (arr.length) {
        const c = arr.shift()!;
        if (garbage) {
          if (c === ">") {
            garbage = false;
          }
        } else {
          if (c === "<") {
            garbage = true;
          } else if (c === "{") {
            stack.push(c);
          } else if (c === "}") {
            score += stack.length;
            stack.pop();
          }
        }
      }

      return score;
    })
  );
}

function part2(input: string): number {
  const lines = parseInput(input);
  return arrSum(
    lines.map((line) => {
      let score = 0;
      let garbage = false;
      let gStart = 0;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (garbage) {
          if (c === ">") {
            garbage = false;
            score += i - gStart;
          }
        } else {
          if (c === "<") {
            garbage = true;
            gStart = i + 1;
          }
        }
      }

      return score;
    })
  );
}

if (Object.entries(test).every(([input, result]) => part1(input) === result)) {
  console.log("part 1 answer", part1(input));
  if (
    Object.entries(test2).every(([input, result]) => part2(input) === result)
  ) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log(
      "part 2 test fail",
      Object.entries(test2).map(([input, result]) => [
        part2(input),
        "===",
        result,
      ])
    );
  }
} else {
  console.log(
    "part 1 test fail",
    Object.entries(test).map(([input, result]) => [part1(input), "===", result])
  );
}

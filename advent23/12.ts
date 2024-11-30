#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 12
 *
 * Summary: Check the possible combinations for a row of characters that matches a rule, given that some ? characters are unknown
 * Escalation: Make the character row and rule 5x larger
 * Naive:  Calculate all permutations of the string and see which match the rule
 * Solution: Recursion and memoization.
 * 1. For each position in the string, see if the first rule can match and then
 * 2. recurse with the remaining substring, else proceed.
 * 3. The memoization helps greatly because the unique starting strings break down in to previously seen combinations
 *
 * Keywords: Recursion, Memoization
 * References: https://old.reddit.com/r/adventofcode/comments/18ge41g/2023_day_12_solutions/
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input12.txt", "utf8");
const test = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

// ? unknown
// . off - space between groups
// # on - part of a group
const UNK = "?";
const OFF = ".";
const ON = "#";

function parseInput(input: string): [string, number[]][] {
  return input.split("\n").map((line) => {
    const [condition, expectedGroups] = line.split(" ");
    return [condition, expectedGroups.split(",").map(mapNum)];
  });
}

function part1(input: string): number {
  const records = parseInput(input);
  return records.reduce((sum, [condition, expectedGroups]) => {
    const row = condition;
    const count = getArrangementsMatchingGroups(row, expectedGroups);
    return sum + count;
  }, 0);
}

const memory = new Map<string, number>();
// basically a memoize cache
function getArrangementsMatchingGroups(row: string, groups: number[]): number {
  const args = `${row}+${groups.join(",")}`;
  if (!memory.has(args)) {
    memory.set(args, countArrangementsMatchingGroups(row, groups));
  }
  return memory.get(args)!;
}

function countArrangementsMatchingGroups(row: string, groups: number[]): number {
  // basically at each spot in the string, ask if the first group can be placed there.
  // if true, move along to the next group
  if (row.length === 0) {
    // no remaining row or groups : ok
    return groups.length === 0 ? 1 : 0;
  }
  if (groups.length === 0) {
    // no more groups but an unhandled item: bad
    return row.includes(ON) ? 0 : 1;
  }

  let count = 0;
  const nextGroupLength = groups[0];
  for (let i = 0; i <= row.length - nextGroupLength; i++) {
    // for each character in the row, decide if the next group starts here
    if (row[i] === OFF) {
      continue; // no group starts with an off...
    }

    const possibleEnd = i + nextGroupLength;
    const rowGroup = row.slice(i, possibleEnd);
    if (!rowGroup.includes(OFF) && row[possibleEnd] !== ON) {
      // the next group could start here! recurse with the remainder of the string and groups.

      const nextGroups = groups.slice(1);
      // if there are more groups to process, add a character for the necessary space.
      const nextStart = nextGroups.length ? possibleEnd + 1 : possibleEnd;

      count += getArrangementsMatchingGroups(row.slice(nextStart), groups.slice(1));
    }
    if (row[i] === ON) {
      // this should be the start of the next group, so abandon the idea of moving on.
      // either it worked on this loop (handled in previous block) or its a total fail
      break;
    }
  }
  return count;
}

function part2(input: string): number {
  const records = parseInput(input);
  return records.reduce((sum, [condition, expectedGroups]) => {
    const row5 = Array(5).fill(condition).join(UNK);
    const group5 = Array(5).fill(expectedGroups);
    const count = getArrangementsMatchingGroups(row5, [].concat(...group5));
    return sum + count;
  }, 0);
}

const t = part1(test);
if (t == 21) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 525152) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, PURP, RED, RESET, YELLOW, arrSum, mapNum } from "./util";
const input = fs.readFileSync("input12.txt", "utf8");
const test = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

// ? unk
// . good
// # bad
const UNK = "?";
const GOD = ".";
const BAD = "#";

function permutationsOfRowMatchingGroup(row: string, group: string): number {
  const perms = permutationsOfRow(row);
  const permGroups = perms.map((p) =>
    p
      .split(GOD)
      .map((sub) => sub.length)
      .filter((len) => len > 0)
      .join(",")
  );

  return permGroups.filter((pg) => pg === group).length;
}

function appendToWholeArray(array: string[], char: string): string[] {
  let out = array.slice(0);
  for (let i = 0; i < array.length; i++) {
    out[i] += char;
  }
  return out;
}

function permutationsOfRow(row: string): string[] {
  let perms: string[] = [""];
  row.split("").forEach((char) => {
    if (char === UNK) {
      perms = appendToWholeArray(perms, GOD).concat(appendToWholeArray(perms, BAD));
    } else {
      perms = appendToWholeArray(perms, char);
    }
  });

  // console.log(`Returning ${perms.length} perms`);
  return perms;
}

function improveRow(row: string, group: string): string {
  const groups = group.split(",").map(mapNum);
  const firstGroup = groups.shift() as number;
  const lastGroup = groups.pop() as number;

  let arr = row.split("");
  while (arr[0] == GOD) {
    arr.shift();
  }
  while (arr[arr.length - 1] == GOD) {
    arr.pop();
  }
  if (arr[0] == BAD) {
    for (let i = 0; i < firstGroup; i++) arr[i] = BAD;
    arr[firstGroup] = GOD;
  }
  if (arr[arr.length - 1] == BAD) {
    for (let i = 0; i < lastGroup; i++) arr[arr.length - 1 - i] = BAD;
    arr[arr.length - 1 - lastGroup] = GOD;
  }

  const r = arr.join("");

  return r;
}

function part1(input: string): number {
  const lines = input.split("\n");
  const combos = lines.map((line) => {
    const [row, group] = line.split(" ");

    return permutationsOfRowMatchingGroup(improveRow(row, group), group);
  });

  return arrSum(combos);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const combos = lines.map((row) => {
    const [c1, g1] = row.split(" ");
    const c5 = `${c1}?${c1}?${c1}?${c1}?${c1}`;
    const g5 = `${g1},${g1},${g1},${g1},${g1}`;

    return permutationsOfRowMatchingGroup(c5, g5);
  });

  return arrSum(combos);
}

const t = part1(test);
if (t == 21) {
  console.log("part 1 answer", part1(input));

  // const t2 = part2(test);
  // if (t2 == 525152) {
  //   console.log("part 2 answer", part2(input));
  // } else {
  //   console.log("part 2 test fail", t2);
  // }
} else {
  console.log("part 1 test fail", t);
}

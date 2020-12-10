#!/usr/bin/env ts-node
import { arrSum, test } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input6.txt", "utf8");
const lines = input.split("\n");

const groups: string[] = [];
const letters = "abcdefghijklmnopqrstuvwxyz".split("");
let group = "";

const groups2: string[] = [];
let group2 = "";

for (const l of lines) {
  const line = l.trim();
  // console.log(line, group2);
  if (line) {
    group += line;
    if (!group2) group2 = line;
    else {
      let tmp = "1";
      for (const a of group2.split("")) {
        // console.log(`Does ${line} have ${a}`);
        if (line.includes(a)) tmp += a;
      }
      group2 = tmp;
    }
  } else {
    groups.push(group);
    group = "";
    groups2.push(group2);
    group2 = "";
  }
}
groups.push(group);
groups2.push(group2);

const numbers = groups.map((l) => {
  let sum = 0;
  for (const c of letters) if (l.includes(c)) sum++;
  return sum;
});
console.log("Part one", arrSum(numbers));

const numbers2 = groups2.map((l) => {
  let sum = 0;
  for (const c of letters) if (l.includes(c)) sum++;
  console.log(l, sum);
  return sum;
});
console.log("Part two", arrSum(numbers2));

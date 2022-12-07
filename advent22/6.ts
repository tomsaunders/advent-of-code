#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");

function getMarker(input: string, length: number = 4): number {
  for (let i = length; i <= input.length; i++) {
    const sub = input.substring(i - length, i);
    const set = new Set(sub.split(""));
    if (set.size === length) return i;
  }
  return 0;
}

function part1(input: string): number {
  return getMarker(input, 4);
}

function part2(input: string): number {
  return getMarker(input, 14);
}

console.log("part1");
console.log(part1("bvwbjplbgvbhsrlpgdmjqwftvncz"));
console.log(part1("nppdvjthqldpwncqszvftbrmjlhg"));
console.log(part1("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"));
console.log(part1("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"));
console.log(part1(input));
console.log("part2");
console.log(part2("mjqjpqmgbljsphdztnvjfqwrcgsmlb"));
console.log(part2("bvwbjplbgvbhsrlpgdmjqwftvncz"));
console.log(part2("nppdvjthqldpwncqszvftbrmjlhg"));
console.log(part2("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"));
console.log(part2("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"));
console.log(part2(input));

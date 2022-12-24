#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input13.txt", "utf8");

const test = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

function inRightOrder(first: Nest, second: Nest): boolean | undefined {
  // console.log("   compare", first, second);
  if (!Array.isArray(first) && !Array.isArray(second)) {
    if (first === second) return undefined;
    return first < second;
  }
  if (!Array.isArray(first)) first = [first];
  if (!Array.isArray(second)) second = [second];

  const count = Math.max(first.length, second.length);
  for (let i = 0; i < count; i++) {
    if (first[i] === undefined) {
      return true; // left ran out
    } else if (second[i] === undefined) {
      return false; // right ran out of room
    }
    const compare: boolean | undefined = inRightOrder(first[i], second[i]);
    if (compare !== undefined) {
      return compare;
    }
  }
}

type Nest = number | number[];
class Pair {
  public first: Nest;
  public second: Nest;

  constructor(public index: number, lines: string[]) {
    this.first = eval(lines[0]);
    this.second = eval(lines[1]);
  }

  public get inRightOrder(): boolean {
    const right = inRightOrder(this.first, this.second) as boolean;
    // console.log(right ? "right order" : "wrong order", this.index);
    return right;
  }
}

function part1(input: string): number {
  const pairs: Pair[] = [];
  const lines = input.split("\n");
  for (let i = 0; i < lines.length; i += 3) {
    pairs.push(new Pair(pairs.length + 1, lines.slice(i, i + 2)));
  }
  return arrSum(pairs.filter((p) => p.inRightOrder).map((p) => p.index));
}

function part2(input: string): number {
  const lines: Nest[] = input
    .split("\n")
    .filter((l) => l.trim().length !== 0)
    .map((l) => eval(l));
  const two = [[2]] as any;
  const six = [[6]] as any;
  lines.push(two);
  lines.push(six);
  lines.sort((a, b): number => {
    return inRightOrder(a, b) ? -1 : 1;
  });
  return (1 + lines.indexOf(two)) * (1 + lines.indexOf(six));
}
console.log(
  "test 1",
  part1(`[[1,1],1]
[[1,1],2]`)
);
console.log(
  "test 1",
  part1(`[[1,1],2]
[[1,1],1]`)
);
const t1 = part1(test);
if (t1 === 13) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 140) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell } from "./util";
const input = fs.readFileSync("input18.txt", "utf8");
const test = fs.readFileSync("test18.txt", "utf8");

function part1(input: string): number {
  const final = resultList(input);
  return magnitude(final);
}

type Smallfish = (string | number)[];

function makeArray(input: string): Smallfish {
  const a = [];
  let n = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (isNumber(c)) {
      n = `${n}${c}`;
    } else {
      if (n) a.push(parseInt(n, 10));
      a.push(c);
      n = "";
    }
  }
  return a;
}

function isNumber(c: string | number): boolean {
  return typeof c !== "string" || !["[", "]", ","].includes(c);
}

function isSmallFish(array: Smallfish, pos: number) {
  const fish = array.slice(pos, pos + 5);

  const is =
    fish.length === 5 &&
    fish[0] === "[" &&
    isNumber(fish[1]) &&
    fish[2] === "," &&
    isNumber(fish[3]) &&
    fish[4] === "]";
  return is;
}

function getLeftNumber(before: Smallfish): number | false {
  for (let i = before.length - 1; i > 0; i--) {
    if (isNumber(before[i])) {
      return i;
    }
  }
  return false;
}

function getRightNumber(after: Smallfish): number | false {
  for (let i = 0; i < after.length; i++) {
    if (isNumber(after[i])) {
      return i;
    }
  }
  return false;
}

function add(left: string, right: string): string {
  return `[${left},${right}]`;
}

function result(left: string, right: string): string {
  let r = add(left, right);
  let e = explode(r);
  let s = split(r);
  while (r !== e || r !== s) {
    let next = r;
    if (r !== e) {
      next = e;
    } else if (r !== s) {
      next = s;
    }
    r = next;
    e = explode(r);
    s = split(r);
  }
  return r;
}

function resultList(input: string): string {
  const lines = input.split("\n");
  const first = lines.shift() as string;
  return lines.reduce(
    (carry: string, current: string) => result(carry, current),
    first
  );
}

function magnitude(input: string): number {
  let a = makeArray(input);
  while (a.length) {
    for (let i = 0; i < a.length; i++) {
      if (isSmallFish(a, i)) {
        const before = a.slice(0, i);
        const [, left, , right] = a.slice(i, i + 5);
        const mag = (left as number) * 3 + (right as number) * 2;
        const after = a.slice(i + 5);
        a = [...before, mag, ...after];
        i = Infinity;
        if (a.length === 1) {
          return mag;
        }
      }
    }
  }
  return 0;
}

function explode(x: string): string {
  // pair's left value is added to the first regular number to the left of the exploding pair (if any)
  // pair's right value is added to the first regular number to the right of the exploding pair (if any)
  const a = makeArray(x);
  let depth = 0;
  for (let i = 0; i < a.length; i++) {
    const c = a[i];
    if (c === "[") {
      depth++;
    } else if (c === "]") {
      depth--;
    } else if (c === ",") {
      // left right splitter
    } else {
      // number
      if (depth === 5 && isSmallFish(a, i - 1)) {
        // on the left number. look for the previous stuff.
        const before = a.slice(0, i - 1);
        const after = a.slice(i + 4);
        let thiz = "0";
        const left = getLeftNumber(before);
        if (left !== false) {
          (before[left] as number) += c as number;
        }

        const right = getRightNumber(after);
        if (right !== false) {
          (after[right] as number) += a[i + 2] as number;
        }
        return [...before, thiz, ...after].join("");
      }
    }
    // console.log(i, c, `d:${depth}`);
  }

  return a.join("");
}

function split(x: string): string {
  // split any two digit number
  const a = makeArray(x);
  for (let i = 0; i < a.length - 1; i++) {
    if (isNumber(a[i]) && a[i] > 9) {
      const before = a.slice(0, i);
      const after = a.slice(i + 1);
      const num = a[i] as number;
      const left = Math.floor(num / 2);
      const right = Math.ceil(num / 2);
      return [...before, `[${left},${right}]`, ...after].join("");
    }
  }
  return x;
}

if (add("[1,2]", "[[3,4],5]") !== "[[1,2],[[3,4],5]]") {
  console.log("Test add fail", add("[1,2]", "[[3,4],5]"));
}

const testExplode: [string, string][] = [
  ["[[[[[9,8],1],2],3],4]", "[[[[0,9],2],3],4]"],
  ["[7,[6,[5,[4,[3,2]]]]]", "[7,[6,[5,[7,0]]]]"],
  ["[[6,[5,[4,[3,2]]]],1]", "[[6,[5,[7,0]]],3]"],
  [
    "[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]",
    "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]",
  ],
  ["[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]", "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"],
];
for (const [start, end] of testExplode) {
  if (explode(start) !== end) {
    console.log(
      "Test explode fail",
      start,
      "expected",
      end,
      "got",
      explode(start)
    );
  }
}

if (
  add("[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]") !==
  "[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]"
) {
  console.log(
    "Test add big fail",
    add("[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]")
  );
}

let t0 = add("[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]");
t0 = explode(t0);
if (t0 !== "[[[[0,7],4],[7,[[8,4],9]]],[1,1]]") {
  console.log("explode 1 fail", t0);
}
t0 = explode(t0);
if (t0 !== "[[[[0,7],4],[15,[0,13]]],[1,1]]") {
  console.log("explode 2 fail", t0);
}
t0 = split(t0);
if (t0 !== "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]") {
  console.log("split 1 fail", t0);
}
t0 = split(t0);
if (t0 !== "[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]") {
  console.log("split 2 fail", t0);
}
t0 = explode(t0);
if (t0 !== "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]") {
  console.log("explode 3 fail");
}

const l1 = resultList(`[1,1]
[2,2]
[3,3]
[4,4]`);

if (l1 !== "[[[[1,1],[2,2]],[3,3]],[4,4]]") {
  console.log("list 1 fail", l1);
}

const l2 = resultList(`[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`);

if (l2 !== "[[[[3,0],[5,3]],[4,4]],[5,5]]") {
  console.log("list 2 fail", l2);
}

const l3 = resultList(`[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`);

if (l3 !== "[[[[5,0],[7,4]],[5,5]],[6,6]]") {
  console.log("list 3  fail", l3);
}

const r0 = resultList(`[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`);
if (r0 !== "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]") {
  console.log("larger example fail", r0);
}

const testMagnitudes: [string, number][] = [
  ["[9,1]", 29],
  ["[1,9]", 21],
  ["[[9,1],[1,9]]", 129],
  ["[[1,2],[[3,4],5]]", 143],
  ["[[[[0,7],4],[[7,8],[6,0]]],[8,1]]", 1384],
  ["[[[[1,1],[2,2]],[3,3]],[4,4]]", 445],
  ["[[[[3,0],[5,3]],[4,4]],[5,5]]", 791],
  ["[[[[5,0],[7,4]],[5,5]],[6,6]]", 1137],
  ["[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]", 3488],
];
for (const [t, m] of testMagnitudes) {
  if (magnitude(t) !== m) {
    console.log(`Magnitude fail ${t} should be ${m} got `, magnitude(t));
  }
}

const t1 = part1(test);
if (t1 === 4140) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 3993) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  let maxM = 0;
  const lines = input.split("\n");
  for (let a = 0; a < lines.length; a++) {
    for (let b = 0; b < lines.length; b++) {
      if (a === b) continue;
      const r = result(lines[a], lines[b]);
      maxM = Math.max(maxM, magnitude(r));
    }
  }

  return maxM;
}

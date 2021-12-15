#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input8.txt", "utf8");
const test = fs.readFileSync("test8.txt", "utf8");

function part1(input: string): number {
  const lines = input.split("\n");
  let count = 0;

  lines.forEach((l) => {
    const [left, right] = l.split(" | ");
    const bits = right.split(" ");
    count += bits.filter(
      (b) =>
        b.length === 2 || b.length === 3 || b.length === 4 || b.length === 7
    ).length;
  });

  return count;
}

const t1 = part1(test);
if (t1 === 26) {
  console.log("Part 1: ", part1(input));
} else {
  console.log("Test fail: ", t1);
}

function order(b: string): string {
  return b.split("").sort().join("");
}

function contains(search: string, haystack: string): boolean {
  const s = search.split("");
  const h = haystack.split("");
  return s.every((x) => h.includes(x));
}

function part2(input: string): number {
  const lines = input.split("\n");
  let sum = 0;
  lines.forEach((l) => {
    const [left, right] = l.split(" | ");
    const lBits = left.split(" ").map(order);
    const map: { [key: string]: string } = {};

    const one = lBits.find((b) => b.length === 2) as string;
    map[one] = "1";
    map[lBits.find((b) => b.length === 3) as string] = "7";
    const four = lBits.find((b) => b.length === 4) as string;
    map[four] = "4";
    map[lBits.find((b) => b.length === 7) as string] = "8";

    let fives = lBits.filter((b) => b.length === 5);
    let sixes = lBits.filter((b) => b.length === 6);

    const three = fives.find((x) => contains(one, x)) as string;
    map[three] = "3";
    fives = fives.filter((x) => x !== three);

    const nine = sixes.find((x) => contains(four, x)) as string;
    map[nine] = "9";
    sixes = sixes.filter((x) => x !== nine);

    const five = fives.find((x) => contains(x, nine)) as string;
    map[five] = "5";
    const two = fives.find((x) => x !== five) as string;
    map[two] = "2";

    const zero = sixes.find((x) => contains(one, x)) as string;
    map[zero] = "0";
    const six = sixes.find((x) => x !== zero) as string;
    map[six] = "6";

    const bits = right.split(" ").map(order);

    const s = parseInt(bits.map((b) => map[b]).join(""), 10);
    sum += s;
  });

  return sum;
}

const t2 = part2(test);
if (t2 === 61229) {
  console.log("Part 2: ", part2(input));
} else {
  console.log("Test2 fail: ", t2);
}

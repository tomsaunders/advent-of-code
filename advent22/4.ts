#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input4.txt", "utf8");
const test = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

class Elf {
  public start: number;
  public end: number;
  constructor(public contents: string) {
    const bits = contents.split("-");
    this.start = parseInt(bits[0], 10);
    this.end = parseInt(bits[1], 10);
  }
  public contains(other: Elf): boolean {
    return other.start >= this.start && other.end <= this.end;
  }
  public overlaps(other: Elf): boolean {
    return (
      (other.start >= this.start && other.start <= this.end) ||
      (other.end >= this.start && other.end <= this.end)
    );
  }
}

class Pair {
  public left: Elf;
  public right: Elf;
  constructor(public contents: string) {
    const bits = contents.split(",");
    this.left = new Elf(bits[0]);
    this.right = new Elf(bits[1]);
  }
  public get fullyContains(): boolean {
    return this.left.contains(this.right) || this.right.contains(this.left);
  }

  public get hasOverlap(): boolean {
    return this.left.overlaps(this.right) || this.right.overlaps(this.left);
  }
}

function getPairs(input: string): Pair[] {
  return input.split("\n").map((i) => new Pair(i));
}

function part1(input: string): number {
  const pairs = getPairs(input);
  return pairs.filter((p) => p.fullyContains).length;
}

function part2(input: string): number {
  const pairs = getPairs(input);
  return pairs.filter((p) => p.hasOverlap).length;
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

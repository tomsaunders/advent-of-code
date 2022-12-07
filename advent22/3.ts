#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input3.txt", "utf8");
const test = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

class Compartment {
  constructor(public contents: string) {}
  public findCommon(other: Compartment): string {
    for (let i = 0; i < this.contents.length; i++) {
      if (other.contents.includes(this.contents[i])) {
        return this.contents[i];
      }
    }
    return "";
  }
}

class Rucksack {
  public left: Compartment;
  public right: Compartment;
  constructor(public contents: string) {
    this.left = new Compartment(contents.substring(0, contents.length / 2));
    this.right = new Compartment(contents.substring(contents.length / 2));
  }

  public get priority(): number {
    const common = this.left.findCommon(this.right);
    return this.calculatePriority(common.charCodeAt(0));
  }

  public calculatePriority(code: number): number {
    if (code >= 97) {
      return code - 96;
    } else {
      return code - 38;
    }
  }
  public groupPriority(other: Rucksack, next: Rucksack): number {
    for (let i = 0; i < this.contents.length; i++) {
      if (
        other.contents.includes(this.contents[i]) &&
        next.contents.includes(this.contents[i])
      ) {
        return this.calculatePriority(this.contents[i].charCodeAt(0));
      }
    }
    return 0;
  }
}

function getRucks(input: string): Rucksack[] {
  return input.split("\n").map((i) => new Rucksack(i));
}

function part1(input: string): number {
  const rucks = getRucks(input);
  return arrSum(rucks.map((r) => r.priority));
}

function part2(input: string): number {
  const rucks = getRucks(input);
  const pts: number[] = [];
  for (let i = 0; i < rucks.length; i += 3) {
    pts.push(rucks[i].groupPriority(rucks[i + 1], rucks[i + 2]));
  }
  return arrSum(pts);
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

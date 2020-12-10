#!/usr/bin/env ts-node
import { arrSum, test } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input7.txt", "utf8");

const testIn = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

const goal = "shiny gold";

class Rule {
  public colour: string;
  public contents: Map<string, number>;
  constructor(line: string) {
    this.contents = new Map<string, number>();
    const bits = line.split(" bags contain ");
    this.colour = bits[0];
    const contents = bits[1].replace(".", "");
    if (contents !== "no other bags") {
      const opts = contents.split(", ");
      for (const o of opts) {
        const b = o.replace(" bags", " bag").replace(" bag", " ").split(" ");
        const num = parseInt(b.shift() as string, 10);
        const c = b.join(" ").trim();
        this.contents.set(c, num);
      }
    }
  }
}

const test2In = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

const lines = input.split("\n");
const rules = lines.map((l) => new Rule(l));
const index = new Map<string, Rule>();
for (const r of rules) {
  index.set(r.colour, r);
}

function findParents(goal: string): string[] {
  const parents: string[] = [];
  for (const r of rules) {
    if (r.contents.has(goal)) {
      parents.push(r.colour);
      parents.push(...findParents(r.colour));
    }
  }
  return Array.from(new Set(parents));
}
console.log(findParents(goal).length);

function countBags(goal: string): number {
  let total = 0;
  const rule = index.get(goal) as Rule;
  // console.log("count ", goal, rule);
  for (const r of Array.from(rule.contents.keys())) {
    const num = rule.contents.get(r) as number;
    total += num;
    total += num * countBags(r);
  }
  return total;
}

console.log(countBags(goal));

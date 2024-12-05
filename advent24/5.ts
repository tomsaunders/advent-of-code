#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 5
 *
 * Summary: Given a series of before/after rules, evaluate which sequences obey the rules and sum their middle pages.
 * Escalation: For the incorrect sequences, work out a sequence that would obey the rules and sum their new middle pages.
 * Naive:  N/A
 * Solution:
 *  1. Filter to find correct sequences, find the middle pages and sum
 *  2. Filter to find incorrect sequences, correct them, find the middle pages and sum
 *
 * Keywords: input parsing, sorting
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input5.txt", "utf8");
const test = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

type Rule = {
  before: string;
  after: string;
};

type Update = string[];

function parseInput(input: string): [Rule[], Update[]] {
  const rules: Rule[] = [];
  const updates: Update[] = [];

  input.split("\n").forEach((l) => {
    if (l.includes("|")) {
      const [before, after] = l.split("|");
      rules.push({ before, after });
    } else if (l.includes(",")) {
      updates.push(l.split(","));
    }
  });

  return [rules, updates];
}

function obeysRules(u: Update, rules: Rule[]): boolean {
  for (let i = 0; i < u.length; i++) {
    const beforeBits = u.slice(0, i);
    const page = u[i];
    const afterBits = u.slice(i + 1);
    // something comes after this page that should be before it
    if (rules.find((r) => r.after === page && afterBits.includes(r.before))) {
      return false;
    }
    // something comes before this page that should be after it
    if (rules.find((r) => r.before === page && beforeBits.includes(r.before))) {
      return false;
    }
  }
  return true;
}

// use the rules in an array sort to find the corrected order
function correctUpdate(u: Update, rules: Rule[]): Update {
  return u.sort((a, b) => {
    const before = rules.find((r) => a === r.before && b === r.after);
    const after = rules.find((r) => a === r.after && b === r.before);
    if (before) {
      return -1;
    } else if (after) {
      return 1;
    }
    return 0;
  });
}

function middlePage(u: Update): number {
  const mid = Math.floor(u.length / 2);
  return parseInt(u[mid]);
}

function part1(input: string): number {
  const [rules, updates] = parseInput(input);
  const correctUpdates = updates.filter((u) => obeysRules(u, rules));

  return arrSum(correctUpdates.map(middlePage));
}

function part2(input: string): number {
  const [rules, updates] = parseInput(input);
  const incorrectUpdates = updates.filter((u) => !obeysRules(u, rules));
  const correctedUpdates = incorrectUpdates.map((u) => correctUpdate(u, rules));

  return arrSum(correctedUpdates.map(middlePage));
}

const t = part1(test);
if (t == 143) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 123) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

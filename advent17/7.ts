#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 7
 *
 * Summary: Parse a graph to determine the root
 * Escalation: Find the part of the graph which is not perfectly balanced according to the node's value
 * Solution: Basic parsing and looping, then drilling down into the graph to follow the imbalanced branch.
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input7.txt", "utf8");
const test = `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`;

class Tower {
  parent?: Tower;
  children: Tower[] = [];
  public cost: number = 0;
  private _weight = 0;
  constructor(public id: string) {}

  public get weight(): number {
    if (!this._weight) {
      this._weight = this.cost + arrSum(this.children.map((c) => c.weight));
    }
    return this._weight;
  }
}

function parseInput(input: string): Tower[] {
  let tMap: Record<string, Tower> = {};
  input.split("\n").forEach((line) => {
    const [lhs, rhs] = line.split(" -> ");
    const [id, num] = lhs.replace(")", "").split(" (");

    const t = tMap[id] || new Tower(id);
    t.cost = parseInt(num);
    tMap[id] = t;

    if (rhs) {
      rhs.split(", ").forEach((c) => {
        const ct = tMap[c] || new Tower(c);
        t.children.push(ct);
        ct.parent = t;
        tMap[c] = ct;
      });
    }
  });
  return Object.values(tMap);
}

function part1(input: string): string {
  const towers = parseInput(input);
  return towers.find((t) => !t.parent)?.id || "";
}

function part2(input: string): number {
  const towers = parseInput(input);
  const root = towers.find((t) => !t.parent)!;

  // odd one out is either max child or min child or not in the children
  function oddOneOut(children: Tower[]): [Tower | undefined, number] {
    const weights = children.map((c) => c.weight);
    const max = Math.max(...weights);
    const min = Math.min(...weights);
    const childrenAtMax = children.filter((c) => c.weight === max);
    if (childrenAtMax.length === 1) {
      return [children.find((c) => c.weight === max), min - max];
    } else if (childrenAtMax.length === children.length) {
      return [undefined, 0];
    } else {
      return [children.find((c) => c.weight === min), max - min];
    }
  }

  let [wrongTower, weightAdjustment] = oddOneOut(root.children);
  while (wrongTower) {
    const [nextTower] = oddOneOut(wrongTower.children);
    if (nextTower) {
      wrongTower = nextTower;
    } else {
      return wrongTower.cost + weightAdjustment;
    }
  }
  return 0;
}

const t = part1(test);
if (t === "tknk") {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 60) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

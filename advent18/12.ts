#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 12
 *
 * Summary:
 * Escalation:
 * Solution:
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input12.txt", "utf8");
const test = `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`;

type PotState = "#" | ".";

class Pot {
  public next?: PotState;
  public constructor(public id: number, public state: PotState = ".") {}

  public get score(): number {
    return this.state === "#" ? this.id : 0;
  }

  public tick(): void {
    this.state = this.next!;
    this.next = undefined;
  }
}

function parseInput(input: string): [string, Record<string, string>] {
  const lines = input.split("\n");
  const initial = lines.shift()?.replace("initial state: ", "")!;
  lines.shift(); // spacer;
  const rules: Record<string, string> = {};
  lines.forEach((line) => {
    const [left, right] = line.split(" => ");
    rules[left] = right;
  });
  return [initial, rules];
}

function part1(input: string): number {
  let [state, rules] = parseInput(input);
  const lookup: Record<number, Pot> = {};
  state.split("").forEach((s, idx) => {
    lookup[idx] = new Pot(idx, s as PotState);
  });

  function getPot(idx: number): Pot {
    if (!lookup[idx]) {
      lookup[idx] = new Pot(idx);
    }
    return lookup[idx];
  }

  function getLine(idx: number): string {
    return [
      getPot(idx - 2).state,
      getPot(idx - 1).state,
      getPot(idx).state,
      getPot(idx + 1).state,
      getPot(idx + 2).state,
    ].join("");
  }

  function getNext(line: string): PotState {
    if (rules[line]) {
      return rules[line] as PotState;
    }
    return ".";
  }

  for (let i = 0; i < 20; i++) {
    const pots = Object.values(lookup);
    pots.forEach((p) => {
      p.next = getNext(getLine(p.id));
    });
    pots.forEach((p) => p.tick());
    const ids = Object.values(lookup).map((p) => p.id);
    const max = Math.max(...ids);
    console.log(0, max);
    const line: string[] = [];
    for (let i = 0; i <= max; i++) {
      line.push(i === 0 ? "0" : lookup[i].state);
    }
    line.push(arrSum(Object.values(lookup).map((p) => p.score)).toString());

    console.log(line.join(""));
  }

  return arrSum(Object.values(lookup).map((p) => p.score));
}

function part2(input: string): number {
  const things = parseInput(input);
  return 0;
}

const t = part1(test);
if (t === 325) {
  console.log("part 1 answer", part1(input)); // 2140
  const t2 = part2(test);
  if (t2 === 1) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

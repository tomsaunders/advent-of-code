#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day x
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid, mapNum } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");
const test = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

type Button = number[];

type Row = {
  lightStr: string;
  joltageStr: string;
  lightGoal: boolean[];
  joltageGoal: number[];
  buttons: Button[];
};

function parseInput(input: string): Row[] {
  return input.split("\n").map((line) => {
    const bits = line.split(" ");
    const lightStr = (bits.shift() as string).slice(1, -1);
    const joltageStr = (bits.pop() as string).slice(1, -1);
    const lightGoal = lightStr.split("").map((c) => c === "#");
    const joltageGoal = joltageStr.split(",").map(mapNum);
    const buttons = bits.map((b) => b.slice(1, -1).split(",").map(mapNum));
    return {
      lightStr,
      joltageStr,
      lightGoal,
      joltageGoal,
      buttons,
    };
  });
}

function press(initial: boolean[], press: Button): boolean[] {
  const result = initial.slice(0);
  press.forEach((idx) => {
    result[idx] = !result[idx];
  });
  return result;
}

function getStateStr(state: boolean[]): string {
  return state.map((s) => (s ? "#" : ".")).join("");
}

type Possible = {
  count: number;
  state: boolean[];
  stateStr: string;
  pressed: number[];
};

function minPress(row: Row): number {
  let min = 999;
  const goalStr = row.lightStr;
  const initial = row.lightGoal.slice(0).fill(false);

  const possibles: Possible[] = [
    { count: 0, state: initial, stateStr: getStateStr(initial), pressed: [] },
  ];

  const seen: Map<string, number> = new Map<string, number>();

  function goalDiff(poss: Possible): number {
    return row.lightGoal.map((g, i) => {
      return g === poss.state[i];
    }).length;
  }

  while (possibles.length) {
    const poss = possibles.shift() as Possible;
    if (poss.stateStr === goalStr) {
      min = Math.min(min, poss.count);
      // console.log("reached state after", min, possibles.length, row);
    } else if (poss.count >= min) {
      continue;
    } else {
      row.buttons.forEach((button, bIdx) => {
        const pressed = poss.pressed.slice(0);
        if (pressed.includes(bIdx)) return; // each answer has buttons pressed either 0 or 1 times so if its already been pressed we ignore.

        const state = press(poss.state, button);
        pressed.push(bIdx);
        const stateStr = getStateStr(state);
        if (seen.has(stateStr)) {
          const prev = seen.get(stateStr)!;
          if (prev <= poss.count + 1) {
            return;
          }
        }
        possibles.push({
          count: poss.count + 1,
          state,
          stateStr,
          pressed,
        });
        seen.set(stateStr, poss.count + 1);
      });
      possibles.sort((a, b) => {
        const ga = goalDiff(a);
        const gb = goalDiff(b);
        if (ga === gb) {
          return a.count - b.count;
        } else {
          return gb - ga;
        }
      });
    }
  }

  return min;
}

function part1(input: string): number {
  console.time("parseInput");
  const rows = parseInput(input);
  console.timeEnd("parseInput");
  console.time("minPress");
  const minPresses = rows.map((row, i) => {
    const x = minPress(row);
    return x;
  });

  console.timeEnd("minPress");
  return arrSum(minPresses);
}

function part2(input: string): number {
  const rows = parseInput(input);

  return 0;
}

const t = part1(test);
if (t == 7) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 33) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

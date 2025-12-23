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

function minPress(goalStr: string, buttons: Button[]): [number, boolean[][]] {
  let min = 999;
  let c = 0;
  const goalLen = buttons.length;
  const initial: boolean[] = new Array(goalStr.length).fill(false);
  const buttonOption: boolean[][] = [];

  const upper = Math.pow(2, goalLen);
  for (let i = 1; i < upper; i++) {
    let state = initial.slice(0);
    const binArray = i.toString(2).padStart(goalLen, "0").split("").map(mapNum);
    let count = 0;
    binArray.forEach((b, idx) => {
      if (!!b) {
        state = press(state, buttons[idx]);
        count++;
      }
    });
    if (getStateStr(state) === goalStr) {
      min = Math.min(min, count);
      buttonOption.push(state);
      c++;
    }
  }

  // if (c > 1) console.log("there are", c, "ways to get", goalStr, buttonOption);
  return [min, buttonOption];
}

function part1(input: string): number {
  const rows = parseInput(input);
  const x = arrSum(rows.map((row) => minPress(row.lightStr, row.buttons)[0]));
  return x;
}

function getJoltStr(joltageGoal: number[]): string {
  return joltageGoal.map((n) => (n % 2 === 1 ? "#" : ".")).join("");
}

function press2(initial: number[], press: Button, count: number): number[] {
  const result = initial.slice(0);
  press.forEach((idx) => {
    result[idx] += count;
  });
  return result;
}

type QueueItem = {
  presses: number;
  remainingButtons: Button[];
  state: number[];
  log: string[];
};

function minPress2(row: Row, possible?: boolean[]): number {
  const buttonCount = row.joltageGoal.length;
  const joltSum = arrSum(row.joltageGoal);
  const buttons = row.buttons.slice(0);

  const queue: QueueItem[] = [
    {
      presses: 0,
      remainingButtons: buttons.slice(0),
      state: row.joltageGoal.slice(0).fill(0),
      log: [],
    },
  ];

  let minPress = Infinity;

  function considerState(item: QueueItem) {
    if (item.presses >= minPress) {
      return;
    } else if (item.state.every((jolt, idx) => jolt <= row.joltageGoal[idx])) {
      const stateSum = arrSum(item.state);
      if (stateSum === joltSum) {
        if (item.presses < minPress) {
          minPress = Math.min(minPress, item.presses);
        }
      } else if (item.remainingButtons.length === 0) {
        // console.log("nothing left to press", item, stateSum, joltSum);
      } else {
        queue.push(item);
      }
    }
  }

  while (queue.length) {
    const Q = queue.shift() as QueueItem;

    let minCountForButton = 99;
    let lowestFreqButton = 99;
    for (let i = 0; i < buttonCount; i++) {
      const thisButtonIsInCount = Q.remainingButtons.filter((b) =>
        b.includes(i),
      ).length;
      if (
        thisButtonIsInCount < minCountForButton &&
        Q.state[i] < row.joltageGoal[i]
      ) {
        minCountForButton = thisButtonIsInCount;
        lowestFreqButton = i;
      }
    }

    // const buttonMustBeOdd = possible[lowestFreqButton] === true;
    const possibleButtons = Q.remainingButtons.filter((b) =>
      b.includes(lowestFreqButton),
    );
    const buttonGoal =
      row.joltageGoal[lowestFreqButton] - Q.state[lowestFreqButton];

    while (possibleButtons.length) {
      const button = possibleButtons.shift() as Button;
      const remainingButtons = Q.remainingButtons
        .slice(0)
        .filter((b) => b != button);

      if (possibleButtons.length === 0) {
        // this button is the only option, so press it the necessary amount of times
        const presses = Q.presses + buttonGoal;
        const state = press2(Q.state, button, buttonGoal);
        const log = Q.log.slice(0);
        log.push(`Press [${button.join(", ")}] ${buttonGoal} times`);

        considerState({
          presses,
          remainingButtons,
          state,
          log,
        });
      } else {
        // for every amount of presses between 0 and the goal, add a queue item
        for (let i = 0; i <= buttonGoal; i++) {
          const presses = Q.presses + i;
          const state = press2(Q.state, button, i);
          const log = Q.log.slice(0);
          log.push(`Press [${button.join(", ")}] ${i} times`);

          considerState({
            presses,
            remainingButtons,
            state,
            log,
          });
        }
      }
    }
  }
  console.log(row.joltageStr, "=", minPress);
  return minPress;
}

function part2(input: string): number {
  const rows = parseInput(input);
  return arrSum(
    rows.map((row) => {
      return minPress2(row);
      const joltStr = getJoltStr(row.joltageGoal);
      const possibles: boolean[][] = minPress(joltStr, row.buttons)[1];
      return Math.min(...possibles.map((possible) => minPress2(row, possible)));
    }),
  );
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

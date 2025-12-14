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
};

function minPress(row: Row): number {
  let min = 999;
  const goalStr = row.lightStr;
  const initial = row.lightGoal.slice(0).fill(false);

  const possibles: Possible[] = [
    { count: 0, state: initial, stateStr: getStateStr(initial) },
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
      row.buttons.forEach((button) => {
        const state = press(poss.state, button);
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
  const rows = parseInput(input);
  const minPresses = rows.map((row, i) => {
    const x = minPress(row);
    console.log(`Row ${i} of ${rows.length} is ${x}`);
    return x;
  });
  return arrSum(minPresses);
}

function press2(initial: number[], press: Button, times: number): number[] {
  const result = initial.slice(0);
  press.forEach((idx) => {
    result[idx] += times;
  });
  return result;
}

function getStateStr2(state: number[]): string {
  return state.join(",");
}

type Possible2 = {
  count: number;
  state: number[];
  stateStr: string;
  remButtons: Button[];
  choices: number;
};

function minPress2(row: Row): number {
  let min = 9999;
  const goalStr = row.joltageStr;
  const initial = row.joltageGoal.slice(0).fill(0);

  const possibles: Possible2[] = [
    {
      count: 0,
      state: initial,
      stateStr: getStateStr2(initial),
      remButtons: row.buttons.slice(0),
      choices: 0,
    },
  ];

  const seen: Map<string, number> = new Map<string, number>();

  function goalDiff(poss: Possible2): number {
    return arrSum(
      row.joltageGoal.map((g, i) => {
        if (poss.state[i] > g) {
          return g * g;
        }
        return g - poss.state[i];
      }),
    );
  }

  function isValid(state: number[]): boolean {
    let invalid = false;
    for (let i = 0; i < row.joltageGoal.length; i++) {
      if (state[i] > row.joltageGoal[i]) {
        invalid = true;
      }
    }
    return !invalid;
  }

  while (possibles.length < 30 && possibles.length) {
    const poss = possibles.shift() as Possible2;
    const isLogging = true; // possibles.length % 100 === 0;
    if (isLogging) {
      console.log("\nseeking", goalStr, "best so far is", min);
      console.log("considering", poss, "goal diff is", goalDiff(poss));
      console.log(
        "have remover",
        row.buttons.length - poss.remButtons.length,
        "buttons",
      );
      console.log("there are ", possibles.length, "optios");
      console.log("seen these states", seen.size);
    }
    // console.log("least likely is", possibles[possibles.length - 1]);
    if (poss.stateStr === goalStr) {
      min = Math.min(min, poss.count);
      console.log("reached state after", min, possibles.length, row);
    } else if (poss.count >= min || poss.remButtons.length === 0) {
      continue;
    } else {
      if (!isValid(poss.state)) continue;

      let earlyReturn = false;
      const remainingIndices: Button = [];
      for (let j = 0; j < row.joltageGoal.length; j++) {
        if (poss.state[j] < row.joltageGoal[j]) remainingIndices.push(j);
      }
      for (let r = 0; r < remainingIndices.length; r++) {
        const remIndex = remainingIndices[r];

        const buttonsThatCanBePushed = poss.remButtons.filter((rem) =>
          rem.includes(remIndex),
        );
        if (buttonsThatCanBePushed.length === 1) {
          const buttonThatCanBePushed = buttonsThatCanBePushed[0];
          const times = row.joltageGoal[remIndex] - poss.state[remIndex];
          const i = poss.remButtons.indexOf(buttonThatCanBePushed);

          const count = poss.count + times;
          const state = press2(poss.state, buttonThatCanBePushed, times);
          const stateStr = getStateStr2(state);
          if (!isValid(state)) {
            earlyReturn = true;
            continue;
          } else if (seen.has(stateStr)) {
            const prev = seen.get(stateStr)!;
            if (prev <= count) {
              earlyReturn = true;
              continue;
            }
          }
          const remButtons = poss.remButtons.slice(0);
          remButtons.splice(i, 1);
          possibles.push({
            count,
            state,
            stateStr,
            remButtons,
            choices: poss.choices + 1,
          });
          // console.log(
          //   "early returning because the only thing that can get index",
          //   remIndex,
          //   "is pushing",
          //   buttonThatCanBePushed,
          //   times,
          //   "times",
          //   "to get to ",
          //   row.joltageGoal,
          //   "from",
          //   poss.state,
          //   "new state is",
          //   state,
          // );
          earlyReturn = true;
          seen.set(stateStr, count);
        }
      }

      if (earlyReturn) continue;

      const possibleButtons: Button[] = [];
      for (let b = 0; b < poss.remButtons.length; b++) {
        const possButton = poss.remButtons[b];
        const maxPress = Math.min(
          ...possButton.map((idx) => {
            return row.joltageGoal[idx] - poss.state[idx];
          }),
        );
        if (maxPress > 0) {
          possibleButtons.push(possButton);
        }
      }

      for (let b = 0; b < possibleButtons.length; b++) {
        const possButton = possibleButtons[b];
        const maxPress = Math.min(
          ...possButton.map((idx) => {
            return row.joltageGoal[idx] - poss.state[idx];
          }),
        );
        if (isLogging) {
          console.log(
            "considering buttons",
            possButton,
            "max valid amount is",
            maxPress,
          );
        }

        for (let i = 1; i <= maxPress; i++) {
          const count = poss.count + i;
          const state = press2(poss.state, possButton, i);
          if (!isValid(state)) {
            i = maxPress + 1;
            continue;
          }
          const stateStr = getStateStr2(state);
          if (seen.has(stateStr)) {
            const prev = seen.get(stateStr)!;
            if (prev <= count) {
              continue;
            }
          }
          const remButtons = possibleButtons.slice(0);
          remButtons.splice(i, 1);
          possibles.push({
            count,
            state,
            stateStr,
            remButtons,
            choices: poss.choices + 1,
          });
          seen.set(stateStr, count);
        }
      }
      possibles.sort((a, b) => {
        const ga = goalDiff(a);
        const gb = goalDiff(b);
        if (ga === gb) {
          return a.count - b.count;
        } else {
          return ga - gb;
        }
      });
    }
  }
  // console.log("possibles now", possibles.length, possibles);
  return min;
}

function part2(input: string): number {
  const rows = parseInput(input);
  const minPresses = rows.map((row, i) => {
    const x = minPress2(row);
    console.log(`Row ${i + 1} of ${rows.length} is ${x}`);
    return x;
  });
  return arrSum(minPresses);
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

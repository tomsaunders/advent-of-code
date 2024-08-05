#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 25
 *
 * Summary: Implement a turing  machine
 * Escalation: Christmas!
 * Solution: Don't attempt to parse the input - hand code a representation of it, then step through.
 *
 * Keywords:
 * References:
 */
import * as fs from "fs";
type StateKey = "A" | "B" | "C" | "D" | "E" | "F";
type StateMap = Record<StateKey, State | undefined>;
type State = Record<0 | 1, Action>;
interface Action {
  write: 0 | 1;
  moveSlot: 1 | -1;
  gotoState: StateKey;
}

function buildState(w0: 0 | 1, m0: 1 | -1, go0: StateKey, w1: 0 | 1, m1: 1 | -1, go1: StateKey): State {
  return {
    0: { write: w0, moveSlot: m0, gotoState: go0 },
    1: { write: w1, moveSlot: m1, gotoState: go1 },
  };
}

const test: StateMap = {
  A: buildState(1, 1, "B", 0, -1, "B"),
  B: buildState(1, -1, "A", 1, 1, "A"),
  C: undefined,
  D: undefined,
  E: undefined,
  F: undefined,
};

const input: StateMap = {
  A: buildState(1, 1, "B", 0, -1, "C"),
  B: buildState(1, -1, "A", 1, 1, "C"),
  C: buildState(1, 1, "A", 0, -1, "D"),
  D: buildState(1, -1, "E", 1, -1, "C"),
  E: buildState(1, 1, "F", 1, 1, "A"),
  F: buildState(1, 1, "A", 1, 1, "E"),
};

function turingBlueprints(stateMap: StateMap, checksumAfter: number): number {
  let slot = 0;
  let tape: Record<number, number> = { 0: 0 };
  let stateKey: StateKey = "A";
  for (let step = 0; step < checksumAfter; step++) {
    const state = stateMap[stateKey]!;
    const curr = (tape[slot] as 0 | 1) || 0;
    const action = state[curr];
    tape[slot] = action.write;
    slot += action.moveSlot;
    stateKey = action.gotoState as StateKey;
  }

  return Object.values(tape).filter((t) => !!t).length;
}

const t1 = turingBlueprints(test, 6);
if (t1 === 3) {
  console.log("answer", turingBlueprints(input, 12134527));
}

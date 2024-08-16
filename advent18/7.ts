#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 7
 *
 * Summary: Given an input representing a dependency chain, find the order it must be resolved in.
 * Escalation: If each step has an associated time cost and there is a pool of workers to potentially parallel process some tasks, how long does it take to finish?
 * Solution: Part 1 was straight forward - whlie there are unprocessed steps, find the next one (has no dependencies, alphabetically first)
 *  Part 2 was trickier - eventually settled modelling the worker and dependencies between each steps, assigned steps to workers, then built a 'game loop' approach that ticked the clock forward
 *  and once a worker got to 0 for a task it was marked as finished and updated the steps it was blocking.
 *
 * Keywords: Game Loop, Dependencies
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input7.txt", "utf8");
const test = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;

class Step {
  public dependencies: Set<string> = new Set<string>();
  public blocks: Step[] = [];
  public finished = false;
  public active = false;

  constructor(public id: string) {}

  public get cost(): number {
    return this.id.charCodeAt(0) - 64; // A=1, B=2 etc
  }

  public get isPossible(): boolean {
    return !this.active && this.dependencies.size === 0;
  }

  public finish(): void {
    this.active = false;
    this.finished = true;
    this.blocks.forEach((b) => b.dependencies.delete(this.id));
  }
}

function parseInput(input: string): Step[] {
  const m: Record<string, Step> = {};
  function getStep(id: string) {
    if (!m[id]) m[id] = new Step(id);
    return m[id];
  }
  input.split("\n").forEach((line) => {
    const [, firstID, thenID] = line.replace("must be finished before step ", "").split(" ");
    const preReq = getStep(firstID);
    const step = getStep(thenID);
    step.dependencies.add(preReq.id);
    preReq.blocks.push(step);
  });
  return Object.values(m);
}

function part1(input: string): string {
  let steps = parseInput(input);
  let order = "";
  while (steps.length) {
    const possibilities = steps.filter((s) => s.dependencies.size === 0).map((s) => s.id);
    possibilities.sort();
    const firstID = possibilities.shift()!;
    order += firstID;
    const firstStep = steps.find((s) => s.id === firstID);
    firstStep?.finish();
    steps = steps.filter((s) => !s.finished);
  }
  return order;
}

class Worker {
  public timeTilIdle = 0;
  public workingOn?: Step;
  public get free(): boolean {
    return this.timeTilIdle === 0;
  }
  public tick(): void {
    if (this.timeTilIdle && this.workingOn) {
      this.timeTilIdle--;
      if (this.timeTilIdle === 0) {
        this.workingOn.finish();
        this.workingOn = undefined;
      }
    }
  }

  public workOn(step: Step, stepCost: number): void {
    this.workingOn = step;
    this.timeTilIdle = step.cost + stepCost;
    step.active = true;
  }
}

function part2(input: string, workerCount: number, stepCost: number): number {
  const workers = new Array(workerCount).fill(0).map((x) => new Worker());

  let steps = parseInput(input);
  let order = "";
  let time = 0;
  while (steps.length && time < 2000) {
    let freeWorker = workers.find((w) => w.free);
    let possibilities = steps.filter((s) => s.isPossible).map((s) => s.id);
    possibilities.sort();
    let stepID = possibilities.shift()!;

    // if multiple things can be scheduled for multiple free workers, start them all
    while (freeWorker && stepID) {
      // something can be scheduled
      const nextStep = steps.find((s) => s.id === stepID);
      freeWorker.workOn(nextStep!, stepCost);
      freeWorker = workers.find((w) => w.free);
      stepID = possibilities.shift()!;
    }

    // game loop - move on with time
    time++;
    workers.forEach((w) => w.tick());
    steps = steps.filter((s) => !s.finished);
  }
  return time;
}

const t = part1(test);
if (t === "CABDFE") {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test, 2, 0);
  if (t2 === 15) {
    console.log("part 2 answer", part2(input, 5, 60));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

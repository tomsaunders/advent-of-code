#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 19
 *
 * Summary: Given factory blueprints' that create mining robots from mined resources, work out the most mining that can happen in time t
 * Escalation: Increase t
 * Naive:  Simulate every possible move (build robot 1 2 3 or 4, or wait til more resources are found) for every minute
 * Solution: Reduce the search space by only taking efficient options. The crucial logic was abandoning a branch when it had no possibility of beating the best option
 *
 * Keywords: Permutations
 * References: reddit
 */
import * as fs from "fs";
import { arrSum, arrProd } from "./util";
const input = fs.readFileSync("input19.txt", "utf8");

const test = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

class Blueprint {
  public maxGeode: number = 0;
  public id: number;
  public oreCost: number;
  public clyCost: number;
  public obsOreCost: number;
  public obsClyCost: number;
  public geoOreCost: number;
  public geoObsCost: number;

  public maxOreCost: number;

  public constructor(public line: string) {
    const bits = line
      .split(" ")
      .map((b) => parseInt(b, 10))
      .filter((n) => !isNaN(n));
    [this.id, this.oreCost, this.clyCost, this.obsOreCost, this.obsClyCost, this.geoOreCost, this.geoObsCost] = bits;

    this.maxOreCost = Math.max(this.oreCost, this.clyCost, this.geoOreCost, this.obsOreCost);
  }

  public get qualityLevel(): number {
    return this.id * this.maxGeode;
  }
}

interface State {
  oreBots: number;
  clyBots: number;
  obsBots: number;
  oreCount: number;
  clyCount: number;
  obsCount: number;
  geoCount: number;
  turn: number;
}

const TURN = 0;
const ORE_COUNT = 1;
const CLY_COUNT = 2;
const OBS_COUNT = 3;
const GEO_COUNT = 4;
const ORE_BOTS = 5;
const CLY_BOTS = 6;
const OBS_BOTS = 7;
const GEO_BOTS = 8;

type StateArray = [number, number, number, number, number, number, number, number, number];
const sortOrder = [GEO_COUNT, OBS_COUNT, CLY_COUNT, ORE_COUNT];
function sortQ(a: StateArray, b: StateArray): number {
  for (let i = 0; i < sortOrder.length; i++) {
    const k = sortOrder[i];
    const A = a[k];
    const B = b[k];
    if (A != B) {
      return A - B;
    }
  }
  return 0;
}

function sortQueue(a: State, b: State): number {
  if (a.geoCount === b.geoCount) {
    if (a.obsBots === b.obsBots) {
      return b.clyBots - a.clyBots;
    } else {
      return b.obsBots - a.obsBots;
    }
  } else {
    return b.geoCount - a.geoCount;
  }
}

function calculateMaxGeode2(b: Blueprint, timeLimit: number = 24): void {
  const hashes: Set<string>[] = new Array(timeLimit + 2).fill("").map((x) => new Set<string>());
  // const hashes: Record<string, true> = {};
  const queue: StateArray[] = [[0, 0, 0, 0, 0, 1, 0, 0, 0]];

  const addQueue = (newState: StateArray): void => {
    // const [turns, oreCount, clayCount, obsidianCount, geodeCount, oreBots, clayBots, obsidianBots, geodeBots] =
    //   newState;
    const hash = hashes[newState[TURN]] as Set<string>;
    const str = newState.join(":");
    if (newState[TURN] <= timeLimit && !hash.has(str)) {
      queue.push(newState);
      queue.sort(sortQ);
      hash.add(str);
    }
  };

  const nextState = (currentState: StateArray, afterTurns: number = 1): StateArray => {
    const next = currentState.slice(0) as StateArray;

    afterTurns = Math.max(afterTurns, 1);

    next[ORE_COUNT] += currentState[ORE_BOTS] * afterTurns;
    next[OBS_COUNT] += currentState[OBS_BOTS] * afterTurns;
    next[CLY_COUNT] += currentState[CLY_BOTS] * afterTurns;
    next[TURN] += afterTurns;
    return next;
  };

  const triangles = [0];
  for (let i = 0; i < timeLimit; i++) {
    triangles.push(triangles.length + triangles[triangles.length - 1]);
  }

  let max = 0;
  let c = 0;
  while (queue.length) {
    c++;
    const current = queue.pop() as StateArray;
    const [turns, oreCount, clayCount, obsidianCount, geodeCount, oreBots, clayBots, obsidianBots, geodeBots] = current;

    max = Math.max(max, geodeCount);
    if (turns === timeLimit) {
      // do nothing we done.
      continue;
    }
    const timeRemaining = timeLimit - turns; // the best possible outcome of this branch is we build a geode robot on every remaining step
    // 1 - build, no geo
    // 2 - build, 1 geo
    // 3 - build, 1 geo & build, 2 geo = 3
    // 4 - build, 1 geo & build, 2 geo & build, 3 geo = 6 ... triangle sequence
    const bestPossibleGeodesRem = triangles[timeRemaining - 1];
    if (geodeCount + bestPossibleGeodesRem <= max) {
      continue; // abort
    }

    // 5 options - build ore, clay, obsidian or geode... or wait to the end.
    // and since geode count is calculated at the time of building, we dont need to wait to the end to know the max score
    // making it just 4 options

    // have the resources from the start for ore robots
    // should only build an ore bot when bots < max ore cost of something
    if (oreBots < b.maxOreCost) {
      const timeTilBuild = Math.ceil((b.oreCost - oreCount) / oreBots);
      const newOre = nextState(current, timeTilBuild + 1);
      newOre[ORE_COUNT] -= b.oreCost;
      newOre[ORE_BOTS]++;
      addQueue(newOre);
    }

    // should only build clay bot when fewer clay bots than the clay cost of an obsidian bot
    if (clayBots < b.obsClyCost) {
      const timeTilBuild = Math.ceil((b.clyCost - oreCount) / oreBots);
      const newCly = nextState(current, timeTilBuild + 1);
      newCly[ORE_COUNT] -= b.clyCost;
      newCly[CLY_BOTS]++;
      addQueue(newCly);
    }

    // should only build an obsidian bot when there are fewer than the obsidian cost of a geode bot
    // and CAN only build if a cly bot exists
    if (obsidianBots < b.geoObsCost && clayBots) {
      const timeTilBuildClay = Math.ceil((b.obsClyCost - clayCount) / clayBots);
      const timeTilBuildOre = Math.ceil((b.obsOreCost - oreCount) / oreBots);
      // have to wait til both clay and ore counts are appropriate
      const newObs = nextState(current, Math.max(timeTilBuildOre, timeTilBuildClay) + 1);
      newObs[ORE_COUNT] -= b.obsOreCost;
      newObs[CLY_COUNT] -= b.obsClyCost;
      newObs[OBS_BOTS]++;
      // console.log(
      //   "from ",
      //   current,
      //   "it would take",
      //   newObs.turn - current.turn,
      //   "turns to build an obsidian robot",
      //   newObs
      // );
      addQueue(newObs);
    }

    // if we can build a geode robot, we immediately take credit for all geodes possible til the end of the time limit
    // but can only do this if we have some obsidan bots
    if (obsidianBots) {
      const timeTilBuildObs = Math.ceil((b.geoObsCost - obsidianCount) / obsidianBots);
      const timeTilBuildOre = Math.ceil((b.geoOreCost - oreCount) / oreBots);
      // have to wait til both obsidian and ore counts are appropriate
      const newGeo = nextState(current, Math.max(timeTilBuildOre, timeTilBuildObs) + 1);
      newGeo[ORE_COUNT] -= b.geoOreCost;
      newGeo[OBS_COUNT] -= b.geoObsCost;

      if (newGeo[TURN] < timeLimit) {
        newGeo[GEO_COUNT] += timeLimit - newGeo[TURN];
        addQueue(newGeo);
      }
    }
  }
  b.maxGeode = max;
}

function parseInput(input: string): Blueprint[] {
  return input.split("\n").map((l) => new Blueprint(l));
}

function part1(input: string): number {
  console.time("part1");
  const blueprints = parseInput(input);
  blueprints.forEach((b) => calculateMaxGeode2(b));
  console.timeEnd("part1");
  return arrSum(blueprints.map((b) => b.qualityLevel));
}

function part2(input: string): number {
  console.time("part2");
  const blueprints = parseInput(input).slice(0, 3);
  blueprints.forEach((b) => {
    calculateMaxGeode2(b, 32);
  });
  console.timeEnd("part2");
  // exceeds hash set size
  return arrProd(blueprints.map((b) => b.maxGeode));
}

const t1 = part1(test);
if (t1 === 33) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 3472) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

#!/usr/bin/env ts-node
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
    [
      this.id,
      this.oreCost,
      this.clyCost,
      this.obsOreCost,
      this.obsClyCost,
      this.geoOreCost,
      this.geoObsCost,
    ] = bits;

    this.maxOreCost = Math.max(
      this.oreCost,
      this.clyCost,
      this.geoOreCost,
      this.obsOreCost
    );
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

function calculateMaxGeode(b: Blueprint, TIME_LIMIT = 24): void {
  const hash: Set<string> = new Set<string>();
  const queue: State[] = [
    {
      oreBots: 1,
      oreCount: 0,
      clyBots: 0,
      clyCount: 0,
      obsBots: 0,
      obsCount: 0,
      geoCount: 0,
      turn: 0,
    },
  ];

  const addQueue = (newState: State): void => {
    const str = JSON.stringify(newState);
    if (!hash.has(str) && newState.turn <= TIME_LIMIT) {
      queue.push(newState);
      queue.sort(sortQueue);
      hash.add(str);
    }
  };

  const nextState = (currentState: State, afterTurns: number = 1): State => {
    const next = { ...currentState };

    afterTurns = Math.max(afterTurns, 1);

    next.oreCount += currentState.oreBots * afterTurns;
    next.obsCount += currentState.obsBots * afterTurns;
    next.clyCount += currentState.clyBots * afterTurns;
    next.turn += afterTurns;
    return next;
  };

  let max = 0;
  let c = 0;
  while (queue.length) {
    c++;
    const current = queue.shift() as State;

    if (current.turn > TIME_LIMIT) {
      continue;
    } else if (current.geoCount > max) {
      max = current.geoCount;
      console.log(c, queue.length, max, current);
    }

    // 5 options - build ore, clay, obsidian or geode... or wait to the end.
    // and since geode count is calculated at the time of building, we dont need to wait to the end to know the max score
    // making it just 4 options

    // have the resources from the start for ore robots
    // should only build an ore bot when bots < max ore cost of something
    if (current.oreBots < b.maxOreCost) {
      const timeTilBuild = Math.ceil(
        (b.oreCost - current.oreCount) / current.oreBots
      );
      const newOre = nextState(current, timeTilBuild + 1);
      newOre.oreCount -= b.oreCost;
      newOre.oreBots++;
      addQueue(newOre);
    }

    // should only build clay bot when fewer clay bots than the clay cost of an obsidian bot
    if (current.clyBots < b.obsClyCost) {
      const timeTilBuild = Math.ceil(
        (b.clyCost - current.oreCount) / current.oreBots
      );
      const newCly = nextState(current, timeTilBuild + 1);
      newCly.oreCount -= b.clyCost;
      newCly.clyBots++;
      addQueue(newCly);
    }

    // should only build an obsidian bot when there are fewer than the obsidian cost of a geode bot
    // and CAN only build if a cly bot exists
    if (current.obsBots < b.geoObsCost && current.clyBots) {
      const timeTilBuildClay = Math.ceil(
        (b.obsClyCost - current.clyCount) / current.clyBots
      );
      const timeTilBuildOre = Math.ceil(
        (b.obsOreCost - current.oreCount) / current.oreBots
      );
      // have to wait til both clay and ore counts are appropriate
      const newObs = nextState(
        current,
        Math.max(timeTilBuildOre, timeTilBuildClay) + 1
      );
      newObs.oreCount -= b.obsOreCost;
      newObs.clyCount -= b.obsClyCost;
      newObs.obsBots++;
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
    if (current.obsBots) {
      const timeTilBuildObs = Math.ceil(
        (b.geoObsCost - current.obsCount) / current.obsBots
      );
      const timeTilBuildOre = Math.ceil(
        (b.geoOreCost - current.oreCount) / current.oreBots
      );
      // have to wait til both clay and ore counts are appropriate
      const newGeo = nextState(
        current,
        Math.max(timeTilBuildOre, timeTilBuildObs) + 1
      );
      newGeo.oreCount -= b.geoOreCost;
      newGeo.obsCount -= b.geoObsCost;

      if (newGeo.turn < TIME_LIMIT) {
        newGeo.geoCount += TIME_LIMIT - newGeo.turn;
        // console.log(
        //   "from ",
        //   current,
        //   "it would take",
        //   newGeo.turn - current.turn,
        //   "turns to build an geode robot",
        //   newGeo,
        //   "which would be active for",
        //   TIME_LIMIT - newGeo.turn,
        //   "turns"
        // );
        addQueue(newGeo);
      }
    }
  }
  b.maxGeode = max;
  console.log(b.line, TIME_LIMIT, max);
}

function parse(input: string): Blueprint[] {
  return input.split("\n").map((l) => new Blueprint(l));
}

function part1(input: string): number {
  const blueprints = parse(input);
  blueprints.forEach((b) => calculateMaxGeode(b));
  return arrSum(blueprints.map((b) => b.qualityLevel));
}

function part2(input: string): number {
  const blueprints = parse(input).slice(0, 3);
  blueprints.forEach((b) => calculateMaxGeode(b, 32));
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

#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 16
 *
 * Summary: Given a graph of tunnels connecting 'valves' which increase air flow rate, over 30 steps what is the most amount of air that can be linked
 * Escalation: Add a second actor to move in parallel, exponentially increasing the search space
 * Naive:  Optimise the graph to remove pointless nodes, take each step by step traversing the graph
 * Solution: 1. Combine the valve turn on and the move cost into a single option. Calculate from each node the options it has to reach all other point scoring nodes
 *  2. n^2 the complexity by adding a second actor. Finishes within a minute but clearly could be optimised.
 *
 * Keywords: Graph, BFS, Path Finding
 * References:
 */
import * as fs from "fs";
const input = fs.readFileSync("input16.txt", "utf8");

const test = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

interface Option {
  valve: Valve;
  cost: number;
}

class Valve {
  public name: string;
  public flowRate: number;
  public tunnels: string[] = [];
  public connections: Option[] = [];
  public options: Record<string, number> = {};

  constructor(public line: string) {
    line = line.replace("rate=", "").replace(";", "");
    const bits = line.split(" ");
    this.name = bits[1];
    this.flowRate = parseInt(bits[4], 10);
    this.tunnels = bits.slice(9).join(" ").split(", ");
  }

  public addConnection(option: Option): void {
    const existing = this.connections.find((c) => c.valve === option.valve);
    if (existing) {
      existing.cost = Math.min(existing.cost, option.cost);
    } else {
      this.connections.push(option);
    }
  }

  public addOption(option: Option): void {
    this.options[option.valve.name] = option.cost;
  }

  public isBetterOption(option: Option): boolean {
    return option.cost < (this.options[option.valve.name] || Infinity);
  }
}

function parseInput(input: string): Record<string, Valve> {
  const valves = input.split("\n").map((l) => new Valve(l));
  const map: Record<string, Valve> = {};

  valves.forEach((v) => {
    v.tunnels.forEach((t) => {
      v.addConnection({
        valve: valves.find((i) => i.name === t) as Valve,
        cost: 1,
      });
    });
    map[v.name] = v;
  });

  // optimise by removing 0 valve nodes
  valves
    .filter((v) => v.flowRate === 0)
    .forEach((zeroValve) => {
      // remove self from connections
      zeroValve.connections.forEach((c) => {
        c.valve.connections = c.valve.connections.filter((cc) => cc.valve !== zeroValve);
      });
      zeroValve.connections.forEach((a) => {
        zeroValve.connections.forEach((b) => {
          if (a !== b) {
            b.valve.addConnection({
              valve: a.valve,
              cost: a.cost + b.cost,
            });
            a.valve.addConnection({
              valve: b.valve,
              cost: b.cost + a.cost,
            });
          }
        });
      });
    });

  valves.forEach((v) => {
    function visitAllNodes(from: Valve, currentCost: number) {
      from.connections.forEach((connection) => {
        const moveCost = currentCost + connection.cost;
        const option: Option = { cost: moveCost + 1, valve: connection.valve }; // add one for the cost of turning on the valve

        if (v.isBetterOption(option)) {
          v.addOption(option);
          visitAllNodes(connection.valve, moveCost);
        }
      });
    }
    //bfs from the valve
    visitAllNodes(v, 0);
  });

  return map;
}

function part1(input: string): number {
  const valves = parseInput(input);
  const timeLimit = 30;
  interface PathOption {
    timeRemaining: number;
    totalPressure: number;
    path: string[];
  }

  const paths: PathOption[] = [{ timeRemaining: timeLimit, path: ["AA"], totalPressure: 0 }];
  let best = 0;
  while (paths.length) {
    const progress = paths.pop() as PathOption;
    if (progress.totalPressure > best) {
      best = progress.totalPressure;
    }

    const current = progress.path[0];
    const valve = valves[current] as Valve;

    Object.entries(valve.options).forEach(([optionKey, optionCost]) => {
      const optionValve = valves[optionKey];
      const timeRemaining = progress.timeRemaining - optionCost;

      if (timeRemaining >= 0 && !progress.path.includes(optionKey)) {
        const totalPressure = progress.totalPressure + timeRemaining * optionValve.flowRate;
        const path = [optionKey];
        path.push(...progress.path);
        paths.push({ timeRemaining, totalPressure, path });
      }
    });
  }

  return best;
}

function part2(input: string): number {
  const valves = parseInput(input);
  const timeLimit = 26;
  interface PathOption {
    aTimeRem: number;
    bTimeRem: number;
    totalPressure: number;
    aPath: string[];
    bPath: string[];
  }

  const paths: PathOption[] = [
    { aTimeRem: timeLimit, bTimeRem: timeLimit, aPath: ["AA"], bPath: ["AA"], totalPressure: 0 },
  ];
  let best = 0;
  while (paths.length) {
    const progress = paths.pop() as PathOption;
    if (progress.totalPressure > best) {
      best = progress.totalPressure;
    }

    const currentA = progress.aPath[0];
    const valveA = valves[currentA] as Valve;
    const currentB = progress.bPath[0];
    const valveB = valves[currentB] as Valve;

    Object.entries(valveA.options).forEach(([optionKeyA, optionCostA]) => {
      const optionValveA = valves[optionKeyA];
      const aTimeRem = progress.aTimeRem - optionCostA;

      if (aTimeRem >= 0 && !progress.aPath.includes(optionKeyA) && !progress.bPath.includes(optionKeyA)) {
        const totalPressureA = progress.totalPressure + aTimeRem * optionValveA.flowRate;
        const aPath = progress.aPath.slice(0);
        aPath.unshift(optionKeyA);

        Object.entries(valveB.options).forEach(([optionKeyB, optionCostB]) => {
          const optionValveB = valves[optionKeyB];
          const bTimeRem = progress.bTimeRem - optionCostB;
          if (
            optionKeyA !== optionKeyB &&
            bTimeRem >= 0 &&
            !progress.aPath.includes(optionKeyB) &&
            !progress.bPath.includes(optionKeyB)
          ) {
            const bPath = progress.bPath.slice(0);
            bPath.unshift(optionKeyB);
            const totalPressure = totalPressureA + bTimeRem * optionValveB.flowRate;
            paths.push({ aTimeRem, aPath, bTimeRem, bPath, totalPressure });
          }
        });
      }
    });
  }

  return best;
}

const t1 = part1(test);
if (t1 === 1651) {
  console.log("Part 1: ", part1(input)); // 2265
  const t2 = part2(test);
  if (t2 === 1707) {
    console.log("Part 2: ", part2(input)); // 2811
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

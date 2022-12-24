#!/usr/bin/env ts-node
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
}

function parse(input: string): Record<string, Valve> {
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
      console.log(`valve ${zeroValve.name} is pointless, removing`);
      // remove self from connections
      zeroValve.connections.forEach((c) => {
        c.valve.connections = c.valve.connections.filter(
          (cc) => cc.valve !== zeroValve
        );
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

  console.log("optimised map");
  Object.values(map).forEach((v) => {
    console.log("valve ", v.name);
    v.connections.forEach((c) => {
      console.log("- tunnel", c.valve.name, c.cost);
    });
  });
  return map;
}

interface Game {
  valveState: Record<string, number>;
  currentValve: string;
  elephantValve?: string;
  lastValve: string;
  lastElephantValve?: string;
  totalPressure: number;
  timeRemaining: number;
  elephantTimeRemaining?: number;
}

function part1(input: string): number {
  const valves = parse(input);
  const timeLimit = 30;

  const options: Game[] = [
    {
      valveState: {},
      currentValve: "AA",
      lastValve: "",
      totalPressure: 0,
      timeRemaining: timeLimit,
    },
  ];
  let max = 0;

  const seen: Set<string> = new Set<string>();

  const addOption = (g: Game): void => {
    const hash = g.currentValve + "@" + g.timeRemaining + "@" + g.totalPressure;

    if (!seen.has(hash)) {
      options.push(g);
      seen.add(hash);
    }
  };

  while (options.length) {
    options.sort((a, b) =>
      b.totalPressure === a.totalPressure
        ? a.timeRemaining - b.timeRemaining
        : b.totalPressure - a.totalPressure
    );
    const game: Game = options.shift() as Game;
    // console.log(`${options.length} options, `, max, game);

    if (game.timeRemaining > 0) {
      const atValve = valves[game.currentValve];

      // possible moves are turn valve on, or move to neighbour.
      if (!game.valveState[atValve.name] && atValve.flowRate > 0) {
        const nextTime = game.timeRemaining - 1;
        // turn on - current valve is not open and could be useful
        addOption({
          valveState: {
            ...game.valveState,
            [game.currentValve]: valves[game.currentValve].flowRate,
          },
          currentValve: game.currentValve,
          lastValve: "",
          totalPressure: game.totalPressure + atValve.flowRate * nextTime,
          timeRemaining: nextTime,
        });
      }
      // move to neighbour
      atValve.connections.forEach((c) => {
        if (c.valve.name !== game.lastValve) {
          addOption({
            valveState: { ...game.valveState },
            currentValve: c.valve.name,
            lastValve: game.currentValve,
            totalPressure: game.totalPressure,
            timeRemaining: game.timeRemaining - c.cost,
          });
        }
      });
    }
    if (game.totalPressure > max) {
      max = Math.max(max, game.totalPressure);
      // console.log("-new max", max);
    }
  }

  console.log(`found ${max} after ${seen.size}`);
  return max;
}

function part2(input: string): number {
  const valves = parse(input);
  const timeLimit = 26;

  const options: Game[] = [
    {
      valveState: {},
      currentValve: "AA",
      elephantValve: "AA",
      lastValve: "",
      lastElephantValve: "",
      totalPressure: 0,
      timeRemaining: timeLimit,
      elephantTimeRemaining: timeLimit,
    },
  ];
  let max = 0;

  const seen: Set<string> = new Set<string>();

  const addOption = (g: Game): void => {
    let hash = g.currentValve + "@" + g.timeRemaining + "@" + g.totalPressure;
    hash += "@" + g.elephantValve + "@" + g.elephantTimeRemaining;

    if (!seen.has(hash)) {
      options.push(g);
      seen.add(hash);
    }
  };

  while (options.length) {
    options.sort((a, b) =>
      b.totalPressure === a.totalPressure
        ? a.timeRemaining - b.timeRemaining
        : b.totalPressure - a.totalPressure
    );
    const game: Game = options.shift() as Game;
    // console.log(`${options.length} options, `, max, game);

    if (game.timeRemaining > 0) {
      const atValve = valves[game.currentValve];

      // possible moves are turn valve on, or move to neighbour.
      if (!game.valveState[atValve.name] && atValve.flowRate > 0) {
        const nextTime = game.timeRemaining - 1;
        // turn on - current valve is not open and could be useful
        addOption({
          valveState: {
            ...game.valveState,
            [atValve.name]: atValve.flowRate,
          },
          currentValve: game.currentValve,
          lastValve: "",
          totalPressure: game.totalPressure + atValve.flowRate * nextTime,
          timeRemaining: nextTime,
        });
      }
      // move to neighbour
      atValve.connections.forEach((c) => {
        if (c.valve.name !== game.lastValve) {
          addOption({
            valveState: { ...game.valveState },
            currentValve: c.valve.name,
            lastValve: game.currentValve,
            totalPressure: game.totalPressure,
            timeRemaining: game.timeRemaining - c.cost,
          });
        }
      });
    }
    if (game.elephantTimeRemaining! > 0) {
      const atValve = valves[game.elephantValve!];

      // possible moves are turn valve on, or move to neighbour.
      if (!game.valveState[atValve.name] && atValve.flowRate > 0) {
        const nextTime = game.elephantTimeRemaining! - 1;
        // turn on - current valve is not open and could be useful
        addOption({
          valveState: {
            ...game.valveState,
            [atValve.name]: atValve.flowRate,
          },
          currentValve: game.currentValve,
          lastValve: game.lastValve,
          elephantValve: game.elephantValve,
          lastElephantValve: "",
          totalPressure: game.totalPressure + atValve.flowRate * nextTime,
          timeRemaining: game.timeRemaining,
          elephantTimeRemaining: nextTime,
        });
      }
      // move to neighbour
      atValve.connections.forEach((c) => {
        if (c.valve.name !== game.lastElephantValve) {
          addOption({
            valveState: { ...game.valveState },
            currentValve: game.currentValve,
            lastValve: game.lastValve,
            elephantValve: c.valve.name,
            lastElephantValve: game.elephantValve!,
            totalPressure: game.totalPressure,
            timeRemaining: game.timeRemaining,
            elephantTimeRemaining: game.elephantTimeRemaining! - c.cost,
          });
        }
      });
    }
    if (game.totalPressure > max) {
      max = Math.max(max, game.totalPressure);
      // console.log("-new max", max);
    }
  }

  console.log(`found ${max} after ${seen.size}`);
  return max;
}

const t1 = part1(test);
if (t1 === 1651) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 1707) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

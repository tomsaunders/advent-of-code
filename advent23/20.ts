#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 20
 *
 * Summary: Parse instructions and follow them to simulate nodes sending low/high signals to each other
 * Escalation: Find the really big number of cycles before a particular node gets high
 * Naive:  N/A
 * Solution:
 *  1.  Build classes to model the state with functions to process the signals
 *  2.  Reddit... the really big number is composed of cycles, so find the lowest common multiple
 *
 * Keywords: cycles, lowest common multiple
 * References: N/A
 */
import * as fs from "fs";
import { lcm } from "./util";
const input = fs.readFileSync("input20.txt", "utf8");
const test = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const test2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

interface PulseEvent {
  pulseType: Pulse;
  from: string;
  to: string;
}

class Handler {
  public lowCount = 0;
  public highCount = 0;
  public modules: Record<string, Module> = {};

  public pulseQueue: PulseEvent[] = [];
  public lastHigh: Record<string, number> = {};
  public highCycle: Record<string, number> = {};
  public pressCount = 0;

  public addModule(m: Module): void {
    this.modules[m.key] = m;
    m.eventHandler = this;
  }

  public init(): void {
    Object.values(this.modules).forEach((m) => {
      m.destinations.forEach((dest) => {
        if (!this.modules[dest]) {
          this.addModule(new Module(dest, []));
        }
        this.modules[dest].registerInput(m);
      });
    });
  }

  public enqueuePulse(pulseType: Pulse, from: string, to: string) {
    // console.log(`${from} -${pulseType.toLowerCase()}-> ${to}`);
    this.pulseQueue.push({ pulseType, from, to });
    if (pulseType === "HIGH") {
      if (this.lastHigh[from]) {
        this.highCycle[from] = this.pressCount - this.lastHigh[from];
      }
      this.lastHigh[from] = this.pressCount;
    }
  }

  public run(): void {
    while (this.pulseQueue.length) {
      const { pulseType, from, to } = this.pulseQueue.shift() as PulseEvent;
      if (pulseType === "HIGH") {
        this.highCount++;
      } else {
        this.lowCount++;
      }
      const dest = this.modules[to];
      dest.handlePulse(pulseType, from);
    }
  }

  public press(): void {
    this.pressCount++;
    this.enqueuePulse("LOW", "button", "broadcaster");
  }

  public get score(): number {
    return this.lowCount * this.highCount;
  }
}

class Module {
  public eventHandler!: Handler;
  constructor(public key: string, public destinations: string[]) {}

  public handlePulse(pulseType: Pulse, from: string) {}

  public registerInput(module: Module): void {}

  public sendPulse(pulseType: Pulse): void {
    this.destinations.forEach((destination) => {
      this.eventHandler.enqueuePulse(pulseType, this.key, destination);
    });
  }

  static fromLine(line: string): Module {
    const [left, right] = line.split(" -> ");
    const type = left[0];
    let name = left.substring(1);
    const dests = right.split(", ");

    if (type === "%") {
      return new FlipFlopModule(name, dests);
    } else if (type === "&") {
      return new ConjunctionModule(name, dests);
    } else if (type === "b") {
      return new BroadcasterModule(left, dests);
    } else {
      console.error("Oops", line);
      return new Module("error", []);
    }
  }
}

class FlipFlopModule extends Module {
  public isOn = false;

  public handlePulse(pulseType: Pulse, from: string): void {
    if (pulseType === "LOW") {
      // highs are ignored
      this.sendPulse(this.isOn ? "LOW" : "HIGH");
      this.isOn = !this.isOn;
    }
  }
}

class ConjunctionModule extends Module {
  public lastPulses: Record<string, Pulse> = {};

  public registerInput(module: Module): void {
    this.lastPulses[module.key] = "LOW";
  }

  public handlePulse(pulseType: Pulse, from: string): void {
    this.lastPulses[from] = pulseType;
    const allHigh = Object.values(this.lastPulses).every((p) => p === "HIGH");
    this.sendPulse(allHigh ? "LOW" : "HIGH");
  }
}

class BroadcasterModule extends Module {
  public handlePulse(pulseType: Pulse, from: string): void {
    this.sendPulse(pulseType);
  }
}

// modules send high or low pulses to other modules
// flip flop module % on or off, default off.
// conjunction module & remeber last type for all, default low. if all high send low, else high
// broadcast module sends to all destination modules
// button module sends low to broadcaster
// pulses processed in order sent

type Pulse = "LOW" | "HIGH";

function parseInput(input: string): Handler {
  const handler = new Handler();
  input.split("\n").forEach((line) => {
    handler.addModule(Module.fromLine(line));
  });
  handler.init();

  return handler;
}

function part1(input: string, count = 1): number {
  const handler = parseInput(input);
  for (let i = 0; i < count; i++) {
    handler.press();
    handler.run();
  }

  return handler.score;
}

function part2(input: string): number {
  const handler = parseInput(input);
  // from inspection of the input, rx is triggered by hf
  // and four things - nd pc vd and tx go into hf
  // and according to reddit those are on cycles - when they are all sending high
  // so the answer is the lowest common multiple of all four
  for (let i = 0; i < 20000; i++) {
    handler.press();
    handler.run();
  }
  const nums = ["nd", "pc", "vd", "tx"].map((key) => handler.highCycle[key]);

  return lcm(nums);
}

const t = part1(test, 1000);
const t2 = part1(test2, 1000);
if (t == 32000000 && t2 === 11687500) {
  console.log("part 1 answer", part1(input, 1000));
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 1 test fail", t, t2);
}

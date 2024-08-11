#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 4
 *
 * Summary: Sort logs based on timestamp, group by ID, then perform some basic analysis on the entries to find the guard with max sleep.
 * Escalation: Look for the maximum by a different method
 * Solution: The majority of the difficulty is parsing the input into order and making sense of the start and end events.
 * Create a guard class to collect all related log entries, then perform the analysis
 *
 * Keywords: Input parsing
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input4.txt", "utf8");
const test = `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`;

class Guard {
  public lastAsleep?: Date;
  public sleepSum = 0;
  public minuteCounts: number[];

  constructor(public key: string, public logs: [Date, string][] = []) {
    this.minuteCounts = new Array(60).fill(0);
  }

  public get id(): number {
    return parseInt(this.key.split(" ")[1].replace("#", ""));
  }

  public get maxMinute(): number {
    const max = Math.max(...this.minuteCounts);
    return this.minuteCounts.findIndex((c) => c === max);
  }

  public get maxMinute2(): number {
    return Math.max(...this.minuteCounts);
  }

  public addLog(time: Date, log: string): void {
    this.logs.push([time, log]);
  }

  public process(): void {
    let sleepStart = 0;
    this.logs.forEach(([time, log]) => {
      if (log.includes("asleep")) {
        sleepStart = time.getMinutes();
      } else if (log.includes("wakes")) {
        const sleepEnd = time.getMinutes();
        this.sleepSum += sleepEnd - sleepStart;
        for (let i = sleepStart; i < sleepEnd; i++) {
          this.minuteCounts[i]++;
        }
      }
    });
  }
}

function parseInput(input: string): Guard[] {
  const ordered = input
    .split("\n")
    .map((line) => {
      const [ts, bits] = line.replace("[1518", "2018").split("] ");
      return [new Date(ts), bits] as [Date, string];
    })
    .sort((a, b) => (a[0].valueOf() as number) - (b[0].valueOf() as number));

  const gm: Record<string, Guard> = {};

  function getGuard(key: string): Guard {
    if (!gm[key]) {
      gm[key] = new Guard(key);
    }
    return gm[key];
  }

  let last: Guard;
  ordered.forEach(([logTime, log]) => {
    if (log.includes("begins shift")) {
      last = getGuard(log);
    } else {
      last.addLog(logTime, log);
    }
  });

  return Object.values(gm).map((g) => {
    g.process();
    return g;
  });
}

function part1(input: string): number {
  const guards = parseInput(input);
  const guardMax = Math.max(...guards.map((g) => g.sleepSum));
  const guard = guards.find((g) => g.sleepSum === guardMax)!;
  return guard?.id * guard?.maxMinute;
}

function part2(input: string): number {
  const guards = parseInput(input);
  const guardMax = Math.max(...guards.map((g) => g.maxMinute2));
  const guard = guards.find((g) => g.maxMinute2 === guardMax)!;
  return guard?.id * guard?.maxMinute;
}

const t = part1(test);
if (t === 240) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 4455) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

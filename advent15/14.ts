#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input14.txt", "utf8") as string;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

class Reindeer {
  public name: string;
  public speed: number;
  public duration: number;
  public rest: number;
  public points: number = 0;
  public distance: number = 0;

  constructor(line: string) {
    const bits = line.split(" ");
    this.name = bits[0];
    this.speed = parseInt(bits[3], 10);
    this.duration = parseInt(bits[6], 10);
    this.rest = parseInt(bits[13], 10);
  }

  public get loopTime(): number {
    return this.duration + this.rest;
  }

  public tick(time: number): number {
    const loops = Math.floor(time / this.loopTime);
    const full = this.speed * this.duration * loops;

    const rem = time % this.loopTime;
    const mul = Math.min(this.duration, rem);
    const part = mul * this.speed;

    this.distance = full + part;
    return this.distance;
  }
}
const input1 = `Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`;

function fastestDeer(input: string, time: number): number {
  const reindeer = input.split("\n").map((l) => new Reindeer(l));
  return Math.max(...reindeer.map((r) => r.tick(time)));
}

test(1120, fastestDeer(input1, 1000));
console.log("Part One:", fastestDeer(input, 2503));

function pointDeer(input: string, time: number): number {
  const reindeer = input.split("\n").map((l) => new Reindeer(l));
  for (let t = 1; t <= time; t++) {
    let winD = 0;
    for (const r of reindeer) {
      winD = Math.max(winD, r.tick(t));
    }
    for (const r of reindeer) {
      if (r.distance === winD) {
        r.points++;
      }
    }
  }
  return Math.max(...reindeer.map((r) => r.points));
}

console.log("");
test(689, pointDeer(input1, 1000));
console.log("Part Two: ", pointDeer(input, 2503));

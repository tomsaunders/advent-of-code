#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell } from "./util";
const input = fs.readFileSync("input17.txt", "utf8");
const test = fs.readFileSync("test17.txt", "utf8");

class Probe {
  constructor(
    public x: number,
    public y: number,
    public velX: number,
    public velY: number
  ) {}

  public step(): this {
    this.x += this.velX;
    this.y += this.velY;
    if (this.velX > 0) {
      this.velX--;
    } else if (this.velX < 0) {
      this.velX++;
    }
    this.velY--;

    return this;
  }
}

function part1(input: string): number {
  const target = input.replace("target area: ", "");
  const [xt, yt] = target.split(", ");

  const [xLow, xMax] = xt
    .replace("x=", "")
    .split("..")
    .map((i) => parseInt(i, 10));
  const [yLow, yMax] = yt
    .replace("y=", "")
    .split("..")
    .map((i) => parseInt(i, 10));

  function within(p: Probe): boolean {
    return p.x >= xLow && p.x <= xMax && p.y >= yLow && p.y <= yMax;
  }

  let maxY = 0;
  for (let velX = -100; velX < xMax; velX++) {
    for (let velY = Math.min(yLow, yMax); velY < 1000; velY++) {
      const p = new Probe(0, 0, velX, velY);
      let probeMaxY = 0;
      let steps = 0;
      while (steps < 1000 && p.x < xMax && p.y > yLow) {
        p.step();
        probeMaxY = Math.max(probeMaxY, p.y);
        if (within(p) && probeMaxY > maxY) {
          maxY = Math.max(probeMaxY, maxY);
          steps = 1111;
        }
        steps++;
      }
    }
  }

  return maxY;
}

const t1 = part1(test);
if (t1 === 45) {
  console.log("Part 1: ", part1(input));
  /////// part 2
  const t2 = part2(test);
  if (t2 === 112) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const target = input.replace("target area: ", "");
  const [xt, yt] = target.split(", ");

  const [xLow, xMax] = xt
    .replace("x=", "")
    .split("..")
    .map((i) => parseInt(i, 10));
  const [yLow, yMax] = yt
    .replace("y=", "")
    .split("..")
    .map((i) => parseInt(i, 10));

  function within(p: Probe): boolean {
    return p.x >= xLow && p.x <= xMax && p.y >= yLow && p.y <= yMax;
  }

  let every: Set<string> = new Set<string>();
  for (let velX = -300; velX < 300; velX++) {
    for (let velY = -300; velY < 300; velY++) {
      const p = new Probe(0, 0, velX, velY);
      let steps = 0;
      while (steps < 1000 && p.x < xMax && p.y > yLow) {
        p.step();
        if (within(p)) {
          every.add(`${velX},${velY}`);
          steps = 1111;
        }
        steps++;
      }
    }
  }

  return every.size;
}

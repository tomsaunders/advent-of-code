#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 10
 *
 * Summary: Simulate movement of points with x, y, dx and dy. Once they converge, determine what letters they appear to write.
 * Escalation: Find the exact second they are in the correct position
 * Solution: Simulate movement into the future as X = X + DX * TIME. Draw using the Grid util.
 * The correct second is the point at which the coordinate range was the least. I guessed it by hand tweaking but it could have been calculated as well.
 *
 * Keywords: Grid, Velocity
 * References: N/A
 */
import * as fs from "fs";
import { Grid, mapNum, ON } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");
const test = `position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`;

class Light {
  constructor(public x: number, public y: number, private dx: number, private dy: number) {}

  public tick(ticks = 1) {
    this.x += this.dx * ticks;
    this.y += this.dy * ticks;
  }

  public static fromLine(line: string): Light {
    const [x, y, dx, dy] = line
      .replace("position=<", "")
      .replace("> velocity=<", ",")
      .replace(">", "")
      .split(",")
      .map(mapNum);
    return new Light(x, y, dx, dy);
  }
}

function parseInput(input: string): Light[] {
  return input.split("\n").map((line) => Light.fromLine(line));
}

function tickThenDraw(input: string, ticks: number): void {
  const lights = parseInput(input);

  const g = new Grid();
  g.minX = 999;
  g.minY = 999;
  lights.forEach((l) => {
    l.tick(ticks);
    g.createCell(l.x, l.y, 0, ON);
  });
  const xRange = g.maxX - g.minX;
  console.log(ticks, xRange);
  if (xRange < 300) g.draw();
}

tickThenDraw(test, 3);
for (let i = 10880; i < 10889; i++) {
  tickThenDraw(input, i);
}

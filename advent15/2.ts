#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input2.txt", "utf8");

const lines = input.split("\n").map(line => line.trim());
const tests = ["2x3x4", "1x1x10"];

class Present {
  public l: number;
  public w: number;
  public h: number;
  constructor(line: string) {
    [this.l, this.w, this.h] = line.split("x").map(bit => parseInt(bit, 10));
  }

  public wrapping(): number {
    const lw = this.l * this.w;
    const wh = this.w * this.h;
    const hl = this.h * this.l;

    return 2 * lw + 2 * wh + 2 * hl + Math.min(lw, wh, hl);
  }

  public ribbon(): number {
    const plw = 2 * this.l + 2 * this.w;
    const pwh = 2 * this.w + 2 * this.h;
    const phl = 2 * this.h + 2 * this.l;
    const cbv = this.l * this.h * this.w;

    return Math.min(plw, pwh, phl) + cbv;
  }
}
for (const test of tests) {
  const p = new Present(test);
  // console.log("test wrap", test, p.wrapping());
  // console.log("test ribbon", test, p.ribbon());
}

const presents = lines.map(line => new Present(line));
const wraps = presents.map(p => p.wrapping());
const ribs = presents.map(p => p.ribbon());

console.log("Total wrapping p1: ", wraps.reduce((previous, current) => previous + current, 0));
console.log("Total ribbon p2: ", ribs.reduce((previous, current) => previous + current, 0));

#!/usr/bin/env ts-node
import * as fs from "fs";
import { RED, RESET, GREEN } from "./util";
const input = fs.readFileSync("input8.txt", "utf8");
const lines = input.split("\n");

const w = 50;
const h = 6;
const OFF = ".";
const ON = "#";

// export const RED: string = "\x1b[31m";
// export const GREEN: string = "\x1b[32m";
// export const YELLOW: string = "\x1b[33m";
// export const PURP: string = "\x1b[35m";
// export const WHITE: string = "\x1b[37m";
// export const RESET: string = "\x1b[0m";

class Pixel {
  constructor(public x: number, public y: number, public state: string = ".") {}
  public get key(): string {
    return `${this.x}:${this.y}`;
  }
  public get on(): boolean {
    return this.state === ON;
  }
  public get display(): string {
    return this.on ? `${GREEN}${this.state}${RESET}` : " ";
  }

  public light(): void {
    this.state = ON;
  }

  public rotateCol(off: number): void {
    this.y += off;
    this.y %= h;
  }

  public rotateRow(off: number): void {
    this.x += off;
    this.x %= w;
  }
}

function tinyScreen(lines: string[]): number {
  const lookup: { [key: string]: Pixel } = {};
  const pixels: Pixel[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = new Pixel(x, y);
      pixels.push(p);
      lookup[p.key] = p;
    }
  }
  for (const line of lines) {
    const bits = line.split(" ");
    if (bits[0] === "rect") {
      const [a, b] = bits[1].split("x");
      for (let y = 0; y < parseInt(b, 10); y++) {
        for (let x = 0; x < parseInt(a, 10); x++) {
          const k = `${x}:${y}`;
          lookup[k].light();
        }
      }
    } else if (bits[1] === "row") {
      const y = parseInt(bits[2].substr(2), 10);
      pixels
        .filter((p) => p.y === y)
        .forEach((p) => p.rotateRow(parseInt(bits[4], 10)));
    } else if (bits[1] === "column") {
      const x = parseInt(bits[2].substr(2), 10);
      pixels
        .filter((p) => p.x === x)
        .forEach((p) => p.rotateCol(parseInt(bits[4], 10)));
    }
    pixels.forEach((p) => {
      lookup[p.key] = p;
    });
  }
  for (let y = 0; y < h; y++) {
    let l = "";
    for (let x = 0; x < w; x++) {
      const k = `${x}:${y}`;
      l += lookup[k].display;
    }
    console.log(l);
  }

  return pixels.filter((p) => p.on).length;
}

const testIn = `rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1`.split("\n");

console.log("Part One", tinyScreen(lines));

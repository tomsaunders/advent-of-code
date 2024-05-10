#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input2.txt", "utf8");
const test = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

class Game {
  public id: number;
  public draws: Draw[];
  constructor(input: string) {
    const [gStr, rest] = input.split(": ");
    this.id = parseInt(gStr.replace("Game ", ""), 10);
    this.draws = rest.split("; ").map((r) => new Draw(r));
  }

  public isValid(r: number, g: number, b: number) {
    return this.draws.every((d) => d.isValid(r, g, b));
  }

  public get power(): number {
    const maxRed = Math.max(...this.draws.map((d) => d.red));
    const maxGreen = Math.max(...this.draws.map((d) => d.green));
    const maxBlue = Math.max(...this.draws.map((d) => d.blue));

    return maxRed * maxGreen * maxBlue;
  }
}

class Draw {
  public red: number = 0;
  public green: number = 0;
  public blue: number = 0;

  constructor(input: string) {
    const bits = input.split(", ");
    bits.forEach((bit) => {
      const [nStr, colour] = bit.split(" ");
      if (colour === "red") {
        this.red = parseInt(nStr, 10);
      } else if (colour === "green") {
        this.green = parseInt(nStr, 10);
      } else if (colour === "blue") {
        this.blue = parseInt(nStr, 10);
      }
    });
  }

  public isValid(r: number, g: number, b: number) {
    return this.red <= r && this.green <= g && this.blue <= b;
  }
}

function part1(input: string, redMax: number, greenMax: number, blueMax: number): number {
  const lines = input.split("\n");
  const numbers = lines
    .map((l) => new Game(l))
    .filter((g) => g.isValid(redMax, greenMax, blueMax))
    .map((g) => g.id);
  return arrSum(numbers);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const numbers = lines.map((l) => new Game(l)).map((g) => g.power);
  return arrSum(numbers);
}

const t = part1(test, 12, 13, 14);
if (t == 8) {
  console.log("part 1 answer", part1(input, 12, 13, 14));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 2286) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

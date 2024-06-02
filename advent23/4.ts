#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, arrProd, arrSum, isNumeric } from "./util";
const input = fs.readFileSync("input4.txt", "utf8");
const test = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

class Card {
  public winningNumbers: Set<number>;
  public matchCount: number = 0;
  public score: number = 0;

  public constructor(
    public cardNumber: number,
    winning: number[],
    public selectedNumbers: number[]
  ) {
    this.winningNumbers = new Set(winning);
    this.selectedNumbers.forEach((n) => {
      if (this.winningNumbers.has(n)) {
        this.matchCount++;
      }
    });
    if (this.matchCount) {
      this.score = Math.pow(2, this.matchCount - 1);
    }
  }

  public static parseFromLine(line: string): Card {
    const [left, right] = line.split(" | ");
    const [card, winners] = left.split(": ");
    return new Card(
      parseInt(card.replace("Card ", ""), 10),
      winners
        .split(" ")
        .filter((x) => !!x)
        .map((n) => parseInt(n, 10)),
      right
        .split(" ")
        .filter((x) => !!x)
        .map((n) => parseInt(n, 10))
    );
  }
}

function part1(input: string): number {
  const lines = input.split("\n");
  const numbers = lines.map((l) => Card.parseFromLine(l)).map((c) => c.score);
  return arrSum(numbers);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const cards = lines.map((l) => Card.parseFromLine(l));
  const counts = cards.slice(0).map((s) => 1);
  cards.forEach((card, idx) => {
    const myCount = counts[idx];
    for (let i = 1; i <= card.matchCount; i++) {
      counts[i + idx] += myCount;
    }
  });
  return arrSum(counts);
}

const t = part1(test);
if (t == 13) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 30) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

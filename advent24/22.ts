#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 22
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: bigint
 * References: N/A
 */
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input22.txt", "utf8");
const test = `1
10
100
2024`;

function parseInput(input: string): Buyer[] {
  return input.split("\n").map((n) => new Buyer(n));
}

function secretNumber(n: bigint): bigint {
  const m64 = BigInt(n * 64n);
  const mix = BigInt(n ^ m64);
  const prune = BigInt(mix % 16777216n);

  const d32 = BigInt(prune / 32n);
  const mix2 = BigInt(prune ^ d32);
  const prune2 = BigInt(mix2 % 16777216n);

  const m2048 = BigInt(prune2 * 2048n);
  const mix3 = BigInt(prune2 ^ m2048);
  const prune3 = BigInt(mix3 % 16777216n);
  return prune3;
}

type SecretNumber = {
  num: bigint;
  price: number;
  sequence: string;
};

class Buyer {
  first: bigint;
  sequenceMap: Record<string, number> = {};
  secretNumbers: SecretNumber[] = [];

  constructor(input: string) {
    this.first = BigInt(input);
    this.secretNumbers.unshift({
      num: this.first,
      price: Number(this.first % 10n),
      sequence: "",
    });
  }

  tick(): void {
    const last = this.secretNumbers[0];
    const num = secretNumber(last.num);
    const lastBits = last.sequence ? last.sequence.split(",") : [];
    if (lastBits.length > 3) {
      lastBits.shift();
    }
    const price = Number(num % 10n);
    lastBits.push((price - last.price).toString());
    const sequence = lastBits.join(",");
    if (!this.sequenceMap[sequence]) {
      this.sequenceMap[sequence] = price;
    }
    this.secretNumbers.unshift({ num, price, sequence });
  }

  get lastSecretNumber(): SecretNumber {
    return this.secretNumbers[0];
  }

  get lastNum(): bigint {
    return this.lastSecretNumber.num;
  }
}

function part1(input: string, count: number): bigint {
  const buyers = parseInput(input);

  return buyers
    .map((buyer) => {
      for (let i = 0; i < count; i++) {
        buyer.tick();
      }
      return buyer.lastNum;
    })
    .reduce((a, b) => a + b, 0n);
}

function part2(input: string): number {
  const buyers = parseInput(input);
  const allSequences: string[] = [];
  buyers.forEach((b) => {
    for (let i = 0; i < 2000; i++) {
      b.tick();
    }
    allSequences.push(...Object.keys(b.sequenceMap));
  });
  const seqToCheck = Array.from(new Set(allSequences));
  return Math.max(
    ...seqToCheck.map((sequence) => {
      return arrSum(
        buyers.map((b) => {
          return b.sequenceMap[sequence] || 0;
        })
      );
    })
  );

  return 0;
}

console.log(part1("123", 10));
const t = part1(test, 2000);
if (t == 37327623n) {
  console.log("part 1 answer", part1(input, 2000));
} else {
  console.log("part 1 test fail", t);
}
const x = new Buyer("123");
for (let i = 0; i < 10; i++) {
  x.tick();
}
console.log(x);

const t2 = part2(`1
2
3
2024`);
if (t2 == 23) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

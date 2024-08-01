#!/usr/bin/env ts-node

/**
 * Advent of Code 2017 - Day 15
 *
 * Summary: Generate numbers according to some rules and count the number of times they match in binary for the last 16 bits.
 * Escalation: Tweak the generation rules
 * Naive: Compare the two numbers by converting to a binary string and then slicing the end.
 * Solution: From reddit: Compare via '& 0xFFFF' - 1000x faster?
 *
 * Keywords: Reddit solution thread
 * References:
 */
const input: number[] = [883, 879];
const test: number[] = [65, 8921];

const divisor = 2147483647;
const factorA = 16807;
const factorB = 48271;

function part1(genA: number, genB: number): number {
  let match = 0;
  for (let i = 0; i < 40000000; i++) {
    genA *= factorA;
    genB *= factorB;
    genA %= divisor;
    genB %= divisor;
    if ((genA & 0xffff) === (genB & 0xffff)) {
      match++;
    }
  }
  return match;
}

function part2(genA: number, genB: number): number {
  let match = 0;
  for (let i = 0; i < 5000000; i++) {
    do {
      genA *= factorA;
      genA %= divisor;
    } while (genA % 4 !== 0);

    do {
      genB *= factorB;
      genB %= divisor;
    } while (genB % 8 !== 0);

    if ((genA & 0xffff) === (genB & 0xffff)) {
      match++;
    }
  }
  return match;
}

const t = part1(test[0], test[1]);
if (t === 588) {
  console.log("part 1 answer", part1(input[0], input[1]));
  const t2 = part2(test[0], test[1]);
  if (t2 === 309) {
    console.log("part 2 answer", part2(input[0], input[1]));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

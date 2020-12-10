#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input22.txt", "utf8") as string;

function test(a: number, b: number): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

function dealNew(deck: number[]): number[] {
  const stack: number[] = [];
  while (deck.length) {
    stack.push(deck.pop() as number);
  }
  return stack;
}

function cut(deck: number[], slice: number): number[] {
  const a = deck.slice(0, slice);
  const b = deck.slice(slice);
  return [...b, ...a];
}

function dealInc(deck: number[], inc: number): number[] {
  const size: number = deck.length;
  const stack: number[] = [];
  let idx: number = 0;
  while (deck.length) {
    stack[idx] = deck.shift() as number;
    idx += inc;
    idx = idx % size;
  }
  return stack;
}

function newDeck(size: number): number[] {
  const deck: number[] = [];
  let i = 0;
  while (i < size) {
    deck.push(i);
    i++;
  }
  return deck;
}

function deal(input: string, deck: number[]): number[] {
  const lines = input.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    if (line === "deal into new stack") {
      deck = dealNew(deck);
    } else if (line.substr(0, 3) === "cut") {
      const cutSize = parseInt(line.substr(4), 10);
      deck = cut(deck, cutSize);
    } else if (line.includes("deal with increment")) {
      const inc = parseInt(line.replace("deal with increment ", ""), 10);
      deck = dealInc(deck, inc);
    }
    // console.log(line);
    // console.log(deck);
    // console.log(deck.indexOf(9));
  }

  return deck;
}

const input1a = `deal with increment 7
deal into new stack
deal into new stack`;
// Result: 0 3 6 9 2 5 8 1 4 7
console.log(deal(input1a, newDeck(10)));

const input1b = `cut 6
deal with increment 7
deal into new stack`;
// Result: 3 0 7 4 1 8 5 2 9 6
console.log(deal(input1b, newDeck(10)));

const input1c = `deal with increment 7
deal with increment 9
cut -2`;
// Result: 6 3 0 7 4 1 8 5 2 9
console.log(deal(input1c, newDeck(10)));

const input1d = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
// Result: 9 2 5 8 1 4 7 0 3 6
console.log(deal(input1d, newDeck(10)));

const factory = newDeck(10007);
const part1 = deal(input, factory);
console.log("Part 1: ", part1.indexOf(2019));

// console.log("\nPART 2\n");
// When you get back, you discover that the 3D printers have combined their power to create for you a single, giant,
// brand new, factory order deck of 119315717514047 space cards.
// You decide to apply your complete shuffle process (your puzzle input) to the deck 101741582076661 times in a row.
// what number is on the card that ends up in position 2020?

console.log("\nPart 2\n");
test(3, deal2(input1a, 10, 9, 1));
test(8, deal2(input1b, 10, 9, 1));
test(9, deal2(input1c, 10, 9, 1));
test(0, deal2(input1d, 10, 9, 1));

function deal2(
  input: string,
  deckSize: number,
  card: number,
  repeat: number
): number {
  const lines = input.split("\n");
  let idx = card; //the card we care about starts at this position

  let it = 0;
  const map = new Map<number, number>();
  while (it++ < 100) {
    if (it % 100000 === 0) {
      console.log(it / repeat);
    }
    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      if (line === "deal into new stack") {
        idx = Math.abs(deckSize - 1 - idx);
      } else if (line.substr(0, 3) === "cut") {
        const cutSize = parseInt(line.substr(4), 10);
        idx += deckSize;
        idx -= cutSize;
        idx = idx % deckSize;
      } else if (line.includes("deal with increment")) {
        const inc = parseInt(line.replace("deal with increment ", ""), 10);
        const offset = idx * inc;
        idx = offset % deckSize;
      }
    }
    console.log(idx);
  }

  return idx;
}
console.log("Part 2: ", deal2(input, 119315717514047, 2020, 101741582076661));

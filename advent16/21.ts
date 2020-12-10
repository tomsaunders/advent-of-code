#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input21.txt", "utf8");
const lines = input.split("\n");

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

function scramble(input: string, lines: string[]): string {
  let arr = input.split("");
  for (const line of lines) {
    const bits = line.split(" ");
    const [first, second] = bits;
    let narr = arr.slice(0);

    if (first === "swap") {
      let x = 0;
      let y = 0;
      if (second === "position") {
        x = parseInt(bits[2], 10);
        y = parseInt(bits[5], 10);
      } else if (second === "letter") {
        x = arr.indexOf(bits[2]);
        y = arr.indexOf(bits[5]);
      }
      narr[x] = arr[y];
      narr[y] = arr[x];
    } else if (first === "rotate") {
      const n = parseInt(bits[2], 10);
      if (second === "left") {
        const left = arr.slice(0, n);
        const right = arr.slice(n);
        narr = [...right, ...left];
      } else if (second === "right") {
        const left = arr.slice(0, -n);
        const right = arr.slice(-n);
        narr = [...right, ...left];
      }
    } else if (first === "reverse") {
      const x = parseInt(bits[2], 10);
      const y = parseInt(bits[4], 10);
      const d = y - x;
      for (let i = 0; i <= d; i++) {
        narr[x + i] = arr[y - i];
      }
    } else if (first === "move") {
    }
    arr = narr;
  }
  return arr.join("");
}

const testLines: string[] = [
  "swap position 4 with position 0",
  "swap letter d with letter b",
  "reverse positions 0 through 4",
  "rotate left 1 step",
  "move position 1 to position 4",
  "move position 3 to position 0",
  "rotate based on position of letter b",
  "rotate based on position of letter d",
];

// swap position 4 with position 0 swaps the first and last letters, producing the input for the next step, ebcda.
test("ebcda", scramble("abcde", testLines.slice(0, 1)));
// swap letter d with letter b swaps the positions of d and b: edcba.
test("edcba", scramble("ebcda", testLines.slice(1, 2)));
// reverse positions 0 through 4 causes the entire string to be reversed, producing abcde.
test("abcde", scramble("edcba", testLines.slice(2, 3)));
// rotate left 1 step shifts all letters left one position, causing the first letter to wrap to the end of the string: bcdea.
test("bcdea", scramble("abcde", testLines.slice(3, 4)));
test("dabc", scramble("abcd", ["rotate right 1 step"]));
// move position 1 to position 4 removes the letter at position 1 (c), then inserts it at position 4 (the end of the string): bdeac.
test("bdeac", scramble("bcdea", testLines.slice(4, 5)));
// move position 3 to position 0 removes the letter at position 3 (a), then inserts it at position 0 (the front of the string): abdec.

// rotate based on position of letter b finds the index of letter b (1), then rotates the string right once plus a number of times equal to that index (2): ecabd.

// rotate based on position of letter d finds the index of letter d (4), then rotates the string right once, plus a number of times equal to that index, plus an additional time because the index was at least 4, for a total of 6 right rotations: decab.

// console.log("Answer:", scramble("abcdefgh", lines))

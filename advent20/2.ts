#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input2.txt", "utf8");

const lines = input.split("\n").map((line) => line.trim());

class Password {
  public valid: boolean;
  public valid2: boolean;

  constructor(line: string) {
    const bits = line.split(" ");
    const range = bits[0];
    const letter = bits[1].replace(":", "");
    const pass = bits[2];
    const rb = range.split("-");
    const lower = parseInt(rb[0], 10);
    const upper = parseInt(rb[1], 10);

    const count = pass.split("").filter((l) => l === letter).length;
    this.valid = count >= lower && count <= upper;

    let found = 0;

    if (pass[lower - 1] === letter) {
      found++;
    }
    if (pass[upper - 1] === letter) {
      found++;
    }

    this.valid2 = found === 1;
  }
}

const tests = [
  new Password("1-3 a: abcde"),
  new Password("1-3 b: cdefg"),
  new Password("2-9 c: ccccccccc"),
];

const passwords = lines.map((l) => new Password(l));
console.log("valid", passwords.filter((p) => p.valid).length);
console.log("valid2", passwords.filter((p) => p.valid2).length);

console.log(tests);

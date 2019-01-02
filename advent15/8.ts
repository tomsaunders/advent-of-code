#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input8.txt", "utf8");

const lines = input.split("\n");

let stringCode = 0;
let charCount = 0;
let nuCount = 0;
for (const line of lines) {
  let s = line.length;
  let c = eval(line).length;
  stringCode += s;
  charCount += c;
  let n = s + 2;
  for (let i = 0; i < s; i++) {
    let x = line[i];
    if (x === '"' || x === `\\`) {
      n++;
    }
  }
  nuCount += n;
}
console.log(stringCode - charCount);
console.log(nuCount - stringCode);

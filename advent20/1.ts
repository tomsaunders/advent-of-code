#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");
const lines = input.split("\n").map((line) => parseInt(line.trim(), 10));

for (let a = 0; a < lines.length; a++) {
  for (let b = a + 1; b < lines.length; b++) {
    const sum = lines[a] + lines[b];
    if (sum === 2020) {
      console.log(
        ` Part one Has ${lines[a]}, ${lines[b]} which produce ${
          lines[a] * lines[b]
        }`
      );
    }
  }
}

for (let a = 0; a < lines.length; a++) {
  for (let b = a + 1; b < lines.length; b++) {
    for (let c = b + 1; c < lines.length; c++) {
      const sum = lines[a] + lines[b] + lines[c];
      if (sum === 2020) {
        console.log(
          ` Part two Has ${lines[a]}, ${lines[b]} and ${
            lines[c]
          } which produce ${lines[a] * lines[b] * lines[c]}`
        );
      }
    }
  }
}

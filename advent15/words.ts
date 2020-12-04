#!/usr/bin/env npx ts-node
import * as fs from "fs";
const wordfile = fs.readFileSync("/usr/share/dict/words", "utf8");

const words: string[] = wordfile.split("\n");
const reverses: { [key: string]: string } = {};
for (const word of words) {
  const r = word
    .split("")
    .reverse()
    .join("");
  reverses[r] = word;
}

for (const word of words) {
  if (reverses[word] && word.length > 2) {
    console.log(word, reverses[word]);
  }
}

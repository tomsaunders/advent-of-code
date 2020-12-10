#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input5.txt", "utf8");

const lines = input.split("\n");

const isNice = (word: string): boolean => {
  return (
    !!word.match(/.*[aeiou].*[aeiou].*[aeiou].*/g) &&
    !!word.match(/.*([a-z])(\1).*/g) &&
    !word.match(/.*(ab|pq|xy|cd).*/)
  );
};

const isTwoNice = (word: string): boolean => {
  return (
    !!word.match(/.*([a-z]{2}).*(\1).*/g) &&
    !!word.match(/.*([a-z])[a-z](\1).*/g)
  );
};

let c = 0;
let t = 0;
for (const line of lines) {
  if (isNice(line)) c++;
  if (isTwoNice(line)) t++;
}
console.log(c);
console.log(t);

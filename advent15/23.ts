#!/usr/bin/env ts-node
import * as fs from "fs";
import { off } from "process";
import { test } from "./util";

const input = fs.readFileSync("input23.txt", "utf8") as string;
const lines = input.split("\n");

const registers: { [key: string]: number } = { a: 0, b: 0 };

function execute(registers: { [key: string]: number }): number {
  let idx = 0;
  while (idx < lines.length) {
    // console.log(idx, lines[idx], registers);
    const bits = lines[idx].trim().replace(",", "").split(" ") as string[];
    const [key, val] = bits;
    let offset = 1;
    if (key === "hlf") {
      registers[val] /= 2;
    } else if (key === "tpl") {
      registers[val] *= 3;
    } else if (key === "inc") {
      registers[val] += 1;
    } else if (key === "jmp") {
      offset = parseInt(val, 10);
    } else if (key === "jie" && registers[val] % 2 === 0) {
      offset = parseInt(bits[2], 10);
    } else if (key === "jio" && registers[val] === 1) {
      offset = parseInt(bits[2], 10);
    }
    idx += offset;
  }
  console.log(registers);
  return registers["b"];
}
console.log("Part One", execute({ a: 0, b: 0 }));
console.log("Part Two", execute({ a: 1, b: 0 }));

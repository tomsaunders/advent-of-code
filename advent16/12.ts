#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const input = fs.readFileSync("input12.txt", "utf8");
const lines = input.split("\n");

function execute(registers: { [key: string]: number }): number {
  function v(val: any): number {
    const i = parseInt(val, 10);
    return isNaN(i) ? registers[val] : i;
  }

  let i = 0;
  while (i < lines.length) {
    const bits = lines[i].split(" ");
    const cmd = bits[0];
    const val = v(bits[1]);
    // console.log(lines[i], cmd, val, registers);

    if (cmd === "cpy") {
      registers[bits[2]] = val;
      i++;
    } else if (cmd === "inc") {
      registers[bits[1]]++;
      i++;
    } else if (cmd === "dec") {
      registers[bits[1]]--;
      i++;
    } else if (cmd === "jnz") {
      if (val !== 0) {
        i += v(bits[2]);
      } else {
        i++;
      }
    }
  }
  console.log(registers);
  return registers["a"];
}

console.log("Part One", execute({ a: 0, b: 0, c: 0, d: 0 }));
console.log("Part Two", execute({ a: 0, b: 0, c: 1, d: 0 }));

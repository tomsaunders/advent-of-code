#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const input = fs.readFileSync("input23.txt", "utf8");
const lines = input.split("\n");

function execute(
  lines: string[],
  registers: { [key: string]: number }
): number {
  function v(val: any): number {
    const i = parseInt(val, 10);
    return isNaN(i) ? registers[val] : i;
  }

  let i = 0;
  let x = 0;
  while (i < lines.length) {
    const bits = lines[i].split(" ");
    const cmd = bits[0];
    const val = v(bits[1]);
    console.log(lines[i], cmd, val, registers);

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
    } else if (cmd === "tgl") {
      const n = i + val;
      if (n < lines.length) {
        const nLine = lines[n];

        // 1 arg = inc, dec, tgl
        // 2 arg = jnz, cpy

        if (nLine.startsWith("inc")) {
          lines[n] = nLine.replace("inc", "dec");
        } else if (nLine.startsWith("dec") || nLine.startsWith("tgl")) {
          lines[n] = `inc` + nLine.substr(3);
        } else if (nLine.startsWith("jnz")) {
          lines[n] = nLine.replace("jnz", "cpy");
        } else if (nLine.startsWith("cpy")) {
          lines[n] = nLine.replace("cpy", "jnz");
        }
      }
      i++;
    }
  }
  console.log(registers);
  return registers["a"];
}

test(
  execute(
    `cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a`.split("\n"),
    { a: 0, b: 0, c: 0, d: 0 }
  ),
  3
);

console.log("Part One", execute(lines.slice(), { a: 7, b: 0, c: 0, d: 0 }));
console.log("Part Two", execute(lines.slice(), { a: 12, b: 0, c: 0, d: 0 }));

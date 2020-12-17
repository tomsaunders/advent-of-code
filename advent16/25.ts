#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const input = fs.readFileSync("input25.txt", "utf8");
const lines = input.split("\n");

function partOne(lines: string[]): number {
  let a = 0;
  while (!execute(lines, { a: a, b: 0, c: 0, d: 0 })) {
    a++;
    console.log(a);
  }
  return a;
}

function execute(
  lines: string[],
  registers: { [key: string]: number }
): boolean {
  function v(val: any): number {
    const i = parseInt(val, 10);
    return isNaN(i) ? registers[val] : i;
  }

  let i = 0;
  const out = [];

  while (i < lines.length && out.length < 100) {
    const bits = lines[i].split(" ");
    const cmd = bits[0];
    const val = v(bits[1]);

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
    } else if (cmd === "out") {
      if (out.length % 2 == 0) {
        if (val !== 0) {
          // even, should be 0
          return false;
        }
      } else {
        if (val !== 1) {
          // odd, should be 0
          return false;
        }
      }
      out.push(val);
      i++;
    }
  }
  console.log(out);
  return true;
}

console.log("Part One", partOne(lines));

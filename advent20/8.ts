#!/usr/bin/env ts-node
import { arrSum, test } from "./util";
import * as fs from "fs";
import { exit } from "process";
let input = fs.readFileSync("input8.txt", "utf8");

const testIn = ``;

const lines = input.split("\n");

let idx = 0;
let acc = 0;
let seen = new Set<number>();
while (idx >= 0 && idx < lines.length) {
  if (seen.has(idx)) {
    console.log("Part One", acc);
    break;
  }
  seen.add(idx);

  const line = lines[idx];
  const [cmd, val] = line.split(" ");
  if (cmd === "nop") {
    idx++;
  } else if (cmd === "acc") {
    idx++;
    acc += parseInt(val, 10);
  } else if (cmd === "jmp") {
    idx += parseInt(val, 10);
  }
}

const accs: number[] = [];
const idxs: number[] = [];
const linz: string[][] = [];
const change: string[] = [];
lines.forEach((l, i) => {
  const z = lines.slice();
  const line = lines[i];
  if (line.includes("acc")) {
    return;
  } else if (line.includes("nop")) {
    z[i] = line.replace("nop", "jmp");
  } else if (line.includes("jmp")) {
    z[i] = line.replace("jmp", "nop");
  }
  change.push(z[i]);

  accs.push(0);
  idxs.push(0);
  linz.push(z);
});

let running = true;
while (running) {
  idxs.forEach((idx, i) => {
    const lz = linz[i];

    if (idx >= 0 && idx < lz.length) {
      const line = lz[idx];
      const [cmd, val] = line.split(" ");
      if (cmd === "nop") {
        idxs[i]++;
      } else if (cmd === "acc") {
        idxs[i]++;
        accs[i] += parseInt(val, 10);
      } else if (cmd === "jmp") {
        idxs[i] += parseInt(val, 10);
      }
    } else {
      console.log("Part 2", accs[i]);
      console.log("Changed line", i, change[i]);
      running = false;
    }
  });
}

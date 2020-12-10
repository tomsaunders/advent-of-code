#!/usr/bin/env ts-node
import * as fs from "fs";
import { IntcodeProcessor } from "./intcode";
const input = fs.readFileSync("input25.txt", "utf8") as string;

function permute(
  finished: Set<string>,
  options: string[],
  progress: string[]
): void {
  if (progress.length > 3) finished.add(progress.sort().join(","));
  if (options.length === 0) {
    return;
  }
  for (let i = 0; i < options.length; i++) {
    const next = options[i];
    const branch = [...progress, next];

    const rest = [...options];
    rest.splice(i, 1);

    permute(finished, rest, branch);
  }
}
function permutations(arr: any[]): string[][] {
  const all = new Set<string>();
  permute(all, arr, []);

  return Array.from(all.values()).map((s) => s.split(",").filter((s) => !!s));
}

function part1(codes: number[]): number {
  const droid = new IntcodeProcessor(codes.slice(0));
  let cmds = `south
north
west
take ornament
west
take astrolabe
south
take hologram
north
north
take fuel cell
inv
south
east
south
east
take weather machine
south
north
west
north
east
east
take mug
north
take monolith
south
south
west
north
west
take bowl of rice
north
west
north
inv`;
  const items = [
    "bowl of rice",
    "monolith",
    "mug",
    "weather machine",
    "fuel cell",
    "astrolabe",
    "ornament",
    "hologram",
  ];
  // reset
  for (const item of items) {
    cmds += `\ndrop ${item}`;
  }
  const perms = permutations(items);
  let last: string[] = [];
  for (const permItems of perms) {
    for (const l of last) {
      if (!permItems.includes(l)) {
        cmds += `\ndrop ${l}`;
      }
    }
    for (const item of permItems) {
      if (!last.includes(item)) {
        cmds += `\ntake ${item}`;
      }
    }
    cmds += "\nnorth";
    last = permItems;
  }
  droid.inputAscii(cmds);
  let l = "";
  let nx = 0;
  while (!droid.halted) {
    const o = droid.run();
    if (o === 10) {
      console.log(l);
      l = "";
    } else {
      l += String.fromCharCode(o);
    }
    nx++;
  }
  return 99;
}

const codes = input.split(",").map((s) => parseInt(s, 10));
console.log("Part 1", part1(codes.slice(0)));

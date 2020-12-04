#!/usr/bin/env npx ts-node
import * as fs from "fs";
import { test } from "./util";

const input = fs.readFileSync("input19.txt", "utf8") as string;
const medicine =
  "CRnSiRnCaPTiMgYCaPTiRnFArSiThFArCaSiThSiThPBCaCaSiRnSiRnTiTiMgArPBCaPMgYPTiRnFArFArCaSiRnBPMgArPRnCaPTiRnFArCaSiThCaCaFArPBCaCaPTiTiRnFArCaSiRnSiAlYSiThRnFArArCaSiRnBFArCaCaSiRnSiThCaCaCaFYCaPTiBCaSiThCaSiThPMgArSiRnCaPBFYCaCaFArCaCaCaCaSiThCaSiRnPRnFArPBSiThPRnFArSiRnMgArCaFYFArCaSiRnSiAlArTiTiTiTiTiTiTiRnPMgArPTiTiTiBSiRnSiAlArTiTiRnPMgArCaFYBPBPTiRnSiRnMgArSiThCaFArCaSiThFArPRnFArCaSiRnTiBSiThSiRnSiAlYCaFArPRnFArSiThCaFArCaCaSiThCaCaCaSiRnPRnCaFArFYPMgArCaPBCaPBSiRnFYPBCaFArCaSiAl";

class Replacement {
  public from: string;
  public to: string;
  constructor(line: string) {
    [this.from, this.to] = line.split(" => ");
  }
}

function countMolecules(input: string, start: string): number {
  const replacements = input
    .split("\n")
    .filter((l) => !!l.trim())
    .map((l) => new Replacement(l));
  const molecules = new Set<string>();

  for (let i = 0; i < start.length; i++) {
    for (const r of replacements) {
      if (start.substr(i, r.from.length) === r.from) {
        const before = start.substr(0, i);
        const after = start.substr(i + r.from.length);
        const makes = `${before}${r.to}${after}`;
        // console.log(i, r, makes);
        molecules.add(makes);
      }
    }
  }
  return molecules.size;
}

const testIn = `H => HO
H => OH
O => HH`;

test(4, countMolecules(testIn, "HOH"));
test(7, countMolecules(testIn, "HOHOHO"));
console.log("Part one", countMolecules(input, medicine));

function minSteps(input: string, goal: string): number {
  const replacements = input
    .split("\n")
    .filter((l) => !!l.trim())
    .map((l) => new Replacement(l));

  const seen = new Set<string>();

  const queue: [string, number][] = [[goal, 1]];
  let min = 999;
  // work backwards from the goal to make it find 'e'
  let n = 0;
  let minmade = goal;
  while (queue.length) {
    n++;
    const [start, step] = queue.pop() as [string, number];
    if (step >= min) {
      continue;
    }
    if (n % 10000 == 0)
      console.log(
        `Length ${queue.length} step ${step} iterating from ${start}`
      );

    for (const r of replacements) {
      for (let i = 0; i < start.length; i++) {
        if (start.substr(i, r.to.length) === r.to) {
          const before = start.substr(0, i);
          const after = start.substr(i + r.to.length);
          const makes = `${before}${r.from}${after}`;

          if (makes === "e") {
            min = Math.min(min, step);
            console.log(`Made medicine in ${step}`);
          } else if (!seen.has(makes)) {
            seen.add(makes);
            queue.push([makes, step + 1]);
            queue.sort((a, b) => a.length - b.length);
            if (makes.length < minmade.length) {
              minmade = makes;
              console.log("new shortest string", makes);
            }
          }
        }
      }
    }
  }

  return min;
}

const test2In = `e => H
e => O
H => HO
H => OH
O => HH`;

test(3, minSteps(test2In, "HOH"));
test(6, minSteps(test2In, "HOHOHO"));
console.log("Part two", minSteps(input, medicine));

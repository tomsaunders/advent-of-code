#!/usr/bin/npx ts-node
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
  replacements.sort((a, b) => b.to.length - a.to.length);

  let steps = 0;
  let formula = goal;
  while (formula !== "e") {
    for (const r of replacements) {
      if (formula.includes(r.to)) {
        formula = formula.replace(r.to, r.from);
        steps++;
        break;
      }
    }
  }
  return steps;
}

const test2In = `e => H
e => O
H => HO
H => OH
O => HH`;

test(3, minSteps(test2In, "HOH"));
test(6, minSteps(test2In, "HOHOHO"));
console.log("Part two", minSteps(input, medicine));

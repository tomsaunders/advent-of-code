#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrProd, arrSum } from "./util";

const input = fs.readFileSync("input24.txt", "utf8") as string;
const packages = input.split("\n").map((l) => parseInt(l, 10));
packages.sort((a, b) => b - a);

let total = arrSum(packages);

function minQE(packages: number[], goal: number): number {
  let min = 99;

  function permute(
    all: number[][],
    options: number[],
    progress: number[]
  ): void {
    const sum = arrSum(progress);
    if (sum === goal) {
      all.push(progress);
      min = Math.min(min, progress.length);
      return;
    } else if (sum > goal || progress.length > min) {
      return;
    }
    for (let i = 0; i < options.length; i++) {
      const branch = [...progress, options[i]];
      const rest = [...options];
      rest.splice(i, 1);
      permute(all, rest.slice(i), branch);
    }
  }

  const all: number[][] = [];
  permute(all, packages.slice(), []);
  const qe = all.map(arrProd);
  return Math.min(...qe);
}

console.log("Part one", minQE(packages, total / 3));
console.log("Part two", minQE(packages, total / 4));

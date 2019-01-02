#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input9.txt", "utf8");

const lines = input.split("\n");

interface Lookup {
  [key: string]: Dist;
}

interface Dist {
  [key: string]: number;
}

const lookup: Lookup = {};

for (const line of lines) {
  // Norrath to Arbre = 115
  const match = line.match(/(\w*) to (\w*) = (\d*)/);
  if (!match) continue;
  const [full, from, to, dist] = match;
  const d = parseInt(dist, 10);
  if (!lookup[from]) lookup[from] = {};
  if (!lookup[to]) lookup[to] = {};
  lookup[from][to] = d;
  lookup[to][from] = d;
}

const keys = Array.from(Object.keys(lookup));
type Path = string[];
const combine = (current: Path, options: string[]): Path[] => {
  if (!options.length) {
    return [current];
  }
  let combs: Path[] = [];
  for (const option of options) {
    const next: Path = [...current, option];
    const noptions: string[] = options.filter((o) => o != option);
    const n = combine(next, noptions);
    combs = combs.concat(n);
  }
  return combs;
};
const paths = combine([], keys);
let min = 999999;
let max = 0;
for (const path of paths) {
  let dist = 0;
  for (let t = 1; t < path.length; t++) {
    const from = path[t - 1];
    const to = path[t];
    dist += lookup[from][to];
  }
  min = Math.min(min, dist);
  max = Math.max(max, dist);
}
console.log(min);
console.log(max);

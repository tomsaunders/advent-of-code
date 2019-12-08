#!/usr/bin/env npx ts-node
import * as fs from "fs";
let input = fs.readFileSync("input8.txt", "utf8") as string;
let w = 25;
let h = 6;

input = "0222112222120000";
w = h = 2;

const layerSize = w * h;

console.log("Answer");

function count(input: string, match: string): number {
  const arr = input.split("");
  return arr.filter((c) => c === match).length;
}

const layers: string[] = [];
let fewestCount = 99999;
let fewestLayer = "";
for (let i = 0; i < input.length; i += layerSize) {
  const layer = input.substr(i, layerSize);
  layers.unshift(layer);
  const countZero = count(layer, "0");
  if (countZero < fewestCount) {
    fewestCount = countZero;
    fewestLayer = layer;
  }
}
console.log("Answer", count(fewestLayer, "1") * count(fewestLayer, "2"));

console.log("\nPART 2");

const grid: string[][] = [];
for (let y = 0; y < h; y++) {
  const line = [];
  for (let x = 0; x < w; x++) {
    line.push("0");
  }
  grid.push(line);
}

for (const layer of layers) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pos = y * w + x;
      const char = layer[pos];
      if (char !== "2") {
        grid[y][x] = char;
      }
    }
  }
}

console.log("Answer", grid.join("\n"));

#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 11
 *
 * Summary: Given a formula for getting the value of a grid cell, find the 3x3 area with the highest combined value
 * Escalation: Find a larger area of unknown size with the highest value.
 * Naive: Wrap the cell value function in a cache and just loop through the 300x300 cells. And then 300x300x various sizes for part 2. Runs in 225s
 * Solution: Implement a summed-area-table
 *
 * Keywords: Summed Area Table
 * References: https://en.wikipedia.org/wiki/Summed-area_table
 */
import * as fs from "fs";
import { arrSum } from "./util";
import { off } from "process";
const input = 5791;

let data: Record<string, number> = {};
function cellPower(gridSerial: number, x: number, y: number) {
  const key = `${gridSerial}=${x}=${y}`;
  if (x < 0 || y < 0) return 0;

  if (!data[key]) {
    const rackID = x + 10;
    let power = rackID * y;
    power += gridSerial;
    power *= rackID;
    const powerStr = (power % 1000).toString().padStart(3, "0");
    data[key] = parseInt(powerStr[0]) - 5;
  }
  return data[key];
}

function k(x: number, y: number): string {
  return `${x}:${y}`;
}

function powerAt(sumTable: Record<string, number>, x: number, y: number, sizeP1: number) {
  // for rectange A---B
  //              |   |
  //              C---D
  // sum of values = sumTable@D + A - B - C
  const size = sizeP1 - 1;
  const A = k(x, y);
  const B = k(x + size, y);
  const C = k(x, y + size);
  const D = k(x + size, y + size);
  return sumTable[D] + sumTable[A] - sumTable[B] - sumTable[C];
}

function buildSumTable(gridSerial: number): Record<string, number> {
  const sumTable: Record<string, number> = {};
  for (let y = 1; y <= 300; y++) {
    for (let x = 1; x <= 300; x++) {
      sumTable[k(x, y)] =
        cellPower(gridSerial, x, y) +
        (sumTable[k(x, y - 1)] || 0) +
        (sumTable[k(x - 1, y)] || 0) -
        (sumTable[k(x - 1, y - 1)] || 0);
    }
  }

  const dRow = [""];
  const sRow = [""];
  console.log("grid serial", gridSerial);
  for (let y = 44; y < 49; y++) {
    let d: string[] = [];
    let s: string[] = [];
    for (let x = 32; x < 37; x++) {
      d.push(cellPower(gridSerial, x, y).toString().padStart(3, " "));
      s.push(sumTable[k(x, y)].toString().padStart(3, " "));
    }
    dRow.push(d.join(" "));
    sRow.push(s.join(" "));
  }
  console.log("data", dRow.join("\n"));
  console.log("sums", sRow.join("\n"));
  return sumTable;
}

function part1(gridSerial: number): string {
  data = {};
  const sumTable = buildSumTable(gridSerial);

  let max = 0;
  let maXY = "";
  for (let x = 0; x < 299; x++) {
    for (let y = 0; y < 299; y++) {
      const power = powerAt(sumTable, x, y, 3);
      if (power > max) {
        max = power;
        maXY = `${x},${y}`;
      }
    }
  }
  return maXY;
}

function part2(gridSerial: number): string {
  data = {};
  const sumTable = buildSumTable(gridSerial);

  let max = 0;
  let maXYZ = "";
  for (let x = 0; x < 299; x++) {
    for (let y = 0; y < 299; y++) {
      let maxSize = Math.min(20, 300 - Math.max(x, y));
      for (let size = 3; size < maxSize; size++) {
        const power = powerAt(sumTable, x, y, size);
        if (power > max) {
          max = power;
          maXYZ = `${x},${y},${size}`;
        }
      }
    }
  }
  return maXYZ;
}

if (
  cellPower(8, 3, 5) === 4 &&
  cellPower(57, 122, 79) === -5 &&
  cellPower(39, 217, 196) === 0 &&
  cellPower(71, 101, 153) === 4 &&
  part1(18) === "33,45" &&
  part1(42) === "21,61"
) {
  console.log("part 1 answer", part1(input));
  if (part2(18) === "90,269,16" && part2(42) === "232,251,12") {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", part2(18), part2(42));
  }
} else {
  console.log(
    "part 1 test fail",
    cellPower(8, 3, 5),
    cellPower(57, 122, 79),
    cellPower(39, 217, 196),
    cellPower(71, 101, 153)
    // part1(18),
    // part1(42)
  );
}

#!/usr/bin/env ts-node
import { test } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input5.txt", "utf8");
const lines = input.split("\n");

function getSeat(line: string): number {
  let low = 0;
  let upp = 127;
  for (let r = 0; r < 7; r++) {
    const x = line[r];
    // console.log(`${r} - ${x} - ${low} -> ${upp}`);

    const half = (upp + low) / 2;
    if (x === "F") upp = Math.floor(half);
    else if (x === "B") low = Math.ceil(half);
  }
  const row = low;

  low = 0;
  upp = 7;
  for (let c = 7; c < 10; c++) {
    const x = line[c];
    // console.log(`${c} - ${x} - ${low} -> ${upp}`);

    const half = (upp + low) / 2;
    if (x === "L") upp = Math.floor(half);
    else if (x === "R") low = Math.ceil(half);
  }
  const col = low;

  // console.log(`Row ${row} Column ${col}`);
  return row * 8 + col;
}

test(357, getSeat("FBFBBFFRLR"));
test(567, getSeat("BFFFBBFRRR"));
test(119, getSeat("FFFBBBFRRR"));
test(820, getSeat("BBFFBBFRLL"));

const seatIds = lines.map(getSeat);
const min = Math.min(...seatIds);
const max = Math.max(...seatIds);
console.log("Part 1", max);

for (let i = min + 1; i < max - 1; i++) {
  const l = i - 1;
  const r = i + 1;
  if (seatIds.includes(l) && seatIds.includes(r) && !seatIds.includes(i)) {
    console.log("Seat ID", i);
  }
}

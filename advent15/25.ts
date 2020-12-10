#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrProd, arrSum, test } from "./util";

const input = `To continue, please consult the code grid in the manual.  Enter the code at row 2981, column 3075.`;

const start = 20151125;
const multiplier = 252533;
const divider = 33554393;

function valAt(row: number, col: number): number {
  let last = start;
  let r = 1;
  let c = 1;
  let s = 1;
  while (r !== row || c !== col) {
    if (c == s) {
      s++;
      r = s;
      c = 1;
    } else {
      c++;
      r--;
    }
    const next = last * multiplier;
    last = next % divider;
    // console.log(r, c, last);
  }
  return last;
}
test(27995004, valAt(6, 6));
console.log("Part One", valAt(2981, 3075));

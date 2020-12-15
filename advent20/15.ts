#!/usr/bin/env ts-node
import { arrSum, test, Grid, Cell } from "./util";
import * as fs from "fs";
const testIn = ``.split("\n");

function sayNum(input: number[], stop: number = 2020): number {
  const turns = new Map<number, number>();
  let t = 0;
  let last = 0;
  while (t < stop) {
    let num = 0;
    if (t < input.length) {
      num = input[t];
    } else {
      if (turns.has(last)) {
        num = t - (turns.get(last) as number);
      } else {
        num = 0;
      }
    }
    // console.log("Say", num);
    turns.set(last, t);
    t++;

    last = num;
  }
  return last;
}

test(sayNum([0, 3, 6]), 436);
console.log("Part 1", sayNum([0, 5, 4, 1, 10, 14, 7]));
console.log("Part 2", sayNum([0, 5, 4, 1, 10, 14, 7], 30000000));

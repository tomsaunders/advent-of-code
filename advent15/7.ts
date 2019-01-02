#!/usr/bin/env npx ts-node
import * as fs from "fs";
import { isNumber } from "util";
const input = fs.readFileSync("input7.txt", "utf8");
// const input = `123 -> x
// 456 -> y
// x AND y -> d
// x OR y -> e
// x LSHIFT 2 -> f
// y RSHIFT 2 -> g
// NOT x -> h
// NOT y -> i`;

const lines = input.split("\n");

const wires: Map<string, number> = new Map<string, number>();
// part 2
wires.set("b", 16076);

const queue: Set<string> = new Set<string>();
while (lines.length) {
  const line = lines.shift()!!;
  // console.log(`${lines.length} ${line}`);

  // he RSHIFT 5 -> hh
  const three = line.match(/(\w*) (\w*) (.*) -> (\w*)/);
  // NOT y -> i
  const not = line.match(/(NOT) (.*) -> (\w*)/);
  // 123 -> y
  const ass = line.match(/(.*) -> (\w*)/);
  let a;
  let b;
  let c: string;
  let ins;
  if (!!three) {
    [, a, ins, b, c] = three;
  } else if (!!not) {
    [, ins, a, c] = not;
  } else if (!!ass) {
    [, a, c] = ass;
    ins = "ASS";
  } else {
    // console.log("UNPARSED LINE");
  }

  if (c!! === "b") {
    continue; // part 2
  }

  const knownA = !a || wires.has(a) || !isNaN(parseInt(a, 10));
  const knownB = !b || wires.has(b) || !isNaN(parseInt(b, 10));
  if (knownA && knownB) {
    const av = a && wires.has(a) ? wires.get(a)!! : parseInt(a!!, 10);
    const bv = b && wires.has(b) ? wires.get(b)!! : parseInt(b!!, 10);
    let cv = 0;
    switch (ins) {
      case "AND":
        cv = av & bv;
        break;
      case "OR":
        cv = av | bv;
        break;
      case "LSHIFT":
        cv = av << bv;
        break;
      case "RSHIFT":
        cv = av >> bv;
        break;
      case "NOT":
        cv = ~av;
        break;
      case "ASS":
        cv = av;
        break;
    }
    if (cv < 0) cv += 65536;
    wires.set(c!!, cv);
  } else {
    console.log("things unknown", line);
    lines.push(line);
  }
}
console.log(wires);

#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input6.txt", "utf8") as string;
const lines = input.split("\n");

function something(input?: any): number {
  return 99;
}

function test(a: any, b: any): void {
  const o = a == b ? "Test pass" : "Test fail";
  console.log(o, a);
}

test(1, something());

console.log("Answer");
something(input);

console.log("\n\nPART 2\n\n");

console.log("Answer");
something(input);

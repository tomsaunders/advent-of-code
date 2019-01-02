#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input12.txt", "utf8");

const obj = JSON.parse(input);

const rsum = (prev: number, val: any): number => {
  switch (val.constructor.name) {
    case "Number":
      return val + prev;
    case "Object":
      return Object.values(val).reduce(rsum, 0) + prev;
    case "Array":
      return val.reduce(rsum, 0) + prev;
  }
  return prev;
};

const rsum2 = (prev: number, val: any): number => {
  switch (val.constructor.name) {
    case "Number":
      return val + prev;
    case "Object":
      const oarr = Object.values(val);
      return oarr.includes("red") ? prev : oarr.reduce(rsum2, 0) + prev;
    case "Array":
      return val.reduce(rsum2, 0) + prev;
  }
  return prev;
};

const tests = [
  "[1,2,3]",
  '{"a":2,"b":4}',
  "[[[3]]]",
  ' {"a":{"b":4},"c":-1}',
  '{"a":[-1,1]}',
  '[-1,{"a":1}]',
  "[]",
  "{}",
  '[1,{"c":"red","b":2},3]',
  '{"d":"red","e":[1,2,3,4],"f":5}',
  '[1,"red",5]',
  input
];
console.log("\nPart 1\n");
for (const test of tests) {
  const t = [JSON.parse(test)];
  console.log(test.substr(0, 40), t.reduce(rsum, 0));
}

console.log("\n\nPart 2\n");
for (const test of tests) {
  const t = [JSON.parse(test)];
  console.log(test.substr(0, 40), t.reduce(rsum2, 0));
}

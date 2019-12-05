#!/usr/bin/env npx ts-node
import * as fs from "fs";
import { runInNewContext } from "vm";
// const input = fs.readFileSync("input4.txt", "utf8") as string;
// const lines = input.split("\n");

const input = "273025-767253";
const bits = input.split("-");
const min = parseInt(bits[0], 10);
const max = parseInt(bits[1], 10);

function test(a: any, b: any): void {
  const o = a == b ? "Test pass" : "Test fail";
  console.log(o, a, b);
}

function passValid(num: number): boolean {
  const str = `${num}`;
  let double = false;
  let increment = true;
  for (var i = 1; i < str.length; i++) {
    const a = str[i - 1];
    const b = str[i];
    if (a === b) {
      double = true;
    }
    if (parseInt(a, 10) > parseInt(b, 10)) {
      increment = false;
    }
  }
  return double && increment;
}

test(true, passValid(111111));
test(false, passValid(223450));
test(false, passValid(123789));

let c = 0;
for (let n = min; n <= max; n++) {
  if (passValid(n)) c++;
}
console.log("Answer", c);

function pass2Valid(num: number): boolean {
  const str = `${num}`;
  let dubNoTrip = false;
  for (let i = 0; i < 10; i++) {
    const dub = `${i}${i}`;
    const trip = `${dub}${i}`;
    if (str.includes(dub) && !str.includes(trip)) {
      dubNoTrip = true;
    }
  }
  return passValid(num) && dubNoTrip;
}

test(true, pass2Valid(112233));
test(false, pass2Valid(123444));
test(true, pass2Valid(111122));

c = 0;
for (let n = min; n <= max; n++) {
  if (pass2Valid(n)) c++;
}
console.log("Answer2", c);

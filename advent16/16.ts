#!/usr/bin/env ts-node
import { test } from "./util";

function dragon(a: string): string {
  let b = "";
  for (let i = a.length - 1; i >= 0; i--) {
    b += a[i] === "0" ? "1" : "0";
  }
  return `${a}0${b}`;
}

function dragonChecksum(input: string, diskLength: number): string {
  let a = input;
  while (a.length < diskLength) {
    a = dragon(a);
  }
  a = a.substring(0, diskLength);
  return checksum(a);
}

function checksum(input: string): string {
  let checksum = input;
  while (checksum.length % 2 === 0) {
    let c = "";
    for (let i = 0; i < checksum.length; i += 2) {
      const a = checksum[i];
      const b = checksum[i + 1];
      c += a === b ? "1" : "0";
    }
    checksum = c;
  }
  return checksum;
}

test("100", dragon("1"));
test("001", dragon("0"));
test("11111000000", dragon("11111"));
test("1111000010100101011110000", dragon("111100001010"));
test("100", checksum("110010110100"));
console.log("Part One", dragonChecksum("10001001100000001", 272));
console.log("Part Two", dragonChecksum("10001001100000001", 35651584));

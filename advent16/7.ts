#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";

// I tried to do this with regex. I failed. As ever, regex means you have two problems.
// I need to emphasise that I failed multiple times in various combinations with this. Humbling.

function tls(ip: string): boolean {
  let brack = false;
  let valid = false;
  for (let i = 0; i < ip.length - 3; i++) {
    if (ip[i] === "[") {
      brack = true;
    } else if (ip[i] === "]") {
      brack = false;
    } else if (
      ip[i] === ip[i + 3] &&
      ip[i + 1] === ip[i + 2] &&
      ip[i] !== ip[i + 1]
    ) {
      if (brack) {
        return false;
      } else {
        valid = true;
      }
    }
  }
  return valid;
}

test(true, tls("abba[mnop]qrst"));
test(false, tls("abcd[bddb]xyyx"));
test(false, tls("aaaa[qwer]tyui"));
test(true, tls("ioxxoj[asdfgh]zxcvbn"));
test(false, tls("ioxxoj[asdfgh]zx[abba]cvbn"));

const lines = fs.readFileSync("input7.txt", "utf8").split("\n");
console.log("Part One", lines.filter(tls).length);

function ssl(ip: string): boolean {
  let supernet = "";
  let hypernet = "";
  let brack = false;
  for (let i = 0; i < ip.length; i++) {
    if (ip[i] === "[") {
      brack = true;
    } else if (ip[i] === "]") {
      brack = false;
    } else {
      if (brack) hypernet += ip[i];
      else supernet += ip[i];
    }
  }
  for (let i = 0; i < supernet.length - 2; i++) {
    const a = supernet[i];
    const b = supernet[i + 1];
    if (a === supernet[i + 2] && a !== b) {
      if (hypernet.includes(`${b}${a}${b}`)) {
        return true;
      }
    }
  }
  return false;
}

test(true, ssl("aba[bab]xyz"));
test(false, ssl("xyx[xyx]xyx"));
test(true, ssl("aaa[kek]eke"));
test(true, ssl("zazbz[bzb]cdb"));

console.log("Part Two", lines.filter(ssl).length);

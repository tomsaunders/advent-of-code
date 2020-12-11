#!/usr/bin/env ts-node
import * as fs from "fs";
import { isPrimitive } from "util";
import { test } from "./util";

function abba(seg: string): boolean {
  const regex = /(.)(?!\1)(.)\2\1/gm;
  return !!regex.exec(seg);
}

function tls(ip: string): boolean {
  const regex = /\[.*\]/gm;
  const m = regex.exec(ip);
  if (m && abba(m[0])) {
    return false;
  }
  return abba(ip);
}

test(true, tls("abba[mnop]qrst"));
test(false, tls("abcd[bddb]xyyx"));
test(false, tls("aaaa[qwer]tyui"));
test(true, tls("ioxxoj[asdfgh]zxcvbn"));

const lines = fs.readFileSync("input7.txt", "utf8").split("\n");
console.log("Part One", lines.filter(tls).length);

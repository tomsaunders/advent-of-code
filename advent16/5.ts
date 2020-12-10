#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const testIn = "abc";
const input = `abbhdwsy`;

import * as crypto from "crypto";
export const md5 = (contents: string) =>
  crypto.createHash("md5").update(contents).digest("hex");

function getPassword(pref: string): string {
  let pass = "";
  let i = 0;
  while (pass.length < 8) {
    const hash = md5(`${pref}${i}`);
    if (hash.startsWith("00000")) {
      pass += hash[5];
    }
    i++;
  }
  return pass;
}

function getPassword2(pref: string): string {
  let pass = ["", "", "", "", "", "", "", ""];
  let i = 0;
  let found = 0;
  while (found < 8) {
    const hash = md5(`${pref}${i}`);
    if (hash.startsWith("00000")) {
      const pos = parseInt(hash[5], 10);
      if (pos < 8 && !pass[pos]) {
        pass[pos] = hash[6];
        found++;
      }
    }
    i++;
  }
  return pass.join("");
}

test("18f47a30", getPassword(testIn));
console.log("Part One", getPassword(input));
test("05ace8e3", getPassword2(testIn));
console.log("Part Two", getPassword2(input));

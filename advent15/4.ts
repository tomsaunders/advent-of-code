#!/usr/bin/env ts-node
const input = "ckczppom";

import * as crypto from "crypto";
export const md5 = (contents: string) =>
  crypto.createHash("md5").update(contents).digest("hex");

let i = 0;
let hash = md5(input + i);
while (hash.substr(0, 5) !== "00000") {
  i++;
  hash = md5(input + i);
}
console.log(i);
while (hash.substr(0, 6) !== "000000") {
  i++;
  hash = md5(input + i);
}
console.log(i);

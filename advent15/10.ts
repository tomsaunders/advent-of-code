#!/usr/bin/env npx ts-node
const input = "1113222113";

const test = "111221";

let out = input;
const it = 50;
let i = 0;
while (i < it) {
  let next = "";
  let ct = 0;
  let prev = out.substr(0, 1);
  for (let c = 0; c < out.length; c++) {
    const curr = out[c];
    if (prev == curr) {
      ct++;
    } else {
      next += `${ct}${prev}`;
      ct = 1;
      prev = curr;
    }
  }
  next += `${ct}${prev}`;
  i++;
  out = next;
}
console.log(out.length);

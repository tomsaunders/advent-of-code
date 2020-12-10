#!/usr/bin/env ts-node
import * as crypto from "crypto";

const input = "ngcjuoqr";

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

function oneTimePad(salt: string, stretch: boolean = false): number {
  const count = 64;
  const map = new Map<string, string>();
  function getHash(input: string): string {
    if (!map.has(input)) {
      const hash = crypto.createHash("md5").update(input).digest("hex");
      map.set(input, hash);
    }
    return map.get(input) as string;
  }

  function stretchHash(input: string): string {
    if (!map.has(input)) {
      let hash = crypto.createHash("md5").update(input).digest("hex");
      for (let x = 0; x < 2016; x++) {
        hash = crypto.createHash("md5").update(hash).digest("hex");
      }
      map.set(input, hash);
    }
    return map.get(input) as string;
  }

  function isKey(index: number): boolean {
    const input = `${salt}${index}`;

    const func = stretch ? stretchHash : getHash;
    const hash = func(input);
    const regex3 = /(.)\1\1/gm;
    const m = regex3.exec(hash);
    if (m) {
      const c = m[1];
      const seek = `${c}${c}${c}${c}${c}`;
      for (let i = index + 1; i <= index + 1000; i++) {
        const h = func(`${salt}${i}`);
        if (h.includes(seek)) {
          return true;
        }
      }
    }
    return false;
  }

  const keys = new Set<string>();
  let index = -1;
  while (keys.size < count) {
    index++;
    if (isKey(index)) {
      keys.add(`${salt}${index}`);
    }
  }
  return index;
}

test(22728, oneTimePad("abc"));
console.log("Answer", oneTimePad(input));
console.log("\nPart 2\n");
test(22551, oneTimePad("abc", true));
console.log("Answer", oneTimePad(input, true));

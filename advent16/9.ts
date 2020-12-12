#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const input = fs.readFileSync("input9.txt", "utf8");

function decompress(input: string, recursive: boolean = false): number {
  let out = 0;
  let i = 0;
  while (i < input.length) {
    if (input[i] === "(") {
      const end = input.indexOf(")", i + 1);
      const sub = input.substr(i + 1, end - i - 1);
      const bits = sub.split("x");
      const len = parseInt(bits[0], 10);
      const rep = parseInt(bits[1], 10);
      const seq = input.substr(end + 1, len);
      out += recursive ? rep * decompress(seq, true) : rep * len;
      i = end + len;
    } else {
      out++;
    }
    i++;
  }

  return out;
}

test(6, decompress("ADVENT"));
test(7, decompress("A(1x5)BC")); // ABBBBBC
test(9, decompress("(3x3)XYZ")); // XYZXYZXYZ
test(11, decompress("A(2x2)BCD(2x2)EFG")); //ABCBCDEFEFG
test(6, decompress("(6x1)(1x3)A")); //(1x3)A
test(18, decompress("X(8x2)(3x3)ABCY")); //  X(3x3)ABC(3x3)ABCY

console.log("Part One", decompress(input));

test(9, decompress("(3x3)XYZ", true)); // still becomes XYZXYZXYZ, as the decompressed section contains no markers.
test(20, decompress("X(8x2)(3x3)ABCY", true)); // becomes XABCABCABCABCABCABCY
test(241920, decompress("(27x12)(20x12)(13x14)(7x10)(1x12)A", true)); // decompresses into a string of A repeated 241920 times.
test(
  445,
  decompress("(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN", true)
);
console.log("Part Two", decompress(input, true));

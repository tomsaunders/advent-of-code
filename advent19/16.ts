#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input16.txt", "utf8") as string;

function makePattern(repeat: number, basePattern: number[], length: number) {
  const pattern: number[] = [];
  while (pattern.length < length + 1) {
    for (const base of basePattern) {
      for (let r = 0; r < repeat; r++) {
        pattern.push(base);
      }
    }
  }
  pattern.shift();
  return pattern;
}

function fft(input: string, phases: number): string {
  const basePattern = [0, 1, 0, -1];
  const inArray: number[] = input.split("").map(s => parseInt(s, 10));
  const outArray: number[] = inArray.slice(0);

  for (let p = 0; p < phases; p++) {
    for (let i = 0; i < outArray.length; i++) {
      const repeat = i + 1;
      const pattern = makePattern(repeat, basePattern, outArray.length);
      let total = 0;
      for (let d = 0; d < outArray.length; d++) {
        const o = outArray[d] * pattern[d];
        total += o;
      }
      outArray[i] = Math.abs(total) % 10;
    }
  }

  return outArray.join("");
}

function test(a: string, b: string): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  if (b.indexOf(a) !== -1) {
    console.log("Found at index", b.indexOf(a));
  }
  console.log(o);
}

test("01029498", fft("12345678", 4));
test("24176176", fft("80871224585914546619083218645595", 100).substr(0, 8));
test("73745418", fft("19617804207202209144916044189917", 100).substr(0, 8));
test("52432133", fft("69317163492948606335995924319873", 100).substr(0, 8));

console.log("Answer", fft(input, 100).substr(0, 8));
console.log("\nPART 2\n");

function fft2(input: string, inputRepeat: number, phases: number): string {
  const offset = parseInt(input.substr(0, 7), 10);
  let bigInput: string = "";
  for (let r = 0; r < inputRepeat; r++) {
    bigInput += input;
  }
  const answer = fft(bigInput, phases);
  return answer;
  // return answer.substr(offset, 8);
}

test("84462026", fft2("03036732577212944063491565474664", 100, 100));
// test("78725270", fft2("02935109699940807407585447034323", 10000, 100));
// test("53553731", fft2("03081770884921959731165446850517", 10000, 100));

// console.log("Answer", fft2(input, 10000, 100));

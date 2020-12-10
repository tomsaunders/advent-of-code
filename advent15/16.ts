#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input16.txt", "utf8") as string;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

class Sue {
  public id: number;
  public traits: Map<string, number>;

  constructor(line: string) {
    const bits = line.split(" ");
    console.log(line, bits);
    this.id = parseInt(bits[1], 10);
    this.traits = new Map<string, number>();
    for (let i = 2; i < bits.length; i += 2) {
      const trait = bits[i].replace(":", "");
      const val = parseInt(bits[i + 1].replace(",", ""), 10);
      this.traits.set(trait, val);
    }
  }

  public match(trait: string, number: number): boolean {
    return !this.traits.has(trait) || this.traits.get(trait) === number;
  }

  public greater(trait: string, number: number): boolean {
    return (
      !this.traits.has(trait) || (this.traits.get(trait) as number) > number
    );
  }

  public fewer(trait: string, number: number): boolean {
    return (
      !this.traits.has(trait) || (this.traits.get(trait) as number) < number
    );
  }
}

const sues = input.split("\n").map((l) => new Sue(l));

const sue = sues.find(
  (s) =>
    s.match("children", 3) &&
    s.match("cats", 7) &&
    s.match("samoyeds", 2) &&
    s.match("pomeranians", 3) &&
    s.match("akitas", 0) &&
    s.match("vizslas", 0) &&
    s.match("goldfish", 5) &&
    s.match("trees", 3) &&
    s.match("cars", 2) &&
    s.match("perfumes", 1)
);

console.log(sue);

const two = sues.find(
  (s) =>
    s.match("children", 3) &&
    s.greater("cats", 7) &&
    s.match("samoyeds", 2) &&
    s.fewer("pomeranians", 3) &&
    s.match("akitas", 0) &&
    s.match("vizslas", 0) &&
    s.fewer("goldfish", 5) &&
    s.greater("trees", 3) &&
    s.match("cars", 2) &&
    s.match("perfumes", 1)
);
console.log(two);
// test(1120, fastestDeer(input1, 1000));
// console.log("Part One:", fastestDeer(input, 2503));

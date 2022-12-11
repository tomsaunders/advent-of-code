#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input11.txt", "utf8");

const test = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

type Operation = "*" | "+" | "sq";
class Monkey {
  public number = 0;
  public items: number[] = [];
  public operation: Operation = "+";
  public operand: number;
  public testDivisible = 1;
  public trueMonkey = 0;
  public falseMonkey = 0;
  public inspectionCount = 0;

  constructor(lines: string[]) {
    lines = lines.map((l) => l.trim());
    this.number = parseInt(
      lines[0].replace("Monkey ", "").replace(":", ""),
      10
    );
    this.items = lines[1]
      .replace("Starting items: ", "")
      .split(", ")
      .map((n) => parseInt(n, 10));
    const [op, num] = lines[2].replace("Operation: new = old ", "").split(" ");
    this.operation = num === "old" ? "sq" : (op as Operation);
    this.operand = num === "old" ? 0 : parseInt(num, 10);
    this.testDivisible = parseInt(
      lines[3].replace("Test: divisible by ", ""),
      10
    );
    this.trueMonkey = parseInt(
      lines[4].replace("If true: throw to monkey ", ""),
      10
    );
    this.falseMonkey = parseInt(
      lines[5].replace("If false: throw to monkey ", ""),
      10
    );
  }

  public reduce(hcf: number): void {
    this.items = this.items.map((i) => i % hcf);
  }

  public inspect(monkeys: Monkey[], supermodulo?: number): void {
    while (this.items.length) {
      const [item, recipient] = this.inspectNext(supermodulo);
      monkeys[recipient].items.push(item);
    }
  }

  public inspectNext(supermodulo?: number): [number, number] {
    let worry = this.items.shift() as number;
    if (this.operation === "*") {
      worry *= this.operand;
    } else if (this.operation === "+") {
      worry += this.operand;
    } else if (this.operation === "sq") {
      worry *= worry;
    }
    if (!supermodulo) {
      worry = Math.floor(worry / 3);
    } else {
      worry = worry % supermodulo;
    }

    this.inspectionCount++;
    return [
      worry,
      worry % this.testDivisible === 0 ? this.trueMonkey : this.falseMonkey,
    ];
  }
}

function parse(input: string): Monkey[] {
  const monkeys: Monkey[] = [];
  const lines = input.split("\n");
  for (let i = 0; i < lines.length; i += 7) {
    monkeys.push(new Monkey(lines.slice(i, i + 6)));
  }
  return monkeys;
}

function part1(input: string): number {
  const monkeys = parse(input);
  for (let r = 0; r < 20; r++) {
    monkeys.forEach((m) => m.inspect(monkeys));
  }
  const counts = monkeys.map((m) => m.inspectionCount).sort((a, b) => b - a);
  return counts[0] * counts[1];
}

function part2(input: string): number {
  const monkeys = parse(input);
  const commonFactor = monkeys
    .map((m) => m.testDivisible)
    .reduce((p, c) => p * c, 1);
  for (let r = 0; r < 10000; r++) {
    monkeys.forEach((m) => m.inspect(monkeys, commonFactor));
  }
  const counts = monkeys.map((m) => m.inspectionCount).sort((a, b) => b - a);
  return counts[0] * counts[1];
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

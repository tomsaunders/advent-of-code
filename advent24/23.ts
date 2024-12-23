#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input23.txt", "utf8");
const test = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

class Computer {
  connectedTo: Set<Computer>;
  constructor(public id: string) {
    this.connectedTo = new Set<Computer>();
  }

  connect(other: Computer) {
    other.connectedTo.add(this);
    this.connectedTo.add(other);
  }
}

function parseInput(input: string): Record<string, Computer> {
  const computers: Record<string, Computer> = {};
  function getComputer(id: string): Computer {
    if (!computers[id]) computers[id] = new Computer(id);
    return computers[id];
  }
  input.split("\n").forEach((line) => {
    const [left, right] = line.split("-");
    const a = getComputer(left);
    const b = getComputer(right);
    a.connect(b);
  });
  return computers;
}

function part1(input: string): number {
  const computers = parseInput(input);
  const tComputers = Object.values(computers).filter((c) =>
    c.id.startsWith("t")
  );
  const triads = new Set<string>();

  tComputers.forEach((c) => {
    const connections = Array.from(c.connectedTo);
    for (let i = 0; i < connections.length; i++) {
      for (let j = i + 1; j < connections.length; j++) {
        const a = connections[i];
        const b = connections[j];
        if (a.connectedTo.has(b)) {
          triads.add([a.id, b.id, c.id].sort().join(","));
        }
      }
    }
  });

  return triads.size;
}

function part2(input: string): string {
  const computers = parseInput(input);
  let maxGroup: string[] = [];

  Object.values(computers).forEach((c) => {
    if (maxGroup.includes(c.id)) {
      return;
    }

    const connections = Array.from(c.connectedTo);
    const group = [c];
    for (let i = 0; i < connections.length; i++) {
      const a = connections[i];
      if (group.every((g) => g.connectedTo.has(a))) {
        group.push(a);
      }
    }

    if (group.length > maxGroup.length) {
      maxGroup = group.map((g) => g.id);
    }
  });
  return maxGroup.sort().join(",");
}

const t = part1(test);
if (t == 7) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == "co,de,ka,ta") {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 12
 *
 * Summary: Parse input into a graph and count connected nodes
 * Escalation:
 * Solution: Parse connections and do a breadth first search from root
 *
 *
 * Keywords:
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input12.txt", "utf8");
const test = `0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`;

class Node {
  public visited = false;
  public children: Node[] = [];
  constructor(public key: string) {}
}

function parseInput(input: string): Node[] {
  let nMap: Record<string, Node> = {};
  input.split("\n").forEach((line) => {
    const [key, rhs] = line.split(" <-> ");

    const t = nMap[key] || new Node(key);
    nMap[key] = t;

    rhs.split(", ").forEach((c) => {
      const ct = nMap[c] || new Node(c);
      t.children.push(ct);
      nMap[c] = ct;
    });
  });
  return Object.values(nMap);
}

function part1(input: string): number {
  const nodes = parseInput(input);
  const zero = nodes.find((n) => n.key === "0")!;
  const queue: Node[] = [zero];
  while (queue.length) {
    const n = queue.shift()!;
    n.children.forEach((c) => {
      if (!c.visited) {
        queue.push(c);
        c.visited = true;
      }
    });
  }
  return nodes.filter((n) => n.visited).length;
}

function part2(input: string): number {
  const nodes = parseInput(input);
  let groups = 0;
  while (nodes.find((n) => !n.visited)) {
    const queue: Node[] = [nodes.find((n) => !n.visited)!];
    while (queue.length) {
      const n = queue.shift()!;
      n.children.forEach((c) => {
        if (!c.visited) {
          queue.push(c);
          c.visited = true;
        }
      });
    }
    groups++;
  }
  return groups;
}

const t = part1(test);
if (t === 6) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 2) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 8
 *
 * Summary: Parse a series of numbers into nodes, where two 'header' numbers indicate the count of subsequent data to load.
 * Escalation: Calculate the root value based on aggregating child values
 * Solution: All in the parsing. Create a node class with parent and child references, and getters to handle the output for each part.
 * Create a function to recursively process the input array and continuously shift() the array until empty.
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, mapNum } from "./util";
const input = fs.readFileSync("input8.txt", "utf8");
const test = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`;

class Node {
  parent?: Node;
  children: Node[] = [];
  metadata: number[] = [];

  public constructor(public childCount: number, public metaCount: number) {}

  public get metaSum(): number {
    return arrSum(this.metadata);
  }

  public get value(): number {
    if (!this.childCount) {
      return this.metaSum;
    }
    let v = 0;
    this.metadata.forEach((m) => {
      if (this.children[m - 1]) {
        v += this.children[m - 1].value;
      }
    });
    return v;
  }
}

function parseInput(input: string): Node[] {
  const numbers = input.split(" ").map(mapNum);
  const nodes: Node[] = [];

  function parseNode(parent?: Node): Node {
    // header = # children , # metadata
    const childCount = numbers.shift()!;
    const metaCount = numbers.shift()!;

    const node = new Node(childCount, metaCount);
    nodes.push(node);
    node.parent = parent;

    for (let i = 0; i < childCount; i++) {
      node.children.push(parseNode(node));
    }
    for (let i = 0; i < metaCount; i++) {
      node.metadata.push(numbers.shift()!);
    }

    return node;
  }

  parseNode();
  return nodes;
}

function part1(input: string): number {
  const nodes = parseInput(input);
  return arrSum(nodes.map((n) => n.metaSum));
}

function part2(input: string): number {
  const nodes = parseInput(input);
  return nodes[0].value;
}

const t = part1(test);
if (t === 138) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 66) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 20
 *
 * Summary: Shuffle an line of numbers - move each item along the line by a number of places the item represents
 * Escalation: Add a multiplier so that all moves are larger; shuffle multiple times
 * Naive: Implement as a doubly linked list, and make each move one by one
 * Solution: Use a modulo operator - moving 100 times along a 10 item array is actually the same as moving 10 times because it loops
 * ... with caveats about off by one errors and negative direction offsets
 *
 * Keywords: LinkedList, Modulo
 * References:
 */
import * as fs from "fs";
import { arrSum } from "./util";

const input = fs.readFileSync("input20.txt", "utf8");
const test = `1
2
-3
3
-2
0
4`;

class Node {
  public next?: Node;
  constructor(public num: number, public prev?: Node) {}
  public addNode(num: number): Node {
    const nu = new Node(num, this);
    this.next = nu;
    return nu;
  }

  public mix(moves: number): void {
    if (moves === 0) {
      return; // early abort
    }

    this.next!.prev = this.prev;
    this.prev!.next = this.next;
    // this node has now been removed from the list
    if (moves > 0) {
      const nuPrev = this.prev!.offset(moves);
      const nuNext = nuPrev.next!;

      nuPrev.next = this;
      this.prev = nuPrev;
      this.next = nuNext;
      nuNext.prev = this;
    } else if (moves < 0) {
      const nuNext = this.next!.offset(moves);
      const nuPrev = nuNext.prev!;

      nuPrev.next = this;
      this.prev = nuPrev;
      this.next = nuNext;
      nuNext.prev = this;
    }
  }

  public offset(offset: number): Node {
    let node = this as Node;

    if (offset > 0) {
      for (let i = 0; i < offset; i++) {
        node = node.next!;
      }
    } else {
      for (let i = 0; i > offset; i--) {
        node = node.prev!;
      }
    }
    return node;
  }
}

function parseInput(input: string, decryptionKey: number = 1): Node[] {
  const lines = input.split("\n");
  const nodes: Node[] = [];
  let node: Node;
  lines.forEach((line) => {
    const num = parseInt(line) * decryptionKey;
    node = node ? node.addNode(num) : new Node(num);
    nodes.push(node);
  });
  node!.next = nodes[0];
  nodes[0].prev = node!;
  return nodes;
}

function mixNodes(nodes: Node[], count: number = 1): void {
  for (let i = 0; i < count; i++) {
    nodes.forEach((n) => {
      const moves = Math.abs(n.num) % (nodes.length - 1);
      n.mix(n.num > 0 ? moves : -moves);
    });
  }
}

function groveNumber(nodes: Node[]): number {
  const zero = nodes.find((n) => n.num === 0)!;
  const oneK = zero.offset(1000);
  const twoK = oneK.offset(1000);
  const threeK = twoK.offset(1000);
  return arrSum([oneK.num, twoK.num, threeK.num]);
}

function part1(input: string): number {
  const nodes = parseInput(input);
  mixNodes(nodes);

  return groveNumber(nodes);
}

function part2(input: string): number {
  const nodes = parseInput(input, 811589153);
  mixNodes(nodes, 10);

  return groveNumber(nodes);
}

const t = part1(test);
if (t == 3) {
  console.log("part 1 answer", part1(input)); //6712
  const t2 = part2(test);
  if (t2 === 1623178306) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

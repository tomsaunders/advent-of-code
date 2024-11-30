#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 9
 *
 * Summary: Simulate the movement of a head & tail node following U/D/L/R steps.
 * Escalation: Add nodes between the head & tail
 * Naive:  Model all moves on a grid
 * Solution: Model the rope as a linked list
 *
 * Keywords: LinkedList
 * References:
 */
import * as fs from "fs";

const input = fs.readFileSync("input9.txt", "utf8");
const test = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const test2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

class Node {
  public next?: Node;
  constructor(public prev?: Node, public x: number = 0, public y: number = 0) {}
  public addNode(): Node {
    const nu = new Node(this);
    this.next = nu;
    return nu;
  }
  public get coord(): string {
    return `${this.x}.${this.y}`;
  }
  public move(dir: Dir): void {
    if (dir === "D") {
      this.y--;
    } else if (dir === "L") {
      this.x--;
    } else if (dir === "R") {
      this.x++;
    } else if (dir === "U") {
      this.y++;
    }
    this.next?.follow();
  }
  public follow(): void {
    const dx = Math.abs(this.prev!.x - this.x);
    const dy = Math.abs(this.prev!.y - this.y);
    if (dx >= 2 || dy >= 2) {
      // needs to move self
      if (this.prev!.x > this.x) {
        this.x++;
      } else if (this.prev!.x < this.x) {
        this.x--;
      }
      if (this.prev!.y > this.y) {
        this.y++;
      } else if (this.prev!.y < this.y) {
        this.y--;
      }
    }
    this.next?.follow();
  }
}
type Dir = "U" | "D" | "L" | "R";
type Move = [Dir, number];

function parseInput(input: string): Move[] {
  const lines = input.split("\n");
  return lines.map((line) => {
    const [dir, count] = line.split(" ");
    return [dir as Dir, parseInt(count)];
  });
}

function moveCount(moves: Move[], ropeHead: Node, ropeTail: Node): number {
  const seen = new Set<string>();
  moves.forEach((move) => {
    const [dir, count] = move;
    for (let i = 0; i < count; i++) {
      ropeHead.move(dir);
      seen.add(ropeTail.coord);
    }
  });
  return seen.size;
}

function part1(input: string): number {
  const ropeHead = new Node();
  const ropeTail = ropeHead.addNode();
  return moveCount(parseInput(input), ropeHead, ropeTail);
}

function part2(input: string): number {
  const ropeHead = new Node();
  let ropeTail = ropeHead;
  for (let i = 0; i < 9; i++) {
    ropeTail = ropeTail.addNode();
  }
  return moveCount(parseInput(input), ropeHead, ropeTail);
}

const t = part1(test);
if (t == 13) {
  console.log("part 1 answer", part1(input));
  const t2a = part2(test);
  const t2b = part2(test2);
  if (t2a === 1 && t2b == 36) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2a, t2b);
  }
} else {
  console.log("part 1 test fail", t);
}

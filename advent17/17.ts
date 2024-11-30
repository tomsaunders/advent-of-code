#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 17
 *
 * Summary: Repeat offset and insertion steps for a list in a loop
 * Escalation: Do it 50 million times
 * Naive: Just wait for it to run 50 million times. Would probably be done in about 60 minutes...
 * Solution: Part 1 - implement a doubly linked list and do each offset one by one
 * Part 2 - only need to keep track of the 0 item and the thing at the next position.
 * Ignore the list and handle just those two indexes. I had the advantage of having done it previously (i.e. in 2017)
 *
 * Keywords:
 * References:
 */
import * as fs from "fs";
const input = 324;
const test = 3;

class Node {
  public prev!: Node;
  public next!: Node;
  public constructor(public value: number) {}

  public step(count: number): Node {
    let n: Node = this;
    let i = 0;
    while (i < count) {
      i++;
      n = n.next;
    }
    return n;
  }

  public append(value: number): Node {
    const n = new Node(value);
    n.next = this.next;
    n.prev = this;
    this.next = n;
    return n;
  }
}

function part1(inputSteps: number): number {
  const initial = new Node(0);
  initial.next = initial.prev = initial;
  let current = initial;
  for (let i = 1; i <= 2017; i++) {
    current = current.step(inputSteps).append(i);
  }
  return current.next.value;
}

function part2(inputSteps: number): number {
  // item at index 0 is the inital state of 0;
  // we need to treat the list as relative to that
  // and keep track of the value of indexOne.
  let indexOneValue = 0;
  let currentIdx = 0;
  for (let i = 1; i <= 50000000; i++) {
    const moveAlongIdx = (currentIdx + inputSteps) % i;
    const insertAtIdx = moveAlongIdx + 1;
    if (insertAtIdx === 1) {
      indexOneValue = i;
      console.log(i);
    }
    currentIdx = insertAtIdx;
  }
  return indexOneValue;
}

const t1 = part1(test);
if (t1 === 638) {
  console.log("part 1 answer", part1(input));
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 1 test fail", t1);
}

#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell } from "./util";
import * as fs from "fs";
let input = "476138259";
const example = "389125467";

function partOne(input: string, moves: number): number {
  let cups = input.split("").map((i) => parseInt(i, 10));
  for (let i = 0; i < moves; i++) {
    const current = cups.shift() as number;
    const queue = [
      cups.shift() as number,
      cups.shift() as number,
      cups.shift() as number,
    ];
    let destNum = current - 1;
    while (!cups.includes(destNum)) {
      destNum--;
      if (destNum <= 0) destNum = 9;
    }

    const destPos = cups.indexOf(destNum);
    cups.splice(destPos + 1, 0, ...queue);
    cups.push(current);
  }

  const onePos = cups.indexOf(1);
  const before = cups.slice(0, onePos);
  const after = cups.slice(onePos + 1);
  const merge = [...after, ...before];
  return parseInt(merge.map((i) => i.toString(10)).join(""), 10);
}

test(partOne(example, 10), 92658374);
test(partOne(example, 100), 67384529);
console.log("Part One", partOne(input, 100));

class Node {
  constructor(public id: number) {}
  prev!: Node;
  next!: Node;
}

function partTwo(input: string): number {
  let map = new Map<number, Node>();

  let cups = input.split("").map((i) => parseInt(i, 10));
  let last: Node | undefined;
  for (const n of cups) {
    const node = new Node(n);
    if (last) {
      node.prev = last;
      last.next = node;
    }
    last = node;
    map.set(node.id, node);
  }
  let num = map.size;
  while (num < 1000000) {
    const node = new Node(++num);
    if (last) {
      node.prev = last;
      last.next = node;
    }
    last = node;
    map.set(node.id, node);
  }
  const first = map.get(cups[0]) as Node;

  last!.next = first;
  first.prev = last!;

  let start = Date.now();
  let current = first;
  for (let i = 0; i < 10000000; i++) {
    if (i % 100000 === 0) {
      console.log(i, (Date.now() - start) / 1000);
    }

    const one = current.next;
    const two = one.next;
    const thr = two.next;
    const fur = thr.next;

    const queue = [one.id, two.id, thr.id];

    let destNum = current.id - 1;
    while (queue.includes(destNum)) {
      destNum--;
      if (destNum == 0) destNum = 1000000;
    }
    if (destNum == 0) destNum = 1000000;

    const destNode = map.get(destNum) as Node;
    if (!destNode) {
      console.error(`Cant find ${destNum}`);
    }

    current.next = fur;
    fur.prev = current;

    const tmp = destNode.next;
    destNode.next = one;
    one.prev = destNode;
    thr.next = tmp;
    tmp.prev = thr;

    current = current.next;
  }
  const one = map.get(1) as Node;
  return one.next.id * one.next.next.id;
}

test(partTwo(example), 149245887792);
console.log("Part Two", partTwo(input));

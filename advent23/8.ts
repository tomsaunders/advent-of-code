#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, arrProd, arrSum, isNumeric, lcm, mapNum } from "./util";
const input = fs.readFileSync("input8.txt", "utf8");
const test = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const testA = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const test2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

class Node {
  public left!: Node;
  public right!: Node;

  public constructor(public name: string){}

  public toString(): string {
    return this.name;
  }
}

type Step = "L" | "R";

function makeNodes(lines: string[]): Record<string, Node> {
  const lookup: Record<string, Node> = {};
  lines.forEach(l => {
    const bits = l.split(" = ");
    const node = new Node(bits[0]);
    lookup[node.name] = node;
  })
  lines.forEach(l => {
    const bits = l.split(" = ");
    const node = lookup[bits[0]];
    const [left, right] = bits[1].replace("(", "").replace(")", "").split(", ");
    node.left = lookup[left];
    node.right = lookup[right];    
  });
  return lookup;
}

function part1(input: string): number {
  const lines = input.split("\n");
  const steps = lines.shift()?.split("") as Step[];
  lines.shift(); // gap
  const lookup: Record<string, Node> = makeNodes(lines);

  let current = lookup["AAA"] as Node;
  let stepCount = 0;
  while (current.name !== "ZZZ"){
    const step = steps?.shift() as Step;
    if (step === "L"){
      current = current.left;
    } else {
      current = current.right;
    }
    stepCount++;
    steps.push(step);
  }

  return stepCount;
}

function part2(input: string): number {
  const lines = input.split("\n");
  const steps = lines.shift()?.split("") as Step[];
  lines.shift(); // gap
  const lookup: Record<string, Node> = makeNodes(lines);

  let current = Object.values(lookup).filter(n => n.name.endsWith("A")) as Node[];
  function isEnd(n: Node): boolean {
    return n.name.endsWith("Z");
  }

  const firstSeen = new Array(current.length);
  const cycles = new Array(current.length);
  let stepCount = 0;
  while (cycles.filter(c => !!c).length !== current.length){
    const step = steps?.shift() as Step;
    current = current.map((node, i) => {
      if (isEnd(node)){
        if (!firstSeen[i]){
          firstSeen[i] = stepCount;
        } else if (!cycles[i]) {
          cycles[i] = stepCount - firstSeen[i];
        }
      }
      if (step === "L"){
        node = node.left;
      } else {
        node = node.right;
      }
      return node;
    });
    stepCount++;
    steps.push(step);
  }
  return lcm(cycles);
}

const t = part1(test);
const ta = part1(testA);
if (t == 2 && ta == 6) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test2);
console.log("test 2", t2);
if (t2 == 6) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

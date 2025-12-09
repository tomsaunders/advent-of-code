#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day x
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
import { arrProd, Cell, Grid, mapNum } from "./util";
const input = fs.readFileSync("input8.txt", "utf8");
const test = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

type Junction = {
  x: number;
  y: number;
  z: number;
  name: string;
  circuit?: Circuit;
};

type Circuit = {
  junctions: Junction[];
};

type PotentialConnection = {
  a: Junction;
  b: Junction;
  dist: number;
};

function parseInput(input: string): Junction[] {
  return input.split("\n").map((l) => {
    const [x, y, z] = l.split(",").map(mapNum);
    return { x, y, z, name: l };
  });
}

function straightLineDistance(a: Junction, b: Junction): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  );
}

function part1(input: string, connectionLimit = 10): number {
  const junctions = parseInput(input);
  const potentials: PotentialConnection[] = [];
  for (let i = 0; i < junctions.length; i++) {
    for (let j = i + 1; j < junctions.length; j++) {
      const a = junctions[i];
      const b = junctions[j];
      const dist = straightLineDistance(a, b);
      potentials.push({ a, b, dist });
    }
  }

  potentials.sort((a, b) => a.dist - b.dist);

  let connections = 0;
  const circuits: Circuit[] = [];
  while (connections++ < connectionLimit) {
    const { a, b, dist } = potentials.shift() as PotentialConnection;
    if (a.circuit && b.circuit && a.circuit === b.circuit) {
      continue;
    } else if (a.circuit && b.circuit && a.circuit !== b.circuit) {
      a.circuit.junctions.push(...b.circuit.junctions);
      const oldB = b.circuit;
      b.circuit.junctions.forEach((c) => (c.circuit = a.circuit));
      oldB.junctions = [];
    } else if (a.circuit) {
      b.circuit = a.circuit;
      a.circuit.junctions.push(b);
    } else if (b.circuit) {
      a.circuit = b.circuit;
      b.circuit.junctions.push(a);
    } else {
      // new circuit
      const circuit = { junctions: [a, b] };
      a.circuit = b.circuit = circuit;
      circuits.push(circuit);
    }
  }

  circuits.sort((a, b) => b.junctions.length - a.junctions.length);
  const top3 = circuits.slice(0, 3);
  return arrProd(top3.map((c) => c.junctions.length));
}

function part2(input: string): number {
  const junctions = parseInput(input);
  const potentials: PotentialConnection[] = [];
  for (let i = 0; i < junctions.length; i++) {
    for (let j = i + 1; j < junctions.length; j++) {
      const a = junctions[i];
      const b = junctions[j];
      const dist = straightLineDistance(a, b);
      potentials.push({ a, b, dist });
    }
  }

  potentials.sort((a, b) => a.dist - b.dist);

  const circuits: Circuit[] = [];
  let largestCircuit = 0;
  let lastX = 0;
  while (largestCircuit < junctions.length) {
    const { a, b, dist } = potentials.shift() as PotentialConnection;
    lastX = a.x * b.x;
    if (a.circuit && b.circuit && a.circuit === b.circuit) {
      continue;
    } else if (a.circuit && b.circuit && a.circuit !== b.circuit) {
      a.circuit.junctions.push(...b.circuit.junctions);
      const oldB = b.circuit;
      b.circuit.junctions.forEach((c) => (c.circuit = a.circuit));
      oldB.junctions = [];
    } else if (a.circuit) {
      b.circuit = a.circuit;
      a.circuit.junctions.push(b);
    } else if (b.circuit) {
      a.circuit = b.circuit;
      b.circuit.junctions.push(a);
    } else {
      // new circuit
      const circuit = { junctions: [a, b] };
      a.circuit = b.circuit = circuit;
      circuits.push(circuit);
    }
    circuits.sort((a, b) => b.junctions.length - a.junctions.length);
    largestCircuit = circuits[0].junctions.length;
  }

  return lastX;
}

const t = part1(test, 10);
if (t == 40) {
  console.log("part 1 answer", part1(input, 1000));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 25272) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 25
 *
 * Summary: For a graph with nodes and edges, find 3 edges to cut that creates two separate groups
 * Escalation: None. Christmas!
 * Visualise:
 *  (25.html) Draw all of the nodes with a random x y position
 *  then step repeatedly through a loop of moving them towards their connected nodes,
 *  then rescale the coordinates to that they're spread across a range that's possible to see.
 *  Visually inspect the canvas to see the 3 links which stand out,
 * Solution: (25.ts) then hard code a removal of those links to calculate two different groups and get the answer.
 * Proper solution possibly would have involved a 'min cut' algorithm.
 *
 * Keywords:
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input25.txt", "utf8");
const test = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`;

let scale = 500;

class Node {
  public x = 0;
  public y = 0;
  public links: Node[] = [];

  constructor(public key: string) {
    this.x = Math.round(Math.random() * scale);
    this.y = Math.round(Math.random() * scale);
  }

  public connect(node: Node) {
    this.links.push(node);
    // node.connect(this);
  }

  public removeLink(key: string) {
    this.links = this.links.filter((link) => link.key !== key);
  }
}

function parseInput(input: string): Record<string, Node> {
  const nodes: Record<string, Node> = {};

  const getNode = (key: string): Node => {
    if (!nodes[key]) nodes[key] = new Node(key);
    return nodes[key];
  };

  input.split("\n").forEach((line) => {
    const [l, r] = line.split(": ");
    const ln = getNode(l);
    r.split(" ").forEach((x) => {
      const rn = getNode(x);
      ln.connect(rn);
      rn.connect(ln);
    });
  });

  return nodes;
}

function part1(input: string, remove: [string, string][]): number {
  const nodes = parseInput(input);

  remove.forEach(([a, b]) => {
    nodes[a].removeLink(b);
    nodes[b].removeLink(a);
  });

  const [startA, startB] = remove[0];

  function groupCount(key: string): number {
    const seen = new Set<string>();
    const queue = [key];
    while (queue.length) {
      const next = queue.pop()!;
      const node = nodes[next];
      seen.add(next);
      node.links.forEach((link) => {
        if (!seen.has(link.key)) {
          queue.push(link.key);
        }
      });
    }

    return seen.size;
  }

  return groupCount(startA) * groupCount(startB);
}

// from the puzzle page we know these are the links to remove, but it was observed on the visualisation as well
const t = part1(test, [
  ["hfx", "pzl"],
  ["bvb", "cmg"],
  ["nvd", "jqt"],
]);
if (t == 54) {
  // from the visualisation (25.html) after a few dozen steps these edges are the clear connectors between two large groups
  console.log(
    "part 1 answer",
    part1(input, [
      ["lxt", "lsv"],
      ["qmr", "ptj"],
      ["xvh", "dhn"],
    ])
  );
} else {
  console.log("part 1 test fail", t);
}

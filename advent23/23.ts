#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 23
 *
 * Summary: Find the longest path through the grid, following rules that block off some routes
 * Escalation: Ignore aforementioned rules, which increases the search space.
 * Naive:  Basic grid path finding, step by step
 * Solution: Turn a grid into a smaller graph of distances between nodes - a cell where there is a choice between more than one path becomes a node.
 * This took a long time to get through some implementation bugs and then optimise to a clean solution. Still takes 30s to run part 2...
 *
 * Keywords: Grid
 * References: N/A
 */
import * as fs from "fs";
import { Cell, Grid } from "./util";
const input = fs.readFileSync("input23.txt", "utf8");
const test = `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

const viable = ["^", "<", ">", "v", "."];

function part1(input: string): number {
  const grid = parseInput(input);
  const start = grid.getCell(1, 0)!;
  const end = grid.getCell(grid.maxX - 1, grid.maxY)!;

  const getOptions = (cell: Cell): Cell[] => {
    const options: Cell[] = [];
    if (cell.type === "^") {
      options.push(cell.north!);
    } else if (cell.type === ">") {
      options.push(cell.east!);
    } else if (cell.type === "<") {
      options.push(cell.west!);
    } else if (cell.type === "v") {
      options.push(cell.south!);
    } else {
      // get all options not seen
      if ([".", "<"].includes(cell.west?.type || "")) {
        options.push(cell.west!);
      }
      if ([".", ">"].includes(cell.east?.type || "")) {
        options.push(cell.east!);
      }
      if ([".", "^"].includes(cell.north?.type || "")) {
        options.push(cell.north!);
      }
      if ([".", "v"].includes(cell.south?.type || "")) {
        options.push(cell.south!);
      }
    }
    return options;
  };
  const nodes2 = gridToNodes(start, end, getOptions);

  return findLongestNodePath(nodes2, start, end);
}

function part2(input: string): number {
  const grid = parseInput(input);
  const start = grid.getCell(1, 0)!;
  const end = grid.getCell(grid.maxX - 1, grid.maxY)!;

  const getOptions = (cell: Cell): Cell[] => {
    return cell.directNeighbours.filter((o) => viable.includes(o.type));
  };
  const nodes = gridToNodes(start, end, getOptions);

  return findLongestNodePath(nodes, start, end);
}

interface Edge {
  cost: number;
  to: Node;
}
class Node {
  public key: string;
  public edges: Edge[] = [];
  constructor(public cell: Cell) {
    this.key = cell.xy;
  }
  public addEdge(to: Node, cost: number): void {
    if (!this.edges.find((e) => e.to === to && e.cost === cost)) {
      this.edges.push({ to, cost });
    }
  }
}

function gridToNodes(start: Cell, end: Cell, getOptions: (current: Cell) => Cell[]): Record<string, Node> {
  const nodes: Record<string, Node> = {};
  nodes[start.xy] = new Node(start);
  nodes[end.xy] = new Node(end);
  start.grid.cells
    .filter((c) => viable.includes(c.type) && c.directNeighbours.filter((n) => viable.includes(n.type)).length > 2)
    .forEach((c) => {
      nodes[c.xy] = new Node(c);
    });
  Object.values(nodes).forEach((node) => {
    const paths: [Cell, number][] = getOptions(node.cell).map((option) => [option, 1]);
    const seen = new Set<string>();
    seen.add(node.cell.xy);
    while (paths.length) {
      const [cell, steps] = paths.pop()!;
      if (nodes[cell.xy]) {
        node.addEdge(nodes[cell.xy], steps);
      } else {
        getOptions(cell).forEach((option) => {
          if (!seen.has(option.xy)) {
            seen.add(option.xy);
            paths.push([option, steps + 1]);
          }
        });
      }
    }
  });

  return nodes;
}

function findLongestNodePath(nodes: Record<string, Node>, start: Cell, end: Cell): number {
  console.time("findLongestNodePath");

  const graphPaths: { node: Node; trail: Node[]; cost: number }[] = [
    { node: nodes[start.xy], trail: [nodes[start.xy]], cost: 0 },
  ];
  let bestEnd = 0;
  while (graphPaths.length) {
    const { node, trail, cost } = graphPaths.pop()!;
    if (node === nodes[end.xy]) {
      bestEnd = Math.max(bestEnd, cost);
      continue;
    } else {
      node.edges.forEach((edge) => {
        if (!trail.includes(edge.to)) {
          graphPaths.push({ node: edge.to, trail: trail.concat(edge.to), cost: cost + edge.cost });
        }
      });
    }
  }

  console.timeEnd("findLongestNodePath");
  return bestEnd;
}

const t = part1(test);
if (t == 94) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 154) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

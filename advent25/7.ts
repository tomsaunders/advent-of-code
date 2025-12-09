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
import { Cell, Grid, SPACE } from "./util";
const input = fs.readFileSync("input7.txt", "utf8");
const test = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

const SPLITTER = "^";
const BEAM = "|";

function part1(input: string): number {
  const g = parseInput(input);
  const beams = [g.cells.find((c) => c.type === "S")!];
  let splits = 0;
  while (beams.length) {
    const beamCell = beams.shift()!;
    const next = beamCell.south;
    if (next?.type === SPACE) {
      next.type = BEAM;
      beams.push(next);
    } else if (next?.type === SPLITTER) {
      splits++;
      if (next.west) beams.push(next.west);
      if (next.east) beams.push(next.east);
    }
  }
  g.draw();
  return splits;
}

type Link = {
  from: Cell;
  to: Cell | "end";
  dead?: boolean;
};

function part2(input: string): number {
  const g = parseInput(input);
  const start = g.cells.find((c) => c.type === "S")!;
  const paths = [{ from: start, at: start }];
  const links: Link[] = [];
  while (paths.length) {
    const { from, at } = paths.shift()!;
    const next = at.south;
    if (next?.type === SPACE) {
      next.type = BEAM;
      paths.push({ from, at: next });
    } else if (next?.type === SPLITTER) {
      links.push({ from, to: next });
      if (next.west) paths.push({ from: next, at: next.west });
      if (next.east) paths.push({ from: next, at: next.east });
    } else if (!next) {
      links.push({ from, to: "end" });
    }
  }

  let answer = 0;
  while (links.length) {
    console.log(links.length);
    const step = links.shift();
    if (step?.dead) continue;
    if (step?.to === "end") {
      console.log(step.from.coord, "to end");
      answer++;
      continue;
    }

    // from is start, to is something
    const fromTo = links.filter((l) => l.from === step?.to);
    fromTo.forEach((l) => {
      l.dead = true;
      links.unshift({ from: step!.from, to: l.to });
      console.log(
        typeof l.from === "string" ? "end" : l.from.coord || "end",
        "becomes",
        step!.from.coord,
        "to",
        typeof l.to === "string" ? "end" : l.to.coord || "end",
      );
    });
    step!.dead = true;
  }

  return answer;
}

const t = part1(test);
if (t == 21) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 40) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
let input = fs.readFileSync("input3.txt", "utf8");
// input = `..##.......
// #...#...#..
// .#....#..#.
// ..#.#...#.#
// .#...##..#.
// ..#.##.....
// .#.#.#....#
// .#........#
// #.##...#...
// #...##....#
// .#..#...#.#`;
const lines = input.split("\n").map((line) => line.trim());

const TREE = "#";

function counter(dMove: number, rMove: number): number {
  let dPos = 0;
  let rPos = 0;
  let trees = 0;
  while (dPos < lines.length) {
    const line = lines[dPos];
    if (line[rPos % line.length] === TREE) {
      trees++;
    }
    rPos += rMove;
    dPos += dMove;
  }
  return trees;
}

console.log("Part 1", counter(1, 3));

console.log(
  "Part 2",
  counter(1, 1) * counter(1, 3) * counter(1, 5) * counter(1, 7) * counter(2, 1)
);

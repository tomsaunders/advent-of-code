#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, arrProd, arrSum, isNumeric, mapNum } from "./util";
const input = fs.readFileSync("input5.txt", "utf8");
const test = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

function parseStages(lines: string[]): number[][][] {
  const stages: number[][][] = [];
  let stage: number[][] = [];
  while (lines.length) {
    const line = lines.shift()?.trim();
    if (!line) {
      if (stage.length) {
        stages.push(stage);
      }
      stage = [];
    } else if (line.includes("map:")) {
      // dont need to parse, just move on
    } else {
      // a series of rows to parse
      stage.push(line.split(" ").map(mapNum));
    }
  }
  if (stage.length) {
    stages.push(stage);
  }
  return stages;
}

function part1(input: string): number {
  const lines = input.split("\n");
  const seedLine = lines.shift() as string;
  let seeds = seedLine.replace("seeds: ", "").split(" ").map(mapNum);
  console.log(seeds);

  const stages = parseStages(lines);

  stages.forEach((stage: number[][], si) => {
    console.log("seeds", seeds);
    console.log("stage", si, stage);
    const nuSeeds: number[] = [];
    seeds.forEach((seed) => {
      let nuSeed = seed;
      stage.forEach(([dest, source, delta]) => {
        if (seed >= source && seed < source + delta) {
          const offset = seed - source;
          nuSeed = dest + offset;
        }
      });
      nuSeeds.push(nuSeed);
    });

    seeds = nuSeeds;
  });
  return Math.min(...seeds);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const seedLine = lines.shift() as string;
  const seeds = seedLine.replace("seeds: ", "").split(" ").map(mapNum);
  console.log(seeds);
  let seedRanges: [number, number][] = [];

  const stages = parseStages(lines);

  stages.forEach((stage: number[][], si) => {
    console.log("seeds", seeds);
    console.log("stage", si, stage);
    const nuSeedRanges: [number, number][] = [];
    seedRanges.forEach(([seedLow, seedHigh]) => {
      let [nuLow, nuHigh] = [seedLow, seedHigh];
      stage.forEach(([dest, source, delta]) => {
        // if (seed >= source && seed < source + delta) {
        //   const offset = seed - source;
        //   nuSeed = dest + offset;
        // }
      });
      nuSeedRanges.push([nuLow, nuHigh]);
    });

    seedRanges = nuSeedRanges;
  });
  return Math.min(...seeds);
}

const t = part1(test);
if (t == 35) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
// const t2 = part2(test);
// if (t2 == 30) {
//   console.log("part 2 answer", part2(input));
// } else {
//   console.log("part 2 test fail", t2);
// }

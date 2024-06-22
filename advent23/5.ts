#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, arrProd, arrSum, isNumeric, lineToNumbers, mapNum } from "./util";
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

  const stages = parseStages(lines);

  stages.forEach((stage: number[][], si) => {
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
  const seeds = lineToNumbers(seedLine.replace("seeds: ", ""));
  console.log(seeds);
  let seedRanges: [number, number][] = [];
  for (let i = 0; i < seeds.length; i += 2){
    seedRanges.push([seeds[i], seeds[i] + seeds[i+1]-1]);
  }
  console.log(seedRanges);

  const stages = parseStages(lines);

  stages.forEach((stage: number[][], si) => {
    console.log("stage", si, stage);
    console.log("ranges", seedRanges);
    const nuSeedRanges: [number, number][] = [];
    
    /**
     * adapted from existing solutions because this part 2 hurts my brain
     * 
     * for each stage
     *  master list of intersections A
     *  for each stage part
     *    temp list of processing queue P
     *    for each seed
     *      add intersection to A
     *      add parts to P
     *    seed = p
     *  
     */

    stage.forEach(([dest, source, delta]) => {
      const sourceLow = source;
      const sourceHigh = source + delta;
      const offset = dest - source;

      let processingSeedRanges: [number, number][] = [];
      seedRanges.forEach(([seedLow, seedHigh]) => {
        // calculate the bit to the left of the match, the match and the bit to the right
        const [leftLow, leftHigh] = [seedLow, Math.min(seedHigh, sourceLow)];
        const [matchLow, matchHigh] = [Math.max(seedLow, sourceLow), Math.min(sourceHigh, seedHigh)];
        const [rightLow, rightHigh] = [Math.max(seedLow, sourceHigh), seedHigh];
        // then add the ranges if they cover different numbers
        // left and right 
        if (leftHigh > leftLow){
          processingSeedRanges.push([leftLow, leftHigh]);
        }
        if (rightHigh > rightLow){
          processingSeedRanges.push([rightLow, rightHigh]);
        }
        if (matchHigh > matchLow){
          nuSeedRanges.push([matchLow + offset, matchHigh + offset]);
        }
      });
      // having processed
      seedRanges = processingSeedRanges;
    });

    // continue on with the definite intersections + the unmatched detritus
    seedRanges = nuSeedRanges.concat(seedRanges);
  });
  return Math.min(...seedRanges.map(range => Math.min(...range)));
}

const t = part1(test);
if (t == 35) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 46) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

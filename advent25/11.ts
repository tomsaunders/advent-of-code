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
import { Cell, Grid } from "./util";
const input = fs.readFileSync("input11.txt", "utf8");
const test = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

const test2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

class Device {
  public outputs: Device[] = [];
  public visitableDevices: Set<string> = new Set<string>();
  constructor(public name: string) {}
  public toString() {
    return this.name;
  }
  public replace(old: Device, nu: Device) {
    this.outputs = this.outputs.map((o) => (o === old ? nu : o));
  }
}

function parseInput(input: string): Record<string, Device> {
  const devices: Record<string, Device> = {};

  function getDevice(name: string) {
    if (!devices[name]) devices[name] = new Device(name);
    return devices[name];
  }

  input.split("\n").forEach((line) => {
    const [name, rest] = line.split(": ");
    const device = getDevice(name);
    device.outputs = rest.split(" ").map((r) => getDevice(r));
  });

  let allDevices = Array.from(Object.values(devices));
  let devicesWithOneOutput: Device[] = allDevices.filter(
    (d) =>
      d.outputs.length === 1 &&
      d.name !== "fft" &&
      d.name !== "dac" &&
      d.name !== "svr",
  );
  while (devicesWithOneOutput.length) {
    devicesWithOneOutput.forEach((device) => {
      const [target] = device.outputs;
      allDevices.forEach((ad) => {
        ad.replace(device, target);
      });
      delete devices[device.name];
    });

    allDevices = Array.from(Object.values(devices));
    devicesWithOneOutput = allDevices.filter(
      (d) =>
        d.outputs.length === 1 &&
        d.name !== "fft" &&
        d.name !== "dac" &&
        d.name !== "svr",
    );
  }

  allDevices.forEach((device) => {
    // for each device, work out all of the places it can go by tracing to the end.
    const queue: Device[] = device.outputs.slice(0);
    function add(d: Device) {
      if (!device.visitableDevices.has(d.name)) {
        device.visitableDevices.add(d.name);
        queue.push(...d.outputs);
      }
    }
    while (queue.length) {
      const d = queue.shift()!;
      add(d);
    }
  });

  return devices;
}

function part1(input: string): number {
  const devices = parseInput(input);

  const start = devices["you"];
  const goal = devices["out"];
  let pathCount = 0;

  const paths: Device[][] = [[start]];
  while (paths.length) {
    const path = paths.shift() as Device[];
    const [at] = path;
    if (at === goal) {
      pathCount++;
      continue;
    }
    at.outputs.forEach((out) => {
      const outPath = [out, ...path.slice(0)];
      paths.push(outPath);
    });
  }

  return pathCount;
}

function part2(input: string): number {
  const devices = parseInput(input);

  function costFromTo(start: Device, goal: Device, abort: Device[]): number {
    const reverseMap: Record<string, Device[]> = {};
    // create a map of inputs for each output
    Object.values(devices).forEach((device) => {
      if (!start.visitableDevices.has(device.name)) {
        // this device is not visitable from our start point so we can ignore.
        return;
      }
      device.outputs.forEach((outD) => {
        if (!start.visitableDevices.has(outD.name)) {
          // this device is not visitable from our start point so we can ignore.
          return;
        }
        if (!reverseMap[outD.name]) reverseMap[outD.name] = [];
        reverseMap[outD.name].push(device);
      });
    });

    console.log(reverseMap);
    return 0;

    // count the ways you can get from
    // const outToWays: Record<string, number> = { [start.name]: 1 };
    // while (!outToWays[goal.name]) {
    //   if (!Object.keys(reverseMap).length) return 0;
    //   for (const out in reverseMap) {
    //     const ways = reverseMap[out]
    //       .map((d) => outToWays[d.name])
    //       .reduce((a, b) => a + b, 0);
    //     if (!isNaN(ways)) {
    //       delete reverseMap[out];
    //     }
    //     outToWays[out] = ways;
    //   }
    // }
    // return outToWays[goal.name];
  }

  const svr = devices["svr"];
  const fft = devices["fft"];
  const dac = devices["dac"];
  const out = devices["out"];

  return (
    costFromTo(svr, fft, [dac, out]) *
      costFromTo(fft, dac, [out]) *
      costFromTo(dac, out, [fft]) +
    costFromTo(svr, dac, [fft, out]) *
      costFromTo(dac, fft, [out]) *
      costFromTo(fft, out, [dac])
  );
}

const t = part1(test);
if (t == 5) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test2);
if (t2 == 2) {
  // should be 473741288064360
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

/**
 * const input = require(`fs`).readFileSync(`input11.txt`).toString`utf8`
   .trim()
   .split(/\r?\n/)
   .map((line) => line.split(": "))
   .map(([ins, outs]) => [ins, outs.split(" ")]);
 const inToOut = Object.fromEntries(input);
 
 console.log(solve("you", "out"));
 console.log(
   solve("svr", "dac") * solve("dac", "fft") * solve("fft", "out") +
     solve("svr", "fft") * solve("fft", "dac") * solve("dac", "out"),
 );
 
 function solve(start, end) {
   const visitableNodes = new Set([start]);
   let size = 0;
   while (visitableNodes.size > size) {
     size = visitableNodes.size;
     [...visitableNodes]
       .flatMap((n) => inToOut[n])
       .filter((x) => x !== undefined)
       .forEach(visitableNodes.add, visitableNodes);
   }
 
   const outToIn = {};
   for (const [inPath, outs] of input) {
     if (!visitableNodes.has(inPath)) continue;
     for (const out of outs) {
       if (!visitableNodes.has(out)) continue;
       if (!outToIn[out]) outToIn[out] = [];
       outToIn[out].push(inPath);
     }
   }
 
   const outToWays = { [start]: 1 };
   while (!outToWays[end]) {
     if (!Object.keys(outToIn).length) return 0;
     for (const out in outToIn) {
       const ways = outToIn[out]
         .map((l) => outToWays[l])
         .reduce((a, b) => a + b, 0);
       if (!isNaN(ways)) {
         delete outToIn[out];
       }
       outToWays[out] = ways;
     }
   }
   return outToWays[end];
 }
 
 */

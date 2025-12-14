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

  console.log(
    "cleaned up input",
    input.split("\n").length,
    "to",
    Object.values(devices).length,
  );

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
    let pathCount = 0;

    const paths: Device[][] = [[start]];
    while (paths.length) {
      const path = paths.shift() as Device[];
      const [at] = path;
      if (at === goal) {
        console.log("found path", path.join(", "));
        pathCount++;
        continue;
      } else if (abort.includes(at)) {
        continue;
      }
      at.outputs.forEach((out) => {
        const outPath = [out, ...path.slice(0)];
        paths.push(outPath);
      });
    }

    return pathCount;
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
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

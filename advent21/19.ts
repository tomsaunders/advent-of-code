#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input19.txt", "utf8");
const test = fs.readFileSync("test19.txt", "utf8");

/*
x y z
x z y
x -y z
x -z -y

-x y z
-x -z y
-x -y -z
-x z -y

z -y -x
z x -y
z y x
z -x y

-z -x -y
-z y -x
-z x y
-z -y x

-y z x
-y -x z
-y -z -x
-y x -z

y z -x
y x z
y -z x
y -x -z
*/

class Probe {
  public scanX: number;
  public scanY: number;
  public scanZ: number;
  constructor(line: string, public scanner: Scanner) {
    [this.scanX, this.scanY, this.scanZ] = line
      .split(",")
      .map((x) => parseInt(x, 10));
  }

  public get absX(): number {
    return this.scanX + this.scanner.x;
  }

  public get absY(): number {
    return this.scanY + this.scanner.y;
  }

  public get absZ(): number {
    return this.scanZ + this.scanner.z;
  }

  public get absCoord(): string {
    return `${this.absX},${this.absY},${this.absZ};`;
  }
}

class Scanner {
  public probes: Probe[] = [];
  public x: number = Infinity;
  public y: number = Infinity;
  public z: number = Infinity;

  constructor(public name: string) {}

  public addProbe(line: string) {
    this.probes.push(new Probe(line, this));
  }
}

function part1(input: string): number {
  const lines = input.split("\n");
  const scanners: Scanner[] = [];
  let scanner: Scanner;
  lines.forEach((l) => {
    if (l.startsWith("--- scanner")) {
      scanner = new Scanner(l);
      scanners.push(scanner);
    } else if (l.trim() === "") {
    } else {
      scanner.addProbe(l);
    }
  });

  const knownScanners: Scanner[] = [scanners.shift() as Scanner];
  // foreach unknown U
  //// foreach known to find the pair K
  ////// foreach orientation of coordinates
  //////// foreach known probe KP calculate the

  //////// foreach unknown probe UP

  return 0;
}

const t1 = part1(test);
if (t1 === 79) {
  console.log("Part 1: ", part1(input));

  const t2 = part2(test);
  if (t2 === 2) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n");

  return 0;
}

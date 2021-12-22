#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input19.txt", "utf8");
const test = fs.readFileSync("test19.txt", "utf8");

/*
ABC xyz DEF -x -y -z
*/
type PCoord = "A" | "B" | "C" | "D" | "E" | "F";
type PCoordSet = [PCoord, PCoord, PCoord];
type Coord = [number, number, number];
const permutations: PCoordSet[] = `A B C
A C E
A E F
A F B
D B F
D F E
D E C
D C B
C B D
C D E
C E A
C A B
F B A
F A E
F E D
F D B
E D F
E F A
E A C
E C D
B D C
B C A
B A F
B F D`
  .split("\n")
  .map((p) => p.split(" ") as PCoordSet);

class Beacon {
  public x: number = Infinity;
  public y: number = Infinity;
  public z: number = Infinity;

  public scanX: number;
  public scanY: number;
  public scanZ: number;
  constructor(line: string, public scanner: Scanner) {
    [this.scanX, this.scanY, this.scanZ] = line
      .split(",")
      .map((x) => parseInt(x, 10));
  }

  public get scanCoord(): string {
    return `${this.scanX},${this.scanY},${this.scanZ}`;
  }

  public get label(): string {
    return `${this.x},${this.y},${this.z}`;
  }

  public get coord(): Coord {
    return [this.x, this.y, this.z];
  }

  public permuteCoord(permutation: PCoordSet): Coord {
    return permutation.map((p) => {
      switch (p) {
        case "A":
          return this.scanX;
        case "B":
          return this.scanY;
        case "C":
          return this.scanZ;
        case "D":
          return -this.scanX;
        case "E":
          return -this.scanY;
        case "F":
          return -this.scanZ;
      }
    }) as Coord;
  }
}

class Scanner {
  public beacons: Beacon[] = [];
  public x: number = Infinity;
  public y: number = Infinity;
  public z: number = Infinity;
  public permutation: PCoordSet = ["A", "B", "C"];

  constructor(public name: string) {}

  public addProbe(line: string) {
    this.beacons.push(new Beacon(line, this));
  }

  public get isKnown(): boolean {
    return this.x !== Infinity;
  }

  public get beaconSet(): Set<string> {
    return new Set(this.beacons.map((b) => b.label));
  }

  public countMatches(otherSet: Set<string>): number {
    return this.beacons.filter((b) => otherSet.has(b.label)).length;
  }

  public align(
    myBeacon: Beacon,
    knownBeacon: Beacon,
    permute: PCoordSet
  ): void {
    this.permutation = permute;
    const goalCoord: Coord = knownBeacon.coord;
    const myCoord: Coord = myBeacon.permuteCoord(permute);
    this.setPosition(
      goalCoord[0] - myCoord[0],
      goalCoord[1] - myCoord[1],
      goalCoord[2] - myCoord[2]
    );
  }

  public setPosition(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    this.beacons.forEach((b) => {
      const [x, y, z] = b.permuteCoord(this.permutation);
      [b.x, b.y, b.z] = [x + this.x, y + this.y, z + this.z];
    });
  }

  public reset(): this {
    this.x = this.y = this.z = Infinity;
    this.beacons.forEach((b) => {
      b.x = b.y = b.z = Infinity;
    });
    return this;
  }

  public get label(): string {
    return `${this.x}, ${this.y}, ${this.z} facing ${this.permutation.join(
      "-"
    )}`;
  }

  public distanceTo(other: Scanner): number {
    return (
      Math.abs(this.x - other.x) +
      Math.abs(this.y - other.y) +
      Math.abs(this.z - other.z)
    );
  }
}

function run(input: string): [number, number] {
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

  const scan0 = scanners.shift() as Scanner;
  const knownScanners: Scanner[] = [scan0];
  scan0.setPosition(0, 0, 0);

  let unknowns: Scanner[] = scanners.filter((scanner) => !scanner.isKnown);

  const checked: Set<string> = new Set<string>();

  while (unknowns.length) {
    knownScanners.forEach((k) => {
      const knownSet = k.beaconSet;

      unknowns.forEach((u) => {
        const key = `${k.name}:${u.name}`;
        if (checked.has(key)) return;

        for (let pi = 0; pi < permutations.length; pi++) {
          const p = permutations[pi];
          for (let ki = 0; ki < k.beacons.length; ki++) {
            const kb = k.beacons[ki];
            for (let ui = 0; ui < u.beacons.length; ui++) {
              const ub = u.beacons[ui];

              u.align(ub, kb, p);
              const m = u.countMatches(knownSet);
              if (m >= 12) {
                console.log("matches: ", m);
                console.log("Aligned", u.name, "with ", k.name, "at ", u.label);
                ui = ki = pi = Infinity; // abort multiple loop levels
                knownScanners.unshift(u);
              } else {
                u.reset();
              }
            }
          }
        }
        checked.add(key);
      });
      unknowns = scanners.filter((scanner) => !scanner.isKnown);
    });
    console.log(`Known: ${knownScanners.length} Unknown: ${unknowns.length}`);
  }

  const uniqueCount = knownScanners.reduce(
    (fullSet: Set<string>, current: Scanner): Set<string> =>
      new Set([
        ...Array.from(fullSet.values()),
        ...Array.from(current.beaconSet),
      ]),
    new Set()
  ).size;

  let maxDistance = 0;
  for (let a = 0; a < scanners.length; a++) {
    for (let b = 0; b < scanners.length; b++) {
      maxDistance = Math.max(maxDistance, scanners[a].distanceTo(scanners[b]));
    }
  }

  return [uniqueCount, maxDistance];
}

const [t1, t2] = run(test);
if (t1 === 79 && t2 == 3621) {
  console.log("\n\nTest Pass\n\n");
  const [p1, p2] = run(input);
  console.log("Part 1: ", p1);
  console.log("Part 2: ", p2);
} else {
  console.log("Test fail: ", t1, t2);
}

#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input22.txt", "utf8");
const test = fs.readFileSync("test22.txt", "utf8");
const test2 = fs.readFileSync("test22b.txt", "utf8");

class Cube {
  constructor(
    public mode: string,
    public x1: number,
    public x2: number,
    public y1: number,
    public y2: number,
    public z1: number,
    public z2: number
  ) {}

  public get on(): boolean {
    return this.mode === "on";
  }

  public withinRange(maxRange: number): boolean {
    return [this.x1, this.x2, this.y1, this.y2, this.z1, this.z2].every(
      (n) => Math.abs(n) <= maxRange
    );
  }

  public static fromLine(line: string): Cube {
    const l = line
      .replace("on ", "on,")
      .replace("off ", "off,")
      .replace("x=", "")
      .replace("y=", "")
      .replace("z=", "");
    const [instr, xStr, yStr, zStr] = l.split(",");
    const [xMin, xMax] = xStr.split("..").map((b) => parseInt(b, 10));
    const [yMin, yMax] = yStr.split("..").map((b) => parseInt(b, 10));
    const [zMin, zMax] = zStr.split("..").map((b) => parseInt(b, 10));
    return new Cube(instr, xMin, xMax, yMin, yMax, zMin, zMax);
  }
}

class CoordSystem {
  public indexLookup!: Map<number, number>;
  constructor(public values: number[] = []) {}

  public get size(): number {
    return this.values.length;
  }

  public update() {
    this.values = Array.from(new Set(this.values)).sort((a, b) => a - b);
    this.indexLookup = new Map<number, number>();
    this.values.forEach((val, i) => {
      this.indexLookup.set(val, i);
    });
  }

  public getByIndex(idx: number): number {
    return this.values[idx];
  }

  public add(n1: number, n2: number): void {
    this.values.push(n1, n2);
  }

  public getLength(idx: number): number {
    const n1 = this.getByIndex(idx);
    const n2 = this.getByIndex(idx + 1);
    return n2 - n1;
  }

  public getIndexes(n1: number, n2: number): [number, number] {
    return [this.indexLookup.get(n1)!, this.indexLookup.get(n2)! - 1];
  }
}

class SuperSet {
  private store: boolean[][][] = [];
  public constructor(xr: number, yr: number, zr: number) {
    for (let x = 0; x < xr; x++) {
      this.store.push([]);
      for (let y = 0; y < yr; y++) {
        this.store[x].push(new Array<boolean>(zr));
      }
    }
  }

  public set(x: number, y: number, z: number, v: boolean): void {
    this.store[x][y][z] = v;
  }

  public has(x: number, y: number, z: number): boolean {
    return this.store[x][y][z];
  }
}

function part1(input: string): number {
  const lines = input.split("\n");
  const cubes = lines.map(Cube.fromLine).filter((c) => c.withinRange(50));

  return getCubesVolume(cubes);
}

function part2(input: string): number {
  const lines = input.split("\n");
  const cubes = lines.map(Cube.fromLine);

  return getCubesVolume(cubes);
}

function getCubesVolume(cubes: Cube[]): number {
  const xSys = new CoordSystem();
  const ySys = new CoordSystem();
  const zSys = new CoordSystem();
  cubes.forEach((cube) => {
    xSys.add(cube.x1, cube.x2 + 1);
    ySys.add(cube.y1, cube.y2 + 1);
    zSys.add(cube.z1, cube.z2 + 1);
  });
  xSys.update();
  ySys.update();
  zSys.update();

  const onSet = new SuperSet(xSys.size, ySys.size, zSys.size);
  cubes.forEach((c) => {
    const [x1, x2] = xSys.getIndexes(c.x1, c.x2 + 1);
    const [y1, y2] = ySys.getIndexes(c.y1, c.y2 + 1);
    const [z1, z2] = zSys.getIndexes(c.z1, c.z2 + 1);

    for (let z = z1; z <= z2; ++z) {
      for (let y = y1; y <= y2; ++y) {
        for (let x = x1; x <= x2; ++x) {
          onSet.set(x, y, z, c.on);
        }
      }
    }
  });

  let vol = 0;
  for (let z = 0; z < zSys.size; z++) {
    for (let y = 0; y < ySys.size; y++) {
      for (let x = 0; x < xSys.size; x++) {
        if (onSet.has(x, y, z)) {
          vol += xSys.getLength(x) * ySys.getLength(y) * zSys.getLength(z);
        }
      }
    }
  }

  return vol;
}

const t1 = part1(test);
if (t1 === 590784) {
  console.log("Part 1: ", part1(input));
  const t2 = part1(test2);
  const t2b = part2(test2);
  if (t2 === 474140 && t2b === 2758514936282235) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2, t2 === 474140, t2b);
  }
} else {
  console.log("Test fail: ", t1);
}
// takes a long time to run and must be executed with `npm run high-memory 22.ts`

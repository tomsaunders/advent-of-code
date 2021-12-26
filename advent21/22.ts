#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input22.txt", "utf8");
const test = fs.readFileSync("test22.txt", "utf8");
const test2 = fs.readFileSync("test22b.txt", "utf8");

function naive1(input: string): number {
  const lines = input.split("\n");
  const onSet = new Set<string>();

  function range(str: string): [number, number] {
    const bits = str.split("..").map((b) => parseInt(b, 10));
    const low = Math.min(...bits);
    const high = Math.max(...bits);
    return [Math.max(low, -50), Math.min(high, 50)];
  }

  lines.forEach((l) => {
    l = l
      .replace("on ", "on,")
      .replace("off ", "off,")
      .replace("x=", "")
      .replace("y=", "")
      .replace("z=", "");
    const [instr, xStr, yStr, zStr] = l.split(",");
    const [xMin, xMax] = range(xStr);
    const [yMin, yMax] = range(yStr);
    const [zMin, zMax] = range(zStr);

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        for (let z = zMin; z <= zMax; z++) {
          if (instr === "on") {
            onSet.add(`${x};${y};${z}`);
          } else {
            onSet.delete(`${x};${y};${z}`);
          }
        }
      }
    }
  });

  return onSet.size;
}

class CoordSystem {
  public x: Map<number, Coord> = new Map<number, Coord>();
  public y: Map<number, Coord> = new Map<number, Coord>();
  public z: Map<number, Coord> = new Map<number, Coord>();
  public cx: Map<number, Coord> = new Map<number, Coord>();
  public cy: Map<number, Coord> = new Map<number, Coord>();
  public cz: Map<number, Coord> = new Map<number, Coord>();

  public xVal: number[] = [];
  public yVal: number[] = [];
  public zVal: number[] = [];

  private magic(
    expMap: Map<number, Coord>,
    comMap: Map<number, Coord>,
    sortArr: number[],
    expanded: number
  ): Coord {
    if (!expMap.has(expanded)) {
      expMap.set(expanded, new Coord(expanded));
      sortArr.push(expanded);
      sortArr
        .sort((a, b) => a - b)
        .forEach((val, i) => {
          const coord = expMap.get(val) as Coord;
          coord.compressed = i;
          comMap.set(i, coord);
        });
      // console.log(
      //   "adding magic",
      //   expanded,
      //   "order now",
      //   sortArr,
      //   expMap,
      //   comMap
      // );
    }
    return expMap.get(expanded)!;
  }

  public buildCoord(axis: "x" | "y" | "z", expanded: number): Coord {
    if (axis === "x") {
      return this.magic(this.x, this.cx, this.xVal, expanded);
    } else if (axis === "y") {
      return this.magic(this.y, this.cy, this.yVal, expanded);
    } else {
      return this.magic(this.z, this.cz, this.zVal, expanded);
    }
  }

  public getRange(point: number, lookup: Map<number, Coord>): number {
    const from = lookup.get(point)!;
    const to = lookup.get(point + 1)!;
    return Math.abs(to.expanded - from.expanded) + 1;
  }

  public getVolume(point: string): number {
    const [cx, cy, cz] = point.split(";").map((i) => parseInt(i, 10));
    const dx = this.getRange(cx, this.cx);
    const dy = this.getRange(cy, this.cy);
    const dz = this.getRange(cz, this.cz);
    // console.log("expanded ", point, "to", `${dx} * ${dy} * ${dz}`);

    return dx * dy * dz;
  }
}

class Coord {
  public compressed: number = Infinity;
  constructor(public expanded: number) {}

  public valueOf(): number {
    return this.expanded;
  }
}

class Cube {
  constructor(
    public mode: "on" | "off",
    public xMin: Coord,
    public xMax: Coord,
    public yMin: Coord,
    public yMax: Coord,
    public zMin: Coord,
    public zMax: Coord,
    public name: string
  ) {}
  public get compressed(): [number, number, number, number, number, number] {
    return [
      this.xMin.compressed,
      this.xMax.compressed,
      this.yMin.compressed,
      this.yMax.compressed,
      this.zMin.compressed,
      this.zMax.compressed,
    ];
  }
  public withinRange(maxRange: number): boolean {
    return [
      this.xMax,
      this.xMin,
      this.yMax,
      this.yMin,
      this.zMax,
      this.zMin,
    ].every((n) => Math.abs(n.expanded) <= maxRange);
  }
  public static fromLine(line: string, sys: CoordSystem): Cube {
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

    return new Cube(
      instr as "on" | "off",
      sys.buildCoord("x", xMin),
      sys.buildCoord("x", xMax),
      sys.buildCoord("y", yMin),
      sys.buildCoord("y", yMax),
      sys.buildCoord("z", zMin),
      sys.buildCoord("z", zMax),
      `|| ${line} ||`
    );
  }
  public get compressedLabel(): string {
    const [xMin, xMax, yMin, yMax, zMin, zMax] = this.compressed;
    return `x=${xMin}..${xMax},y=${yMin}..${yMax},z=${zMin}..${zMax}`;
  }
}

function part1(input: string): number {
  const lines = input.split("\n");
  const sys = new CoordSystem();
  const cubes = lines
    .map((l) => Cube.fromLine(l, sys))
    .filter((c) => c.withinRange(50));

  const onSet = new Set<string>();
  cubes.forEach((cube) => {
    console.log(cube.name);
    console.log(cube.compressedLabel);
    console.log("\n");
    const [xMin, xMax, yMin, yMax, zMin, zMax] = cube.compressed;
    for (let x = xMin; x < xMax; x++) {
      for (let y = yMin; y < yMax; y++) {
        for (let z = zMin; z < zMax; z++) {
          if (cube.mode === "on") {
            console.log("on", `${x};${y};${z}`);
            onSet.add(`${x};${y};${z}`);
          } else {
            console.log("off", `${x};${y};${z}`);
            onSet.delete(`${x};${y};${z}`);
          }
        }
      }
    }
  });

  return Array.from(onSet.values()).reduce(
    (carry, point: string) => carry + sys.getVolume(point),
    0
  );
}

const t1 = part1(`on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10`);
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

function part2(input: string): number {
  const lines = input.split("\n");

  return 0;
}

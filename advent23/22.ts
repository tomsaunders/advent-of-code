#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 22
 *
 * Summary: Given a series of cube 'bricks', calculate where they will fall to (in a sort of Jenga tower) and then calculate which would cause other bricks to fall if removed.
 * Escalation: Calculate the total chain reaction of removing bricks
 * Naive:  First attempted to put bricks onto a grid and step them down one by one, but this was clunky. Instead parsed the input lines twice - once to sort them from lowest to highest
 * Solution:
 *  Parse the input lines twice - once to sort them in order lowest z to highest, then drop to the lowest point not occupied, then insert into a grid for easy checking of neighbours.
 *  Had difficulty due to the limited test set - it was not immediately obvious I had a mistake in the sorting logic of input parsing.
 *  Escalation wasn't a big problem: I thought some memoization might be required but it got in the way and had no performance issues without.
 *
 * Keywords: Grid, Z-axis
 * References: N/A
 */
import * as fs from "fs";
import { Cell, Grid, SPACE, WALL, mapNum } from "./util";
const input = fs.readFileSync("input22.txt", "utf8");
const test = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

class Brick {
  public cells: Cell[] = [];
  public minX!: number;
  public minY!: number;
  public minZ!: number;
  public maxX!: number;
  public maxY!: number;
  public maxZ!: number;
  public supports: Set<string> = new Set<string>();
  public isSupportedBy: Set<string> = new Set<string>();

  constructor(public originalLine: string, public lz: number) {
    this.reset();
  }

  public init(): void {
    // get every cell above this brick's cells. Exclude self cells in case its vertical
    const upCells = this.cells.map((c) => c.getUp()).filter((c) => c && c.reference !== this.originalLine) as Cell[];
    // ditto below
    const downCells = this.cells
      .map((c) => c.getDown())
      .filter((c) => c && c.reference !== this.originalLine) as Cell[];

    upCells.forEach((c) => {
      this.supports.add(c.reference!);
    });
    downCells.forEach((c) => {
      this.isSupportedBy.add(c.reference!);
    });
  }

  public reset(): void {
    this.minX = this.minY = this.minZ = Infinity;
    this.maxX = this.maxY = this.maxZ = 0;
  }

  public addCell(cell: Cell): void {
    this.cells.push(cell);
    this.minX = Math.min(this.minX, cell.x);
    this.minY = Math.min(this.minY, cell.y);
    this.minZ = Math.min(this.minZ, cell.z);
    this.maxX = Math.max(this.maxX, cell.x);
    this.maxY = Math.max(this.maxY, cell.y);
    this.maxZ = Math.max(this.maxZ, cell.z);
    cell.reference = this.originalLine; // use as unique identifier
  }

  public hasAllSupportsFalling(falling: Set<string>): boolean {
    return Array.from(this.isSupportedBy).every((support) => falling.has(support));
  }

  public toString(): string {
    return `Was ${this.originalLine} now ${this.minX},${this.minY},${this.minZ}~${this.maxX},${this.maxY},${this.maxZ}`;
  }
}

function parseInput(input: string): Record<string, Brick> {
  const lines = input.split("\n");
  const grid = new Grid();
  const bricks: Brick[] = [];
  const landedCubes = new Map<string, Brick>();
  lines.forEach((line) => {
    const [left] = line.split("~");
    const [lx, ly, lz] = left.split(",").map(mapNum);
    bricks.push(new Brick(line, lz));
  });
  bricks.sort((a, b) => a.lz - b.lz);

  bricks.forEach((brick) => {
    const line = brick.originalLine;
    const [left, right] = line.split("~");
    const [lx, ly, lz] = left.split(",").map(mapNum);
    const [rx, ry, rz] = right.split(",").map(mapNum);

    let coords: { x: number; y: number; z: number }[] = [];
    for (let x = lx; x <= rx; x++) {
      for (let y = ly; y <= ry; y++) {
        for (let z = lz; z <= rz; z++) {
          coords.push({ x, y, z });
        }
      }
    }
    let under = coords.map(({ x, y, z }) => {
      return { x, y, z: z - 1 };
    });
    while (under.every(({ x, y, z }) => z > 0 && !grid.getCell(x, y, z))) {
      coords = under;
      under = coords.map(({ x, y, z }) => {
        return { x, y, z: z - 1 };
      });
    }
    coords.forEach(({ x, y, z }) => {
      const cell = grid.createCell(x, y, z, WALL);
      brick.addCell(cell);
      landedCubes.set(`${x},${y},${z}`, brick);
    });
  });

  const brickMap: Record<string, Brick> = {};
  bricks.forEach((b) => {
    brickMap[b.originalLine] = b;
    b.init();
  });

  return brickMap;
}

function part1(input: string): number {
  const brickMap = parseInput(input);
  let deleteCount = 0;
  Object.values(brickMap).forEach((b) => {
    if (b.supports.size === 0) {
      deleteCount++;
      return;
    }
    // else for each thing b supports, if it is supported by at least 2 things that is ok
    if (Array.from(b.supports.values()).every((supportKey) => brickMap[supportKey].isSupportedBy.size > 1)) {
      deleteCount++;
      return;
    }
  });

  return deleteCount;
}

function part2(input: string): number {
  const brickMap = parseInput(input);

  const calcFallCount = (brickKey: string, falling: Set<string>): number => {
    falling.add(brickKey);
    const b = brickMap[brickKey];
    let falls = 0;

    Array.from(b.supports.values()).forEach((brickAboveKey) => {
      const brickAbove = brickMap[brickAboveKey];
      if (brickAbove.hasAllSupportsFalling(falling)) {
        falls++;
        falls += calcFallCount(brickAboveKey, falling);
      }
    });
    return falls;
  };

  let fallCount = 0;
  Object.values(brickMap).forEach((b) => {
    fallCount += calcFallCount(b.originalLine, new Set<string>());
  });
  return fallCount;
}

const t = part1(test);
if (t == 5) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 7) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input17.txt", "utf8");

class HyperGrid {
  public map: Map<string, HyperCube>;

  constructor() {
    this.map = new Map<string, HyperCube>();
  }

  public getCube(x: number, y: number, z: number, w: number): HyperCube {
    const coord = [x, y, z, w].join("-");
    if (!this.map.has(coord)) {
      this.map.set(coord, new HyperCube(".", x, y, z, w));
    }
    return this.map.get(coord) as HyperCube;
  }

  public getCubes(i: number): HyperCube[] {
    const cubes: HyperCube[] = [];
    for (let w = -i; w <= i; w++) {
      for (let z = -i; z <= i; z++) {
        for (let y = -i; y <= 10 + i; y++) {
          for (let x = -i; x <= 10 + i; x++) {
            cubes.push(this.getCube(x, y, z, w));
          }
        }
      }
    }
    return cubes;
  }

  public getNeighbours(cube: HyperCube): HyperCube[] {
    const n: HyperCube[] = [];
    for (let w = -1; w <= 1; w++) {
      for (let z = -1; z <= 1; z++) {
        for (let y = -1; y <= 1; y++) {
          for (let x = -1; x <= 1; x++) {
            if (x == 0 && y == 0 && z == 0 && w == 0) {
              continue;
            }
            n.push(
              this.getCube(
                cube.x + x,
                cube.y + y,
                cube.z + z,
                cube.w + w
              ) as HyperCube
            );
          }
        }
      }
    }
    return n;
  }

  public static fromLines(input: string | string[]): HyperGrid {
    const lines = Array.isArray(input) ? input : input.split("\n");

    const g = new HyperGrid();
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        const c = new HyperCube(lines[y][x], x, y, 0, 0);
        g.map.set(c.coord, c);
      }
    }
    return g;
  }
}

class HyperCube {
  public coord: string;
  public next: string = ".";
  constructor(
    public type: string,
    public x: number,
    public y: number,
    public z: number,
    public w: number
  ) {
    this.coord = [this.x, this.y, this.z, this.w].join("-");
  }
  public get active(): boolean {
    return this.type === "#";
  }
}

function getNeighbours(grid: Grid, cell: Cell): Cell[] {
  const n: Cell[] = [];
  for (let z = -1; z <= 1; z++) {
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x == 0 && y == 0 && z == 0) {
          continue;
        }
        n.push(grid.getCell(cell.x + x, cell.y + y, cell.z + z, true) as Cell);
      }
    }
  }
  return n;
}

function getCells(grid: Grid): Cell[] {
  const cells: Cell[] = [];
  const minZ = grid.minZ - 1,
    minY = grid.minY - 1,
    minX = grid.minX - 1,
    maxZ = grid.maxZ + 1,
    maxY = grid.maxY + 1,
    maxX = grid.maxX + 1;
  for (let z = minZ; z <= maxZ; z++) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        cells.push(grid.getCell(x, y, z, true) as Cell);
      }
    }
  }
  return cells;
}

function partOne(input: string): number {
  const grid = Grid.fromLines(input);
  for (let i = 0; i < 6; i++) {
    // grid.drawAll(false);

    const cells: Cell[] = getCells(grid);
    for (const cell of cells) {
      const n = getNeighbours(grid, cell);
      const active = n.filter((c) => c.type === "#").length;
      if (cell.type === "#") {
        cell.next = active === 2 || active === 3 ? "#" : ".";
      } else {
        cell.next = active === 3 ? "#" : ".";
      }
    }
    for (const cell of cells) {
      if (cell.next) {
        cell.type = cell.next;
      }
    }
  }
  return grid.cells.filter((x) => x.type === "#").length;
}
test(
  112,
  partOne(`.#.
..#
###`)
);

console.log("Part 1", partOne(input));

function partTwo(input: string): number {
  const grid = HyperGrid.fromLines(input);
  for (let i = 0; i < 6; i++) {
    const cubes: HyperCube[] = grid.getCubes(i + 1);
    for (const cube of cubes) {
      const n = grid.getNeighbours(cube);
      const active = n.filter((c) => c.active).length;
      if (cube.active) {
        cube.next = active === 2 || active === 3 ? "#" : ".";
      } else {
        cube.next = active === 3 ? "#" : ".";
      }
    }
    for (const cube of cubes) {
      if (cube.next) {
        cube.type = cube.next;
      }
    }
  }
  return grid.getCubes(6).filter((x) => x.active).length;
}

test(
  848,
  partTwo(`.#.
..#
###`)
);

console.log("Part 2", partTwo(input));

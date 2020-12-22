#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell, getStringGroups } from "./util";
import * as fs from "fs";
import { on } from "cluster";
let input = fs.readFileSync("input20.txt", "utf8");

const testInput = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

const monster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `;

function reverse(str: string): string {
  return str.split("").reverse().join("");
}

class Tile {
  public neighbours: Set<number> = new Set<number>();
  constructor(public id: number, public base: string[] = []) {}
  static fromString(input: string[]): Tile {
    const first = input.shift() as string;
    const bits = first.split(" ");
    const t = new Tile(parseInt(bits[1].replace(":", ""), 10));
    t.base = input.slice();
    return t;
  }

  public get top(): string {
    return this.base[0];
  }

  public get bot(): string {
    return this.base[this.base.length - 1];
  }

  public get left(): string {
    let left = "";
    for (const row of this.base) {
      left += row[0];
    }
    return left;
  }

  public get right(): string {
    let right = "";
    for (const row of this.base) {
      right += row[row.length - 1];
    }
    return right;
  }

  public get borders(): string[] {
    return [
      this.top,
      reverse(this.top),
      this.bot,
      reverse(this.bot),
      this.left,
      reverse(this.left),
      this.right,
      reverse(this.right),
    ];
  }

  public flip(): Tile {
    const t = this.clone();
    t.base = this.base.map((r) => reverse(r));
    return t;
  }

  public rotate(): Tile {
    const t = this.clone();

    const rows = 10,
      cols = 10;
    const grid = [];
    for (let j = 0; j < cols; j++) {
      grid[j] = Array(rows);
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[j][i] = this.base[9 - i][j];
      }
    }
    t.base = grid.map((r) => r.join(""));

    return t;
  }

  public trim(): string[] {
    const out: string[] = [];
    for (let y = 1; y < this.base.length - 1; y++) {
      out.push(this.base[y].substr(1, this.base[y].length - 2));
    }
    return out;
  }

  public print(): void {
    this.base.forEach((l) => console.log(l));
  }

  clone(): Tile {
    const t = new Tile(this.id, this.base.slice());
    t.neighbours = new Set<number>(this.neighbours);
    return t;
  }
}

function tileOptions(from: Tile): Tile[] {
  let options: Tile[] = [];
  let t = from;
  for (let i = 0; i < 4; i++) {
    t = t.rotate();
    options.push(t);
    options.push(t.flip());
  }
  return options;
}

function gridStr(grid: Tile[][], trim: boolean = false): string[][] {
  const gridStrArr: string[][] = [];
  const min = trim ? 1 : 0;
  const max = trim ? 9 : 10;
  for (const row of grid) {
    for (let r = min; r < max; r++) {
      let put = "";
      for (const g of row) {
        put += g.base[r].substr(min, max - min);
      }
      gridStrArr.push(put.split(""));
    }
  }
  return gridStrArr;
}

function printGrid(grid: Tile[][], trim: boolean = false): void {
  console.log(
    gridStr(grid, trim)
      .map((l) => l.join(""))
      .join("\n")
  );
}

function roughness(input: string): number {
  const g = getStringGroups(input);
  const tiles = g.map((t) => Tile.fromString(t));
  const tileMap = new Map<number, Tile>();
  const neighbourMap = new Map<string, Tile>();

  for (const t of tiles) {
    tileMap.set(t.id, t);
    for (const b of t.borders) {
      if (neighbourMap.has(b)) {
        const n = neighbourMap.get(b) as Tile;
        n.neighbours.add(t.id);
        t.neighbours.add(n.id);
      }
      neighbourMap.set(b, t);
    }
  }

  function neighbours(from: Tile): Tile[] {
    return Array.from(from.neighbours.values()).map((n) =>
      tileMap.get(n)
    ) as Tile[];
  }

  const corners = tiles.filter((t) => t.neighbours.size === 2);
  console.log("Part One", arrProd(corners.map((c) => c.id)));

  function findRightMatch(to: Tile): Tile {
    for (const c of neighbours(to)) {
      for (const n of tileOptions(c)) {
        if (n.left === to.right) return n;
      }
    }
    throw new Error("no match!");
  }

  function findDownMatch(to: Tile): Tile {
    for (const c of neighbours(to)) {
      for (const n of tileOptions(c)) {
        if (n.top === to.bot) return n;
      }
    }
    throw new Error("no match!");
  }

  const grid: Tile[][] = [];
  let len = Math.sqrt(tiles.length);

  let left: Tile = corners[0];
  const [right, down] = neighbours(left);
  // get corner in correct orientation
  for (const o of tileOptions(left)) {
    if (right.borders.includes(o.right) && down.borders.includes(o.bot)) {
      left = o;
      break;
    }
  }

  while (grid.length < len) {
    left = grid.length ? findDownMatch(left) : left;
    // console.log("left", left.id);

    const row: Tile[] = [left];
    let next = left;
    while (row.length < len) {
      const match = findRightMatch(next);
      row.push(match);
      next = match;
      // console.log("next", next.id);
    }
    grid.push(row);
  }

  const trimGrid = gridStr(grid, true);
  len = trimGrid.length;
  const hashSet = new Set<string>();
  const monSet = new Set<string>();
  for (let y = 0; y < len; y++) {
    for (let x = 0; x < len; x++) {
      const k = `${x}:${y}`;
      if (trimGrid[y][x] === "#") hashSet.add(k);
    }
  }
  const monsterArr = monster.split("\n");
  const monsterOffs: [number, number][][] = [[], [], [], [], [], [], [], []];
  for (let y = 0; y < monsterArr.length; y++) {
    const line = monsterArr[y];
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "#") {
        monsterOffs[0].push([x, y]);
        monsterOffs[1].push([y, x]);
        monsterOffs[2].push([-x, y]);
        monsterOffs[3].push([y, -x]);
        monsterOffs[4].push([x, -y]);
        monsterOffs[5].push([-y, x]);
        monsterOffs[6].push([-x, -y]);
        monsterOffs[7].push([-y, -x]);
      }
    }
  }

  function checkSnake(startX: number, startY: number): void {
    for (const snake of monsterOffs) {
      if (
        snake.every(([dx, dy]): boolean => {
          return hashSet.has(`${startX + dx}:${startY + dy}`);
        })
      ) {
        snake.forEach(([dx, dy]): void => {
          monSet.add(`${startX + dx}:${startY + dy}`);
        });
      }
    }
  }
  for (let y = 0; y < len; y++) {
    for (let x = 0; x < len; x++) {
      checkSnake(x, y);
    }
  }
  console.log("all wate", hashSet.size);
  console.log("monsters", monSet.size);
  return hashSet.size - monSet.size;
}
test(roughness(testInput), 273);
console.log("Part Two", roughness(input));

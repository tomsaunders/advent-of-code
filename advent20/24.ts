#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell, OFF, ON } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input24.txt", "utf8");
const example = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;

function setupGrid(input: string): Grid {
  const lines = input.split("\n");
  const grid = new Grid();

  for (const line of lines) {
    const steps: string[] = [];
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === "s" || c === "n") {
        steps.push(line.substr(i, 2));
        i++;
      } else {
        steps.push(c);
      }
    }
    let x = 0,
      y = 0,
      z = 0;
    for (const step of steps) {
      if (step === "e") {
        x++;
        y--;
      } else if (step === "w") {
        x--;
        y++;
      } else if (step === "ne") {
        x++;
        z--;
      } else if (step === "nw") {
        z--;
        y++;
      } else if (step === "se") {
        z++;
        y--;
      } else if (step === "sw") {
        x--;
        z++;
      }
      const c = grid.getCell(x, y, z, true) as Cell;
      // console.log(c.coord);
      // c.toggle();
      grid.addCell(c);
    }
    const c = grid.getCell(x, y, z) as Cell;
    c.toggle();
  }
  return grid;
}

function partOne(input: string): number {
  const grid = setupGrid(input);
  return grid.cells.filter((c) => c.isOn).length;
}

test(partOne(example), 10);
console.log("Part One", partOne(input));

function partTwo(input: string, days: number): number {
  const grid = setupGrid(input);
  grid.getCell(0, 0, 0, true);
  // console.log(
  //   "on",
  //   grid.cells.filter((c) => c.isOn).map((c) => c.label)
  // );
  for (let d = 0; d < days; d++) {
    grid.cells.forEach((c) => {
      const blackN = c.hexNeighbours;
    });
    const cells = grid.cells;
    cells.forEach((c) => {
      const blackN = c.hexNeighbours.filter((c) => c.isOn).length;
      // console.log(
      //   `Cell ${c.label} has neighbours  ${c.hexNeighbours
      //     .map((n) => n.coord)
      //     .join(", ")} and ${blackN} are black`
      // );
      c.next = c.type;
      if (c.isOn && (blackN === 0 || blackN > 2)) {
        c.next = OFF;
        // console.log("so fli to white");
      } else if (c.isOff && blackN === 2) {
        c.next = ON;
        // console.log("so flip to blacks");
      }
    });
    cells.forEach((c) => {
      c.type = c.next!;
    });
  }
  return grid.cells.filter((c) => c.isOn).length;
}

test(partTwo(example, 1), 15);
test(partTwo(example, 10), 37);
test(partTwo(example, 100), 2208);
console.log("Part Two", partTwo(input, 100));

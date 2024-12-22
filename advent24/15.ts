#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
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
import { arrSum, Cell, Direction, Grid, SPACE } from "./util";
const input = fs.readFileSync("input15.txt", "utf8");
const test0 = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`;
const test = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

function parseInput(input: string): [Grid, string] {
  const lines = input.split("\n");
  const empty = lines.findIndex((l) => l.trim() === "");
  const grid = lines.slice(0, empty);
  const moves = lines.slice(empty + 1).join("");
  return [Grid.fromLines(grid), moves];
}

function parseInput2(input: string): [Grid, string] {
  const lines = input.split("\n");
  const empty = lines.findIndex((l) => l.trim() === "");
  const grid = lines.slice(0, empty).map((gLine) => {
    let nu = "";
    gLine.split("").forEach((c) => {
      if (c === "#") nu += "##";
      if (c === "O") nu += "[]";
      if (c === ".") nu += "..";
      if (c === "@") nu += "@.";
    });
    return nu;
  });
  const moves = lines.slice(empty + 1).join("");
  return [Grid.fromLines(grid), moves];
}

function swap(a: Cell, b: Cell): void {
  const tmp = b.type;
  b.type = a.type;
  a.type = tmp;
}

function getDirection(move: string): Direction {
  switch (move) {
    case "^":
      return "n";
    case ">":
      return "e";
    case "<":
      return "w";
    case "v":
      return "s";
  }
  return "North";
}

function part1(input: string): number {
  const [grid, moves] = parseInput(input);
  const start = grid.cells.find((c) => c.type === "@") as Cell;
  start.type = ".";
  let curr = start;
  moves.split("").forEach((move) => {
    const dir = getDirection(move);
    const next = curr.getDirection(dir)!;
    if (next.isSpace) {
      swap(curr, next);
      curr = next;
    } else if (next.type === "O") {
      let nextnext = next.getDirection(dir)!;
      while (nextnext.type === "O") nextnext = nextnext.getDirection(dir)!;
      if (nextnext.isSpace) {
        swap(next, nextnext);
        swap(curr, next);
        curr = next;
      }
    }
  });
  return arrSum(
    grid.cells.filter((c) => c.type === "O").map((c) => c.y * 100 + c.x)
  );
}

function isBox(cell: Cell): boolean {
  return cell.type === "[" || cell.type === "]";
}

// class Box {
//   public right: Cell;
//   constructor(public left: Cell) {
//     this.right = left.east!;
//   }

//   public canMove(dir: Direction): boolean {
//     const nl = this.left.getDirection(dir)!;
//     const nr = this.right.getDirection(dir)!;
//     return nl.isWall || nr.isWall;
//   }
// }

type Box = [Cell, Cell];

function getBox(cell: Cell): Box {
  if (cell.type === "[") return [cell, cell.east!];
  else return [cell.west!, cell];
}

function canMoveBox(box: Box, dir: Direction): boolean {
  const [l, r] = box;
  const nl = l.getDirection(dir)!;
  const nr = r.getDirection(dir)!;
  if (nl.isWall || nr.isWall) {
    // console.log("Cant move box at ", l.toString() + r, " because wall");
    return false;
  }
  const canLeft = nl.isSpace || canMoveBox(getBox(nl), dir);
  const canRight = nr.isSpace || canMoveBox(getBox(nr), dir);

  // console.log(
  //   canLeft && canRight ? "can" : "cant",
  //   " move box at ",
  //   l.toString() + r,
  //   ""
  // );
  return canLeft && canRight;
}

function pushBox(box: Box, dir: Direction): void {
  const [l, r] = box;
  console.log("Moving box at ", l.toString() + r, " ", dir);
  if (l.isSpace && r.isSpace) {
    console.log("free abort");
    return;
  }
  const nl = l.getDirection(dir)!;
  if (!nl) {
    console.warn("Couldnt get ", dir, "from " + l);
  }
  const nr = r.getDirection(dir)!;
  if (!nr) {
    console.warn("Couldnt get ", dir, "from " + r);
  }

  if (nl.isSpace && nr.isSpace) {
    swap(l, nl);
    swap(r, nr);
    console.log("free space! move in!");
  } else {
    if (l.type === nl.type) {
      pushBox(getBox(nl), dir);
    } else {
      nl.isSpace || pushBox(getBox(nl), dir);
      nr.isSpace || pushBox(getBox(nr), dir);
    }
    swap(l, nl);
    swap(r, nr);
  }
}

function part2(input: string): number {
  const [grid, moves] = parseInput2(input);
  const start = grid.cells.find((c) => c.type === "@") as Cell;
  // const boxes = grid.cells
  //   .filter((c) => c.type === "[")
  //   .map((lb) => {
  //     return new Box(lb);
  //   });
  start.type = ".";
  let curr = start;

  moves
    .split("")
    // .slice(0, 30)
    .forEach((move) => {
      console.log(move);
      curr.visited = true;
      const dir = getDirection(move);
      const next = curr.getDirection(dir)!;
      if (next.isSpace) {
        swap(curr, next);
        curr = next;
      } else if (isBox(next)) {
        let nextnext = next.getDirection(dir)!;
        const moveQueue = [next];
        if (dir === "e" || dir === "w") {
          // pushing single row only
          while (isBox(nextnext)) {
            moveQueue.push(nextnext);
            nextnext = nextnext.getDirection(dir)!;
          }
          if (nextnext.isSpace) {
            let space = nextnext;
            while (moveQueue.length) {
              const end = moveQueue.pop()!;
              swap(space, end);
              space = end;
            }
            swap(curr, next);
            curr = next;
          }
        } else {
          // moving up or down
          const box = getBox(next);
          if (canMoveBox(box, dir)) {
            pushBox(box, dir);
            swap(curr, next);
            curr = next;
          }
        }
      }
      // console.log(curr + "");
      // grid.draw();
    });
  return arrSum(
    grid.cells.filter((c) => c.type === "[").map((c) => c.y * 100 + c.x)
  );
}

const t0 = part1(test0);
const t = part1(test);
if (t == 10092 && t0 == 2028) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t, t0);
}
const t2 = part2(test);
if (t2 == 9021) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

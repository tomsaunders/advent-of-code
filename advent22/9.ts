#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, Cell, Grid, SPACE, WALL } from "./util";
const input = fs.readFileSync("input9.txt", "utf8");
const test = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

function parse(input: string): Grid {
  return Grid.fromLines(input);
}

type Dir = "R" | "L" | "U" | "D";
type Move = [Dir, number];

function part1(input: string): number {
  const grid = new Grid();
  const moves = input.split("\n").map((m) => {
    const bits = m.split(" ");
    return [bits[0], parseInt(bits[1], 10)] as Move;
  });

  let tail = grid.getCell(5, 5, 0, true) as Cell;
  let head = grid.getCell(5, 5, 0, true) as Cell;
  tail.visited = true;
  head.type = "H";
  moves.forEach(([dir, count]: Move) => {
    for (let i = 0; i < count; i++) {
      head.init(false, true);
      head.type = SPACE;
      tail.type = SPACE;
      if (dir === "D") {
        head = head.south as Cell;
      } else if (dir === "L") {
        head = head.west as Cell;
      } else if (dir === "R") {
        head = head.east as Cell;
      } else if (dir === "U") {
        head = head.north as Cell;
      }
      head.init(false);
      head.type = "H";
      if (head.allNeighbours.includes(tail) || head === tail) {
        // do nothing
        tail.type = "T";
      } else {
        if (dir === "D") {
          tail = head.north as Cell;
        } else if (dir === "L") {
          tail = head.east as Cell;
        } else if (dir === "R") {
          tail = head.west as Cell;
        } else if (dir === "U") {
          tail = head.south as Cell;
        }
        tail.type = "T";
        tail.visited = true;
      }
    }
  });

  // grid.draw();
  return grid.cells.filter((c) => c.visited).length;
}

function part2(input: string): number {
  const grid = new Grid();
  const moves = input.split("\n").map((m) => {
    const bits = m.split(" ");
    return [bits[0], parseInt(bits[1], 10)] as Move;
  });

  const rope: Cell[] = [];
  for (let r = 0; r < 10; r++) {
    rope.push(grid.getCell(10, 10, 0, true) as Cell);
  }
  let head = rope[0] as Cell;
  let tail = rope[9] as Cell;

  tail.visited = true;
  moves.forEach(([dir, count]: Move) => {
    for (let c = 0; c < count; c++) {
      for (let i = 0; i <= 9; i++) {
        rope[i].type = SPACE;
      }
      head = rope[0];
      head.init(false, true);
      if (dir === "D") {
        head = head.south as Cell;
      } else if (dir === "L") {
        head = head.west as Cell;
      } else if (dir === "R") {
        head = head.east as Cell;
      } else if (dir === "U") {
        head = head.north as Cell;
      }
      rope[0] = head;

      for (let i = 0; i < 9; i++) {
        const prev = rope[i];
        let next = rope[i + 1];
        prev.init(false, true);
        if (prev.allNeighbours.includes(next) || prev === next) {
          // do nothing
        } else {
          if (dir === "D") {
            next = prev.north as Cell;
          } else if (dir === "L") {
            next = prev.east as Cell;
          } else if (dir === "R") {
            next = prev.west as Cell;
          } else if (dir === "U") {
            next = prev.south as Cell;
          }
          rope[i + 1] = next;
        }
      }
      for (let i = 0; i <= 9; i++) {
        rope[i].type = `${i}`;
      }
      tail = rope[9];
      tail.visited = true;
      console.log("visited", tail.coord);
      grid.draw();
    }
  });

  // grid.draw();
  return grid.cells.filter((c) => c.visited).length;
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
// console.log(
//   part2(`R 5
// U 8
// L 8
// D 3
// R 17
// D 10
// L 25
// U 20`)
// );
// console.log(part2(input));

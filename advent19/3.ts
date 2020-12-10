#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input3.txt", "utf8") as string;
const lines = input.split("\n");

function test(a: any, b: any): void {
  const o = a == b ? "Test pass" : "Test fail";
  console.log(o, a, b);
}

test("6", wires("R8,U5,L5,D3\nU7,R6,D4,L4"));
test(
  "159",
  wires("R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83")
);
test(
  "135",
  wires(
    "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
  )
);

function wires(input: string): number {
  const grid: Set<string> = new Set<string>();
  const lines = input.split("\n");
  let minInt = 99999999999;
  for (let w = 0; w < lines.length; w++) {
    const wire = lines[w];
    let x = 0;
    let y = 0;
    const cmds = wire.split(",");
    for (const cmd of cmds) {
      const c = cmd.substr(0, 1);
      const d = parseInt(cmd.substr(1));
      for (let i = 1; i <= d; i++) {
        if (c === "U") {
          y++;
        } else if (c === "D") {
          y--;
        } else if (c === "L") {
          x--;
        } else if (c === "R") {
          x++;
        }
        const point = `${x}:${y}`;
        if (grid.has(point) && w) {
          const dist = Math.abs(x) + Math.abs(y);
          minInt = Math.min(dist, minInt);
        } else {
          grid.add(point);
        }
      }
    }
  }

  return minInt;
}

console.log("Answer", wires(input));

console.log("PART 2");
test(
  "610",
  steps("R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83")
);
test(
  "410",
  steps(
    "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
  )
);

function steps(input: string): number {
  const grid: Map<string, number> = new Map<string, number>();
  const lines = input.split("\n");
  let minInt = 99999999999;
  for (let w = 0; w < lines.length; w++) {
    const wire = lines[w];
    let x = 0;
    let y = 0;
    const cmds = wire.split(",");
    let steps = 0;
    for (const cmd of cmds) {
      const c = cmd.substr(0, 1);
      const d = parseInt(cmd.substr(1));
      for (let i = 1; i <= d; i++) {
        steps++;
        if (c === "U") {
          y++;
        } else if (c === "D") {
          y--;
        } else if (c === "L") {
          x--;
        } else if (c === "R") {
          x++;
        }
        const point = `${x}:${y}`;
        if (grid.has(point)) {
          if (w) {
            const w1Steps = grid.get(point) as number;
            const total = w1Steps + steps;
            minInt = Math.min(total, minInt);
          }
        } else {
          if (w === 0) {
            grid.set(point, steps);
          }
        }
      }
    }
  }

  return minInt;
}

console.log("Answer", steps(input));

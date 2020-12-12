#!/usr/bin/env ts-node
import { arrSum, test, Grid, Cell } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input12.txt", "utf8");
const testIn = `F10
N3
F7
R90
F11`.split("\n");

const lines = input.split("\n");

function manhattan(lines: string[]): number {
  const dirMap: { [key: string]: object } = {
    E: {
      L180: "W",
      R180: "W",
      L90: "N",
      L270: "S",
      R90: "S",
      R270: "N",
    },
    W: {
      L180: "E",
      R180: "E",
      L90: "S",
      L270: "N",
      R90: "N",
      R270: "S",
    },
    N: {
      L180: "S",
      R180: "S",
      L90: "W",
      L270: "E",
      R90: "E",
      R270: "W",
    },
    S: {
      L180: "N",
      R180: "N",
      L90: "E",
      L270: "W",
      R90: "W",
      R270: "E",
    },
  };

  let x = 0;
  let y = 0;
  let facing = "E";

  for (const line of lines) {
    let dir = line[0];
    const num = parseInt(line.substr(1), 10);

    if (dir === "F") {
      dir = facing;
    }

    if (dir === "N") {
      y -= num;
    } else if (dir === "S") {
      y += num;
    } else if (dir === "E") {
      x += num;
    } else if (dir === "W") {
      x -= num;
    } else if (dir === "L" || dir === "R") {
      const m = dirMap[facing] as { [key: string]: string };
      facing = m[line] as string;
    }
  }
  return Math.abs(x) + Math.abs(y);
}

test(25, manhattan(testIn));
console.log("Part 1", manhattan(lines));

function waypoint(lines: string[]): number {
  let wx = 10;
  let wy = -1;
  let x = 0;
  let y = 0;

  for (const line of lines) {
    let dir = line[0];
    const num = parseInt(line.substr(1), 10);

    if (dir === "F") {
      x += wx * num;
      y += wy * num;
    }

    if (dir === "N") {
      wy -= num;
    } else if (dir === "S") {
      wy += num;
    } else if (dir === "E") {
      wx += num;
    } else if (dir === "W") {
      wx -= num;
    } else if (dir === "L" || dir === "R") {
      let l = line;
      if (line === "R90") l = "L270";
      else if (line === "R180") l = "L180";
      else if (line === "R270") l = "L90";

      let tx = wx;
      let ty = wy;
      if (l === "L90") {
        wx = ty;
        wy = -tx;
      } else if (l === "L180") {
        wx = -tx;
        wy = -ty;
      } else if (l === "L270") {
        wx = -ty;
        wy = tx;
      }
    }
  }
  return Math.abs(x) + Math.abs(y);
}
test(286, waypoint(testIn));
console.log("Part 2", waypoint(lines));

#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input3.txt", "utf8");

interface MoveMap {
  [key: string]: Coord;
}
const map: MoveMap = {
  "^": [0, -1],
  v: [0, 1],
  ">": [1, 0],
  "<": [-1, 0],
};

type Coord = [number, number];
let pos: Coord = [0, 0];
let robo: Coord = [0, 0];
const key = (pos: Coord): string => `${pos[0]}:${pos[1]}`;

const seen: Map<string, number> = new Map<string, number>();
seen.set(key(pos), 1);

for (let i = 0; i < input.length; i++) {
  const [dx, dy] = map[input[i]] as Coord;
  let k: string;
  if (i % 2 === 0) {
    // always use pos for part 1, alternate robo and pos for part 2
    pos[0] += dx;
    pos[1] += dy;
    k = key(pos);
  } else {
    robo[0] += dx;
    robo[1] += dy;
    k = key(robo);
  }
  const n = seen.has(k) ? seen.get(k)!! : 0;
  seen.set(k, n + 1);
}
console.log(Array.from(seen.values()).length);

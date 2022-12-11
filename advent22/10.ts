#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum, SPACE, WALL } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");

const test = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

type Op = "noop" | "addx";
type Cmd = [Op, number?];

function parse(
  input: string
): [Record<number, number>, Record<number, number>] {
  let registerX = 1;
  let cycles = 0;

  const moves = input.split("\n").map((m) => {
    const bits = m.split(" ");
    return [bits[0], parseInt(bits[1] || "0", 10)] as Cmd;
  });

  let i = 0;
  const signals: Record<number, number> = {};
  const registers: Record<number, number> = {};

  while (cycles < 240) {
    const move = moves[i];
    if (move[0] === "noop") {
      cycles++;
      signals[cycles] = registerX * cycles;
      registers[cycles] = registerX;
    } else if (move[0] === "addx") {
      cycles++;
      signals[cycles] = registerX * cycles;
      registers[cycles] = registerX;
      cycles++;
      signals[cycles] = registerX * cycles;
      registers[cycles] = registerX;
      registerX += move[1] as number;
    }

    i++;
    i %= moves.length;
  }
  return [signals, registers];
}

function part1(input: string): number {
  const [signals] = parse(input);
  return arrSum([
    signals[20],
    signals[60],
    signals[100],
    signals[140],
    signals[180],
    signals[220],
  ]);
}

function part2(input: string): string {
  const [signals, registers] = parse(input);
  for (let y = 0; y < 6; y++) {
    let l = "";
    for (let x = 0; x < 40; x++) {
      const cycle = y * 40 + x;
      const reg = registers[cycle + 1];
      if (reg === x || reg === x + 1 || reg === x - 1) {
        l += WALL;
      } else {
        l += SPACE;
      }
    }
    console.log(l);
  }
  return "\n";
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

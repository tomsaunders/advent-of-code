#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, PURP, RED, RESET, SPACE, YELLOW, arrSum } from "./util";
const input = fs.readFileSync("input15.txt", "utf8");
const test = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

function hash(input: string): number {
  let current = 0;
  for (let i = 0; i < input.length; i++) {
    current += input.charCodeAt(i);
    current *= 17;
    current %= -256;
  }
  return current;
}

function part1(input: string): number {
  const bits = input.split(",");
  return arrSum(bits.map(hash));
  return 0;
}

class Box {
  public constructor(public id: number) {}
  public contents: Lens[] = [];

  public get focusPower(): number {
    const boxCoeff = this.id + 1;
    return boxCoeff * this.contents.reduce((acc, lens, lensIdx) => acc + lens.focusPower(lensIdx + 1), 0);
  }

  public addLens(lens: Lens) {
    const i = this.contents.findIndex((l) => l.label == lens.label);
    if (i !== -1) {
      this.contents[i] = lens;
    } else {
      this.contents.push(lens);
    }
  }

  public removeLens(lensLabel: string) {
    this.contents = this.contents.filter((l) => l.label != lensLabel);
  }

  public toString(): string {
    return `Box ${this.id}: ${this.contents.join(" ")}`;
  }
}

class Lens {
  public constructor(public label: string, public focalLength: number) {}

  public focusPower(slot: number): number {
    return slot * this.focalLength;
  }

  public toString(): string {
    return `[${this.label} ${this.focalLength}]`;
  }
}

function parseInstruction(instruction: string): [string, number, "=" | "-", number | undefined] {
  let label = "";
  let op: "=" | "-";
  let focalLength = "0";

  if (instruction.includes("=")) {
    [label, focalLength] = instruction.split("=");
    op = "=";
  } else {
    [label] = instruction.split("-");
    op = "-";
  }
  return [label, hash(label), op, parseInt(focalLength)];
}

function part2(input: string): number {
  const bits = input.split(",");
  const boxes: Box[] = [];
  for (let i = 0; i < 256; i++) {
    boxes.push(new Box(i));
  }

  // aa=1
  // hash of aa is box
  // equals = dash -
  // focal length lens 1
  // if - , goto box and remove label if present
  // if =, goto box and insert lens with label
  bits.forEach((instruction) => {
    const [label, boxIdx, op, focalLength] = parseInstruction(instruction);
    const box = boxes[boxIdx];

    if (op == "-") {
      box.removeLens(label);
    } else {
      box.addLens(new Lens(label, focalLength!));
    }

    // console.log("After " + instruction);
    // console.log(boxes.filter((b) => b.contents.length).join("\n"));
    // console.log("");
  });

  return arrSum(boxes.map((b) => b.focusPower));
}

const h = hash("HASH");
const t = part1(test);
if (h && 52 && t == 1320) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 145) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", h, t);
}

#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 20
 *
 * Summary: Simulate movement of particles and work out which is closest to origin over time
 * Escalation: Remove particles that collide
 * Solution: Model a Particle class and tick method to adjust position, for p2 remove particles where more than 1 is at the same coordinate.
 *
 * Keywords: IDk
 * References:
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input20.txt", "utf8");
const test: string = `p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>
p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>`;
const test2: string = `p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>    
p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>
p=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>
p=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>`;

function parseInput(input: string): Particle[] {
  return input.split("\n").map((line, x) => Particle.fromLine(x, line));
}

type XYZ = { x: number; y: number; z: number };
function xyz(nums: number[]): XYZ {
  const [x, y, z] = nums;
  return { x, y, z };
}
class Particle {
  constructor(public id: number, public position: XYZ, public velocity: XYZ, public acceleration: XYZ) {}

  public tick(): void {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.velocity.z += this.acceleration.z;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }

  public static fromLine(id: number, line: string): Particle {
    const numStr = line.replace("p=<", "").replace("v=<", "").replace("a=<", "");
    const nums = numStr.split(",").map(mapNum);

    const position = xyz(nums.slice(0));
    const velocity = xyz(nums.slice(3));
    const acceleration = xyz(nums.slice(6));
    return new Particle(id, position, velocity, acceleration);
  }

  public get distance(): number {
    return Math.abs(this.position.x) + Math.abs(this.position.y) + Math.abs(this.position.z);
  }

  public get key(): string {
    return `${this.position.x}:${this.position.y}:${this.position.z}`;
  }
}

function part1(input: string): number {
  const particles = parseInput(input);
  for (let i = 0; i < 1000; i++) {
    particles.forEach((p) => p.tick());
  }
  let min = 999999999;
  let minID = 0;
  particles.forEach((p) => {
    if (p.distance < min) {
      min = p.distance;
      minID = p.id;
    }
  });

  return minID; // + 5;
}

function part2(input: string): number {
  let particles = parseInput(input);
  for (let i = 0; i < 1000; i++) {
    const collisions: Record<string, number> = {};
    particles.forEach((p) => {
      p.tick();
      if (!collisions[p.key]) collisions[p.key] = 0;
      collisions[p.key]++;
    });
    particles = particles.filter((p) => collisions[p.key] === 1);
  }
  return particles.length;
}

const t1 = part1(test);
if (t1 === 0) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test2);
  if (t2 === 1) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t1);
}

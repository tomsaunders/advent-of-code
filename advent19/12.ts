#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input11.txt", "utf8") as string;

class Moon {
  public vx: number = 0;
  public vy: number = 0;
  public vz: number = 0;
  public seen: Map<string, number>;
  public loopSize: number = 0;

  constructor(public x: number, public y: number, public z: number) {
    this.seen = new Map<string, number>();
    this.seen.set(this.status, 0);
  }

  public get status(): string {
    return `pos= ${this.x}, ${this.y}, ${this.z} vel= ${this.vx}, ${this.vy}, ${this.vz}`;
  }

  public get potential(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  public get kinetic(): number {
    return Math.abs(this.vx) + Math.abs(this.vy) + Math.abs(this.vz);
  }

  public get energy(): number {
    return this.potential * this.kinetic;
  }

  public gravity(moons: Moon[]): void {
    for (const moon of moons) {
      if (moon !== this) {
        if (moon.x > this.x) {
          this.vx++;
          moon.vx--;
        } else if (moon.x < this.x) {
          this.vx--;
          moon.vx++;
        }
        if (moon.y > this.y) {
          this.vy++;
          moon.vy--;
        } else if (moon.y < this.y) {
          this.vy--;
          moon.vy++;
        }
        if (moon.z > this.z) {
          this.vz++;
          moon.vz--;
        } else if (moon.z < this.z) {
          this.vz--;
          moon.vz++;
        }
      }
    }
  }

  public move(time: number): void {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    if (this.loopSize) {
      // return;
    }
    // const status = this.status;
    // if (this.seen.has(status)) {
    //   const loop = time - (this.seen.get(status) as number);
    //   if (!this.loopSize || loop < this.loopSize) {
    //     this.loopSize = loop;
    //     console.log(
    //       time,
    //       `${status} seen previously at `,
    //       this.seen.get(status),
    //       "loop size is",
    //       loop
    //     );
    //   }
    // } else {
    //   this.seen.set(status, time);
    // }
  }
}

const testMoons = [
  new Moon(-1, 0, 2),
  new Moon(2, -10, -7),
  new Moon(4, -8, 8),
  new Moon(3, 5, -1)
];

const test2 = [
  new Moon(-8, -10, 0),
  new Moon(5, 5, 10),
  new Moon(2, -7, 3),
  new Moon(9, -8, -3)
];

const inputMoons = [
  new Moon(1, 4, 4),
  new Moon(-4, -1, 19),
  new Moon(-15, -14, 12),
  new Moon(-17, 1, 10)
];

function run(moons: Moon[], time: number): void {
  for (let m = 0; m < moons.length; m++) {
    const moon = moons[m];
    moon.gravity(moons.slice(m + 1));
  }
  for (const moon of moons) {
    moon.move(time);
  }
}

function energyLoop(moons: Moon[], count: number): number {
  let t = 0;
  for (; t < count; t++) {
    run(moons, t);
  }
  let total = 0;
  for (const moon of moons) {
    total += moon.energy;
  }
  return total;
}

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

test(179, energyLoop(testMoons, 10));
test(1940, energyLoop(test2, 100));
console.log("Part 1 answer:", energyLoop(inputMoons, 1000));

// part 2
console.log("\nPart 2");

function steps(moons: Moon[]): number {
  const seen = new Map<string, number>();
  let hash = moons.map(m => m.status).join("::");
  let t = 0;
  while (!seen.has(hash)) {
    seen.set(hash, t);
    run(moons, t);
    t++;
    hash = moons.map(m => m.status).join("::");
    if (seen.has(hash)) {
      return t;
    }
  }
  return t;
}

function axisSeen(moons: Moon[]): number {
  const xMap = new Map<string, number>();
  const yMap = new Map<string, number>();
  const zMap = new Map<string, number>();
  let xhash = moons.map(m => `${m.x}:${m.vx}`).join("::");
  let yhash = moons.map(m => `${m.y}:${m.vy}`).join("::");
  let zhash = moons.map(m => `${m.z}:${m.vz}`).join("::");
  xMap.set(xhash, 0);
  yMap.set(yhash, 0);
  zMap.set(zhash, 0);

  let t = 0;
  let xLoop = 0;
  let yLoop = 0;
  let zLoop = 0;
  while (!xLoop || !yLoop || !zLoop) {
    run(moons, t);
    t++;
    xhash = moons.map(m => `${m.x}:${m.vx}`).join("::");
    yhash = moons.map(m => `${m.y}:${m.vy}`).join("::");
    zhash = moons.map(m => `${m.z}:${m.vz}`).join("::");

    if (!xLoop) {
      if (xMap.has(xhash)) {
        xLoop = t - (xMap.get(xhash) as number);
      } else {
        xMap.set(xhash, t);
      }
    }
    if (!yLoop) {
      if (yMap.has(yhash)) {
        yLoop = t - (yMap.get(yhash) as number);
      } else {
        yMap.set(yhash, t);
      }
    }
    if (!zLoop) {
      if (zMap.has(zhash)) {
        zLoop = t - (zMap.get(zhash) as number);
      } else {
        zMap.set(zhash, t);
      }
    }
  }

  let mul = 1;
  let max = Math.max(xLoop, yLoop, zLoop);
  let stepTry = mul * max;

  console.log("Finding first common multiples of ", xLoop, yLoop, zLoop);
  while (
    stepTry % xLoop !== 0 ||
    stepTry % yLoop !== 0 ||
    stepTry % zLoop !== 0
  ) {
    mul++;
    stepTry = mul * max;
  }

  return stepTry;
}

test(2772, steps(testMoons));
test(2772, axisSeen(testMoons));
test(4686774924, axisSeen(test2));
console.log("Answer", axisSeen(inputMoons));

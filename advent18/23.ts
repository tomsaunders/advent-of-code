#!/usr/bin/env npx ts-node
import * as fs from "fs";
const input = fs.readFileSync("input23.txt", "utf8");
const test = `pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1`;

const test2 = `pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5`;

// const lines = test2.split("\n");
const lines = input.split("\n");

const fuzz = (num: number, seed: number = 0): number => {
  // let multiplier = (Math.random() - 0.5) / 5;
  // if (Math.random() > 0.8) {
  //   multiplier *= 0.1;
  // }
  // // if (Math.random() > 0.8) {
  // //   multiplier *= 10;
  // // }
  // return Math.floor(num * (multiplier + 1));

  if (seed) {
    Math.floor(num + ((Math.random() - 0.5) * seed) / 100);
  }

  if (Math.random() > 0.5) {
    return Math.floor(num + (Math.random() - 0.5) * 2000);
  }
  return Math.floor(num + (Math.random() - 0.5) * 10);
};

const avg = (a: number, b: number): number => {
  const diff = b - a;
  return Math.round(a + diff * Math.random());
  // return Math.round((a + b) / 2);
};

class Position {
  public score: number = 0;
  public nearest: number = 999999999;
  public constructor(public x: number, public y: number, public z: number) {}

  public dist(z: number, y: number, x: number): number {
    return Math.abs(this.y - y) + Math.abs(this.x - x) + Math.abs(this.z - z);
  }

  public mutate(seed: number = 0): Position {
    return new Position(fuzz(this.x, seed), fuzz(this.y, seed), fuzz(this.z, seed));
  }

  public crossover(other: Position) {
    return new Position(avg(this.x, other.x), avg(this.y, other.y), avg(this.z, other.z));
  }

  public toString(): string {
    return `${this.x},${this.y},${this.z} found ${this.score}`;
  }

  public closest(bot: Nanobot): void {
    const diff = this.dist(bot.z, bot.y, bot.x) - bot.radius;
    this.nearest = Math.min(diff, this.nearest);
  }
}

class Nanobot extends Position {
  public constructor(public x: number, public y: number, public z: number, public radius: number) {
    super(x, y, z);
  }

  public canSee(other: Position): boolean {
    return this.dist(other.z, other.y, other.x) <= this.radius;
  }

  public toString(): string {
    return `${this.x},${this.y},${this.z} r${this.radius}`;
  }
}

const bots: Nanobot[] = [];
let big = 0;
let b: Nanobot;

// let maxY = 0;
// let minY = 0;
// let maxX = 0;
// let minX = 0;
// let minZ = 0;
// let maxZ = 0;

for (let line of lines) {
  line = line
    .replace("pos=<", "")
    .replace(">", "")
    .replace(" r=", "");
  const [x, y, z, radius] = line.split(",").map((value) => parseInt(value, 10));
  const bot = new Nanobot(x, y, z, radius);
  bots.push(bot);
  if (radius > big) {
    big = radius;
    b = bot;
  }
  // maxY = Math.max(maxY, y);
  // minY = Math.min(minY, y);
  // maxX = Math.max(maxX, x);
  // minX = Math.min(minX, x);
  // minZ = Math.min(minZ, z);
  // maxZ = Math.max(maxZ, z);
}

const inRange = bots.filter((bot) => {
  return b.canSee(bot);
});
console.log("Part 1: ", inRange.length);

const key = (x: number, y: number, z: number): string => {
  return [x, y, z].join(":");
};

const populationSize = 300;
const populationKeep = 0.8;
const populationCross = 0.5;

let population = [new Position(16624021, 29121000, 52820569)];
let max = 0;
let minOrigin = 999999999;
let maxAt = "";
let results = [0, 2, 1];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// initial population
while (population.length < populationSize) {
  shuffleArray(bots);
  population.push(bots[0].mutate());
}

let gen = 0;
while (gen < 10000000) {
  // while we are improving
  let localFittest = 0;
  for (const candidate of population) {
    candidate.score = 0;
    for (const bot of bots) {
      if (bot.canSee(candidate)) {
        candidate.score++;
      } else {
        candidate.closest(bot);
      }
    }
  }

  const keep = Math.ceil(populationSize * populationKeep);
  const cross = Math.ceil(populationSize * populationCross);
  let shortlist = population
    .sort((a: Position, b: Position) => (b.score === a.score ? a.nearest - b.nearest : b.score - a.score))
    .slice(0, keep);
  const next: Position[] = [];

  const fittest = shortlist[0];
  console.log(`Fittest ${fittest}   ${fittest.nearest}   ${fittest.dist(0, 0, 0)}`);
  for (let i = 0; i < gen % 100; i++) {
    next.push(fittest.mutate(fittest.nearest));
  }

  if (gen % 30 === 0) {
    for (const bot of bots) {
      if (!bot.canSee(fittest)) {
        next.push(fittest.crossover(bot));
        next.push(bot.crossover(fittest));
        next.push(bot.mutate(fittest.nearest));
        next.push(bot.mutate(fittest.nearest));
        // if (next.length > 10) break;
      }
    }
  }

  if (gen % 2 === 0) {
    for (let i = 0; i < 5; i++) {
      next.push(shortlist[i]);
      next.push(shortlist[i].mutate());
      next.push(shortlist[i].mutate());
      next.push(shortlist[i].mutate());
      next.push(shortlist[i].mutate());
      next.push(shortlist[i].mutate());
    }
  }
  next.push(shortlist[0].crossover(shortlist[1]));
  next.push(shortlist[0].crossover(shortlist[2]));
  next.push(shortlist[1].crossover(shortlist[2]));

  while (next.length < cross) {
    shuffleArray(shortlist);
    next.push(shortlist[0].crossover(shortlist[1]));
    next.push(shortlist[2].crossover(shortlist[3]));
  }

  shortlist = shortlist.sort((a: Position, b: Position) =>
    b.score === a.score ? b.dist(0, 0, 0) - a.dist(0, 0, 0) : b.score - a.score
  );
  localFittest = shortlist[0].score;
  const worstShortlist = shortlist[shortlist.length - 1];
  // console.log(`${worstShortlist} worst`);
  max = Math.max(max, localFittest);
  const pcg = Math.round((localFittest / max) * 10000) / 10000;
  if (gen % 1000 == 0) console.log(`\n${gen} ${pcg}%`);

  while (next.length < populationSize) {
    const short = shortlist.shift() as Position;
    if (short.score === max) {
      // console.log(`${gen} New max ${short}   ${minOrigin}    ${short.nearest}`);
      if (short.dist(0, 0, 0) < minOrigin) {
        minOrigin = short.dist(0, 0, 0);
      }
    }
    next.push(short.mutate());
  }

  population = next;
  results.shift();
  results.push(localFittest);
  gen++;
}

//97015850 too low

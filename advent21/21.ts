#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input21.txt", "utf8");
const test = fs.readFileSync("test21.txt", "utf8");

class Die {
  public max: number = 100;
  public next: number = 1;
  public count: number = 0;
  constructor() {}
  public roll(): number {
    this.count++;
    const n = this.next;
    this.next++;
    if (this.next > this.max) {
      this.next -= this.max;
    }
    return n;
  }
}

class Player {
  constructor(
    public position: number,
    public score: number = 0,
    public multiplier: number = 1
  ) {}

  public turn(die: Die): void {
    const moves = die.roll() + die.roll() + die.roll();
    this.move(moves);
  }

  public move(spaces: number): this {
    this.position += spaces;
    this.position %= 10;
    this.score += this.position + 1;
    return this;
  }

  public hasWon(maxScore: number): boolean {
    return this.score >= maxScore;
  }

  public diracTurn(): Player[] {
    return [
      this.dirac(3, 1),
      this.dirac(4, 3),
      this.dirac(5, 6),
      this.dirac(6, 7),
      this.dirac(7, 6),
      this.dirac(8, 3),
      this.dirac(9, 1),
    ];
  }

  public dirac(spaces: number, freq: number): Player {
    return new Player(this.position, this.score, this.multiplier * freq).move(
      spaces
    );
  }

  static fromLine(line: string): Player {
    let position = parseInt(line.split(": ")[1], 10);
    position--; // 0 indexed.
    return new Player(position, 0);
  }
}

function part1(input: string): number {
  const lines = input.split("\n");
  const players = lines.map((l) => Player.fromLine(l));
  const [p1, p2] = players;

  const dice = new Die();

  while (!players.find((p) => p.hasWon(1000))) {
    p1.turn(dice);
    if (!p1.hasWon(1000)) {
      p2.turn(dice);
    }
  }

  const lowScore = Math.min(...players.map((p) => p.score));
  return lowScore * dice.count;
}

const t1 = part1(test);
if (t1 === 739785) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 444356092776315) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

type Game = [Player, Player];

function part2(input: string): number {
  const lines = input.split("\n");
  const players = lines.map((l) => Player.fromLine(l)) as Game;
  let p1Count = 0;
  let p2Count = 0;

  const games: Game[] = [players];
  while (games.length) {
    const game = games.pop() as Game;
    const [p1, p2] = game;
    const ones = p1.diracTurn();
    ones.forEach((d1) => {
      if (d1.hasWon(21)) {
        p1Count += p2.multiplier * d1.multiplier;
      } else {
        const twos = p2.diracTurn();
        twos.forEach((d2) => {
          if (d2.hasWon(21)) {
            p2Count += d1.multiplier * d2.multiplier;
          } else {
            games.push([d1, d2]);
          }
        });
      }
    });
  }

  return Math.max(p1Count, p2Count);
}

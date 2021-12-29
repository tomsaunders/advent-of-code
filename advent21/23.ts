#!/usr/bin/env ts-node
import * as fs from "fs";
import { WALL, SPACE } from "./util";
const input = fs.readFileSync("input23.txt", "utf8");
const test = fs.readFileSync("test23.txt", "utf8");
const input2 = fs.readFileSync("input23b.txt", "utf8");
const test2 = fs.readFileSync("test23b.txt", "utf8");

const template = `#############
#...........#
###.#.#.#.###
  #.#.#.#.#
  #########`.split("\n");

const HALL_Y = 1;

function coord(x: number, y: number): string {
  return `${x};${y}`;
}

let debug = false;

class Amph {
  public code: number;
  constructor(
    public game: Game,
    public x: number,
    public y: number,
    public type: string
  ) {
    this.code = this.type.charCodeAt(0) - 65;
  }

  public get label(): string {
    return `${this.type} @ ${this.coord}`;
  }

  public get coord(): string {
    return coord(this.x, this.y);
  }

  public get moveCoefficient(): number {
    return Math.pow(10, this.code);
  }

  public get roomX(): number {
    return 3 + this.code * 2;
  }

  public get inHallway(): boolean {
    return this.y === HALL_Y;
  }

  public get inGoal(): boolean {
    // if not in the right column or in the hallway, obviously not in goal
    if (this.x !== this.roomX || this.y === HALL_Y) {
      return false;
    }
    // at the right level, but check that everything lower down matches.. if not, this will have to move out
    for (let y = this.y; y <= this.game.maxY; y++) {
      if (this.game.getCell(this.x, y) !== this.type) {
        return false;
      }
    }
    return true;
  }

  public get minRemainingMoves(): number {
    if (this.inGoal) {
      return 0;
    }
    // if in hallway, will have to descend at least one to goal
    // if in wrong room, will have to do that 1 plus move up to y=1 (hallway)
    const vertical = this.y === HALL_Y ? 1 : this.y;
    const horizontal = Math.abs(this.x - this.roomX);
    return vertical + horizontal;
  }
}

type Move = [number, number, number, Amph]; // destination x & y, moves, Amph that moves

class Game {
  constructor(public score: number) {}
  public amphs: Amph[] = [];
  public lookup: { [key: string]: Amph } = {};

  public get heuristic(): number {
    const inGoal = this.amphs.filter((a) => a.inGoal).length;
    const inHall = this.amphs.filter((a) => a.inHallway).length;
    return inGoal * 100 + inHall * 10;
  }

  public get isComplete(): boolean {
    return this.amphs.every((a) => a.inGoal);
  }

  public get maxY(): number {
    return this.amphs.length / 4 + 1; // 4 rooms, 1 hallway.
  }

  public get hash(): string {
    return this.amphs.map((a) => a.label).join("=") + "=" + this.score;
  }

  public get minRemainingCost(): number {
    return this.amphs.reduce(
      (carry, a) => (carry += a.minRemainingMoves * a.moveCoefficient),
      0
    );
  }

  public addAmph(x: number, y: number, type: string): void {
    const a = new Amph(this, x, y, type);
    this.amphs.push(a);
    if (this.lookup[a.coord]) {
      throw Error(a.coord + " is already full");
    }
    this.lookup[a.coord] = a;
  }

  public getCell(x: number, y: number): string {
    const c = coord(x, y);
    return this.lookup[c] ? this.lookup[c].type : SPACE;
  }

  public hasPotential(currentMinimum: number): boolean {
    return this.score + this.minRemainingCost < currentMinimum;
  }

  public getRoomCells(x: number): string[] {
    const cells: string[] = [];
    for (let y = HALL_Y + 1; y <= this.maxY; y++) {
      cells.push(this.getCell(x, y));
    }
    return cells;
  }

  public getGoalOptions(): Move[] {
    // find every amph that can reach a room.. whether room to room or hallway to room
    const options: Move[] = [];
    this.amphs
      .filter((a) => !a.inGoal)
      .forEach((a) => {
        debug && console.log("..checking goal for ", a.label);
        const goalCells = this.getRoomCells(a.roomX);
        if (!goalCells.every((g) => g === SPACE || g === a.type)) {
          return; // goals are only valid destinations if they are empty or if the bottom is the right type
        }
        debug && console.log("....goal is empty");

        let path: Set<string> = new Set<string>();
        if (!a.inHallway) {
          let y = a.y;
          while (y > HALL_Y) {
            y--;
            if (this.getCell(a.x, y) === SPACE) {
              path.add(coord(a.x, y));
            } else {
              return; // blocked.
            }
          }
          debug && console.log("....can reach hallway");
        } else {
          debug && console.log("....already in hallway");
        }
        // calc moves to hallway outside room
        let i = Math.min(a.roomX, a.x);
        let j = Math.max(a.roomX, a.x);
        for (let x = i; x <= j; x++) {
          if (x === a.x) continue;
          if (this.getCell(x, HALL_Y) === SPACE) {
            path.add(coord(x, HALL_Y));
          } else {
            return; // blocked.
          }
        }
        debug && console.log("....can reach hallway outside goal");

        let deepestY = 0;
        for (let y = HALL_Y + 1; y <= this.maxY; y++) {
          const c = this.getCell(a.roomX, y);
          if (c === SPACE) {
            deepestY = y;
            path.add(coord(a.roomX, y));
          }
        }
        debug && console.log("....can get inside goal");
        options.push([a.roomX, deepestY, path.size, a]);
      });

    return options;
  }

  public getHallwayOptions(): Move[] {
    const options: Move[] = [];

    this.amphs
      .filter((a) => !a.inGoal && !a.inHallway)
      .forEach((a) => {
        debug && console.log("..checking hallway for ", a.label);
        let y = a.y;
        while (y > HALL_Y) {
          y--;
          if (this.getCell(a.x, y) === SPACE) {
          } else {
            return; // blocked.
          }
        }
        const movesToLeave = a.y - HALL_Y;
        // move left checking free options
        for (let lx = a.x - 1; lx > 0; lx--) {
          const moves = a.x - lx + movesToLeave;
          if (this.getCell(lx, y) === SPACE) {
            if (![3, 5, 7, 9].includes(lx)) {
              // cant stop right outside a room
              options.push([lx, HALL_Y, moves, a]);
              debug && console.log("....found option", coord(lx, HALL_Y));
            }
          } else {
            lx = -99;
          }
        }

        // move left checking free options
        for (let rx = a.x + 1; rx < 12; rx++) {
          const moves = rx - a.x + movesToLeave;
          if (this.getCell(rx, y) === SPACE) {
            if (![3, 5, 7, 9].includes(rx)) {
              options.push([rx, HALL_Y, moves, a]);
              debug && console.log("....found option", coord(rx, HALL_Y));
            }
          } else {
            rx = 99;
          }
        }
      });

    return options;
  }

  public makeMove(move: Move): void {
    const [x, y, count, amph] = move;

    const thisAmph = this.lookup[amph.coord];
    delete this.lookup[amph.coord];

    const cost = thisAmph.moveCoefficient * count;

    this.score += cost;
    thisAmph.x = x;
    thisAmph.y = y;
    if (this.lookup[thisAmph.coord])
      throw new Error(thisAmph.coord + " is already full");
    this.lookup[thisAmph.coord] = thisAmph;
    debug &&
      console.log(
        "....moving",
        amph.type,
        "at",
        amph.coord,
        "to",
        thisAmph.coord
      );
  }

  public draw(): void {
    for (let y = 0; y < template.length; y++) {
      let l = "";
      for (let x = 0; x < template[y].length; x++) {
        const c = coord(x, y);
        l += this.lookup[c] ? this.lookup[c].type : template[y][x];
      }
      debug && console.log(l);
    }
  }

  public clone(): Game {
    const game = new Game(this.score);
    for (const a of this.amphs) {
      game.addAmph(a.x, a.y, a.type);
    }
    return game;
  }

  static fromString(input: string): Game {
    const lines = input.split("\n");

    const game = new Game(0);
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        const c = lines[y][x];
        if (c === WALL || c === SPACE || c === " ") {
          // ignore
        } else {
          game.addAmph(x, y, c);
        }
      }
    }
    return game;
  }

  static pathFindingPrioritySort(a: Game, b: Game): number {
    if (a.heuristic === b.heuristic) {
      return a.minRemainingCost - b.minRemainingCost; // try min score
    }
    return b.heuristic - a.heuristic; // max heuristic
  }
}

function run(input: string): number {
  let minScore = Infinity;
  const queue: Game[] = [Game.fromString(input)];

  let seen: Set<string> = new Set<string>();

  function addQueue(game: Game): void {
    if (!game.hasPotential(minScore)) {
      debug && console.log("too expensive to queue");
      return;
    }
    if (seen.has(game.hash)) {
      debug && console.log("already seen", game.hash);
    }
    debug && console.log("queueed", game.hash);
    seen.add(game.hash);
    queue.push(game);
  }

  while (queue.length) {
    const game: Game = queue.shift() as Game;
    if (game.score > minScore) {
      continue;
    }
    if (game.isComplete) {
      if (game.score < minScore) {
        minScore = Math.min(minScore, game.score);
        console.log(
          "game complete!",
          game.score,
          "min now",
          minScore,
          "queue len",
          queue.length
        );
      }
      continue;
    }
    game.draw();

    // any move that can reach a goal is perfect and the order doesn't matter
    let hasGoalMove = false;
    game.getGoalOptions().forEach((move) => {
      const newGame = game.clone();
      debug && console.log("Making goal move");
      newGame.makeMove(move);
      addQueue(newGame);
      hasGoalMove = true;
    });

    if (!hasGoalMove) {
      // at this point, consider the option branches
      game.getHallwayOptions().forEach((move) => {
        const newGame = game.clone();
        debug && console.log("Making hallway move");
        newGame.makeMove(move);
        addQueue(newGame);
      });
    }

    queue.sort(Game.pathFindingPrioritySort);
    if (queue[0])
      debug &&
        console.log(
          "\nQueue sort: next is ",
          queue[0].heuristic,
          queue[0].score,
          "queue size is",
          queue.length,
          "min score is",
          minScore
        );
  }

  return minScore;
}

const t1 = run(test);
if (t1 === 12521) {
  console.log("Test completed");
  console.log("Part One:", run(input));
  const t2 = run(test2);
  if (t2 === 44169) {
    console.log("Test completed");
    console.log("Part Two:", run(input2));
  }
}

// A note on prioritising the queue
// adding the notion of the minimum remaining cost and evaluating the most promising part of the queue based on that
// changed the execution time for
// ...part 1 test and input - 2 min to 12 seconds - 10x better
// ...both tests and both inputs - 9 minutes to 9.75 minutes - slower?!
// this is way slower than is sensible, perhaps revisiting on a work wednesday would be a good idea

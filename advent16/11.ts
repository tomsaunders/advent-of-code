#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrProd, arrSum, test } from "./util";
const input = `The first floor contains a polonium generator, a thulium generator, a thulium-compatible microchip, a promethium generator, a ruthenium generator, a ruthenium-compatible microchip, a cobalt generator, and a cobalt-compatible microchip.
The second floor contains a polonium-compatible microchip and a promethium-compatible microchip.
The third floor contains nothing relevant.
The fourth floor contains nothing relevant.`;

const testIn = `The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.`;

interface GameState {
  e: number;
  f: string[];
}

// polonium 1 thulium 2 promethium 3 ruthenium 4 cobalt 5
const inputState: GameState = {
  e: 0,
  f: ["1G, 2G, 2M, 3G, 4G, 4M, 5G, 5M", "1M, 3M", "", ""],
};

// hydrogen 1 lithium 2
const testState: GameState = {
  e: 0,
  f: ["1M,2M", "1G", "2G", ""],
};

class Game {
  public elevator: number;
  public map: Map<string, Device>;
  public floors: Device[][] = [];
  constructor(state: GameState) {
    this.elevator = state.e;
    this.map = new Map<string, Device>();
    this.floors = state.f.map((devices: string, i): Device[] =>
      devices.split(",").map((id) => Device.init(id.trim(), i, this))
    );
  }
  refloor(): Game {
    this.floors = [[], [], [], []];
    Array.from(this.map.values()).forEach((d) => {
      if (!this.floors[d.floor]) {
        console.error("WTF");
        console.log(d);
      }
      this.floors[d.floor].push(d);
    });
    return this;
  }
  toJSON(): GameState {
    return {
      e: this.elevator,
      f: this.floors.slice().map((devices: Device[]): string =>
        devices
          .slice()
          .map((d) => d.id)
          .sort()
          .join(",")
      ),
    };
  }
  get valid(): boolean {
    return this.floors.every((floor: Device[]) => {
      const containsGenerator = !!floor.find((d) => d instanceof Gen);
      const containsUnshielded = !!floor.find(
        (d) => d instanceof Chip && !d.isShielded
      );
      return !(containsGenerator && containsUnshielded);
    });
  }
  get elevatorOptions(): number[] {
    const options = [];
    if (this.elevator !== 3) {
      options.push(1);
    }

    if (this.elevator !== 0) {
      if (this.elevator === 1 && this.floors[0].length === 0) {
        // do nothing
      } else {
        options.push(-1);
      }
    }

    return options;
  }
  get deviceOptions(): Device[] {
    return this.floors[this.elevator];
  }

  get score(): number {
    return arrProd(
      this.floors.map((devices: Device[]) =>
        arrProd(devices.map((d) => 4 - d.floor))
      )
    );
  }

  get win(): boolean {
    return (
      this.valid &&
      this.elevator === 3 &&
      this.floors[3].length === this.map.size
    );
  }
}

class Device {
  constructor(public id: string, public floor: number, protected game: Game) {
    game.map.set(id, this);
  }
  public get code(): string {
    return this.id[0];
  }
  static init(key: string, floor: number, game: Game): Device {
    if (key.endsWith("M")) {
      return new Chip(key, floor, game);
    } else {
      return new Gen(key, floor, game);
    }
  }
}
class Chip extends Device {
  public get gen(): Gen {
    return this.game.map.get(this.code + "G") as Gen;
  }
  public get isShielded(): boolean {
    const gen = this.gen;
    return gen.floor === this.floor;
  }
}
class Gen extends Device {
  public get chip(): Gen {
    return this.game.map.get(this.code + "M") as Gen;
  }
}

const g = new Game(testState);

type Branch = [GameState, number, number];
function gameLoop(start: GameState) {
  const queue: Branch[] = [[start, 0, 99999]];

  const seen: Map<string, number> = new Map<string, number>();

  let minSteps = 999999;
  let x = 0;
  while (queue.length) {
    x++;
    const [state, steps, score] = queue.pop() as Branch;
    if (steps > minSteps) {
      continue;
    }
    const game = new Game(state);
    if (game.win) {
      minSteps = Math.min(steps, minSteps);
      console.log("winning!", steps, game.toJSON());
      continue;
    }

    if (!game.valid) {
      continue;
    }

    if (queue.length % 1000 === 0)
      console.log(
        "steps",
        steps,
        game.toJSON(),
        "score",
        score,
        "queue",
        queue.length,
        "seen",
        seen.size,
        "x",
        x
      );

    for (const dE of game.elevatorOptions) {
      for (const a of game.deviceOptions) {
        for (const b of game.deviceOptions) {
          const branch = new Game(state);
          branch.elevator += dE;
          branch.map.get(a.id)!.floor = branch.elevator;
          if (a !== b) {
            branch.map.get(b.id)!.floor = branch.elevator;
          }
          const j = branch.refloor().toJSON();
          const k = JSON.stringify(j);
          if (seen.has(k)) {
            const s = seen.get(k) as number;
            if (s <= steps + 1) {
              // been here before for cheaper
              continue;
            }
          } else {
            seen.set(k, steps + 1);
            queue.push([j, steps + 1, branch.score]);
          }
        }
      }
    }
    queue.sort((a, b) => b[2] - a[2]);
  }
  return minSteps;
}
test(gameLoop(testState), 11);
console.log(gameLoop(inputState));

const inputState2: GameState = {
  e: 0,
  f: ["1G, 2G, 2M, 3G, 4G, 4M, 5G, 5M, 6G, 6M, 7G, 7M", "1M, 3M", "", ""],
};
console.log(gameLoop(inputState2));

// goal - get everything to the fourth floor
// elevator starts on the first floor and can carry at most two things
// if a microchip is on the same level as a generator without being protected by its own, dead

// for each move,
// what gets off the elevator (everything)
// what gets on the elevator (1-2 items)
// does the elevator go up or down
// is the game left in a valid state
// goal alg - what is the distance for each component to the goal
// then, what is the fewest steps

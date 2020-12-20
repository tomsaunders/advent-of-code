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
  constructor(state: GameState) {
    this.elevator = state.e;
    this.map = new Map<string, Device>();
    state.f.map((devices: string, i): Device[] =>
      devices
        .split(",")
        .filter((x) => !!x)
        .map((id) => Device.init(id.trim(), i, this))
    );
  }
  toJSON(): GameState {
    const f: Device[][] = [[], [], [], []];
    Array.from(this.map.values()).forEach((d) => {
      f[d.floor].push(d);
    });

    return {
      e: this.elevator,
      f: f.map((devices: Device[]): string =>
        devices
          .slice()
          .map((d) => d.id)
          .sort()
          .join(",")
      ),
    };
  }
  get valid(): boolean {
    const f: Device[][] = [[], [], [], []];
    Array.from(this.map.values()).forEach((d) => {
      f[d.floor].push(d);
    });
    return f.every((floor: Device[]) => {
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
      const floor0 = Array.from(this.map.values()).filter((d) => d.floor === 0)
        .length;
      const floor1 = Array.from(this.map.values()).filter((d) => d.floor === 1)
        .length;
      if (this.elevator === 1 && floor0 === 0) {
        // do nothing
      } else if (this.elevator === 2 && floor0 === 0 && floor1 === 0) {
        // do nothing
      } else {
        // at least one thing is below, so going down is required.
        options.push(-1);
      }
    }

    return options;
  }
  get deviceOptions(): Device[] {
    return Array.from(this.map.values()).filter(
      (d) => d.floor === this.elevator
    );
  }

  get win(): boolean {
    return (
      this.valid &&
      this.elevator === 3 &&
      Array.from(this.map.values()).every((d) => d.floor === 3)
    );
  }

  get state(): string {
    const pairs = (Array.from(this.map.values()).filter(
      (x) => x instanceof Chip
    ) as Chip[])
      .map((x) => x.state)
      .sort()
      .join("-");
    return `${this.elevator}e${pairs}`;
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
  public get state(): string {
    return `${this.floor}${this.gen.floor}`;
  }
}
class Gen extends Device {
  public get chip(): Gen {
    return this.game.map.get(this.code + "M") as Gen;
  }
}

const g = new Game(testState);

type Branch = [GameState, number];
function gameLoop(start: GameState) {
  const queue: Branch[] = [[start, 0]];
  const seen: Set<string> = new Set<string>();

  let minSteps = 999999;
  let x = 0;
  while (queue.length && x < 100000) {
    x++;
    const [state, steps] = queue.pop() as Branch;

    if (steps > minSteps) {
      // console.log("aborting for steps");
      continue;
    }

    const game = new Game(state);

    if (game.win) {
      minSteps = Math.min(steps, minSteps);
      continue;
    }

    if (!game.valid) {
      continue;
    }

    for (const dE of game.elevatorOptions) {
      for (const a of game.deviceOptions) {
        for (const b of game.deviceOptions) {
          const branch = new Game(state);
          branch.elevator += dE;
          branch.map.get(a.id)!.floor = branch.elevator;
          if (a !== b) {
            branch.map.get(b.id)!.floor = branch.elevator;
          }
          const j = branch.toJSON();
          const k = branch.state;
          if (!seen.has(k)) {
            seen.add(k);
            queue.push([j, steps + 1]);
          }
        }
      }
    }
    queue.sort((a, b) => b[1] - a[1]);
  }
  return minSteps;
}
test(gameLoop(testState), 11);
console.log("Part One", gameLoop(inputState));

const inputState2: GameState = {
  e: 0,
  f: ["1G, 2G, 2M, 3G, 4G, 4M, 5G, 5M, 6G, 6M, 7G, 7M", "1M, 3M", "", ""],
};
console.log("Part Two", gameLoop(inputState2));

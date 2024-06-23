#!/usr/bin/env ts-node
import * as fs from "fs";
/**
 * Advent of Code 2023 - Day 18
 *
 * Summary: lowest-cost path finding algorithm for a graph with unusual rules about possible moves
 * Escalation: trickier rules about possible moves
 * Naive: Large search space
 * Solution: a* algorithm, but calculate all possible moves from current space rather than just the first steps
 * in each direction
 *
 * Keywords: a*, path finding, grid
 */
import { Cell, Direction, Grid, PURP, RED, RESET, SPACE, YELLOW, arrSum } from "./util";
const input = fs.readFileSync("input17.txt", "utf8");
const test = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

type HV = "ew" | "ns";

interface PathStep {
  key: string;
  position: Cell;
  direction: HV;
  heatLoss: number;
  distToEnd: number;
}

function part1(input: string): number {
  return crucible(input, 1, 3);
}

function part2(input: string): number {
  return crucible(input, 4, 10);
}

function crucible(input: string, minimumStraightSteps: number, maxStraightSteps: number): number {
  const grid = Grid.fromLines(input);
  const start = grid.getCell(0, 0)!;
  const end = grid.getCell(grid.maxX, grid.maxY);
  grid.draw();

  const buildNextStep = (current?: PathStep, direction?: Direction): PathStep | undefined => {
    const next = current?.position.getDirection(direction!);
    if (!next) {
      return next;
    }

    const hv = direction === "e" || direction === "w" ? "ew" : "ns";
    return {
      position: next,
      direction: hv,
      heatLoss: current!.heatLoss + next.int,
      distToEnd: grid.maxX - next.x + grid.maxY - next.y,
      key: next.xy + ", " + hv,
    };
  };

  const openSet: PathStep[] = [
    {
      position: start,
      direction: "ew",
      heatLoss: 0,
      distToEnd: grid.maxX + grid.maxY,
      key: start.xy + ", ew",
    },
    {
      position: start,
      direction: "ns",
      heatLoss: 0,
      distToEnd: grid.maxX + grid.maxY,
      key: start.xy + ", ns",
    },
  ];

  const cameFrom: Record<string, string> = {};
  const reconstructPath = (currentKey: string): Cell[] => {
    const path: Cell[] = [];
    let key = currentKey;
    while (!key.startsWith("0, 0")) {
      const [x, y] = key.split(", ");
      const cell = grid.getCell(parseInt(x), parseInt(y))!;
      cell.visited = true;
      path.unshift(cell);
      key = cameFrom[key];
    }
    return path;
  };

  const cheapestPath: Record<string, number> = {};

  while (openSet.length) {
    const currentStep = openSet.pop() as PathStep;
    const { position, direction, heatLoss } = currentStep;

    if (position === end) {
      // reached the goal!
      reconstructPath(currentStep.key);

      grid.draw();
      return heatLoss;
    }
    let options: (PathStep | undefined)[] = [];
    let a: PathStep | undefined = currentStep;
    let b: PathStep | undefined = currentStep;
    let aDir: Direction = "e";
    let bDir: Direction = "w";
    if (direction === "ew") {
      aDir = "n";
      bDir = "s";
    }
    for (let i = 1; i <= maxStraightSteps; i++) {
      a = buildNextStep(a, aDir);
      b = buildNextStep(b, bDir);
      if (i >= minimumStraightSteps) {
        options.push(a, b);
      }
    }
    (options.filter((o) => !!o) as PathStep[]).forEach((nextStep) => {
      if (!cheapestPath[nextStep.key] || nextStep?.heatLoss < cheapestPath[nextStep.key]) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom[nextStep.key] = currentStep.key;
        cheapestPath[nextStep.key] = nextStep.heatLoss;
        openSet.push(nextStep);
      }
    });

    openSet.sort((a, b) => {
      return b.heatLoss + b.distToEnd - (a.heatLoss + a.distToEnd);
    });
  }

  return 99;
}

const t = part1(test);
if (t == 102) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 94) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

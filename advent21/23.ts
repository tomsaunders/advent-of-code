#!/usr/bin/env ts-node
import * as fs from "fs";
import { Grid, Cell, SPACE } from "./util";
const input = fs.readFileSync("input23.txt", "utf8");
const test = fs.readFileSync("test23.txt", "utf8");

type Amph = "A" | "B" | "C" | "D";
const hallY = 1;

class Room {
  public GOAL_Y1 = 2;
  public GOAL_Y2 = 3;

  constructor(public type: Amph, public x: number, public grid: Grid) {}

  public get goal1(): Cell {
    return this.grid.getCell(this.x, this.GOAL_Y1) as Cell;
  }

  public get goal2(): Cell {
    return this.grid.getCell(this.x, this.GOAL_Y2) as Cell;
  }

  public getNextGoal(): Cell | undefined {
    if (this.goal1.isSpace) {
      if (this.goal2.isSpace) {
        return this.goal2;
      } else if (this.goal2.type === this.type) {
        return this.goal1;
      }
    }
  }

  public get complete(): boolean {
    return this.goal1.type === this.type && this.goal2.type === this.type;
  }
}

function part1(input: string): number {
  const grid = Grid.fromLines(input);
  const roomA = new Room("A", 3, grid);
  const roomB = new Room("B", 5, grid);
  const roomC = new Room("C", 7, grid);
  const roomD = new Room("D", 9, grid);
  const rmMap = new Map<Amph, Room>();
  const rooms = [roomA, roomB, roomC, roomD];

  rooms.forEach((r) => rmMap.set(r.type, r));

  function getHallway(grid: Grid): Cell[] {
    return grid.cells.filter((c) => c.y === hallY && !c.isWall);
  }

  function getHallwayOptions(cell: Cell): [Cell, number][] {
    const options: [Cell, number][] = [];
    const grid = cell.grid;

    const outsideCell = grid.getCell(cell.x, hallY) as Cell;
    const goal1Cell = grid.getCell(cell.x, hallY + 1) as Cell;
    if (cell.y === 3 && !goal1Cell.isSpace) {
      return [];
    }
    if (!outsideCell.isSpace) {
      return [];
    }
    const movesToleave = cell.y - hallY;
    let left = outsideCell.west;
    while (left && left.isSpace) {
      if (![3, 5, 7, 9].includes(left.x)) {
        options.push([left, movesToleave + outsideCell.x - left.x]);
      }
      left = left.west;
    }
    let right = outsideCell.east;
    while (right && right.isSpace) {
      if (![3, 5, 7, 9].includes(right.x)) {
        options.push([right, movesToleave + right.x - outsideCell.x]);
      }
      right = right.east;
    }
    return options;
  }

  function getRoomDistance(cell: Cell): [number, Cell] {
    if (cell.y !== hallY) {
      return [0, cell]; // can only get to room from the hallway.
    }
    const grid = cell.grid;
    const room = rmMap.get(cell.type as Amph) as Room;
    const goal = room.getNextGoal();
    if (!goal) {
      return [0, cell];
    }
    let current = cell;
    if (cell.x < room.x) {
      for (let x = cell.x + 1; x <= room.x; x++) {
        current = grid.getCell(x, hallY) as Cell;
        if (!current.isSpace) {
          return [0, cell];
        }
      }
    } else {
      for (let x = cell.x - 1; x >= room.x; x--) {
        current = grid.getCell(x, hallY) as Cell;
        if (!current.isSpace) {
          return [0, cell];
        }
      }
    }

    return [Math.abs(cell.x - room.x) + Math.abs(goal.y - hallY), goal];
  }

  function isAmph(cell: Cell): boolean {
    return ["A", "B", "C", "D"].includes(cell.type);
  }

  function inWrongRoom(cell: Cell): boolean {
    if (cell.y > 1) {
      // in a room
      const goalX = 3 + (cell.type.charCodeAt(0) - 65) * 2;
      if (cell.x === goalX) {
        // in the correct column
        if (cell.y === 3) {
          // in the deepest goal
          return false;
        } else {
          // not deepest goal
          if (cell.south!.type === cell.type) {
            // the deepest goal is complete, it has the same type
            return false;
          }
        }
      }
    }
    return true;
  }

  function coeff(cell: Cell): number {
    return Math.pow(10, cell.type.charCodeAt(0) - 65); // 10^0 = 1 .. 10^3 = 1000
  }

  function hash(grid: Grid): string {
    return grid.cells
      .filter(isAmph)
      .map((c) => c.label)
      .sort()
      .join(";");
  }

  function minRemainingCost(grid: Grid): number {
    let minRemainingCost = 0;
    const hallAmphs = getHallway(grid).filter(isAmph);
    const roomAmphs = grid.cells.filter(isAmph).filter(inWrongRoom);
    hallAmphs.forEach((a) => {
      const goalX = 3 + (a.type.charCodeAt(0) - 65) * 2;
      const minSteps = Math.abs(a.x - goalX) + 1; // at least one step into room
      minRemainingCost += minSteps * coeff(a);
    });
    roomAmphs.forEach((a) => {
      const goalX = 3 + (a.type.charCodeAt(0) - 65) * 2;
      const minSteps = Math.abs(a.x - goalX) + a.y - hallY + 1; // step out of and at least one step into goal room
      minRemainingCost += minSteps * coeff(a);
    });
    return minRemainingCost;
  }

  let minScore = Infinity;
  const queue: [Grid, number, number][] = [[grid, 0, 0]];

  let seen = new Map<string, number>();
  function addQueue(g: Grid, score: number, heuristic: number): void {
    const h = hash(g);
    const o = seen.get(h);
    if (o && o < score) {
      // already been here for cheaper

      console.log(
        "...but already seen",
        h,
        "for a cost of",
        o,
        "which is less than",
        score
      );
      return;
    } else {
      if (score + minRemainingCost(g) > minScore) {
        console.log("aborting for min cost reason");
        return;
      }

      seen.set(h, score);
      queue.push([g, score, heuristic]);
    }
  }
  while (queue.length < 800) {
    const [stateGrid, score, heuristic] = queue.pop() as [Grid, number, number];
    if (score > minScore) {
      continue;
    }

    rooms.forEach((r) => (r.grid = stateGrid));
    if (rooms.every((r) => r.complete)) {
      minScore = Math.min(minScore, score);
      continue;
    }

    const o = seen.get(hash(stateGrid));
    if (o && o < score) {
      continue; // second hash abort
    }

    console.log(
      "\nLoading state with score",
      score,
      "heuristic",
      heuristic,
      "queue length",
      queue.length,
      "min score currently",
      minScore
    );

    if (score + minRemainingCost(stateGrid) > minScore) {
      console.log("aborting for min cost reason");
      continue;
    }

    // not done, continue.

    stateGrid.draw(0, false);

    let foundGoalMove = false;

    getHallway(stateGrid)
      .filter(isAmph)
      .forEach((hallAmph) => {
        const [d, goal] = getRoomDistance(hallAmph);
        if (d) {
          foundGoalMove = true;
          const newGrid = stateGrid.clone();
          newGrid.getCell(goal.x, goal.y)!.type = hallAmph.type;
          newGrid.getCell(hallAmph.x, hallAmph.y)!.type = SPACE;
          const newScore = score + d * coeff(hallAmph);
          console.log(
            hallAmph.label,
            "can reach goal at a cost of ",
            newScore - score
          );
          addQueue(newGrid, newScore, heuristic + 1);
        }
      });
    if (!foundGoalMove) {
      stateGrid.cells
        .filter(isAmph)
        .filter(inWrongRoom)
        .forEach((roomAmph) => {
          getHallwayOptions(roomAmph).forEach(([dest, d]) => {
            const newGrid = stateGrid.clone();
            newGrid.getCell(dest.x, dest.y)!.type = roomAmph.type;
            newGrid.getCell(roomAmph.x, roomAmph.y)!.type = SPACE;
            const newScore = score + d * coeff(roomAmph);
            console.log(
              roomAmph.label,
              "can reach hallway",
              dest.coord,
              "at a cost of ",
              newScore - score
            );
            addQueue(newGrid, newScore, heuristic);
          });
        });
    }
    queue.sort((a, b) => a[2] - b[2]);
  }

  return minScore;
}

const t1 = part1(test);
if (t1 === 12521) {
  console.log("Test completed");
  console.log("Part 1: ", part1(input));

  const t2 = part2(test);
  if (t2 === 2) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

function part2(input: string): number {
  const lines = input.split("\n");

  return 0;
}

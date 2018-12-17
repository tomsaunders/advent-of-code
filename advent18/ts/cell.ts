import { Grid } from "./grid";
import { Unit } from "./unit";

export class Cell {
  public static WALL = "#";
  public static OPEN = ".";

  public unit: Unit;

  public get isWall(): boolean {
    return this.icon === Cell.WALL;
  }

  public get neighbours(): Cell[] {
    const n = [];
    const offs: number[][] = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    for (const o of offs) {
      const [dy, dx] = o;
      const cell = this.grid.getCell(this.y + dy, this.x + dx);
      if (cell.isOpen) {
        n.push(cell);
      }
    }
    return n;
  }

  public get isOpen(): boolean {
    return this.icon === Cell.OPEN;
  }

  public constructor(public y: number, public x: number, public icon: string, public grid: Grid) {}

  public toString(): string {
    return `${this.x},${this.y}`;
  }

  public dist(y: number | Cell, x?: number): number {
    if (y instanceof Cell) {
      x = y.x;
      y = y.y;
    }
    return Math.abs(y - this.y) + Math.abs(x - this.x);
  }

  public placeUnit(unit: Unit): void {
    this.unit = unit;
    this.icon = unit.icon;
  }

  public leaveUnit(): void {
    this.unit = null;
    this.icon = Cell.OPEN;
  }

  public sort(other: Cell): number {
    if (this.y === other.y) {
      return other.x - this.x;
    } else {
      return other.y - this.y;
    }
  }
}

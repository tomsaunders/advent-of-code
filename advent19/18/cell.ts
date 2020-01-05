import { Grid } from "./grid";

const WALL: string = "#";
const SPACE: string = ".";
const ENTRANCE: string = "@";

const RED: string = "\x1b[31m";
const GREEN: string = "\x1b[32m";
export const YELLOW: string = "\x1b[33m";
const PURP: string = "\x1b[35m";
const WHITE: string = "\x1b[37m";
export const RESET: string = "\x1b[0m";

export class Cell {
  constructor(public grid: Grid, public x: number, public y: number, public z: number, public type: string) {
    this.knownDistances = new Map<Cell, number>();
  }

  public visited = false;
  public tentativeDist = 9999;
  public levelDist: number[] = [];
  public knownDistances: Map<Cell, number>;
  public isGate: boolean = false;
  public isKey: boolean = false;
  public unlockedBy: string = "";

  public north?: Cell;
  public south?: Cell;
  public east?: Cell;
  public west?: Cell;
  public neighbours: Cell[] = [];
  public init(): this {
    this.north = this.grid.getCell(this.x, this.y - 1, this.z);
    this.south = this.grid.getCell(this.x, this.y + 1, this.z);
    this.east = this.grid.getCell(this.x + 1, this.y, this.z);
    this.west = this.grid.getCell(this.x - 1, this.y, this.z);
    this.neighbours = [this.north, this.south, this.east, this.west].filter((c) => !!c && !c.isWall) as Cell[];
    this.knownDistances = new Map<Cell, number>();

    const charCode = this.type.charCodeAt(0);
    this.isGate = charCode >= 65 && charCode <= 90;
    this.isKey = charCode >= 97 && charCode <= 122;
    if (this.isGate) {
      this.unlockedBy = this.type.toLowerCase();
    }
    this.reset();
    return this;
  }

  public reset(): void {
    this.visited = false;
    this.tentativeDist = 9999;
  }

  public get coord(): string {
    return `${this.x}:${this.y}:${this.z}`;
  }

  public get label(): string {
    return `${this.type} @ ${this.coord}`;
  }

  public get kdInfo(): string {
    const kd = Array.from(this.knownDistances.entries())
      .map((v: [Cell, number]) => `${v[1]} to ${v[0].label}`)
      .join("\n\t");
    return `${this.label} knows distances = \n\t${kd}`;
  }

  public get unexplored(): Cell[] {
    return this.neighbours.filter((n) => !n.visited);
  }

  public getPathOptions(keyStr: string): [Cell, number][] {
    return Array.from(this.knownDistances.entries()).filter((v: [Cell, number]) => {
      if (!v[0].isGate) {
        return true;
      } else if (keyStr.includes(v[0].unlockedBy)) {
        return true;
      }
      return false;
    });
  }

  public get code(): string {
    if (this.isGate) {
      return `${PURP}${this.type}${RESET}`;
    }
    if (this.isKey) {
      return `${RED}${this.type}${RESET}`;
    }
    if (this.visited) {
      return " ";
    }
    if (this.isSpace) {
      return `${WHITE}${this.type}${RESET}`;
    }
    return this.type;
  }

  public get isWall(): boolean {
    return this.type === WALL;
  }

  public get isSpace(): boolean {
    return this.type === SPACE;
  }

  public get isEntrance(): boolean {
    return this.type === ENTRANCE;
  }

  public get isObject(): boolean {
    return !this.isWall && !this.isSpace;
  }

  public get isIntersection(): boolean {
    return this.neighbours.length > 2 && this.isSpace;
  }

  public clone(): Cell {
    return new Cell(this.grid, this.x, this.y, this.z, this.type);
  }
}

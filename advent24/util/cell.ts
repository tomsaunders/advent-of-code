import { Grid } from "./grid";
import { RED, RESET, WHITE, WALL, SPACE, GREEN, ON, OFF, Direction } from ".";

export type CellCreator = (grid: Grid, x: number, y: number, z: number, type: string) => Cell;

export class Cell {
  public reference?: string;
  constructor(public grid: Grid, public x: number, public y: number, public z: number, public type: string) {}

  public visited = false;
  public tentativeDist = 9999;
  public guessDist = 9999;
  public knownDistances: [Cell, number][] = [];
  public cost: number = 1;

  public north?: Cell;
  public south?: Cell;
  public east?: Cell;
  public west?: Cell;
  // NSEW which are open
  public openNeighbours: Cell[] = [];
  // NSEW array
  public directNeighbours: Cell[] = [];
  // diagonals
  public diagonalNeighbours: Cell[] = [];
  // NSEW + diagonals
  public allNeighbours: Cell[] = [];

  public init(doReset = true, createNeighbours = false): void {
    this.north = this.getNorth(createNeighbours);
    this.south = this.getSouth(createNeighbours);
    this.east = this.getEast(createNeighbours);
    this.west = this.getWest(createNeighbours);

    this.directNeighbours = [this.north, this.south, this.east, this.west].filter((c) => !!c) as Cell[];

    this.diagonalNeighbours = [
      this.getNorthWest(createNeighbours),
      this.getNorthEast(createNeighbours),
      this.getSouthWest(createNeighbours),
      this.getSouthEast(createNeighbours),
    ].filter((c) => !!c) as Cell[];

    this.openNeighbours = this.directNeighbours.filter((c) => c.isSpace);
    this.allNeighbours = this.diagonalNeighbours.concat(this.directNeighbours);

    this.knownDistances = [];
    if (doReset) {
      this.reset();
    }
  }

  public get hexNeighbours(): Cell[] {
    return [
      this.grid.getCell(this.x + 1, this.y - 1, this.z, true), //e
      this.grid.getCell(this.x - 1, this.y + 1, this.z, true), //w
      this.grid.getCell(this.x + 1, this.y, this.z - 1, true), //ne
      this.grid.getCell(this.x, this.y + 1, this.z - 1, true), //nw
      this.grid.getCell(this.x, this.y - 1, this.z + 1, true), //se
      this.grid.getCell(this.x - 1, this.y, this.z + 1, true), //sw
    ] as Cell[];
  }

  public getCubeNeighbours(createNeighbours = false): Cell[] {
    return [
      this.getNorth(createNeighbours),
      this.getSouth(createNeighbours),
      this.getEast(createNeighbours),
      this.getWest(createNeighbours),
      this.getUp(createNeighbours),
      this.getDown(createNeighbours),
    ].filter((c) => !!c) as Cell[];
  }

  public reset(): void {
    this.visited = false;
    this.tentativeDist = 9999;
  }

  public get coord(): string {
    return `${this.x}:${this.y}:${this.z}`;
  }

  public get xy(): string {
    return `${this.x}, ${this.y}`;
  }

  public get label(): string {
    return `${this.code} @ ${this.coord}`;
  }

  public toString(): string {
    return this.label;
  }

  public get kdInfo(): string {
    const kd = this.knownDistances.map((v: [Cell, number]) => `${v[1]} to ${v[0].coord}`).join("\n\t");
    return `${this.label} knows distances = \n\t${kd}`;
  }

  public get unexplored(): Cell[] {
    return this.openNeighbours.filter((n) => !n.visited);
  }

  public get code(): string {
    if (this.knownDistances.length) {
      return `${RED}X${RESET}`;
    }
    if (this.visited) {
      return `${GREEN}${this.type}${RESET}`;
    }
    if (this.isSpace) {
      return `${WHITE}${this.type}${RESET}`;
    }
    return this.type;
  }

  public get charCode(): number {
    return this.type.charCodeAt(0);
  }

  public get isWall(): boolean {
    return this.type === WALL;
  }

  public get isSpace(): boolean {
    return this.type === SPACE;
  }

  public get onBorder(): boolean {
    return this.x == this.grid.maxX || this.x == this.grid.minX || this.y == this.grid.minY || this.y == this.grid.maxY;
  }

  public get isOn(): boolean {
    return this.type === ON;
  }

  public get isOff(): boolean {
    return this.type === OFF;
  }

  public toggle(): this {
    this.type = this.type === ON ? OFF : ON;
    return this;
  }

  public get isIntersection(): boolean {
    return this.openNeighbours.length > 2 && this.isSpace;
  }

  public get int(): number {
    return parseInt(this.type, 10);
  }

  public clone(): Cell {
    return this.cloneToGrid(this.grid);
  }

  public cloneToGrid(grid: Grid): Cell {
    return new Cell(grid, this.x, this.y, this.z, this.type);
  }

  public getDirection(direction: Direction, createNeighbours = false): Cell | undefined {
    if (direction == "North" || direction === "n") {
      return this.grid.getCell(this.x, this.y - 1, this.z, createNeighbours);
    } else if (direction == "South" || direction === "s") {
      return this.grid.getCell(this.x, this.y + 1, this.z, createNeighbours);
    } else if (direction == "East" || direction === "e") {
      return this.grid.getCell(this.x + 1, this.y, this.z, createNeighbours);
    } else if (direction == "West" || direction === "w") {
      return this.grid.getCell(this.x - 1, this.y, this.z, createNeighbours);
    }
  }

  public getNorth(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x, this.y - 1, this.z, createNeighbours);
  }

  public getSouth(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x, this.y + 1, this.z, createNeighbours);
  }

  public getEast(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x + 1, this.y, this.z, createNeighbours);
  }

  public getWest(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x - 1, this.y, this.z, createNeighbours);
  }

  public getNorthWest(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x - 1, this.y - 1, this.z, createNeighbours);
  }

  public getNorthEast(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x + 1, this.y - 1, this.z, createNeighbours);
  }

  public getSouthWest(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x - 1, this.y + 1, this.z, createNeighbours);
  }

  public getSouthEast(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x + 1, this.y + 1, this.z, createNeighbours);
  }

  public getUp(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x, this.y, this.z + 1, createNeighbours);
  }

  public getDown(createNeighbours = false): Cell | undefined {
    return this.grid.getCell(this.x, this.y, this.z - 1, createNeighbours);
  }
}

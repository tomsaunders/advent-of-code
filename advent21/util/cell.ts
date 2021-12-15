import { Grid } from "./grid";
import { RED, RESET, WHITE, WALL, SPACE, GREEN, ON, OFF } from ".";

export class Cell {
  public next?: string;
  constructor(
    public grid: Grid,
    public x: number,
    public y: number,
    public z: number,
    public type: string
  ) {}

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

  public init(): void {
    this.north = this.grid.getCell(this.x, this.y - 1, this.z);
    this.south = this.grid.getCell(this.x, this.y + 1, this.z);
    this.east = this.grid.getCell(this.x + 1, this.y, this.z);
    this.west = this.grid.getCell(this.x - 1, this.y, this.z);

    this.directNeighbours = [
      this.north,
      this.south,
      this.east,
      this.west,
    ].filter((c) => !!c) as Cell[];

    this.diagonalNeighbours = [
      this.grid.getCell(this.x - 1, this.y - 1, this.z),
      this.grid.getCell(this.x + 1, this.y - 1, this.z),
      this.grid.getCell(this.x - 1, this.y + 1, this.z),
      this.grid.getCell(this.x + 1, this.y + 1, this.z),
    ].filter((c) => !!c) as Cell[];

    this.openNeighbours = this.directNeighbours.filter((c) => c.isSpace);
    this.allNeighbours = this.diagonalNeighbours.concat(this.directNeighbours);

    this.knownDistances = [];
    this.reset();
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

  public reset(): void {
    this.visited = false;
    this.tentativeDist = 9999;
  }

  public get coord(): string {
    return `${this.x}:${this.y}:${this.z}`;
  }

  public get label(): string {
    return `${this.code} @ ${this.coord}`;
  }

  public get kdInfo(): string {
    const kd = this.knownDistances
      .map((v: [Cell, number]) => `${v[1]} to ${v[0].coord}`)
      .join("\n\t");
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
}

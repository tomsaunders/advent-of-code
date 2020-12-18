import { Grid } from "./grid";
import { RED, RESET, WHITE, WALL, SPACE, GREEN } from ".";

export class Cell {
  constructor(
    public grid: Grid,
    public x: number,
    public y: number,
    public z: number,
    public type: string
  ) {}

  public visited = false;
  public tentativeDist = 9999;
  public knownDistances: [Cell, number][] = [];

  public north?: Cell;
  public south?: Cell;
  public east?: Cell;
  public west?: Cell;
  public neighbours: Cell[] = [];
  public init(): void {
    this.north = this.grid.getCell(this.x, this.y - 1, this.z);
    this.south = this.grid.getCell(this.x, this.y + 1, this.z);
    this.east = this.grid.getCell(this.x + 1, this.y, this.z);
    this.west = this.grid.getCell(this.x - 1, this.y, this.z);
    this.neighbours = [this.north, this.south, this.east, this.west].filter(
      (c) => !!c && !c.isWall
    ) as Cell[];
    this.knownDistances = [];
    this.reset();
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
    return this.neighbours.filter((n) => !n.visited);
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

  public get isIntersection(): boolean {
    return this.neighbours.length > 2 && this.isSpace;
  }

  public clone(): Cell {
    return new Cell(this.grid, this.x, this.y, this.z, this.type);
  }
}

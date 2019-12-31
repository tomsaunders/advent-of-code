import { Grid } from "./grid";

const WALL: string = "#";
const SPACE: string = ".";

const RED: string = "\x1b[31m";
const GREEN: string = "\x1b[32m";
const YELLOW: string = "\x1b[33m";
const PURP: string = "\x1b[35m";
const WHITE: string = "\x1b[37m";
const RESET: string = "\x1b[0m";

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
  public levelDist: number[] = [];
  public portalCode: string = "";
  public portal?: Cell | null = null;
  public knownDistances: [Cell, number][] = [];
  public portalLinks: [Cell, number][] = [];

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
    if (this.portalCode) {
      this.portal = this.grid.getPortal(this);
    }
    this.neighbours = [this.north, this.south, this.east, this.west].filter(
      c => !!c && c.isSpace
    ) as Cell[];
    this.knownDistances = [];
    this.portalLinks = [];
    this.reset();
  }

  public getPortalLinks(level: number): [Cell, number][] {
    return this.portalLinks.filter(pl => {
      if (level === 0) {
        if (["AA", "ZZ"].includes(pl[0].portalCode)) {
          return true;
        } else if (pl[0].isOuter) {
          return false;
        }
      } else {
        if (["AA", "ZZ"].includes(pl[0].portalCode)) {
          return false;
        }
      }
      return true;
    });
  }

  public reset(): void {
    this.visited = false;
    this.tentativeDist = 9999;
  }

  public get coord(): string {
    return `${this.x}:${this.y}:${this.z}`;
  }

  public get label(): string {
    return `${this.portalCode || this.type} @ ${this.coord}`;
  }

  public get kdInfo(): string {
    const kd = this.knownDistances
      .map((v: [Cell, number]) => `${v[1]} to ${v[0].coord}`)
      .join("\n\t");
    return `${this.label} knows distances = \n\t${kd}`;
  }

  public get plInfo(): string {
    const kd = this.portalLinks
      .map((v: [Cell, number]) => `${v[1]} to ${v[0].label}`)
      .join("\n\t");
    return `${this.label} has portal links = \n\t${kd}`;
  }

  public get unexplored(): Cell[] {
    return this.neighbours.filter(n => !n.visited);
  }

  public get code(): string {
    if (this.portalCode) {
      return `${PURP}@${RESET}`;
    }
    if (this.knownDistances.length) {
      return `${RED}X${RESET}`;
    }
    if (this.visited) {
      return " ";
    }
    if (this.isSpace) {
      return `${WHITE}${this.type}${RESET}`;
    }
    return this.type;
  }

  public get charCode(): number {
    return this.type.charCodeAt(0);
  }

  public get isOuter(): boolean {
    if (!this.portalCode) {
      return false;
    }
    return (
      this.y === 2 ||
      this.y === this.grid.maxY ||
      this.x === 2 ||
      this.x === this.grid.maxX
    );
  }

  public get isInner(): boolean {
    return !!this.portalCode && !this.isOuter;
  }

  public get isWall(): boolean {
    return this.type !== SPACE;
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

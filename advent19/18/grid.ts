import { Cell } from "./cell";

const WALL: string = "#";
const SPACE: string = ".";

export class Grid {
  public recursive = false;
  public lines: string[] = [];
  public lookup: Map<string, Cell>;
  public minY: number = 0;
  public minX: number = 0;
  public maxY: number = 0;
  public maxX: number = 0;
  public _cells: Cell[][] = [];
  constructor() {
    this.lookup = new Map<string, Cell>();
  }

  public get cells(): Cell[] {
    return Array.from(this.lookup.values());
  }

  public addCell(x: number, y: number, z: number, type: string): Cell | undefined {
    const c = new Cell(this, x, y, z, type);
    this.lookup.set(c.coord, c);
    this.minY = Math.min(this.minY, y);
    this.minX = Math.min(this.minX, x);
    this.maxY = Math.max(this.maxY, y);
    this.maxX = Math.max(this.maxX, x);
    return c;
  }

  public getCell(x: number, y: number, z: number) {
    return this.lookup.get(`${x}:${y}:${z}`);
  }

  public draw(): void {
    const YELLOW: string = "\x1b[33m";
    const RESET: string = "\x1b[0m";

    const z = 0;
    let xRow = `${YELLOW}   `;
    for (let x = this.minX; x <= this.maxX; x++) {
      xRow += x % 10 === 0 ? Math.round(x / 10) : " ";
    }
    xRow = `${xRow}${RESET}`;
    console.log(xRow);
    xRow = `${YELLOW}   `;
    for (let x = this.minX; x <= this.maxX; x++) {
      xRow += x % 10;
    }
    xRow = `${xRow}${RESET}`;
    console.log(xRow);

    for (let y = this.minY; y <= this.maxY; y++) {
      const yPos = y < 10 ? `0${y}` : `${y}`;
      let line = `${YELLOW}${yPos}${RESET} `;
      for (let x = this.minX; x <= this.maxX; x++) {
        const c = `${x}:${y}:${z}`;
        const cell = this.lookup.get(c);
        line += cell ? cell.code : " ";
      }
      console.log(line);
    }
  }
}

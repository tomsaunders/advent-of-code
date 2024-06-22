import { Cell, CellCreator } from "./cell";
import { WHITE } from ".";

export class Grid {
  public lines: string[] = [];
  public lookup: Map<string, Cell>;
  public minY: number = 0;
  public minX: number = 0;
  public maxY: number = 0;
  public maxX: number = 0;
  public minZ: number = 0;
  public maxZ: number = 0;
  public _cells: Cell[][] = [];
  constructor() {
    this.lookup = new Map<string, Cell>();
  }

  public get cells(): Cell[] {
    return Array.from(this.lookup.values());
  }

  public get hash(): string {
    return this.cells.map((c) => c.type).join("");
  }

  public reset(): void {
    this.cells.forEach((c) => c.reset());
  }

  public createCell(x: number, y: number, z: number, type: string, cellCreator?: CellCreator): Cell | undefined {
    const c = cellCreator ? cellCreator(this, x, y, z, type) : new Cell(this, x, y, z, type);

    return this.addCell(c);
  }

  public addCell(c: Cell): Cell | undefined {
    this.lookup.set(c.coord, c);
    this.minY = Math.min(this.minY, c.y);
    this.minX = Math.min(this.minX, c.x);
    this.maxY = Math.max(this.maxY, c.y);
    this.maxX = Math.max(this.maxX, c.x);
    this.minZ = Math.min(this.minZ, c.z);
    this.maxZ = Math.max(this.maxZ, c.z);

    return c;
  }

  public getCell(x: number, y: number, z: number = 0, createIfNot = false) {
    const c = this.getByCoord(`${x}:${y}:${z}`);
    if (!c && createIfNot) {
      return this.createCell(x, y, z, ".");
    }
    return c;
  }

  public getByCoord(coord: string) {
    return this.lookup.get(coord);
  }

  public init(): this {
    this.cells.forEach((c) => c.init());
    return this;
  }

  public draw(z: number = 0, drawCoords: boolean = true): void {
    const YELLOW: string = "\x1b[33m";
    const RESET: string = "\x1b[0m";

    if (drawCoords) {
      let xRow = `${YELLOW}   `;
      for (let x = this.minX; x <= this.maxX; x++) {
        xRow += x % 10 === 0 ? Math.round(Math.abs(x) / 10) : " ";
      }
      xRow = `${xRow}${RESET}`;
      console.log(xRow);
      xRow = `${YELLOW}   `;
      for (let x = this.minX; x <= this.maxX; x++) {
        xRow += Math.abs(x) % 10;
      }
      xRow = `${xRow}${RESET}`;
      console.log(xRow);
    }

    for (let y = this.minY; y <= this.maxY; y++) {
      const yPos = y < 10 ? `0${Math.abs(y)}` : `${Math.abs(y)}`;
      let line = drawCoords ? `${YELLOW}${yPos}${RESET} ` : "";
      for (let x = this.minX; x <= this.maxX; x++) {
        const c = `${x}:${y}:${z}`;
        const cell = this.lookup.get(c);
        line += cell ? cell.code : " ";
      }
      console.log(line);
    }
  }

  public drawAll(drawCoords: boolean = true): void {
    for (let i = this.minZ; i <= this.maxZ; i++) {
      console.log("z=", i);
      this.draw(i, drawCoords);
    }
  }

  public breadthFirst(from: Cell, getOpenNeighbours?: (c: Cell) => Cell[]): void {
    if (!getOpenNeighbours) {
      getOpenNeighbours = (c: Cell) => c.openNeighbours;
    }
    let unvisitedSet: Cell[] = [from];
    from.tentativeDist = 0;
    while (unvisitedSet.length) {
      unvisitedSet.sort((a, b) => b.tentativeDist - a.tentativeDist);
      let c = unvisitedSet.pop() as Cell;
      c.visited = true;
      for (const n of getOpenNeighbours(c)) {
        const d = c.tentativeDist + n.cost;
        if (d < n.tentativeDist) {
          n.tentativeDist = d;
          unvisitedSet.push(n);
        }
      }
    }
  }

  public shortestPath(from: Cell, to: Cell, getOpenNeighbours?: (c: Cell) => Cell[]): number {
    if (!getOpenNeighbours) {
      getOpenNeighbours = (c: Cell) => c.openNeighbours;
    }

    let unvisitedSet: Cell[] = this.cells.slice(0);
    from.tentativeDist = 0;
    let c: Cell = from;

    while (!to.visited && unvisitedSet.length) {
      for (const n of getOpenNeighbours(c)) {
        const d = c.tentativeDist + n.cost;
        n.tentativeDist = Math.min(d, n.tentativeDist);
      }
      c.visited = true;
      unvisitedSet.sort((a, b) => b.tentativeDist - a.tentativeDist);
      c = unvisitedSet.pop() as Cell;
    }
    return to.tentativeDist;
  }

  public aStar(from: Cell, to: Cell): Cell[] {
    let openSet: Cell[] = [from];
    // tentative dist is the shortest known distance from 'from' to a cell. 0 at start.
    from.tentativeDist = 0;

    // use manhattan distance as heuristic
    const h = (c: Cell) => Math.abs(to.x - c.x) + Math.abs(to.y - c.y) + c.cost;
    // guess dist is the estimated cost of going start to end via this. The more accurate the estimate, the faster the path will be found
    from.guessDist = h(from);

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    const cameFrom: Map<Cell, Cell> = new Map<Cell, Cell>();

    const reconstructPath = (start: Cell): Cell[] => {
      const path = [start];
      let c = start;
      while (c !== from) {
        c = cameFrom.get(c) as Cell;
        path.unshift(c);
      }
      return path;
    };

    while (openSet.length) {
      const current = openSet.pop() as Cell;
      if (current === to) {
        return reconstructPath(current);
      }

      for (const n of current.directNeighbours) {
        const tentativeGScore = current.tentativeDist + n.int;
        const gScore = n.tentativeDist || 9999;
        if (tentativeGScore < gScore) {
          cameFrom.set(n, current);
          n.tentativeDist = tentativeGScore;
          n.guessDist = tentativeGScore + h(n);
          if (!openSet.includes(n)) {
            openSet.push(n);
          }
        }
      }
      openSet.sort((a, b) => b.guessDist - a.guessDist);
    }

    // Open set is empty but goal was never reached
    return [];
  }

  public static fromLines(input: string | string[], cellCreator?: CellCreator): Grid {
    const lines = Array.isArray(input) ? input : input.split("\n");

    const g = new Grid();
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        g.createCell(x, y, 0, lines[y][x], cellCreator);
      }
    }
    return g.init();
  }

  public clone(): Grid {
    const g = new Grid();
    Array.from(this.lookup.values()).forEach((c) => {
      g.addCell(c.cloneToGrid(g));
    });
    return g.init();
  }
}

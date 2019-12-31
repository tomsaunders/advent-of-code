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

  public addCell(
    x: number,
    y: number,
    z: number,
    type: string
  ): Cell | undefined {
    const isPortalCode = (x: number, y: number): boolean => {
      const code = this.lines[y].charCodeAt(x);
      return code >= 65 && code <= 90;
    };

    if (type === WALL || type === SPACE) {
      const c = new Cell(this, x, y, z, type);
      this.lookup.set(c.coord, c);
      this.minY = Math.min(this.minY, y);
      this.minX = Math.min(this.minX, x);
      this.maxY = Math.max(this.maxY, y);
      this.maxX = Math.max(this.maxX, x);

      let portal: string = "";
      if (isPortalCode(x, y - 1)) {
        portal = `${this.lines[y - 2][x]}${this.lines[y - 1][x]}`;
      } else if (isPortalCode(x, y + 1)) {
        portal = `${this.lines[y + 1][x]}${this.lines[y + 2][x]}`;
      } else if (isPortalCode(x - 1, y)) {
        portal = `${this.lines[y][x - 2]}${this.lines[y][x - 1]}`;
      } else if (isPortalCode(x + 1, y)) {
        portal = `${this.lines[y][x + 1]}${this.lines[y][x + 2]}`;
      }
      if (portal) {
        c.portalCode = portal;
      }
      return c;
    }
  }

  public getCell(x: number, y: number, z: number) {
    return this.lookup.get(`${x}:${y}:${z}`);
  }

  public draw(): void {
    for (let z = 0; z < 3; z++) {
      this.drawLevel(z);
    }
  }

  public drawLevel(z: number): void {
    console.log("Level", z);
    let xRow = "   ";
    for (let x = this.minX; x <= this.maxX; x++) {
      xRow += x % 10 === 0 ? Math.round(x / 10) : " ";
    }
    console.log(xRow);
    xRow = "   ";
    for (let x = this.minX; x <= this.maxX; x++) {
      xRow += x % 10;
    }
    console.log(xRow);

    for (let y = this.minY; y <= this.maxY; y++) {
      const yPos = y < 10 ? `0${y}` : `${y}`;
      let line = `${yPos} `;
      for (let x = this.minX; x <= this.maxX; x++) {
        const c = `${x}:${y}:${z}`;
        const cell = this.lookup.get(c);
        line += cell ? cell.code : " ";
      }
      console.log(line);
    }
    console.log("drawn from ", this.minX, this.minY, this.maxX, this.maxY);
  }

  public shortestPath(from: Cell, to: Cell): number {
    let unvisitedSet: Cell[] = Array.from(this.lookup.values()).map(c => {
      c.init();
      return c;
    });
    from.tentativeDist = 0;
    let c: Cell = from;

    while (!to.visited && unvisitedSet.length) {
      const d = c.tentativeDist + 1;
      if (c.portal) {
        c.portal.tentativeDist = Math.min(d, c.portal.tentativeDist);
      }
      for (const n of c.neighbours) {
        n.tentativeDist = Math.min(d, n.tentativeDist);
      }
      c.visited = true;
      unvisitedSet.sort((a, b) => b.tentativeDist - a.tentativeDist);
      c = unvisitedSet.pop() as Cell;
    }
    return to.tentativeDist;
  }

  public shortestPortalPath(from: Cell, to: Cell): number {
    this.cells.forEach(c => c.reset());
    from.tentativeDist = 0;
    to.tentativeDist++;
    type Path = [Cell, number, number];
    const queue: Path[] = [[from, 0, 0]];

    const visited = new Set<string>();
    while (queue.length) {
      let [c, dist, level] = queue.pop() as Path;
      const k = `${c.coord}@${level}`;
      if (c === to) {
        to.tentativeDist = Math.min(to.tentativeDist, dist);
        continue;
      } else if (dist > to.tentativeDist) {
        continue;
      }

      // console.log(`${c.tentativeDist} path - `, c.plInfo);
      let p = c.portal;
      if (p) {
        let l = level;
        if (p.isOuter) {
          l++;
        } else {
          l--;
        }
        if (!visited.has(`${p.coord}@${l}`)) {
          // console.log("queuing portal", p.label, "at level", l);
          queue.push([p, dist + 1, l]);
        }
      }
      for (const [n, d] of c.getPortalLinks(level)) {
        if (!visited.has(`${n.coord}@${level}`)) {
          queue.push([n, dist + d, level]);
        }
      }
      visited.add(k);
      queue.sort((a, b) => b[1] - a[1]);
    }
    return to.tentativeDist;
  }

  public getPortal(from: Cell): Cell | undefined {
    // if (this.recursive) return undefined;
    if (from.portalCode === "AA" || from.portalCode === "ZZ") {
      return undefined;
    }
    // console.log("getting portal from", from.label);
    if (this.recursive) {
      if (from.isInner) {
        // going to the next level
        // console.log("going down from", from.label);
        const p = this.cells.find(
          c => c.portalCode === from.portalCode && c.isOuter
        ) as Cell;
        // console.log("found p", p ? p.label : "NOT FOUND Y NOT");
        return p;
      } else {
        // previous level
        // console.log("going up from", from.label);
        const p = this.cells.find(
          c => c.portalCode === from.portalCode && c.isInner
        ) as Cell;
        // console.log("found p", p ? p.label : "NOT FOUND Y NOT");
        return p;
      }
    } else {
      return this.cells.find(
        c => c.portalCode === from.portalCode && c !== from
      );
    }
  }

  public makeRecursive() {
    this.recursive = true;
    const cells = this.cells;
    cells.forEach(c => c.init());
    const portals = cells.filter(c => !!c.portalCode);

    function explore(from: Cell): void {
      let current = from;
      let d = 0;
      while ((!current.isIntersection || d === 0) && !current.visited) {
        current.visited = true;
        for (const n of current.neighbours) {
          if (!n.visited) {
            current = n;
            d++;
          }
        }
      }
      if (d && from !== current) {
        from.knownDistances.push([current, d]);
        current.knownDistances.push([from, d]);
      }
    }
    function explore2(from: Cell): void {
      const queue: [number, Cell][] = [[0, from]];
      while (queue.length) {
        const [d, current] = queue.pop() as [number, Cell];
        if (current.isIntersection && current !== from) {
          from.knownDistances.push([current, d]);
          current.knownDistances.push([from, d]);
          continue;
        }
        current.visited = true;
        for (const n of current.unexplored) {
          queue.push([d + 1, n]);
        }
      }
    }
    function explore3(from: Cell): void {
      cells.forEach(c => c.reset());
      const queue: [number, Cell][] = [[0, from]];
      while (queue.length) {
        const [d, c] = queue.pop() as [number, Cell];
        // console.log("pathfinding from ");
        if (c.portalCode && c !== from) {
          // console.log(`Got path ${d} : ${from.portalCode} to ${c.portalCode}`);
          const existing = from.portalLinks.find(v => v[0] === c);
          if (existing) {
            existing[1] = Math.min(d, existing[1]);
          } else {
            from.portalLinks.push([c, d]);
          }
          continue;
        }
        c.visited = true;
        for (const [n, nd] of c.knownDistances) {
          if (!n.visited) {
            queue.push([d + nd, n]);
          }
        }
      }
    }

    for (const a of portals) {
      explore(a);
    }

    const intersections = cells.filter(c => c.isIntersection);
    while (intersections.length) {
      const current = intersections.pop() as Cell;
      explore2(current);
    }

    // this.drawLevel(0);
    for (const a of portals) {
      explore3(a);
      // console.log(a.plInfo);
    }

    const start = portals.find(c => c.portalCode === "AA");

    // TODO
    // level 0 - AA and ZZ are active. All other outer portals are walls
    // level 1 - AA and ZZ are walls.
    // throw new Error("made recursive temp halt");
  }
}

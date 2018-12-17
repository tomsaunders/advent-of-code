import { Goblin, Unit, Elf } from "./unit";
import { Cell } from "./cell";

export class Grid {
  public goblins: Goblin[] = [];
  public elves: Elf[] = [];
  public cells: Cell[] = [];
  public completedTurns = 0;
  public grid: Cell[][];

  public get isGameOver(): boolean {
    return this.getHP(this.goblins) == 0 || this.getHP(this.elves) == 0;
  }

  public get outcome(): number {
    const hp = this.getHP(this.goblins) + this.getHP(this.elves);
    return this.completedTurns * hp;
  }
  public get units(): Unit[] {
    return this.goblins
      .concat(this.elves)
      .filter(unit => unit.isAlive)
      .sort((a: Unit, b: Unit) => a.sort(b));
  }

  public get p(): string {
    return "";
  }

  public constructor() {}

  public getCell(y: number, x: number): Cell {
    if (this.grid[y] && this.grid[y][x]) {
      return this.grid[y][x];
    } else {
      return new Cell(y, x, Cell.WALL, this);
    }
  }

  public getHP(units: Unit[]): number {
    let hp = 0;
    for (const unit of units) {
      hp += Math.max(0, unit.hp);
    }
    return hp;
  }
}

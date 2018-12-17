import { Cell } from "./cell";

export class Unit {
  public hp: number;
  public att: number;
  public icon: string;

  public get isAlive(): boolean {
    return this.hp > 0;
  }

  public constructor(public cell: Cell) {
    cell.placeUnit(this);
  }

  public toString(): string {
    return ` ${this.icon}(${this.hp})`;
  }

  public canAttack(target: Unit): boolean {
    return this.isAlive && target.isAlive && this.dist(target) === 1;
  }

  public attack(target: Unit): void {
    target.beAttacked(this.att);
  }

  public beAttacked(damage: number): void {
    this.hp -= damage;
    if (!this.isAlive) {
      this.cell.leaveUnit();
      this.cell = null;
    }
  }

  public dist(target: Unit): number {
    return this.cell.dist(target.cell);
  }

  public sort(other: Unit): number {
    return this.cell.sort(other.cell);
  }
}

export class Goblin extends Unit {
  public static GOBLIN = "G";
  public icon = Goblin.GOBLIN;
}

export class Elf extends Unit {
  public static ELF = "E";
  public icon = Elf.ELF;
}

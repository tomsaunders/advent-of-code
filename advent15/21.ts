#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";

const input = `Hit Points: 104
Damage: 8
Armor: 1`;

class Item {
  constructor(
    public name: string,
    public cost: number,
    public damage: number,
    public armor: number = 0
  ) {}
}

class Character {
  public items: Item[] = [];
  public cost: number = 0;

  constructor(
    public name: string,
    public hp: number,
    items: Item[] = [],
    public damage: number = 0,
    public armor: number = 0
  ) {
    items.forEach((i) => this.addItem(i));
  }

  public addItem(i: Item): void {
    this.items.push(i);
    this.damage += i.damage;
    this.armor += i.armor;
    this.cost += i.cost;
  }

  public clone(): Character {
    return new Character(this.name, this.hp, [], this.damage, this.armor);
  }

  public print(): string {
    const i = this.items.map((i) => i.name).join(", ");
    return `Final HP ${this.hp} Damage ${this.damage} Armor ${this.armor} Cost ${this.cost} Items ${i}`;
  }
}

const weapons = [
  new Item("Dagger", 8, 4),
  new Item("Shortsword", 10, 5),
  new Item("Warhammer", 25, 6),
  new Item("Longsword", 40, 7),
  new Item("Greataxe", 74, 8),
];

const armors = [
  new Item("None", 0, 0, 0),
  new Item("Leather", 13, 0, 1),
  new Item("Chainmail", 31, 0, 2),
  new Item("Splintmail", 53, 0, 3),
  new Item("Bandedmail", 75, 0, 4),
  new Item("Platemail", 102, 0, 5),
];

const rings = [
  new Item("NoneL", 0, 0, 0),
  new Item("NoneR", 0, 0, 0),
  new Item("Damage +1", 25, 1, 0),
  new Item("Damage +2", 50, 2, 0),
  new Item("Damage +3", 100, 3, 0),
  new Item("Defense +1", 20, 0, 1),
  new Item("Defense +2", 40, 0, 2),
  new Item("Defense +3", 80, 0, 3),
];

function battle(a: Character, b: Character, log: boolean = false): Character {
  while (a.hp > 0 && b.hp > 0) {
    const attackA = Math.max(1, a.damage - b.armor);
    b.hp -= attackA;
    if (log) console.log(`Player does ${attackA} boss is ${b.hp}`);
    if (b.hp <= 0) return a;

    const attackB = Math.max(1, b.damage - a.armor);
    a.hp -= attackB;
    if (log) console.log(`Boss does ${attackB} player is ${a.hp}`);
    if (a.hp <= 0) return b;
  }
  return a;
}

function buildQueue(): Character[] {
  const queue: Character[] = [];
  for (const w of weapons) {
    for (const a of armors) {
      for (const r of rings) {
        for (const x of rings) {
          if (x === r) continue;
          queue.push(new Character("C", 100, [w, a, r, x]));
        }
      }
    }
  }
  return queue;
}

function minWin(boss: Character): number {
  const queue: Character[] = buildQueue();

  const winners = queue.filter((p) => p === battle(p, boss.clone()));
  const costs = winners.map((w) => w.cost);
  const min = Math.min(...costs);
  const cheap = winners.find((w) => w.cost === min) as Character;
  return min;
}

function maxLose(boss: Character): number {
  const queue: Character[] = buildQueue();

  const losers = queue.filter((p) => p !== battle(p, boss.clone()));
  const costs = losers.map((w) => w.cost);
  const max = Math.max(...costs);
  return max;
}

const testP = new Character("Test player", 8, [], 5, 5);
const testB = new Character("Test boss", 12, [], 7, 2);
test(testP, battle(testP, testB));

console.log("Part 1", minWin(new Character("Boss", 104, [], 8, 1)));
console.log("Part 2", maxLose(new Character("Boss", 104, [], 8, 1)));

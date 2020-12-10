#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";

const input = `Hit Points: 55
Damage: 8`;

const bossHP = 55;
const bossDam = 8;

type Turn = (player: Character, boss: Character) => void;
type Spell = [string, number, number, Turn]; // name, cost, duration, function
const spells: Spell[] = [
  [
    "MagicMissile",
    53,
    0,
    (player: Character, boss: Character) => {
      boss.hp -= 4;
    },
  ],
  [
    "Drain",
    73,
    0,
    (player: Character, boss: Character) => {
      boss.hp -= 2;
      player.hp += 2;
    },
  ],
  [
    "Shield",
    113,
    6,
    (player: Character, boss: Character) => {
      player.armor += 7;
    },
  ],
  [
    "Poison",
    173,
    6,
    (player: Character, boss: Character) => {
      boss.hp -= 3;
    },
  ],
  [
    "Recharge",
    229,
    5,
    (player: Character, boss: Character) => {
      player.mana += 101;
    },
  ],
];
const [magicMissile, drain, shield, poison, recharge] = spells;

class Character {
  public opponent!: Character;
  public history: string[] = [];
  public shistory: string[] = [];

  constructor(
    public name: string,
    public hp: number,
    public mana: number,
    public spent: number = 0,
    public armor: number = 0,
    public spells: Spell[] = []
  ) {}

  public fight(o: Character): this {
    this.opponent = o;
    this.opponent.opponent = this;
    return this;
  }

  public clone(): Character {
    const c = new Character(
      this.name,
      this.hp,
      this.mana,
      this.spent,
      this.armor,
      this.spells.slice()
    );
    c.history = this.history.slice();
    c.shistory = this.shistory.slice();
    return c;
  }

  public print(): string {
    const i = this.spells.map((s) => s[0]).join(", ");
    const h = this.shistory.join(", ");
    return `Player has HP ${this.hp} - Mana Rem ${this.mana} - Mana used ${this.spent} - Spells ${i}\n${h}`;
  }

  public key(): string {
    const i = this.spells
      .map((s) => `${s[0]}-${s[2]}`)
      .sort()
      .join(",");
    return `HP: ${this.hp} - Mana Rem: ${this.mana} - Mana used: ${this.spent} - Active Spells: ${i}`;
  }

  public active(spell: Spell): boolean {
    return !!this.spells.find((s) => s[0] === spell[0]);
  }

  public run(): void {
    this.armor = 0;
    this.spells.forEach((s) => {
      s[3](this, this.opponent); // run
      s[2]--; // decrement
      this.history.push(`Effect ${s[0]} turns remaining ${s[2]}`);
    });
    this.spells = this.spells.filter((s) => s[2] > 0);
  }

  public cast(spell: Spell): void {
    this.shistory.push(spell[0]);
    this.mana -= spell[1];
    this.spent += spell[1];
    if (spell[2]) {
      this.history.push(`Start effect ${spell[0]}`);
      this.spells.push(spell.slice() as Spell);
    } else {
      this.history.push(`Cast spell ${spell[0]}`);
      spell[3](this, this.opponent);
    }
  }

  public get winner(): boolean {
    return this.hp > 0 && this.opponent.hp <= 0;
  }
}

class Boss extends Character {
  constructor(hp: number, public attack: number) {
    super("Boss", hp, 0);
  }

  public print(): string {
    return this.hp > 0 ? `Boss has ${this.hp} HP` : "Boss is dead";
  }

  public turn() {
    const d = Math.max(1, this.attack - this.opponent.armor);
    this.opponent.hp -= d;
    this.opponent.history.push(
      `Boss does ${d} damage and is at ${this.hp} HP\n`
    );
  }

  public clone(): Boss {
    return new Boss(this.hp, this.attack);
  }
}

const boss = new Boss(bossHP, bossDam);
const play = new Character("Part One", 50, 500);

function minMana(): number {
  const queue: Character[] = [play.clone().fight(boss.clone())];
  let min = 999999;
  let minP: Character;
  let n = 0;

  const seen = new Set<string>();
  while (queue.length) {
    const player = queue.pop() as Character;
    const boss = player.opponent as Boss;
    n++;

    if (player.spent > min) {
      continue;
    }

    if (n % 1000 === 0)
      console.log(
        n,
        queue.length,
        player.spent,
        min,
        player.print(),
        "\n",
        player.key()
      );

    const availSpells = spells
      .slice()
      .filter((s) => s[1] < player.mana && !player.active(s));
    for (const spell of availSpells) {
      // console.log("\n\nTrying spell", spell[0], player.print(), boss.print());
      const branchBoss = boss.clone();
      const branch = player.clone().fight(branchBoss);
      branch.run();
      if (branch.winner && branch.spent < min) {
        min = branch.spent;
        minP = branch;
        continue;
      }
      branch.cast(spell);
      if (branch.winner && branch.spent < min) {
        min = branch.spent;
        minP = branch;
        continue;
      }
      branch.run();
      if (branch.winner && branch.spent < min) {
        min = branch.spent;
        minP = branch;
        continue;
      }
      branchBoss.turn();
      if (branchBoss.winner) {
        continue; // abandon
      }
      const k = branch.key();
      if (!seen.has(k)) {
        seen.add(k);
        queue.push(branch);
      }
      // console.log(branch.history.join("\n"));
    }
    // return 0;
    queue.sort((a, b) => b.spent - a.spent);
  }
  if (!!minP!) {
    console.log(minP!.print());
  }
  console.log(seen.size);
  return min;
}

console.log("Part 1", minMana());

// test 1
// const test1P = new Character("Test 1 player", 10, 250);
// const test1B = new Boss(13, 8);

// console.log("\nPlayer Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1P.cast(poison);
// console.log("Boss Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1B.turn();

// console.log("\nPlayer Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1P.cast(magicMissile);
// console.log("Boss Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1B.turn();
// console.log(test1B.print());

// test 2
// const test1P = new Character("Test 2 player", 10, 250);
// const test1B = new Boss(14, 8).fight(test1P);

// console.log("\nPlayer Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1P.cast(recharge);
// console.log("Boss Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1B.turn();

// console.log("\nPlayer Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1P.cast(shield);
// console.log("Boss Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1B.turn();

// console.log("\nPlayer Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1P.cast(drain);
// console.log("Boss Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1B.turn();

// console.log("\nPlayer Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1P.cast(poison);
// console.log("Boss Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1B.turn();

// console.log("\nPlayer Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1P.cast(magicMissile);
// console.log("Boss Turn", test1P.print(), "\n", test1B.print());
// test1P.run();
// test1B.turn();

// console.log(test1B.print());

#!/usr/bin/env ts-node
import * as fs from "fs";
const inputImmune = `2785 units each with 4474 hit points (weak to cold) with an attack that does 14 fire damage at initiative 20
4674 units each with 7617 hit points (immune to slashing, bludgeoning; weak to fire) with an attack that does 15 slashing damage at initiative 15
1242 units each with 1934 hit points (weak to fire) with an attack that does 15 bludgeoning damage at initiative 6
1851 units each with 9504 hit points (weak to bludgeoning) with an attack that does 47 slashing damage at initiative 2
846 units each with 9124 hit points (weak to bludgeoning; immune to radiation) with an attack that does 99 bludgeoning damage at initiative 4
338 units each with 1378 hit points (immune to radiation) with an attack that does 39 cold damage at initiative 10
3308 units each with 5087 hit points (weak to radiation) with an attack that does 12 fire damage at initiative 3
2668 units each with 8316 hit points (weak to bludgeoning, radiation) with an attack that does 28 slashing damage at initiative 9
809 units each with 1756 hit points (immune to bludgeoning) with an attack that does 21 cold damage at initiative 1
4190 units each with 8086 hit points (immune to cold) with an attack that does 18 cold damage at initiative 5`;

const inputInfection = `2702 units each with 10159 hit points with an attack that does 7 fire damage at initiative 7
73 units each with 14036 hit points (weak to fire) with an attack that does 384 radiation damage at initiative 18
4353 units each with 35187 hit points with an attack that does 15 slashing damage at initiative 14
370 units each with 9506 hit points (weak to bludgeoning, radiation) with an attack that does 46 slashing damage at initiative 12
4002 units each with 22582 hit points (weak to radiation, cold) with an attack that does 11 fire damage at initiative 8
1986 units each with 24120 hit points (immune to fire) with an attack that does 22 radiation damage at initiative 11
1054 units each with 17806 hit points with an attack that does 25 cold damage at initiative 16
124 units each with 37637 hit points with an attack that does 589 cold damage at initiative 19
869 units each with 11019 hit points (weak to fire) with an attack that does 24 cold damage at initiative 17
3840 units each with 38666 hit points (immune to slashing, fire, bludgeoning) with an attack that does 19 bludgeoning damage at initiative 13`;

const testImmune = `17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3`;

const testInfection = `801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4`;

enum AttackType {
  radiation = "radiation",
  slashing = "slashing",
  fire = "fire",
  default = "default",
  cold = "cold",
  bludgeoning = "bludgeoning",
}

class Group {
  public unitCount: number = 0;
  public hp: number = 0;
  public immunities: AttackType[] = [];
  public weaknesses: AttackType[] = [];
  public attackPower: number = 0;
  public attackType: AttackType = AttackType.default;
  public initiative: number = 0;
  public selected = false;
  public target: Group | undefined;
  public name: string;

  public get effectivePower(): number {
    return this.unitCount * this.attackPower;
  }

  public get totalHP(): number {
    return this.unitCount * this.hp;
  }

  public constructor(
    line: string,
    public army: Army,
    public opposition: Army,
    public num: number,
    public boost: number = 0
  ) {
    this.name = army.name + " group " + num;
    let m: RegExpExecArray | null;
    const regex = /(\d*) units each with (\d*) hit points (\((.*)\)?\s)?with an attack that does (\d*) (\S*) damage at initiative (\d*)/gm;
    if ((m = regex.exec(line)) !== null) {
      const [all, count, hp, groupWeak, weak, aPower, aType, init] = m;
      this.unitCount = parseInt(count, 10);
      this.hp = parseInt(hp, 10);
      this.attackPower = parseInt(aPower, 10) + boost;
      this.attackType = aType as AttackType;
      this.initiative = parseInt(init, 10);

      if (weak) {
        const bits = weak.includes("; ") ? weak.split("; ") : [weak];
        for (const b of bits) {
          const parts = b.replace(/,/g, "").replace(")", "").split(" ");
          if (parts[0] === "immune") {
            this.immunities = parts.slice(2) as AttackType[];
          } else if (parts[0] === "weak") {
            this.weaknesses = parts.slice(2) as AttackType[];
          }
        }
      }
    }
  }

  public calcDamage(attackPower: number, attackType: AttackType): number {
    if (this.immunities.includes(attackType)) {
      attackPower = 0;
    } else if (this.weaknesses.includes(attackType)) {
      attackPower *= 2;
    }
    return attackPower;
  }

  public takeDamage(damage: number): number {
    const remHp = Math.max(0, this.totalHP - damage);
    const oc = this.unitCount;
    this.unitCount = Math.ceil(remHp / this.hp);
    return oc - this.unitCount;
  }

  public attack(): number {
    if (!this.target || !this.target.unitCount) {
      return 0;
    }
    return this.target.takeDamage(
      this.target.calcDamage(this.effectivePower, this.attackType)
    );
  }
}

class Army {
  public groups: Group[] = [];
  public enemy: Army | undefined;

  public get score(): number {
    return this.groups.reduce(
      (value: number, group: Group) => (value += group.unitCount),
      0
    );
  }

  public get health(): number {
    return this.groups.reduce(
      (value: number, group: Group) => (value += group.totalHP),
      0
    );
  }

  public get availableTargets(): Group[] {
    return this.groups.filter((group) => !group.selected && group.unitCount);
  }

  public constructor(public name: string) {}

  public add(group: Group) {
    this.groups.push(group);
  }

  public die() {
    this.groups = [];
  }

  public status(print: boolean): void {
    if (print) console.log(this.name + ":");
    for (let g = 0; g < this.groups.length; g++) {
      const n = g + 1;
      const group = this.groups[g];
      if (!group.unitCount) {
        continue;
      }
      if (print) console.log(`Group ${n} contains ${group.unitCount} units`);
    }
  }

  public selectTargets(print: boolean): void {
    for (const e of this.enemy!!.groups) {
      e.selected = false;
    }
    const groups = this.groups.sort(
      (a, b) => b.effectivePower - a.effectivePower
    );
    for (const group of groups) {
      if (!group.unitCount) {
        continue;
      }

      let max = 0;
      let target;
      for (const potential of this.enemy!!.availableTargets) {
        const damage = potential.calcDamage(
          group.effectivePower,
          group.attackType
        );
        if (damage > max) {
          max = damage;
          target = potential;
        } else if (damage === max && target) {
          if (potential.effectivePower > target.effectivePower) {
            target = potential;
          } else if (
            potential.effectivePower === target.effectivePower &&
            potential.initiative > target.initiative
          ) {
            target = potential;
          }
        }
        if (print)
          console.log(
            `${group.name} would deal defending group ${potential.num} ${damage} damage`
          );
      }
      if (target) {
        target.selected = true;
      }
      group.target = target;
    }
  }
}

const loadArmies = (boost: number = 0): [Army, Army] => {
  let infectionArmy = new Army("Infection");
  let immuneArmy = new Army("Immune System");
  immuneArmy.enemy = infectionArmy;
  infectionArmy.enemy = immuneArmy;

  let i = 1;
  for (const line of inputInfection.split("\n")) {
    const group = new Group(line, infectionArmy, immuneArmy, i);
    infectionArmy.add(group);
    i++;
  }

  i = 1;
  for (const line of inputImmune.split("\n")) {
    const group = new Group(line, immuneArmy, infectionArmy, i, boost);
    immuneArmy.add(group);
    i++;
  }

  return [infectionArmy, immuneArmy];
};

const attack = (a: Army, b: Army, print: boolean) => {
  const groups = a.groups.concat(b.groups).sort((x: Group, y: Group) => {
    return y.initiative - x.initiative;
  });
  for (const group of groups) {
    if (group.unitCount && group.target) {
      const kills = group.attack();
      if (print)
        console.log(
          `${group.name} attacks defending group ${group.target.num}, killing ${kills} units`
        );
    }
  }
};

const fight = (infectionArmy: Army, immuneArmy: Army, print: boolean) => {
  let round = 0;
  let prev = 0;
  while (infectionArmy.health > 0 && immuneArmy.health > 0) {
    immuneArmy.status(print);
    infectionArmy.status(print);
    if (print) console.log("");
    infectionArmy.selectTargets(print);
    immuneArmy.selectTargets(print);
    if (print) console.log("");
    attack(infectionArmy, immuneArmy, print);
    const hp = infectionArmy.health + immuneArmy.health;
    if (hp === prev) {
      immuneArmy.die(); //stalemate
      break;
    }
    prev = hp;
  }
  console.log(
    `${infectionArmy.name} : ${infectionArmy.score} / ${immuneArmy.name} : ${immuneArmy.score}`
  );
  console.log(Math.max(infectionArmy.score, immuneArmy.score));
};

let [infectionArmy, immuneArmy] = loadArmies();

// part 1
fight(infectionArmy, immuneArmy, false);

let boost = 40;

while (immuneArmy.health === 0) {
  [infectionArmy, immuneArmy] = loadArmies(boost);
  console.log(`Fighting with boost ${boost}`);
  fight(infectionArmy, immuneArmy, false);
  boost += 1;
}

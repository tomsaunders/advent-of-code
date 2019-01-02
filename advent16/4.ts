#!/usr/bin/env npx ts-node --pretty
// Lesson: sort returns an array but affects it in place, therefore the order of the inputs was affected
// and part 2 gave the wrong answer because things were no longer in the expected column

import * as fs from "fs";
const input = fs.readFileSync("input4.txt", "utf8");
const lines = input.split("\n");

type Freq = [string, number];

class Room {
  public get isReal(): boolean {
    //A room is real (not a decoy) if the checksum is the five most common letters in the encrypted name,
    //in order, with ties broken by alphabetization. For example:
    const freqs = new Map<string, Freq>();
    for (let i = 0; i < this.name.length; i++) {
      const c = this.name[i];
      if (c === "-") continue;
      const nu = freqs.has(c) ? freqs.get(c)!![1] : 0;
      freqs.set(c, [c, nu + 1]);
    }
    const pairs = Array.from(freqs.values());
    pairs.sort((a: Freq, b: Freq) => {
      const [achar, acount] = a;
      const [bchar, bcount] = b;
      if (acount == bcount) {
        return achar.localeCompare(bchar);
      } else {
        return bcount - acount;
      }
    });
    const calcSum = pairs
      .slice(0, 5)
      .map((f) => f[0])
      .join("");
    return calcSum === this.checksum;
  }
  public constructor(public name: string, public sectorID: number, public checksum: string) {}

  public decrypt(): void {
    let d = "";
    for (let i = 0; i < this.name.length; i++) {
      const c = this.name[i];
      if (c === "-") {
        d += c;
      } else {
        d += this.shift(c);
      }
    }
    console.log(d, this.sectorID);
  }

  public shift(char: string): string {
    const code = char.charCodeAt(0) - 97;
    const s = code + this.sectorID;
    const a = s % 26;
    return String.fromCharCode(a + 97);
  }
}

const rooms: Room[] = [];

for (const line of lines) {
  //aaaaa - bbb - z - y - x - (123)[abxyz];
  const match = line.match(/(.*)-(\d*)\[(.*)\]/);
  if (!match) continue;
  const [, name, sectorID, checksum] = match;
  match.shift();
  rooms.push(new Room(name, parseInt(sectorID, 10), checksum));
}

const real = rooms.filter((room) => room.isReal);
const sum = real.reduce((sum: number, room: Room): number => sum + room.sectorID, 0);
console.log(sum);
real.forEach((room) => room.decrypt());

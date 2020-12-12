#!/usr/bin/env ts-node
import * as fs from "fs";
import { test } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");
const lines = input.split("\n");
lines.sort();

const botMax = 210;
let running = true;

const bots: Bot[] = [];
const outputs: number[] = [];

class Bot {
  public chips: number[] = [];
  constructor(
    public id: number,
    public lowType: string,
    public lowTo: number,
    public highType: string,
    public highTo: number
  ) {}
  public get ready(): boolean {
    return this.chips.length === 2;
  }
  public run(): void {
    this.chips.sort((a, b) => a - b);
    const low = this.chips.shift() as number;
    const high = this.chips.shift() as number;

    if (low === 17 && high === 61) {
      console.log("Part One", this.id);
    }
    if (this.lowType === "bot") bots[this.lowTo].chips.push(low);
    else outputs[this.lowTo] = low;
    if (this.highType === "bot") bots[this.highTo].chips.push(high);
    else outputs[this.highTo] = high;
  }
  public static fromLine(line: string): Bot {
    //bot 24 gives low to bot 129 and high to bot 192
    const bits = line.split(" ");
    return new Bot(
      parseInt(bits[1], 10),
      bits[5],
      parseInt(bits[6], 10),
      bits[10],
      parseInt(bits[11], 10)
    );
  }
}

for (let i = 0; i < botMax; i++) {
  bots.push(new Bot(i, "", 0, "", 0));
  outputs.push(0);
}

for (const line of lines) {
  if (line.startsWith("bot")) {
    const b = Bot.fromLine(line);
    bots[b.id] = b;
  } else {
    const bits = line.split(" ");
    const chip = parseInt(bits[1], 10);
    const dest = parseInt(bits[5], 10);
    bots[dest].chips.push(chip);
  }
}
while (running) {
  running = false;
  for (const bot of bots) {
    if (bot.ready) {
      bot.run();
      running = true;
    }
  }
}
console.log("Part Two", outputs[0] * outputs[1] * outputs[2]);
// value 7 goes to bot 174
// bot 24 gives low to bot 129 and high to bot 192
// Based on your instructions, what is the number of the bot that is responsible for comparing value-61 microchips with value-17 microchips?

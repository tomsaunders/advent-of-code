#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("wordlist", "utf8") as string;
const grid = `TJER
SONS
PNIL
ESRII`;
const lines = grid.split("\n");

class Letter {
  constructor(
    public grid: Grid,
    public x: number,
    public y: number,
    public letter: string
  ) {}
  private n?: Letter[];
  public get key(): string {
    return `${this.x}:${this.y}`;
  }
  public get label(): string {
    return `${this.letter} @ ${this.key}`;
  }
  public get neighbours(): Letter[] {
    if (!this.n) {
      this.n = [];
      for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
          const l = this.grid.lookup.get(`${this.x + b}:${this.y + a}`);
          if (l && l !== this) {
            this.n.push(l);
          }
        }
      }
    }
    return this.n;
  }
}
class Grid {
  public lookup: Map<string, Letter>;
  constructor() {
    this.lookup = new Map<string, Letter>();
  }
  public add(x: number, y: number, letter: string) {
    const l = new Letter(this, x, y, letter);
    this.lookup.set(l.key, l);
  }
  public get letters(): Letter[] {
    return Array.from(this.lookup.values());
  }
}

const g = new Grid();
for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  for (let x = 0; x < 4; x++) {
    g.add(x, y, line[x]);
  }
}

function word(letters: Letter[]): string {
  return letters.map((l) => l.letter).join("");
}

const candidates = new Set<string>();
const valid = new Set<string>();
const words = input.split("\n").map((w) => w.toUpperCase());
for (const w of words) {
  valid.add(w);
  for (let l = 1; l <= w.length; l++) {
    const p = w.substr(0, l);
    candidates.add(p);
  }
}

function permute(finished: string[], progress: Letter[]): void {
  const w = word(progress);
  // console.log(w);
  if (valid.has(w)) {
    finished.push(w);
  }
  if (!candidates.has(w)) {
    return;
  }

  const options = progress[progress.length - 1].neighbours.filter(
    (n) => !progress.includes(n)
  );
  if (options.length === 0) {
    return;
  }
  for (let i = 0; i < options.length; i++) {
    const next = options[i];
    const branch = [...progress];
    branch.push(next);

    const rest = [...options];
    rest.splice(i, 1);

    permute(finished, branch);
  }
}

const found = new Set<string>();
for (const l of g.letters) {
  const all: string[] = [];
  permute(all, [l]);
  console.log("found", all.length, "for ", l.label);
  for (const a of all) {
    found.add(a);
  }
}

let out = Array.from(found.values()).filter((s) => s.length > 2);
out.sort((a, b) =>
  b.length == a.length ? b.charCodeAt(0) - a.charCodeAt(0) : b.length - a.length
);
console.log(out.join("\n"));

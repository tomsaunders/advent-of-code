#!/usr/bin/env npx ts-node
import * as fs from "fs";
import { Grid } from "./grid";
import { Cell } from "./cell";
const input = fs.readFileSync("input18.txt", "utf8") as string;

function test(a: number, b: number): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

const input1a = `#########
#b.A.@.a#
#########`;

const input1b = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`;

const input1c = `########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`;

const input1d = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`;

const input1e = `########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`;

// test(8, keySteps(input1a));
// test(86, keySteps(input1b));
// test(132, keySteps(input1c));
test(136, keySteps(input1d));
// test(81, keySteps(input1e));

function keySteps(input: string): number {
  const map = new Grid();
  const lines = input.split("\n");
  map.lines = lines;
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const code = line[x];
      map.addCell(x, y, 0, code);
    }
  }
  map.draw();
  const cells = map.cells.map((c) => c.init());
  const start = cells.find((c) => c.isEntrance) as Cell;
  const allKeys = cells.filter((c) => c.isKey).length;
  const objects = cells.filter((c) => c.isObject);

  function explore(from: Cell): void {
    from.visited = true;
    const queue: [number, Cell][] = [];
    for (const n of from.neighbours) {
      queue.push([1, n]);
    }

    while (queue.length) {
      const [d, current] = queue.pop() as [number, Cell];
      if (current.isObject) {
        from.knownDistances.set(current, d);
        current.knownDistances.set(from, d);
        continue;
      }
      current.visited = true;
      for (const n of current.unexplored) {
        queue.push([d + 1, n]);
      }
    }
  }
  for (const o of objects) {
    explore(o);
  }

  function addKey(key: string, keys: string): string {
    if (keys.includes(key)) return keys;

    const a = keys.split("");
    a.push(key);
    a.sort();
    return a.join("");
  }

  // cell (position) , collected keys, total distance, order
  type SearchState = [Cell, string, number, string];
  const queue: SearchState[] = [[start, "", 0, ""]];
  const visited = new Map<string, number>();
  let bestFound: number = 99999999;

  let x = 0;

  while (queue.length && x < 10) {
    let [c, keys, dist, order] = queue.pop() as SearchState;
    console.log(
      "Searching: ",
      c.label,
      " found keys ",
      keys,
      " at dist ",
      dist,
      "... queue is",
      queue.length,
      " best so far",
      bestFound,
      "list of seen things",
      visited.size,
      "order",
      order
    );
    if (dist > bestFound) {
      continue;
    }
    const k = `${c.coord}:${keys}`;
    visited.set(k, dist);

    if (c.isKey) {
      keys = addKey(c.type, keys);
      console.log("found key!", c.type, "now at", keys);
      if (!order.includes(c.type)) order = `${order}${c.type}`;
    }
    if (keys.length === allKeys) {
      bestFound = Math.min(bestFound, dist);
      console.log("found a sequence ", order);
    }
    x++;

    for (const [n, d] of c.getPathOptions(keys)) {
      const nk = `${n.coord}:${keys}`;
      const before = visited.get(nk) || 99999999;
      const nd = dist + d;
      console.log("path option:", n.label, "reachable in ", d, "steps, seen before?", before);
      if (nd < before) {
        console.log("queued");
        queue.push([n, keys, nd, order]);
      }
    }

    queue.sort((a, b) => {
      // if (a[1].length === b[1].length) {
      return b[2] - a[2];
      // } else {
      // return a[1].length - b[1].length;
      // }
    });
  }

  console.log("done in steps ", x);
  return bestFound;
}

// console.log("Answer: ", keySteps(input));
// console.log("\nPART 2\n");
// console.log("Answer", portal2(input));

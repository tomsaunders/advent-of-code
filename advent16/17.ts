#!/usr/bin/env ts-node
import { test, md5 } from "./util";
const input = "udskfozm";

type Branch = [string, number, number];

const [startX, startY] = [0, 0];
const [goalX, goalY] = [3, 3];

function valid(c: string): boolean {
  return c === "b" || c === "c" || c === "d" || c === "e" || c === "f";
}

function options(branch: Branch, queue: Branch[]): void {
  const [progress, x, y] = branch;

  const hash = md5(progress);
  if (valid(hash[0]) && y > 0) {
    queue.push([progress + "U", x, y - 1]);
  }
  if (valid(hash[1]) && y < goalY) {
    queue.push([progress + "D", x, y + 1]);
  }
  if (valid(hash[2]) && x > 0) {
    queue.push([progress + "L", x - 1, y]);
  }
  if (valid(hash[3]) && x < goalX) {
    queue.push([progress + "R", x + 1, y]);
  }
}

function shortestPath(startHash: string): string {
  let shortest = "".padEnd(999, "X");
  let queue: Branch[] = [[startHash, startX, startY]];
  while (queue.length) {
    const next = queue.shift() as Branch;
    const [progress, x, y] = next;

    if (x === goalX && y === goalY) {
      if (progress.length < shortest.length) {
        shortest = progress;
        continue;
      }
    }
    if (progress.length > shortest.length) {
      continue;
    }
    options(next, queue);

    queue.sort((a, b) => b[0].length - a[0].length);
  }

  return shortest.replace(startHash, "");
}

test(shortestPath("ihgpwlah"), "DDRRRD");
test(shortestPath("kglvqrro"), "DDUDRLRRUDRD");
test(shortestPath("ulqzkmiv"), "DRURDRUDDLLDLUURRDULRLDUUDDDRR");

console.log("Part One", shortestPath(input));

function longestPath(startHash: string): number {
  let longest = 0;
  let queue: Branch[] = [[startHash, startX, startY]];
  while (queue.length) {
    const next = queue.pop() as Branch;
    const [progress, x, y] = next;

    if (x === goalX && y === goalY) {
      longest = Math.max(longest, progress.length);
      continue;
    }
    options(next, queue);

    queue.sort((a, b) => b[0].length - a[0].length);
  }

  return longest - startHash.length;
}

test(longestPath("ihgpwlah"), 370);
test(longestPath("kglvqrro"), 492);
test(longestPath("ulqzkmiv"), 830);

console.log("Part One", longestPath(input));

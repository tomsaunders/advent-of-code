#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell, getStringGroups } from "./util";
import * as fs from "fs";

let input = fs.readFileSync("input22.txt", "utf8");
const lines = input.split("\n");

function combat(input: string): number {
  const players = getStringGroups(input);
  players[0].shift();
  players[1].shift();

  while (players.every((p) => p.length)) {
    const a = players[0].shift() as string;
    const b = players[1].shift() as string;

    if (parseInt(a, 10) > parseInt(b, 10)) {
      players[0].push(a);
      players[0].push(b);
    } else {
      players[1].push(b);
      players[1].push(a);
    }
  }
  const winner = players[0].length ? players[0] : players[1];
  let score = 0;
  let mult = 1;
  while (winner.length) {
    const n = winner.pop() as string;
    score += mult * parseInt(n, 10);
    mult++;
  }
  return score;
}
const example = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

test(combat(example), 306);
console.log("Part One", combat(input));

function partTwo(input: string): number {
  const players = getStringGroups(input);
  players[0].shift();
  players[1].shift();

  return recursiveCombat(players);
}

function recursiveCombat(
  players: string[][],
  recursiveGame: number = 0
): number {
  const seen = new Set<string>();
  // console.log(`=== Game ${recursiveGame + 1} ===`);

  let round = 1;
  while (players.every((p) => p.length)) {
    // console.log(`\n-- Round ${round} (Game ${recursiveGame + 1}) --`);
    // console.log(`Player 1's deck: ${players[0].join(", ")}`);
    // console.log(`Player 2's deck: ${players[1].join(", ")}`);
    const k = players.map((p) => p.join("-")).join("::");
    if (seen.has(k)) {
      // player 1 wins
      return 99;
    }
    seen.add(k);

    const a = players[0].shift() as string;
    const b = players[1].shift() as string;
    // console.log(`Player 1 plays:`, a);
    // console.log(`Player 2 plays:`, b);

    let aI = parseInt(a, 10);
    let bI = parseInt(b, 10);

    if (players[0].length >= aI && players[1].length >= bI) {
      // new game of recursive combat
      // console.log("Playing a sub-game to determine the winner...");
      aI = recursiveCombat(
        [players[0].slice(0, aI), players[1].slice(0, bI)],
        recursiveGame + 1
      );
      bI = 0;
      // console.log(`...anyway, back to game ${recursiveGame + 1}.`);
    }

    if (aI > bI) {
      players[0].push(a);
      players[0].push(b);
      // console.log(`Player 1 wins round ${round} of game ${recursiveGame + 1}!`);
    } else {
      players[1].push(b);
      players[1].push(a);
      // console.log(`Player 2 wins round ${round} of game ${recursiveGame + 1}!`);
    }
    round++;
  }

  if (recursiveGame) {
    // console.log(
    //   `The winner of game ${recursiveGame + 1} is player ${
    //     players[0].length ? 1 : 2
    //   }!`
    // );
    return players[0].length ? 99 : -99;
  }

  // console.log(
  //   `The winner of game ${recursiveGame + 1} is player ${
  //     players[0].length ? 1 : 2
  //   }!`
  // );
  const winner = players[0].length ? players[0] : players[1];
  // console.log(`\n== Post-game results ==`);
  // console.log(`Player 1's deck: ${players[0].join(", ")}`);
  // console.log(`Player 2's deck: ${players[1].join(", ")}`);

  let score = 0;
  let mult = 1;
  while (winner.length) {
    const n = winner.pop() as string;
    score += mult * parseInt(n, 10);
    mult++;
  }

  // console.log("Score", score);
  return score;
}
test(
  partTwo(`Player 1:
43
19

Player 2:
2
29
14`),
  99
);
test(partTwo(example), 291);
console.log("Part Two", partTwo(input));

const nick = fs.readFileSync("input22Nick.txt", "utf8");
test(combat(nick), 36257);
test(partTwo(nick), 33304);

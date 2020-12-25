#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell } from "./util";
import * as fs from "fs";

const cardPublicKey = 18356117;
const doorPublicKey = 5909654;

function subjectNumberTransform(subject: number, loop: number): number {
  let v = 1;
  for (let i = 0; i < loop; i++) {
    v *= subject;
    v %= 20201227;
  }

  return v;
}

function partOne(cardPK: number, doorPK: number): number {
  // const cardLoop = findLoop(cardPK);
  const doorLoop = findLoop(doorPK);

  const encKey = subjectNumberTransform(cardPK, doorLoop);
  return encKey;
}

function findLoop(pk: number): number {
  let i = 0;
  let v = 1;
  while (v !== pk) {
    v *= 7;
    v %= 20201227;
    i++;
  }
  return i;
}

console.log("Merry Xmas");
test(subjectNumberTransform(7, 8), 5764801);
test(subjectNumberTransform(7, 11), 17807724);
test(findLoop(5764801), 8);
test(findLoop(17807724), 11);

test(partOne(5764801, 17807724), 14897079);
console.log("Part One", partOne(cardPublicKey, doorPublicKey));

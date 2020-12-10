#!/usr/bin/env ts-node
const input = "vzbxkghb";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const hasStraight = (pass: string): boolean => {
  for (let i = 0; i < alphabet.length - 2; i++) {
    const straight = alphabet.slice(i, i + 3);
    if (pass.includes(straight)) {
      return true;
    }
  }
  return false;
};

const hasIOL = (pass: string): boolean => {
  return pass.includes("i") || pass.includes("o") || pass.includes("l");
};

const hasPairs = (pass: string): boolean => {
  return !!pass.match(/.*([a-z])\1.*([a-z])\2.*/);
};

const valid = (guess: number[]): boolean => {
  const pass = guessString(guess);
  return hasPairs(pass) && !hasIOL(pass) && hasStraight(pass);
};

const guessString = (guess: number[]): string => {
  return guess
    .map((g) => alphabet[g])
    .reverse()
    .join("");
};

const inc = (guess: number[]): number[] => {
  const last = guess.length - 1;
  for (let i = 0; i <= last; i++) {
    guess[i] += 1;
    if (guess[i] === 26) {
      guess[i] = 0;
      if (i === last) {
        guess.push(0);
      }
    } else {
      break;
    }
  }
  return guess;
};

const inarr = input.split("").reverse();
let guess = [];
for (const i of inarr) {
  guess.push(alphabet.indexOf(i));
}
guess = inc(guess);
while (!valid(guess)) {
  guess = inc(guess);
}
console.log(guessString(guess));
guess = inc(guess);
while (!valid(guess)) {
  guess = inc(guess);
}
console.log(guessString(guess));

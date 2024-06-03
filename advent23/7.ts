#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, ON, arrProd, arrSum, isNumeric, mapNum } from "./util";
const input = fs.readFileSync("input7.txt", "utf8");
const test = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const CAMEL_CARDS = "AKQJT987654321".split("");
const JOKER_CAMEL_CARDS = "AKQT987654321J".split("");

const HIGH = 0;
const ONEP = 1;
const TWOP = 2;
const THRE = 3;
const FULL = 4;
const FOUR = 5;
const FIVE = 6;

class Hand {
  public rank: number = 0;
  public typeScore: number = 0;
  public labelScore: number = 0;

  constructor(public cards: string, public bid: number){
    const cardCounts = new Array(CAMEL_CARDS.length);
    CAMEL_CARDS.forEach((c, i) => {
      cardCounts[i] = 0;
      for (let h = 0; h < 5; h++){
        if (cards[h] === c){
          cardCounts[i]++;
        }
      }
    })
    cardCounts.sort().reverse();
    const most = cardCounts[0];
    const nextMost = cardCounts[1];
    
    if (most === 5){
      this.typeScore = FIVE;
    } else if (most === 4){
      this.typeScore = FOUR;
    } else if (most === 3){
      if (nextMost === 2){
        this.typeScore = FULL;
      } else {
        this.typeScore = THRE;
      }
    } else if (most === 2){
      if (nextMost === 2)      {
      this.typeScore = TWOP;
      } else {
        this.typeScore = ONEP;
      }
    } else {
      this.typeScore = HIGH;
    }

    for (let h  = 0; h < 5; h++){
      const mult = Math.pow(10, (4-h) * 2);
      const cardScore = 13 - CAMEL_CARDS.indexOf(cards[h]);
      this.labelScore += cardScore * mult;
    }
  }


  public get score(): number {
    return this.rank * this.bid;
  }

  public toString(): string {
    return `${this.cards} score ${this.score}`;
  }

  public static fromLine(line: string): Hand {
    const bits = line.split(' ');
    return new Hand(bits[0], parseInt(bits[1]));
  }

  public static sort(a: Hand, b: Hand): number {
    if (a.typeScore === b.typeScore){
      return b.labelScore - a.labelScore;
    }
    return b.typeScore - a.typeScore;
  }
}

class JokerHand extends Hand {
  constructor(public cards: string, public bid: number){
    super(cards, bid);
    this.labelScore = 0;

    const cardCounts = new Array(JOKER_CAMEL_CARDS.length);
    JOKER_CAMEL_CARDS.forEach((c, i) => {
      cardCounts[i] = 0;
      for (let h = 0; h < 5; h++){
        if (cards[h] === c){
          cardCounts[i]++;
        }
      }
    })
    const jokerCount = cardCounts.pop(); // joker is the last card and we dont want to consider it after this.

    cardCounts.sort().reverse();
    const most = cardCounts[0];
    const nextMost = cardCounts[1];

    const mostWithJ = most + jokerCount;
    const nextWithJ = nextMost + jokerCount;

    
    if (mostWithJ === 5){
      this.typeScore = FIVE;
    } else if (mostWithJ === 4){
      this.typeScore = FOUR;
    } else if (mostWithJ === 3){
      if (nextMost === 2){
        this.typeScore = FULL;
      } else {
        this.typeScore = THRE;
      }
    } else if (mostWithJ === 2){
      if (nextMost === 2)      {
      this.typeScore = TWOP;
      } else {
        this.typeScore = ONEP;
      }
    } else {
      this.typeScore = HIGH;
    }

    for (let h  = 0; h < 5; h++){
      const mult = Math.pow(10, (4-h) * 2);
      const cardScore = 13 - JOKER_CAMEL_CARDS.indexOf(cards[h]);
      this.labelScore += cardScore * mult;
    }
  }

  public static fromLine(line: string): Hand {
    const bits = line.split(' ');
    return new JokerHand(bits[0], parseInt(bits[1]));
  }
}

function part1(input: string): number {
  const lines = input.split("\n");
  const hands = lines.map(l => Hand.fromLine(l));
  const sorted = hands.sort(Hand.sort).reverse();
  sorted.forEach((hand, idx) => hand.rank = idx+1);

  return arrSum(sorted.map(h => h.score));
}

function part2(input: string): number {
  const lines = input.split("\n");
  const hands = lines.map(l => JokerHand.fromLine(l));
  const sorted = hands.sort(Hand.sort).reverse();
  sorted.forEach((hand, idx) => hand.rank = idx+1);

  return arrSum(sorted.map(h => h.score));
}

const t = part1(test);
if (t == 6440) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 5905) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}

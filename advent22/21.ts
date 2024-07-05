#!/usr/bin/env ts-node
/**
 * Advent of Code 2022 - Day 21
 *
 * Summary: Evaluate a series of mathematical operations ('monkeys') by starting from the known values and subbing them in to other expressions until reaching the root
 * Escalation: Change the calculation and find the input that gives a particular output
 * Solution:
 *  1: loop through the monkeys to see if they can be evaluated fully - if so sub into any other matching monkeys, loop until the record does not change size (is fully reduced)
 *  2: reduce the record as much as possible (til one root side is a number), then solve as an algebraic equation until only the input and output are left
 *
 * Keywords: eval, dependency chain, algebra
 * References:
 */
import * as fs from "fs";
const input = fs.readFileSync("input21.txt", "utf8");

const test = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

type Monkeys = Record<string, string>;
function parseInput(input: string): Monkeys {
  const monkeyMap: Monkeys = {};
  input.split("\n").forEach((line) => {
    const [key, op] = line.split(": ");
    monkeyMap[key] = op;
  });
  return monkeyMap;
}

function eeval(op: string): number {
  const bits = op.split(" ") as any[];
  const firstOperand = parseInt(bits[0]);
  // if a single number, return
  if (!isNaN(firstOperand) && bits.length === 1) {
    return firstOperand;
  }
  const secondOperand = parseInt(bits[2]);
  // if both sides are numbers, we can eval them
  // else this isn't yet able to be processed and we return NaN
  if (!isNaN(firstOperand) && !isNaN(secondOperand)) {
    return eval(op) as number;
  } else {
    return NaN;
  }
}

function reduceMonkeys(monkeys: Monkeys): Monkeys {
  let size = 0;
  let keys = Object.keys(monkeys);
  while (keys.length !== size) {
    size = keys.length;
    keys.forEach((key) => {
      const op = monkeys[key];
      const num = eeval(op as string);
      if (!isNaN(num as number)) {
        monkeys[key] = num.toString();
        Object.keys(monkeys).forEach((otherKey) => {
          if (otherKey !== key && monkeys[otherKey].includes(key)) {
            monkeys[otherKey] = monkeys[otherKey].replace(key, monkeys[key]);
          }
        });
        if (key !== "root") delete monkeys[key];
      }
    });
    keys = Object.keys(monkeys);
  }
  return monkeys;
}

function part1(input: string): number {
  const monkeys = parseInput(input);
  reduceMonkeys(monkeys);
  return parseInt(monkeys["root"]);
}

function part2(input: string): number {
  const monkeys = parseInput(input);
  monkeys["root"] = monkeys["root"].replace(" + ", " = "); //
  monkeys["humn"] = "X"; // override to string constant that cannot be eval'd
  reduceMonkeys(monkeys);

  // after reducing, we should have something like root: abcd = 999
  // so we build an algebraic expander
  // if abcd: efgh - 1
  // after one step then root becomes efgh = 1000

  // loop until the only two keys left are root and humn
  while (Object.keys(monkeys).length > 2) {
    let [lhs, rhs] = monkeys["root"].split(" = ");
    const rootNum = parseInt(rhs);
    console.log(monkeys[lhs], "=", rhs);
    const [first, op, second] = monkeys[lhs].split(" ");
    // either first or second is a number

    delete monkeys[lhs];
    if (isNaN(parseInt(first))) {
      lhs = first;
      const num = parseInt(second);
      // first is a key, second is a number
      if (op === "/") {
        rhs = `${rootNum * num}`;
      } else if (op === "*") {
        rhs = `${rootNum / num}`;
      } else if (op === "-") {
        rhs = `${rootNum + num}`;
      } else if (op === "+") {
        rhs = `${rootNum - num}`;
      }
    } else if (isNaN(parseInt(second))) {
      // second is a key, first is a number
      lhs = second;
      const num = parseInt(first);
      if (op === "/") {
        rhs = `${num / rootNum}`;
      } else if (op === "*") {
        rhs = `${rootNum / num}`;
      } else if (op === "-") {
        rhs = `${num - rootNum}`;
      } else if (op === "+") {
        rhs = `${rootNum - num}`;
      }
    }

    monkeys["root"] = `${lhs} = ${rhs}`;
  }
  return parseInt(monkeys["root"].replace("humn =", ""));
}

const t1 = part1(test);
if (t1 === 152) {
  console.log("Part 1: ", part1(input));
  const t2 = part2(test);
  if (t2 === 301) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", t2);
  }
} else {
  console.log("Test fail: ", t1);
}

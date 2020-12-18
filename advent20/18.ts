#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input18.txt", "utf8");
const lines = input.split("\n");

function getTerms(input: string, useMath2: boolean = false): string[] {
  let terms: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === "(") {
      let end = 0;
      let level = 0;
      for (let n = i; n < input.length; n++) {
        if (input[n] === "(") {
          level++;
        } else if (input[n] === ")") {
          level--;
          if (!level) {
            end = n;
            n = input.length;
          }
        }
      }
      const substr = input.substr(i + 1, end - i - 1);
      const s = useMath2 ? math2(substr) : math(substr);
      // console.log(
      //   `from i ${i} found brackets ${substr} len ${
      //     end - i - 1
      //   } evaluated to ${s}`,
      //   "next char",
      //   end,
      //   input[end]
      // );
      terms.push(s.toString(10));
      i = end;
    } else if (c.trim()) {
      // console.log("term", c);
      terms.push(c);
    }
  }
  return terms;
}

function math(input: string): number {
  const terms = getTerms(input);
  let sum = parseInt(terms[0] as string, 10);
  for (let i = 1; i < terms.length; i++) {
    const c = terms[i];
    if (c === "+") {
      sum += parseInt(terms[i + 1] as string, 10);
      i++;
    } else if (c === "*") {
      sum *= parseInt(terms[i + 1] as string, 10);
      i++;
    }
  }
  return sum;
}

test(math("1 + 2 * 3 + 4 * 5 + 6"), 71);
test(math("1 + (2 * 3) + (4 * (5 + 6))"), 51);
test(math("2 * 3 + (4 * 5)"), 26);
test(math("5 + (8 * 3 + 9 + 3 * 4 * 3)"), 437);
test(math("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"), 12240);
test(math("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"), 13632);
console.log("Part One", arrSum(lines.map((l) => math(l))));

function math2(input: string): number {
  let terms = getTerms(input, true);
  // console.log("terms 1", terms);

  while (terms.includes("+")) {
    for (let i = 1; i < terms.length; i++) {
      const c = terms[i];
      // console.log(i, c);
      if (c === "+") {
        const s = parseInt(terms[i - 1]) + parseInt(terms[i + 1]);
        terms.splice(i - 1, 3, s.toString());
        // const prior = i > 1 ? terms.slice(0, i - 2) : [];
        // const after = terms.slice(i + 2);
        // terms = [...prior, s.toString(10), ...after];
        // console.log("terms now", terms);
        i = terms.length + 9999;
        // return 0;
      }
    }
  }
  // console.log("terms 2", terms);

  let sum = parseInt(terms[0] as string, 10);
  for (let i = 1; i < terms.length; i++) {
    const c = terms[i];
    if (c === "+") {
      sum += parseInt(terms[i + 1] as string, 10);
      i++;
    } else if (c === "*") {
      sum *= parseInt(terms[i + 1] as string, 10);
      i++;
    }
  }
  return sum;
}

test(math2("1 + 2 * 3 + 4 * 5 + 6"), 231);
test(math2("1 + (2 * 3) + (4 * (5 + 6))"), 51);
test(math2("2 * 3 + (4 * 5)"), 46);
test(math2("5 + (8 * 3 + 9 + 3 * 4 * 3)"), 1445);
test(math2("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"), 669060);
test(math2("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"), 23340);
console.log("Part Two", arrSum(lines.map((l) => math2(l))));

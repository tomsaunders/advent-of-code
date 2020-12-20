#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell } from "./util";
import * as fs from "fs";
let ruleString = fs.readFileSync("input19a.txt", "utf8");
let inputString = fs.readFileSync("input19b.txt", "utf8");

function countMatches(
  ruleString: string,
  inputs: string,
  part2: boolean = false
): number {
  const ruleLines = ruleString.split("\n");
  const inputLines = inputs.split("\n");
  const rules: Map<string, string> = new Map<string, string>();
  for (const r of ruleLines) {
    const [id, rule] = r.split(":");

    rules.set(id, rule.trim().replace('"', "").replace('"', ""));
  }

  function cleanX(r: string): string {
    return r
      .replace(/\s/g, "")
      .replace(/\(([ab]*)\)/gm, "$1")
      .replace(/\(([ab]*)\)/gm, "$1");
  }

  const x8 = rules.has("8") ? cleanX(construct("8")) : "x";
  const x42 = rules.has("42") ? cleanX(construct("42")) : "x";
  const x31 = rules.has("31") ? cleanX(construct("31")) : "x";

  function construct(ruleId: string, depth: number = 0): string {
    const rule = rules.get(ruleId) as string;
    if (rule.length === 1 && isNaN(parseInt(rule, 10))) {
      return `(${rule})`;
    } else {
      const bits = rule.split(" ").map((b) => {
        if (b === "|") {
          return b;
        }
        if (rules.has(b)) {
          if (depth) {
            if (b === "8") {
              return `(${x8}+)`;
            } else if (b === "11") {
              return `(?<a>${x42}{${depth}})(?<b>${x31}{${depth}})`;
            }
          }
          return construct(b);
        }
      });
      return `(${bits.join(" ")})`;
    }
  }

  if (!part2) {
    const rule = cleanX(construct("0"));
    return inputLines.filter((l) => !!new RegExp(`^${rule}$`, "gi").exec(l))
      .length;
  }

  const matched: Set<string> = new Set<string>();
  let unmatched = inputLines.slice();
  let found = 1;
  let depth = 1;
  while (found) {
    found = 0;
    const rule = cleanX(construct("0", depth));
    const nextLines: string[] = [];
    unmatched.forEach((l) => {
      const m = !!new RegExp(`^${rule}$`, "gi").exec(l);
      if (m) {
        matched.add(l);
        found++;
      } else {
        nextLines.push(l);
      }
    });
    depth++;
    unmatched = nextLines;
  }

  return matched.size;
}
test(
  countMatches(
    `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"`,
    `ababbb
bababa
abbbab
aaabbb
aaaabbb`
  ),
  2
);
console.log("Part One", countMatches(ruleString, inputString));

const test2Rules = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1`;

const test2Inputs = `abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`;
test(countMatches(test2Rules, test2Inputs), 3);

test(countMatches(test2Rules, test2Inputs, true), 12);
console.log("Part Two", countMatches(ruleString, inputString, true));

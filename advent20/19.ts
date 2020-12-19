#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell } from "./util";
import * as fs from "fs";
let ruleLines = fs.readFileSync("input19a.txt", "utf8").split("\n");
let inputLines = fs.readFileSync("input19b.txt", "utf8").split("\n");

const rules: Map<string, string> = new Map<string, string>();
for (const r of ruleLines) {
  const [id, rule] = r.split(":");

  rules.set(id, rule.trim().replace('"', "").replace('"', ""));
}

function construct(ruleId: string): string {
  const rule = rules.get(ruleId) as string;
  if (rule.length === 1 && isNaN(parseInt(rule, 10))) {
    return `(${rule})`;
  } else {
    const bits = rule.split(" ").map((b) => {
      if (b === "|") {
        return b;
      }
      if (rules.has(b)) {
        return construct(b);
      }
    });
    return `(${bits.join(" ")})`;
  }
}
console.log(construct("0"));

const rule = construct("0").replace(/\s/g, "");
console.log(rule);
const r = new RegExp(`^${rule}$`, "gi");
console.log(r);

const regex = /^(((((((a)((a)((a)((b)(a)|(b)(b))|(b)((a)(b)))|(b)(((b)(a)|(a)(b))(a)|((a)(b)|(b)(b))(b)))|(b)(((((a)|(b))((a)|(b)))(a)|((a)(b)|(b)(b))(b))(a)|(((a)(b)|(b)(b))(b)|((a)(b))(a))(b)))(b)|(((((b)(a)|(a)(b))(b)|((a)(b)|(a)(a))(a))(a)|((b)((b)(a))|(a)((a)(b)|(a)(a)))(b))(a)|((b)((b)((a)(b))|(a)((b)(a)|(a)(b)))|(a)(((a)(a)|((a)|(b))(b))(a)))(b))(a))(a)|(((a)((((a)(a)|((a)|(b))(b))(a)|((b)(b))(b))(a)|(((a)|(b))((a)(b)|(b)(b)))(b))|(b)((a)((b)((b)((a)|(b))|(a)(a))|(a)((a)(a)|((a)|(b))(b)))|(b)(((a)(a)|(b)(b))((a)|(b)))))(b)|((a)((b)(((b)(a)|(a)(b))(b)|((a)(b)|(b)(b))(a))|(a)(((b)(a))(a)|((b)(b))(b)))|(b)((b)(((a)(b))(b)|((a)(b)|(a)(a))(a))|(a)((a)((a)(b)|(a)(a))|(b)((b)(a)|(a)(b)))))(a))(b))(b)|(((((((a)|(b))((a)(b)|(b)(b)))(b)|(((a)|(b))((b)(a)|(b)(b)))(a))(a)|(((b)((b)(b))|(a)((b)(a)))(b)|((b)((b)(a))|(a)((a)(b)|(b)(b)))(a))(b))(a)|((b)((((a)(b)|((a)|(b))(a))(a)|((a)(b)|(a)(a))(b))(a)|((a)((a)(a)|((a)|(b))(b))|(b)((b)(a)|((a)|(b))(b)))(b))|(a)(((a)((a)(b)|(b)(b))|(b)((a)(a)|(b)(b)))(a)|(((b)(a)|((a)|(b))(b))(a)|((a)(b)|((a)|(b))(a))(b))(b)))(b))(a)|((b)((((a)((a)(a)|((a)|(b))(b))|(b)((b)(a)|((a)|(b))(b)))(b)|((b)((a)(b)|(a)(a))|(a)((a)(b)))(a))(a)|((a)((b)((b)(b))|(a)((b)(a)))|(b)(((a)(b)|(b)(b))(b)|((b)(a)|(b)(b))(a)))(b))|(a)(((b)(((a)(a)|((a)|(b))(b))((a)|(b)))|(a)((b)((a)(b)|(a)(a))|(a)((b)(a)|((a)|(b))(b))))(b)|((b)(((a)(b)|((a)|(b))(a))(a))|(a)((b)((a)(a)|((a)|(b))(b))|(a)((b)(a)|(b)(b))))(a)))(b))(a)))((((((a)((a)((a)((b)(a)|(b)(b))|(b)((a)(b)))|(b)(((b)(a)|(a)(b))(a)|((a)(b)|(b)(b))(b)))|(b)(((((a)|(b))((a)|(b)))(a)|((a)(b)|(b)(b))(b))(a)|(((a)(b)|(b)(b))(b)|((a)(b))(a))(b)))(b)|(((((b)(a)|(a)(b))(b)|((a)(b)|(a)(a))(a))(a)|((b)((b)(a))|(a)((a)(b)|(a)(a)))(b))(a)|((b)((b)((a)(b))|(a)((b)(a)|(a)(b)))|(a)(((a)(a)|((a)|(b))(b))(a)))(b))(a))(a)|(((a)((((a)(a)|((a)|(b))(b))(a)|((b)(b))(b))(a)|(((a)|(b))((a)(b)|(b)(b)))(b))|(b)((a)((b)((b)((a)|(b))|(a)(a))|(a)((a)(a)|((a)|(b))(b)))|(b)(((a)(a)|(b)(b))((a)|(b)))))(b)|((a)((b)(((b)(a)|(a)(b))(b)|((a)(b)|(b)(b))(a))|(a)(((b)(a))(a)|((b)(b))(b)))|(b)((b)(((a)(b))(b)|((a)(b)|(a)(a))(a))|(a)((a)((a)(b)|(a)(a))|(b)((b)(a)|(a)(b)))))(a))(b))(b)|(((((((a)|(b))((a)(b)|(b)(b)))(b)|(((a)|(b))((b)(a)|(b)(b)))(a))(a)|(((b)((b)(b))|(a)((b)(a)))(b)|((b)((b)(a))|(a)((a)(b)|(b)(b)))(a))(b))(a)|((b)((((a)(b)|((a)|(b))(a))(a)|((a)(b)|(a)(a))(b))(a)|((a)((a)(a)|((a)|(b))(b))|(b)((b)(a)|((a)|(b))(b)))(b))|(a)(((a)((a)(b)|(b)(b))|(b)((a)(a)|(b)(b)))(a)|(((b)(a)|((a)|(b))(b))(a)|((a)(b)|((a)|(b))(a))(b))(b)))(b))(a)|((b)((((a)((a)(a)|((a)|(b))(b))|(b)((b)(a)|((a)|(b))(b)))(b)|((b)((a)(b)|(a)(a))|(a)((a)(b)))(a))(a)|((a)((b)((b)(b))|(a)((b)(a)))|(b)(((a)(b)|(b)(b))(b)|((b)(a)|(b)(b))(a)))(b))|(a)(((b)(((a)(a)|((a)|(b))(b))((a)|(b)))|(a)((b)((a)(b)|(a)(a))|(a)((b)(a)|((a)|(b))(b))))(b)|((b)(((a)(b)|((a)|(b))(a))(a))|(a)((b)((a)(a)|((a)|(b))(b))|(a)((b)(a)|(b)(b))))(a)))(b))(a))(((b)((a)((b)(((b)((b)(a)|(a)(a)))(a)|(((a)(b))(b)|((a)(a)|(b)(b))(a))(b))|(a)((b)(((a)(a)|((a)|(b))(b))(a)|((a)(b)|((a)|(b))(a))(b))|(a)((a)((a)(a))|(b)((b)(a)|(a)(a)))))|(b)((b)(((a)((b)((a)|(b))|(a)(a))|(b)((b)(a)|(a)(a)))(a)|((((a)|(b))((a)|(b)))(a)|((a)(b)|(a)(a))(b))(b))|(a)((b)(((a)|(b))((b)(a)|(b)(b)))|(a)((b)((a)(b)|((a)|(b))(a))|(a)((a)(a))))))|(a)((a)(((a)((((a)|(b))((a)|(b)))(a)|((b)(a)|(a)(b))(b))|(b)(((b)(a)|(a)(b))((a)|(b))))(b)|((b)(((b)((a)|(b))|(a)(a))(b)|((a)(a)|(b)(b))(a))|(a)((b)((b)(a))|(a)((a)(b)|(b)(b))))(a))|(b)(((((a)(b)|(b)(b))(a)|((a)(a)|((a)|(b))(b))(b))(a)|((a)((a)(b)|(a)(a))|(b)((b)(a)|(a)(b)))(b))(a)|((a)(((a)(b)|((a)|(b))(a))(b)|((a)(b)|(a)(a))(a))|(b)(((a)(b))(b)|((a)(a)|(b)(b))(a)))(b))))(b)|((b)((a)(((((b)(a))(b))(b)|((a)(((a)|(b))((a)|(b)))|(b)((a)(a)|((a)|(b))(b)))(a))(a)|((b)((b)((a)(b)|(a)(a))|(a)(((a)|(b))((a)|(b))))|(a)((b)((b)(b))|(a)((a)(a)|((a)|(b))(b))))(b))|(b)((b)(((b)((a)(b))|(a)((b)(a)|(a)(b)))(a)|(((b)(a)|(a)(a))(a)|((a)(b))(b))(b))|(a)(((a)((b)(b))|(b)((a)(b)|((a)|(b))(a)))(a)|((b)((a)(b))|(a)((b)(a)|((a)|(b))(b)))(b))))|(a)((((b)((((a)|(b))((a)|(b)))(b)|((b)(b))(a))|(a)((b)((b)(a))|(a)((a)(b)|(a)(a))))(a)|((b)(((b)(a))(b)|((b)(a))(a))|(a)(((a)(a)|(b)(b))(a)|((b)(b))(b)))(b))(b)|((a)((a)((((a)|(b))((a)|(b)))(a)|((a)(b)|(a)(a))(b))|(b)((b)((b)(a))|(a)((a)(b)|(a)(a))))|(b)(((b)((a)(a)|(b)(b))|(a)((b)(a)))(b)|((a)((b)(a)|(a)(b))|(b)((b)(b)))(a)))(a)))(a))))$/gm;
test(102, inputLines.filter((l) => !!r.exec(l)).length);
test(102, inputLines.filter((l) => !!regex.exec(l)).length);

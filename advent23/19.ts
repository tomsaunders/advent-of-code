#!/usr/bin/env ts-node
/**
 * Advent of Code 2023 - Day 19
 *
 * Summary: Parse instructions and follow them to simulate a branching workflow to good or bad states
 * Escalation: Invert the process - conceive of all possible value combinations that would result in a good state
 * Naive:  N/A
 * Solution:
 *  1.  Build classes to model the state with functions to process the 'rules'.
 *  2.  Add a new 'potential' class that models the min and max of acceptable ranges.
 *      Every branch in the workflow results in a split of this model - one that passes and one that fails this test.
 *      By the end of following all flows, each potential object has reached either a good or bad state.
 *      The score for each is range1 * range2 * range3 * range4.
 *
 * Keywords: Input processing
 * References: N/A
 */
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input19.txt", "utf8");
const test = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

class Rule {
  public justReturn = false;
  public prop?: "x" | "m" | "a" | "s";
  public op?: ">" | "<";
  public val?: number;
  public nextFlow!: string;

  constructor(public rawString: string) {}

  public process(part: Part): boolean | string {
    if (this.justReturn) {
      return this.nextFlow;
    }
    if (this.op === "<" && part[this.prop!] < this.val!) {
      return this.nextFlow;
    } else if (this.op === ">" && part[this.prop!] > this.val!) {
      return this.nextFlow;
    }
    return false;
  }

  public makeFail(part: PotentialPart): void {
    if (this.op === "<") {
      // this is a less than, so set the min to the value
      part[this.prop!] = this.val!;
    } else if (this.op === ">") {
      // greater than , so the max is the value
      part[this.prop!.toUpperCase() as "X" | "M" | "A" | "S"] = this.val!;
    }
  }

  public makePass(part: PotentialPart): void {
    if (this.op === ">") {
      // this a greater than, min is one above value
      part[this.prop!] = this.val! + 1;
    } else if (this.op === "<") {
      // less than , so the max is one less than the value
      part[this.prop!.toUpperCase() as "X" | "M" | "A" | "S"] = this.val! - 1;
    }
  }

  static fromString(ruleStr: string): Rule {
    const r = new Rule(ruleStr);
    if (!ruleStr.includes(":")) {
      r.nextFlow = ruleStr;
      r.justReturn = true;
    } else {
      // a>xxxx:r
      r.prop = ruleStr[0] as any;
      r.op = ruleStr[1] as any;
      const [val, nextFlow] = ruleStr.substring(2).split(":");
      r.val = parseInt(val);
      r.nextFlow = nextFlow;
    }

    return r;
  }
}

class Workflow {
  public rules: Rule[] = [];
  constructor(public name: string, public ruleStr: string) {
    this.rules = ruleStr.split(",").map((r) => Rule.fromString(r));
  }

  public process(part: Part, workflows: Record<string, Workflow>): void {
    // console.log("processing rule", this.name);
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      // console.log(i, rule.rawString);
      const result = rule.process(part);
      if (result === false) {
        continue; // do next rule
      } else if (result === "A" || result === "R") {
        part.state = result;
        // console.log("end state", part);
        return;
      } else if (typeof result === "string") {
        const nextFlow = workflows[result];
        if (!nextFlow) {
          console.log("unable to handle rule", rule, result, part);
        }
        return nextFlow.process(part, workflows);
      }
    }
  }

  public potentialProcess(part: PotentialPart, allParts: PotentialPart[], workflows: Record<string, Workflow>): void {
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      if (rule.justReturn) {
        const result = rule.nextFlow;
        if (result === "A" || result === "R") {
          part.state = result;
          return;
        } else if (result && typeof result === "string") {
          return workflows[result].potentialProcess(part, allParts, workflows);
        }
      } else if (rule.op === "<" || rule.op === ">") {
        // this is a switch. we process with two parts
        // the existing part is altered to fail the rule, a new part is made to match it
        const nu = part.clone();
        allParts.push(nu);
        rule.makeFail(part);
        rule.makePass(nu);
        // the part continues in this loop
        // nu is on a new stack that passes into this new flow
        const nuResult = rule.nextFlow;
        if (nuResult === "A" || nuResult === "R") {
          nu.state = nuResult;
        } else if (nuResult && typeof nuResult === "string") {
          workflows[nuResult].potentialProcess(nu, allParts, workflows);
        }
      }
    }
  }
}

class Part {
  public x: number = 1;
  public m: number = 1;
  public a: number = 1;
  public s: number = 1;
  public state?: "A" | "R";

  public get score(): number {
    return this.x + this.m + this.a + this.s;
  }

  public get isAccepted(): boolean {
    return this.state === "A";
  }

  public toString(): string {
    return `x=${this.x},m=${this.m},a=${this.a},s=${this.s}`;
  }

  static fromLine(line: string): Part {
    const bits = line.replace("{", "").replace("}", "").split(",");
    const p = new Part();
    bits.forEach((b) => {
      const [prop, val] = b.split("=");
      p[prop as "x" | "m" | "a" | "s"] = parseInt(val);
    });
    return p;
  }
}

class PotentialPart extends Part {
  public X: number = 4000;
  public M: number = 4000;
  public A: number = 4000;
  public S: number = 4000;

  public get score(): number {
    return (this.X - this.x + 1) * (this.M - this.m + 1) * (this.A - this.a + 1) * (this.S - this.s + 1);
  }

  public toString(): string {
    return `x=${this.x}-${this.X},m=${this.m}-${this.M},a=${this.a}-${this.A},s=${this.s}-${this.S} ... final state ${this.state} ... score ${this.score}`;
  }

  public clone(): PotentialPart {
    const pp = new PotentialPart();
    pp.x = this.x;
    pp.m = this.m;
    pp.a = this.a;
    pp.s = this.s;
    pp.X = this.X;
    pp.M = this.M;
    pp.A = this.A;
    pp.S = this.S;
    return pp;
  }
}

function parseInput(input: string): [Part[], Record<string, Workflow>] {
  const lines = input.split("\n");
  const workflows: Record<string, Workflow> = {};
  const parts: Part[] = [];
  let split = false;
  lines.forEach((line) => {
    if (!line.trim().length) {
      split = true;
    } else {
      if (split) {
        parts.push(Part.fromLine(line));
      } else {
        const [name, rule] = line.replace("}", "").split("{");
        const w = new Workflow(name, rule);
        workflows[w.name] = w;
      }
    }
  });
  return [parts, workflows];
}

function part1(input: string): number {
  const [parts, workflows] = parseInput(input);
  const inFlow = workflows["in"]!;
  parts.forEach((part) => {
    inFlow.process(part, workflows);
  });

  return arrSum(parts.filter((p) => p.isAccepted).map((p) => p.score));
}

function part2(input: string): number {
  const [parts, workflows] = parseInput(input);
  const inFlow = workflows["in"]!;
  const allParts: PotentialPart[] = [];
  inFlow.potentialProcess(new PotentialPart(), allParts, workflows);

  // console.log(allParts.join("\n"));

  return arrSum(allParts.filter((p) => p.isAccepted).map((p) => p.score));
}

const t = part1(test);
if (t == 19114) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 167409079868000) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}

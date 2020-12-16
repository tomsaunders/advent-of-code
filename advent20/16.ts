#!/usr/bin/env ts-node
import { arrSum, test, arrProd } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input16.txt", "utf8");
const inputOtherTickets = input;
const inputTicket =
  "79,193,53,97,137,179,131,73,191,139,197,181,67,71,211,199,167,61,59,127";
const inputRules = `departure location: 45-309 or 320-962
departure station: 27-873 or 895-952
departure platform: 45-675 or 687-962
departure track: 42-142 or 164-962
departure date: 38-433 or 447-963
departure time: 39-703 or 709-952
arrival location: 34-362 or 383-963
arrival station: 26-921 or 934-954
arrival platform: 38-456 or 480-968
arrival track: 42-295 or 310-956
class: 29-544 or 550-950
duration: 44-725 or 749-963
price: 37-494 or 509-957
route: 25-170 or 179-966
row: 32-789 or 795-955
seat: 29-98 or 122-967
train: 45-403 or 418-956
type: 36-81 or 92-959
wagon: 25-686 or 692-955
zone: 37-338 or 353-960`;

class Rule {
  public position?: number;

  constructor(
    public name: string,
    public r1: number,
    public r2: number,
    public r3: number,
    public r4: number
  ) {}

  public inRange(num: number): boolean {
    const x =
      (num >= this.r1 && num <= this.r2) || (num >= this.r3 && num <= this.r4);
    return x;
  }

  static fromLine(line: string): Rule {
    const bits = line.split(":");
    const [name, rest] = bits;
    const rbits = rest.split(" ");
    const [r1, r2] = rbits[1].split("-").map((x) => parseInt(x, 10));
    const [r3, r4] = rbits[3].split("-").map((x) => parseInt(x, 10));
    return new Rule(name, r1, r2, r3, r4);
  }
}

class Ticket {
  constructor(public values: number[]) {}

  public invalidNumbers(rules: Rule[]): number[] {
    const invalid = [];

    for (const value of this.values) {
      if (!rules.find((r) => r.inRange(value))) {
        invalid.push(value);
      }
    }
    return invalid;
  }

  static fromLine(line: string): Ticket {
    const values = line.split(",").map((x) => parseInt(x, 10));
    return new Ticket(values);
  }
}

function errorCheckRate(ruleString: string, ticketString: string): number {
  const rules = ruleString.split("\n").map((r) => Rule.fromLine(r));
  const tickets = ticketString.split("\n").map((t) => Ticket.fromLine(t));
  const errors = [];
  for (const t of tickets) {
    errors.push(...t.invalidNumbers(rules));
  }
  // console.log(errors);
  return arrSum(errors);
}
test(
  71,
  errorCheckRate(
    `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50`,
    `7,3,47
40,4,50
55,2,20
38,6,12`
  )
);
console.log("Part One", errorCheckRate(inputRules, inputOtherTickets));

function partTwo(
  ruleString: string,
  ticketString: string,
  myTicket: string
): number {
  const rules = ruleString.split("\n").map((r) => Rule.fromLine(r));
  const tickets = ticketString.split("\n").map((t) => Ticket.fromLine(t));
  const validTickets = tickets.filter((t) => !t.invalidNumbers(rules).length);

  const columns: number[][] = [];
  for (const r of rules) columns.push([]);

  validTickets.forEach((t, c) => {
    t.values.forEach((v, pos) => {
      columns[pos].push(v);
    });
  });

  let unassignedRules = rules.filter((r) => r.position === undefined);
  const assignedCols = new Set<number>();
  while (unassignedRules.length) {
    for (const r of unassignedRules) {
      let validCol: number[] = [];
      for (let pos = 0; pos < columns.length; pos++) {
        if (assignedCols.has(pos)) {
          continue;
        }
        const c = columns[pos];
        if (c.every((v) => r.inRange(v))) {
          validCol.push(pos);
        }
      }
      if (validCol.length === 1) {
        r.position = validCol[0];
        assignedCols.add(r.position);
      }
    }
    unassignedRules = rules.filter((r) => r.position === undefined);
  }

  const mine = Ticket.fromLine(myTicket);
  const departure = rules
    .filter((r) => r.name.startsWith("departure"))
    .map((r) => mine.values[r.position!]);
  return arrProd(departure);

  return 0;
}
console.log("Part Two", partTwo(inputRules, inputOtherTickets, inputTicket));

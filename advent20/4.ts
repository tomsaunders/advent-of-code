#!/usr/bin/env ts-node
import * as fs from "fs";
let input = fs.readFileSync("input4.txt", "utf8");

const expected = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const extra = "cid";

const test = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

class Passport {
  public data: Map<string, any>;
  constructor() {
    this.data = new Map<string, any>();
  }

  processLine(line: string): void {
    const bits = line.split(" ").forEach((b) => {
      const [key, val] = b.split(":");
      this.data.set(key, val);
    });
  }

  get isValid(): boolean {
    return expected.every((k) => this.data.has(k));
  }

  get superValid(): boolean {
    const byr = parseInt(this.data.get("byr"), 10);
    const iyr = this.data.get("iyr");
    const eyr = this.data.get("eyr");
    const hgt = this.data.get("hgt");
    const hcl = this.data.get("hcl");
    const ecl = this.data.get("ecl");
    const pid = this.data.get("pid");

    const validEyes = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

    return (
      this.between(byr, 1920, 2002) &&
      this.between(iyr, 2010, 2020) &&
      this.between(eyr, 2020, 2030) &&
      this.hgtValid(hgt) &&
      this.hclValid(hcl) &&
      validEyes.includes(ecl) &&
      pid.length === 9
    );
  }

  between(n: number, a: number, b: number): boolean {
    return !isNaN(n) && n >= a && n <= b;
  }

  hgtValid(h: string): boolean {
    if (h.endsWith("cm") && h.length === 5) {
      const n = parseInt(h.replace("cm", ""), 10);
      return this.between(n, 150, 193);
    } else if (h.endsWith("in") && h.length === 4) {
      const n = parseInt(h.replace("in", ""), 10);
      return this.between(n, 59, 76);
    }
    return false;
  }

  hclValid(h: string): boolean {
    if (h.startsWith("#") && h.length === 7) {
      return parseInt(h.substr(1), 16) !== NaN;
    }
    return false;
  }
}

function countValid(input: string): number {
  const passports = [];
  let current = new Passport();
  for (const line of input.split("\n")) {
    const l = line.trim();
    if (l) {
      current.processLine(l);
    } else {
      passports.push(current);
      current = new Passport();
    }
  }
  passports.push(current);
  console.log("Found ", passports.length);
  return passports.filter((p) => p.isValid).length;
}

function countValid2(input: string): number {
  const passports = [];
  let current = new Passport();
  for (const line of input.split("\n")) {
    const l = line.trim();
    if (l) {
      current.processLine(l);
    } else {
      passports.push(current);
      current = new Passport();
    }
  }
  passports.push(current);
  return passports.filter((p) => p.isValid).filter((p) => p.superValid).length;
}

console.log("Test", countValid(test));
console.log("Part 1", countValid(input));

console.log(
  "Test",
  countValid2(`eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`)
);

console.log(
  "Test2",
  countValid2(`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`)
);

console.log("Part 2", countValid2(input));

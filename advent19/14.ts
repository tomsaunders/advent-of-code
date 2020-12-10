#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input14.txt", "utf8") as string;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

class Chemical {
  public qty: number;
  public name: string;
  constructor(input: string) {
    const bits = input.split(" ");
    this.qty = parseInt(bits[0]);
    this.name = bits[1];
  }
}

class Formula {
  public name: string;
  public qty: number;
  public source: Map<string, number>;

  constructor(input: string) {
    const bits = input.split(" => ");
    this.source = new Map<string, number>();
    bits[0]
      .split(", ")
      .map((c) => new Chemical(c))
      .forEach((c) => this.source.set(c.name, c.qty));
    const result = new Chemical(bits[1]);
    this.name = result.name;
    this.qty = result.qty;
  }
}

function fuel(input: string): number {
  const lines = input.split("\n");
  const formulae = lines.map((l) => new Formula(l));
  const lookup = new Map<string, Formula>();
  const surplus = new Map<string, number>();
  formulae.forEach((f) => {
    surplus.set(f.name, 0);
    lookup.set(f.name, f);
  });

  const fuelResult = lookup.get("FUEL") as Formula;
  let fSource = fuelResult.source;

  let x = 0;
  while (fSource.size !== 1 || !fSource.has("ORE")) {
    const chemicals = Array.from(fSource.keys());
    for (const chem of chemicals) {
      if (chem !== "ORE") {
        const chemForm = lookup.get(chem) as Formula;
        let fetch = fSource.get(chem) as number;
        let inSurplus = surplus.get(chem) as number;

        if (inSurplus >= fetch) {
          fetch = 0;
          inSurplus -= fetch;
        } else {
          fetch -= inSurplus;

          const mul = Math.ceil(fetch / chemForm.qty);
          const chemMade = mul * chemForm.qty;

          inSurplus = chemMade - fetch;
          // console.log(`Made ${chemMade} seeking ${fetch} of ${chem} - surplus now ${inSurplus}`);

          for (const key of chemForm.source.keys()) {
            const chemQty = chemForm.source.get(key) as number;
            const curr = (fSource.get(key) as number) || 0;
            fSource.set(key, curr + chemQty * mul);
            // console.log(`${key} now at `, curr + chemQty * mul);
          }
        }
        surplus.set(chem, inSurplus);
        fSource.delete(chem);
      }
    }
  }
  return fSource.get("ORE") as number;
}

const test1a = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`;

const test1b = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`;

const test1c = `157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`;

const test1d = `2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`;

const test1e = `171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`;

test(31, fuel(test1a));
test(165, fuel(test1b));
test(13312, fuel(test1c));
test(180697, fuel(test1d));
test(2210736, fuel(test1e));
console.log("Part 1 answer:", fuel(input));

// part 2
console.log("\nPart 2");
function trillionaire(input: string): number {
  const trillion = 1000000000000;
  const lines = input.split("\n");
  const formulae = lines.map((l) => new Formula(l));
  const lookup = new Map<string, Formula>();
  const surplusMaster = new Map<string, number>();
  formulae.forEach((f) => {
    surplusMaster.set(f.name, 0);
    lookup.set(f.name, f);
  });

  const fuelResult = lookup.get("FUEL") as Formula;

  const singleCost = fuel(input);

  let lower = Math.ceil(trillion / singleCost);
  let upper = lower * 2;
  // console.log("single cost", singleCost, "trying", lower, "and", upper);

  while (lower !== upper) {
    const mul = Math.round(lower + (upper - lower) / 2);
    // console.log("Trying", mul);

    let fSource = new Map(fuelResult.source);
    const surplus = new Map(surplusMaster);
    for (const key of fSource.keys()) {
      const chemQty = fSource.get(key) as number;
      const curr = (fSource.get(key) as number) || 0;
      fSource.set(key, curr + chemQty * mul);
      // console.log(`${key} now at `, curr + chemQty * mul);
    }
    while (fSource.size !== 1 || !fSource.has("ORE")) {
      const chemicals = Array.from(fSource.keys());
      for (const chem of chemicals) {
        if (chem !== "ORE") {
          const chemForm = lookup.get(chem) as Formula;
          let fetch = fSource.get(chem) as number;
          let inSurplus = surplus.get(chem) as number;

          if (inSurplus >= fetch) {
            fetch = 0;
            inSurplus -= fetch;
          } else {
            fetch -= inSurplus;

            const mul = Math.ceil(fetch / chemForm.qty);
            const chemMade = mul * chemForm.qty;

            inSurplus = chemMade - fetch;
            // console.log(`Made ${chemMade} seeking ${fetch} of ${chem} - surplus now ${inSurplus}`);

            for (const key of chemForm.source.keys()) {
              const chemQty = chemForm.source.get(key) as number;
              const curr = (fSource.get(key) as number) || 0;
              fSource.set(key, curr + chemQty * mul);
              // console.log(`${key} now at `, curr + chemQty * mul);
            }
          }
          surplus.set(chem, inSurplus);
          fSource.delete(chem);
        }
      }
    }
    const ore = fSource.get("ORE") as number;
    const ratio = trillion / ore;
    if (ore < trillion) {
      lower = mul;
    } else {
      upper = mul - 1;
    }
  }
  return lower + 1;
}

test(82892753, trillionaire(test1c));
test(5586022, trillionaire(test1d));
test(460664, trillionaire(test1e));
console.log("Answer:", trillionaire(input));

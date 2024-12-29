#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 24
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input24.txt", "utf8");
const test = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`;

const test2 = `x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00`;

type WireValue = 0 | 1 | null;
type WireValues = Record<string, WireValue>;
type Op = "XOR" | "OR" | "AND";
type Calc = {
  a: string;
  op: Op;
  b: string;
  output: string;
};

function parseInput(input: string): { wires: WireValues; calcs: Calc[] } {
  const calcs: Calc[] = [];
  const wires: WireValues = {};
  input.split("\n").forEach((line) => {
    const bits = line.split(" ");
    if (line.includes(":")) {
      const id = bits[0].replace(":", "");
      wires[id] = parseInt(bits[1]) as 0 | 1;
    }
    if (line.includes("->")) {
      const [a, op, b, x, output] = bits;
      calcs.push({ a, b, op: op as Op, output });
    }
  });

  return { wires, calcs };
}

function getKeys(wires: WireValues, start: string): string[] {
  return Object.keys(wires)
    .filter((k) => k.startsWith(start))
    .sort();
}

function getBinary(wires: WireValues, start: string): string {
  return getKeys(wires, start)
    .map((z) => wires[z]?.toString())
    .reverse()
    .join("");
}

function part1(input: string): number {
  const { wires, calcs } = parseInput(input);

  const has = (k: string): boolean => {
    return wires[k] === 0 || wires[k] === 1;
  };

  while (calcs.length) {
    const { a, b, op, output } = calcs.shift()!;
    if (has(a) && has(b)) {
      if (op === "AND") {
        wires[output] = wires[a] && wires[b];
      } else if (op === "OR") {
        wires[output] = wires[a] || wires[b];
      } else {
        wires[output] = wires[a] !== wires[b] ? 1 : 0;
      }
    } else {
      calcs.push({ a, b, op, output });
    }
  }
  const zBinary = getBinary(wires, "z");
  return parseInt(zBinary, 2);
}

function part2(input: string): string {
  // val (gates, registers) = parse(input)
  const { wires, calcs } = parseInput(input);

  //       val nxz = gates.filter { it.c.first() == 'z' && it.c != "z45" && it.op != Operation.XOR }
  //       val xnz = gates.filter { it.a.first() !in "xy" && it.b.first() !in "xy" && it.c.first() != 'z' && it.op == Operation.XOR }

  const nxz = calcs.filter(
    (c) => c.output.startsWith("z") && c.output !== "z45" && c.op !== "XOR",
  );
  const xnz = calcs.filter(
    (c) =>
      !["x", "y"].includes(c.a[0]) &&
      !["x", "y"].includes(c.b[0]) &&
      !c.output.startsWith("z") &&
      c.op == "XOR",
  );

  //   private fun List<Gate>.firstZThatUsesC(c: String): String? {
  //     val x = filter { it.a == c || it.b == c }
  //     x.find { it.c.startsWith('z') }?.let { return "z" + (it.c.drop(1).toInt() - 1).toString().padStart(2, '0') }
  //     return x.firstNotNullOfOrNull { firstZThatUsesC(it.c) }
  // }
  function firstZThatUses(output: string): string {
    const zKeys = calcs
      .filter((c) => c.output.startsWith("z"))
      .map((c) => c.output)
      .sort();
    for (let i = 0; i < zKeys.length; i++) {
      const z = zKeys[i];
      // console.log("\nz", z);
      const related = new Set<string>();
      const lookup = [z];
      while (lookup.length) {
        const look = lookup.shift()!;
        calcs.forEach((c) => {
          if (c.output === look) {
            related.add(c.a);
            related.add(c.b);
            lookup.push(c.a, c.b);
          }
        });
      }
      if (related.has(output)) {
        console.log("first z using ", output, "is", z);
        return "z" + (parseInt(z.substring(1)) - 1).toString().padStart(2, "0");
      }
    }

    return "";
  }

  //       for (i in xnz) {
  //           val b = nxz.first { it.c == gates.firstZThatUsesC(i.c) }
  //           val temp = i.c
  //           i.c = b.c
  //           b.c = temp
  //       }

  xnz.forEach((c) => {
    const other = nxz.find((cc) => cc.output === firstZThatUses(c.output))!;
    // if (!other) {
    //   console.log("couldnt find", c);
    // }
    const tmp = c.output;
    c.output = other.output;
    other.output = tmp;
  });

  const xBinary = getBinary(wires, "x");
  const yBinary = getBinary(wires, "y");
  const xNum = parseInt(xBinary, 2);
  const yNum = parseInt(yBinary, 2);
  const has = (k: string): boolean => {
    return wires[k] === 0 || wires[k] === 1;
  };

  const backupCalcs = calcs.slice(0);
  while (calcs.length) {
    const { a, b, op, output } = calcs.shift()!;
    if (has(a) && has(b)) {
      if (op === "AND") {
        wires[output] = wires[a] && wires[b];
      } else if (op === "OR") {
        wires[output] = wires[a] || wires[b];
      } else {
        wires[output] = wires[a] !== wires[b] ? 1 : 0;
      }
    } else {
      calcs.push({ a, b, op, output });
    }
  }
  const zBinary = getBinary(wires, "z");
  const zNum = parseInt(zBinary, 2);

  const expected = xNum + yNum;
  const expectedBinary = expected.toString(2);

  console.log("x", xBinary);
  console.log("y", yBinary);
  console.log("z", zBinary);
  console.log("a", expectedBinary);
  console.log("^", (zNum ^ expected).toString(2));

  const falseCarry = (zNum ^ expected).toString(2);
  const falseCarryCount = falseCarry.length - 1;
  console.log("carrycount", falseCarryCount);

  //       val falseCarry = (getWiresAsLong(registers, 'x') + getWiresAsLong(registers, 'y') xor run(gates, registers)).countTrailingZeroBits().toString()

  const falseCarryCalcs = backupCalcs.filter(
    (c) =>
      c.a.endsWith(falseCarryCount.toString()) &&
      c.b.endsWith(falseCarryCount.toString()),
  );
  console.log();
  const swaps = nxz.concat(xnz, falseCarryCalcs);
  return swaps
    .map((c) => c.output)
    .sort()
    .join(",");
}

const t = part1(test);
if (t == 2024) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
console.log("part 2 answer", part2(input));

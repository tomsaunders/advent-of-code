#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input16.txt", "utf8");

function pad(str: string): string {
  while (str.length < 4) {
    str = `0${str}`;
  }
  return str;
}

class Packet {
  public length: number = 6;
  public subPackets: Packet[] = [];
  constructor(public version: number, binary: string) {}

  public get versionSum(): number {
    return this.subPackets.reduce(
      (carry, sub) => (carry += sub.versionSum),
      this.version
    );
  }

  public get value(): number {
    return 0;
  }

  public static parseHex(hex: string): Packet {
    let binary = "";
    for (let i = 0; i < hex.length; i++) {
      binary += pad(parseInt(hex[i], 16).toString(2));
    }
    return Packet.parse(binary);
  }

  public static parse(binary: string): Packet {
    const version = parseInt(binary.substr(0, 3), 2);
    const type = parseInt(binary.substr(3, 3), 2);
    let rest = binary.substr(6);

    if (type === 4) {
      // literal
      const l = new LiteralPacket(version, rest);
      return l;
    } else {
      const p = new OperatorPacket(version, rest, type);
      // operator
      const lengthType = rest[0];
      if (lengthType === "0") {
        const bitLength = parseInt(rest.substr(1, 15), 2);
        rest = rest.substr(16, bitLength);
        p.length += 16;
        while (rest.length) {
          const sub = Packet.parse(rest);
          p.subPackets.push(sub);
          rest = rest.substr(sub.length);
          p.length += sub.length;
        }
      } else if (lengthType === "1") {
        const numPackets = parseInt(rest.substr(1, 11), 2);
        rest = rest.substr(12);
        p.length += 12;
        while (p.subPackets.length < numPackets && rest.length) {
          const sub = Packet.parse(rest);
          p.subPackets.push(sub);
          rest = rest.substr(sub.length);
          p.length += sub.length;
        }
      } else {
        console.warn("Unknown length!", lengthType);
      }
      return p;
    }
    return new Packet(version, rest);
  }
}

class OperatorPacket extends Packet {
  constructor(public version: number, binary: string, public type: number) {
    super(version, binary);
  }

  public get value(): number {
    let a: Packet;
    let b: Packet;
    switch (this.type) {
      case 0: // sum
        return this.subPackets.reduce((carry, p) => (carry += p.value), 0);
      case 1: // product
        return this.subPackets.reduce((carry, p) => (carry *= p.value), 1);
      case 2: // min
        return Math.min(...this.subPackets.map((p) => p.value));
      case 3: // max
        return Math.max(...this.subPackets.map((p) => p.value));
      case 5: // greater than
        [a, b] = this.subPackets;
        return a.value > b.value ? 1 : 0;
      case 6: // less than
        [a, b] = this.subPackets;
        return a.value < b.value ? 1 : 0;
      case 7: // equal
        [a, b] = this.subPackets;
        return a.value === b.value ? 1 : 0;
    }
    return 99;
  }
}

class LiteralPacket extends Packet {
  public val: number;

  constructor(public version: number, binary: string) {
    super(version, binary);
    let num: string = "";

    for (let i = 0; i < binary.length; i += 5) {
      this.length += 5;
      if (binary[i] === "1") {
        // ongoing
        num += binary.substr(i + 1, 4);
      } else if (binary[i] === "0") {
        num += binary.substr(i + 1, 4);
        i += Infinity;
      }
    }
    this.val = parseInt(num, 2);
  }

  public get value(): number {
    return this.val;
  }
}

function part1(input: string): number {
  const packet = Packet.parseHex(input);
  return packet.versionSum;
}

part1("D2FE28");
part1("38006F45291200");
part1("EE00D40C823060");
const t1 = part1("8A004A801A8002F478");
const t2 = part1("620080001611562C8802118E34");
const t3 = part1("C0015000016115A2E0802F182340");
const t4 = part1("A0016C880162017C3686B18A3D4780");
if (t1 === 16 && t2 === 12 && t3 === 23 && t4 === 31) {
  console.log("Part 1: ", part1(input));
  const r1 = part2("C200B40A82");
  const r2 = part2("04005AC33890");
  const r3 = part2("880086C3E88112");
  const r4 = part2("CE00C43D881120");
  const r5 = part2("D8005AC2A8F0");
  const r6 = part2("F600BC2D8F");
  const r7 = part2("9C005AC2F8F0");
  const r8 = part2("9C0141080250320F1802104A08");
  if (
    r1 === 3 &&
    r2 === 54 &&
    r3 === 7 &&
    r4 === 9 &&
    r5 === 1 &&
    r6 === 0 &&
    r7 === 0 &&
    r8 === 1
  ) {
    console.log("Part 2: ", part2(input));
  } else {
    console.log("Test2 fail: ", r1, r2, r3, r4, r5, r6, r7, r8);
  }
} else {
  console.log("Test fail: ", t1, t2, t3, t4);
}

function part2(input: string): number {
  const packet = Packet.parseHex(input);
  return packet.value;
}

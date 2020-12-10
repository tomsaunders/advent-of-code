#!/usr/bin/env ts-node
import * as fs from "fs";
import { IntcodeProcessor } from "./intcode";
const input = fs.readFileSync("input23.txt", "utf8") as string;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

function part1(codes: number[]): number {
  const nics: IntcodeProcessor[] = [];
  for (let n = 0; n < 50; n++) {
    const nic = new IntcodeProcessor(codes.slice(0));
    nic.input.push(n);
    nics.push(nic);
  }

  let y255: number = 0;
  let nx = 0;
  while (!y255) {
    for (let n = 0; n < 50; n++) {
      const nic = nics[n];
      nic.step();
      nx++;
      if (nic.output.length === 3) {
        const y = nic.output.pop() as number;
        const x = nic.output.pop() as number;
        const a = nic.output.pop() as number;
        if (a === 255) {
          y255 = y;
        } else {
          const d = nics[a];
          d.input.push(x);
          d.input.push(y);
        }
      }
    }
  }

  return y255;
}

const codes = input.split(",").map((s) => parseInt(s, 10));
console.log("Part 1", part1(codes.slice(0)));
console.log("Part 2", part2(codes.slice(0)));

function part2(codes: number[]): number {
  const nics: IntcodeProcessor[] = [];
  for (let n = 0; n < 50; n++) {
    const nic = new IntcodeProcessor(codes.slice(0));
    nic.input.push(n);
    nics.push(nic);
  }

  let natX = 0;
  let natY = 0;
  let delY = 0;

  while (1) {
    for (let n = 0; n < 50; n++) {
      const nic = nics[n];
      nic.step();
      if (nic.output.length === 3) {
        const y = nic.output.pop() as number;
        const x = nic.output.pop() as number;
        const a = nic.output.pop() as number;
        if (a === 255) {
          natX = x;
          natY = y;
          let idle = true;
          for (let nn = 0; nn < 50; nn++) {
            const nic2 = nics[nn];
            // console.log(nn, nic2.input.length);
            if (nic2.input.length !== 0) {
              idle = false;
            }
          }
          if (idle) {
            if (delY === natY) {
              return natY;
            }
            nics[0].input.push(natX);
            nics[0].input.push(natY);
            console.log("NAT sending", natX, natY, "to", 0);
            delY = natY;
          }
        } else {
          const d = nics[a];
          d.input.push(x);
          d.input.push(y);
          console.log(n, "sending", x, y, "to", a);
        }
      }
    }
  }

  return 99;
}

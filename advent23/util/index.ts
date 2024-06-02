export { Grid } from "./grid";
import { Cell } from "./cell";
export { Cell } from "./cell";

export const WALL: string = "#";
export const SPACE: string = ".";
export const ON: string = "#";
export const OFF: string = ".";

export const RED: string = "\x1b[31m";
export const GREEN: string = "\x1b[32m";
export const YELLOW: string = "\x1b[33m";
export const PURP: string = "\x1b[35m";
export const WHITE: string = "\x1b[37m";
export const RESET: string = "\x1b[0m";

export function test(a: any, b: any): void {
  const o =
    a == b
      ? `${GREEN}Test pass = ${a}${RESET}`
      : `${RED}!!Test fail got ${b} wanted ${a}${RESET}`;
  console.log(o);
}

export function arrSum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function arrProd(arr: number[]): number {
  return arr.reduce((a, b) => a * b, 1);
}

export function getStringGroups(input: string): string[][] {
  let groups: string[][] = [];
  let group: string[] = [];

  for (const line of input.split("\n")) {
    const l = line.trim();
    if (l) {
      group.push(l);
    } else {
      groups.push(group);
      group = [];
    }
  }
  if (group.length) {
    groups.push(group);
  }

  return groups;
}

// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
export function isNumeric(str: string | undefined): boolean {
  if (typeof str != "string") return false; // we only process strings!
  return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export function mapNum(str: string): number {
  return parseInt(str, 10);
}

export { Grid } from "./grid";
export { Cell } from "./cell";

export type Direction = "North" | "East" | "South" | "West" | "n" | "e" | "s" | "w";
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
  const o = a == b ? `${GREEN}Test pass = ${a}${RESET}` : `${RED}!!Test fail got ${b} wanted ${a}${RESET}`;
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

// https://stackoverflow.com/a/3154503
export function lcm(arr: number[]): number {
  return arr.reduce((acc, n) => (acc * n) / gcd(acc, n));
}

export function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

export function lineToNumbers(line: string): number[] {
  return line.match(/([\-\d]+)/g)?.map(mapNum) as number[];
}

// https://en.wikipedia.org/wiki/Shoelace_formula
export type XYCoord = [number, number];
export function perimeter(coordinates: XYCoord[]): number {
  let perimeter = 0;
  for (let i = 1; i < coordinates.length; i++) {
    let j = i - 1;
    const [jx, jy] = coordinates[j];
    const [ix, iy] = coordinates[i];
    // assuming right angle grid lines and only one coordinate actually changing at a time that is
    perimeter += Math.abs(iy - jy) + Math.abs(ix - jx);
  }
  return perimeter;
}

export function shoelaceArea(coordinates: XYCoord[]): number {
  let area = 0;
  for (let i = 1; i < coordinates.length; i++) {
    let j = i - 1;
    const [jx, jy] = coordinates[j];
    const [ix, iy] = coordinates[i];
    // shoelace is jx * iy - jy*ix
    area += jx * iy - jy * ix;
  }
  return Math.abs(area / 2);
}

export function picksTheoremArea(interiorPoints: number, boundaryPoints: number): number {
  return interiorPoints + boundaryPoints / 2 - 1;
}

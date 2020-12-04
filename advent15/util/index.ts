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

export type PathStep = [Cell, number];

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

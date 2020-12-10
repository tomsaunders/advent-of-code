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

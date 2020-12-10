#!/usr/bin/env ts-node
const input = 3018458;
function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

class Elf {
  public next?: Elf;
  public prev?: Elf;
  public constructor(public idx: number) {}
  public remove() {
    this.prev!.next = this.next;
    this.next!.prev = this.prev;
  }
}

function makeCircle(count: number): Elf[] {
  let idx = 1;
  const circle: Elf[] = [new Elf(idx)];

  let last = circle[0];
  while (idx < count) {
    idx++;
    const e = new Elf(idx);
    last.next = e;
    e.prev = last;
    last = e;
    circle.push(e);
  }
  last.next = circle[0];
  circle[0].prev = last;
  return circle;
}

function elephant(count: number): number {
  const circle = makeCircle(count);
  let current = circle[0];
  while (current !== current.next) {
    if (current.next) {
      current.next.remove();
      current = current.next;
    }
  }

  return current.idx;
}

function across(count: number): number {
  let w: number = 1;
  for (let i = 1; i < count; i++) {
    w = (w % i) + 1;
    if (w > (i + 1) / 2) {
      w++;
    }
  }
  return w;
}

test(3, elephant(5));
console.log("Answer:", elephant(input));
console.log("\nPart 2\n");
test(2, across(5));
console.log("Answer:", across(input));

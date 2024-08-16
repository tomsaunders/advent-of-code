#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 9
 *
 * Summary: Insert items in an array ~70 thousand times to simulate an elf marble game. A scoring event happens every 23 marbles, get the highest player score.
 * Escalation: Insert 7 million times.
 * Solution: Implement each marble placement as a node in a doubly linked list.
 *
 * Keywords: LinkedList
 * References: N/A
 */

class Node {
  public prev!: Node;
  public next!: Node;
  public constructor(public value: number) {}

  public step(count: number): Node {
    let n: Node = this;
    let i = 0;
    if (count > 0) {
      while (i < count) {
        i++;
        n = n.next;
      }
    } else {
      while (count < i) {
        count++;
        n = n.prev;
      }
    }
    return n;
  }

  public append(value: number): Node {
    const n = new Node(value);
    n.next = this.next;
    n.prev = this;
    this.next.prev = n;
    this.next = n;
    return n;
  }

  public remove(): Node {
    this.prev.next = this.next;
    this.next.prev = this.prev;
    return this;
  }
}

function marbleGame(playerCount: number, lastMarble: number): number {
  const players: number[] = new Array(playerCount).fill(0);
  let marble = 0;

  let current = new Node(marble++);
  current.next = current.prev = current;

  while (marble <= lastMarble) {
    if (marble % 23 === 0) {
      const playerIdx = marble % playerCount;
      const minusSeven = current.step(-7).remove();
      players[playerIdx] += marble + minusSeven.value;
      current = minusSeven.next;
    } else {
      const next = current.next;
      current = next.append(marble);
    }
    marble++;
  }

  return Math.max(...players);
}

if (marbleGame(9, 25) === 32 && marbleGame(10, 1618) === 8317) {
  console.log("part 1 answer", marbleGame(438, 71626));
  console.log("part 2 answer", marbleGame(438, 7162600));
} else {
  console.log("part 1 test fail", marbleGame(9, 25), marbleGame(10, 1618));
}

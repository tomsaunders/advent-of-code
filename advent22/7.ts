#!/usr/bin/env ts-node
import * as fs from "fs";
import { arrSum } from "./util";
const input = fs.readFileSync("input7.txt", "utf8");
const test = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

class FileDir {
  public parent?: FileDir;
  public children: Record<string, FileDir> = {};

  constructor(public path: string, public thisSize: number = 0) {}

  public getSize(): number {
    return (
      this.thisSize ||
      Object.values(this.children).reduce((p, c) => p + c.getSize(), 0)
    );
  }

  public getDirSize(): number {
    if (this.thisSize) return 0;
    return this.getSize();
  }

  public add(line: string): FileDir {
    const [cmd, name] = line.split(" ");
    const dir = new FileDir(`${this.path}/${name}`);
    if (cmd === "dir") {
    } else {
      dir.thisSize = parseInt(cmd, 10);
    }
    this.children[name] = dir;
    dir.parent = this;
    return dir;
  }

  public cd(path: string): FileDir {
    if (path === ".." && this.parent) {
      return this.parent;
    }
    return this.children[path];
  }
}

function parse(input: string): Record<string, FileDir> {
  const lines = input.split("\n");
  const root = new FileDir("/");
  let curr: FileDir = root;
  const flat: Record<string, FileDir> = {
    "/": root,
  };
  lines.forEach((line) => {
    if (line.startsWith("$")) {
      if (line === "$ ls") {
        // await results
      } else if (line === "$ cd /") {
        curr = root;
      } else if (line.startsWith("$ cd")) {
        const cd = line.replace("$ cd ", "");
        curr = curr.cd(cd);
      }
    } else {
      const newt = curr.add(line);
      flat[newt.path] = newt;
    }
  });

  return flat;
}

function part1(input: string): number {
  const flat = parse(input);
  let sum = 0;
  Object.values(flat).forEach((d) => {
    const size = d.getDirSize();
    if (size <= 100000) {
      sum += size;
    }
  });
  return sum;
}

function part2(input: string): number {
  const flat = parse(input);
  const root = flat["/"];
  const unused = 70000000 - root.getSize();
  const remove = 30000000 - unused;

  const above: number[] = []; // above size
  Object.values(flat).forEach((d) => {
    const size = d.getDirSize();
    if (size > remove) {
      above.push(size);
    }
  });
  return Math.min(...above);
}

console.log("part1");
console.log(part1(test));
console.log(part1(input));
console.log("part2");
console.log(part2(test));
console.log(part2(input));

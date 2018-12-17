import { Cell } from "./cell";
import { isArray } from "util";

export class Path {
  public array: Cell[];

  public constructor(param: Cell | Cell[]) {
    if (isArray(param)) {
      this.array = param;
    } else {
      this.array = [param];
    }
  }

  public before(step: Cell) {
    this.array.unshift(step);
  }

  public step(step: Cell) {
    const newArray = this.array.concat([step]);
    return new Path(newArray);
  }

  public first(): Cell {
    return this.array[1];
  }

  public end(): Cell {
    return this.array[this.array.length - 1];
  }

  public dist(): number {
    return this.array.length;
  }
}

export class FakePath {
  public constructor(private fakeDist: number) {}
  public dist(): number {
    return this.fakeDist;
  }
}

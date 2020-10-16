#!/usr/bin/env npx ts-node
const input = `Frosting: capacity 4, durability -2, flavor 0, texture 0, calories 5
Candy: capacity 0, durability 5, flavor -1, texture 0, calories 8
Butterscotch: capacity -1, durability 0, flavor 5, texture 0, calories 6
Sugar: capacity 0, durability 0, flavor -2, texture 2, calories 1`;

const input1 = `Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`;

function test(a: any, b: any): void {
  const o = a == b ? `Test pass = ${a}` : `!!Test fail got ${b} wanted ${a}`;
  console.log(o);
}

class Ingredient {
  public name: string;
  public capacity: number;
  public durability: number;
  public flavor: number;
  public texture: number;
  public calories: number;
  public mul: number = 0;

  constructor(line: string) {
    const bits = line.replace(":", "").split(" ");
    this.name = bits[0];
    this.capacity = parseInt(bits[2], 10);
    this.durability = parseInt(bits[4], 10);
    this.flavor = parseInt(bits[6], 10);
    this.texture = parseInt(bits[8], 10);
    this.calories = parseInt(bits[10], 10);
  }
}

function permute(finished: any[][], size: number, rem: number, progress: number[]): void {
  if (progress.length === size - 1) {
    finished.push(progress.concat(rem));
    return;
  }
  for (let i = 0; i <= rem; i++) {
    const branch = [...progress, i];
    permute(finished, size, rem - i, branch);
  }
}
function permutations(size: number, limit: number): number[][] {
  const all: any[][] = [];
  permute(all, size, limit, []);

  return all;
}

function bestRecipe(input: string, calorieTarget?: number): number {
  const ingredients = input.split("\n").map(l => new Ingredient(l));
  const perms = permutations(ingredients.length, 100);
  let max = 0;
  for (const perm of perms) {
    let capacity = 0,
      durability = 0,
      flavor = 0,
      texture = 0,
      calories = 0;
    for (let i = 0; i < ingredients.length; i++) {
      capacity += ingredients[i].capacity * perm[i];
      durability += ingredients[i].durability * perm[i];
      flavor += ingredients[i].flavor * perm[i];
      texture += ingredients[i].texture * perm[i];
      calories += ingredients[i].calories * perm[i];
    }
    const score = Math.min(capacity, durability, flavor, texture) < 1 ? 0 : capacity * durability * flavor * texture;
    if (!calorieTarget || calories === calorieTarget) {
      max = Math.max(max, score);
    }
  }
  return max;
}

test(62842880, bestRecipe(input1));
console.log("Part One:", bestRecipe(input));
test(57600000, bestRecipe(input1, 500));
console.log("Part Two:", bestRecipe(input, 500));

#!/usr/bin/env ts-node
import { arrSum, test, arrProd, Grid, Cell } from "./util";
import * as fs from "fs";
let input = fs.readFileSync("input21.txt", "utf8");
const foodLines = input.split("\n");

class Food {
  public static allIngredients = new Set<string>();
  public static allAllergies = new Set<string>();

  public ingredients = new Set<string>();
  public allergens = new Set<string>();

  public hasAllergy(a: string): boolean {
    return this.allergens.has(a);
  }

  public hasIngredient(i: string): boolean {
    return this.ingredients.has(i);
  }

  public filterIngredientOptions(options: string[]): string[] {
    return options.filter((i) => this.hasIngredient(i));
  }

  static fromLine(line: string): Food {
    const food = new Food();

    let [ingredientBits, allergyBits] = line.split(" (contains ");
    allergyBits = allergyBits.replace(")", "");
    for (let i of ingredientBits.split(" ")) {
      food.ingredients.add(i.trim());
      Food.allIngredients.add(i.trim());
    }
    for (const a of allergyBits.split(", ")) {
      food.allergens.add(a.trim());
      Food.allAllergies.add(a.trim());
    }

    return food;
  }
}

const foods = foodLines.map((l) => Food.fromLine(l));
const allergyIngredient: { [key: string]: string } = {};
const allergyOptions = new Map<string, string[]>();

// find options for each allergy
for (const a of Array.from(Food.allAllergies.values())) {
  let ingredientOptions = Array.from(Food.allIngredients);
  for (const f of foods) {
    if (f.hasAllergy(a)) {
      ingredientOptions = f.filterIngredientOptions(ingredientOptions);
    }
  }
  allergyOptions.set(a, ingredientOptions);
}

// filter down to one ingredient for each allergy
while (Object.keys(allergyIngredient).length < 8) {
  const usedIngredients = Object.values(allergyIngredient);
  const remainingAllergies = Array.from(allergyOptions.keys());
  for (const a of remainingAllergies) {
    const availableIngredients = allergyOptions
      .get(a)
      ?.filter((i) => !usedIngredients.includes(i));
    if (availableIngredients?.length === 1) {
      allergyOptions.delete(a);
      allergyIngredient[a] = availableIngredients.pop() as string;
    }
  }
}

const usedIngredients = Object.values(allergyIngredient);
const nonAllergens = Array.from(Food.allIngredients.values()).filter(
  (i) => !usedIngredients.includes(i)
);

console.log(
  "Part 1",
  arrSum(
    foods.map((f) =>
      arrSum(nonAllergens.map((i) => (f.hasIngredient(i) ? 1 : 0)))
    )
  )
);
console.log(
  "Part 2",
  Object.keys(allergyIngredient)
    .sort()
    .map((a) => allergyIngredient[a])
    .join(",")
);

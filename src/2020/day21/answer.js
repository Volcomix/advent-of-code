import { readFile } from '../../file-helper.js'

async function part1() {
  const input = await readFile()
  const foods = input
    .split('\n')
    .map((line) => line.match(/^(.*) \(contains (.*)\)$/))
    .map(([_, ingredients, allergens]) => ({
      ingredients: ingredients.split(' '),
      allergens: allergens.split(', '),
    }))

  /** @type {Map<string, string[]>} */
  const allergensMap = new Map()

  for (const food of foods) {
    for (const allergen of food.allergens) {
      if (allergensMap.has(allergen)) {
        const allergenIngredients = new Set(food.ingredients)
        allergensMap.set(
          allergen,
          allergensMap
            .get(allergen)
            .filter((ingredient) => allergenIngredients.has(ingredient)),
        )
      } else {
        allergensMap.set(allergen, food.ingredients)
      }
    }
  }

  const ingredientsWithAllergen = new Set([...allergensMap.values()].flat())
  const ingredientsWithoutAllergen = foods
    .flatMap((food) => food.ingredients)
    .filter((ingredient) => !ingredientsWithAllergen.has(ingredient))

  console.log('Part 1:', ingredientsWithoutAllergen.length)
}

part1()

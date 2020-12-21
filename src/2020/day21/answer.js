import { readFile } from '../../file-helper.js'

async function main() {
  const input = await readFile()
  const foods = input
    .split('\n')
    .map((line) => line.match(/^(.*) \(contains (.*)\)$/))
    .map(([_, ingredients, allergens]) => ({
      ingredients: ingredients.split(' '),
      allergens: allergens.split(', '),
    }))

  /** @type {Map<string, Set<string>>} */
  const allergensMap = new Map()

  for (const food of foods) {
    for (const allergen of food.allergens) {
      const newAllergenIngredients = new Set(food.ingredients)
      if (allergensMap.has(allergen)) {
        allergensMap.set(
          allergen,
          new Set(
            [...allergensMap.get(allergen)].filter((ingredient) =>
              newAllergenIngredients.has(ingredient),
            ),
          ),
        )
      } else {
        allergensMap.set(allergen, newAllergenIngredients)
      }
    }
  }

  const ingredientsWithAllergen = new Set(
    [...allergensMap.values()].flatMap((ingredients) => [...ingredients]),
  )
  const ingredientsWithoutAllergen = foods
    .flatMap((food) => food.ingredients)
    .filter((ingredient) => !ingredientsWithAllergen.has(ingredient))

  console.log('Part 1:', ingredientsWithoutAllergen.length)

  /** @type {Map<string, string>} */
  const ingredientsMap = new Map()

  while (allergensMap.size) {
    const [allergen, ingredients] = [...allergensMap].find(
      ([_, ingredients]) => ingredients.size === 1,
    )
    const ingredient = ingredients.values().next().value
    ingredientsMap.set(ingredient, allergen)
    allergensMap.delete(allergen)
    for (const [_, ingredients] of allergensMap) {
      ingredients.delete(ingredient)
    }
  }

  const ingredients = [...ingredientsMap]
    .sort(([_ingredient1, allergen1], [_ingredient2, allergen2]) =>
      allergen1 > allergen2 ? 1 : allergen1 < allergen2 ? -1 : 0,
    )
    .map(([ingredient]) => ingredient)

  console.log('Part 2:', ingredients.join(','))
}

main()

import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const { template, pairs } = await readInput()
  let polymer = template
  for (let i = 0; i < 10; i++) {
    const nextPolymer = [polymer[0]]
    for (let j = 1; j < polymer.length; j++) {
      const pair = polymer.substr(j - 1, 2)
      nextPolymer.push(pairs.get(pair), pair[1])
    }
    polymer = nextPolymer.join('')
  }
  const countsByElement = new Map()
  for (let i = 0; i < polymer.length; i++) {
    const element = polymer[i]
    countsByElement.set(element, (countsByElement.get(element) ?? 0) + 1)
  }
  const counts = [...countsByElement.values()].sort((a, b) => a - b)
  console.log('Part 1:', counts[counts.length - 1] - counts[0])
}

async function part2() {
  const { template, pairs } = await readInput()
  const pairMap = new Map()
  for (const [pair, insertion] of pairs) {
    const element = pairMap.get(pair[0]) ?? new Map()
    element.set(pair[1], insertion)
    pairMap.set(pair[0], element)
  }
  const countsByElement = new Map()
  for (let i = 0; i < template.length; i++) {
    const element = template[i]
    countsByElement.set(element, (countsByElement.get(element) ?? 0) + 1)
  }
  for (let i = 1; i < template.length; i++) {
    const [element1, element2] = template.substr(i - 1, 2)
    traverse(element1, element2, pairMap, 40, countsByElement)
    console.log('pair done', element1, element2, countsByElement)
  }
  const counts = [...countsByElement.values()].sort((a, b) => a - b)
  console.log('Part 2:', counts[counts.length - 1] - counts[0])
}

async function readInput() {
  const input = await readFile()
  const [template, pairs] = input.split('\n\n')
  return {
    template,
    pairs: new Map(
      pairs.split('\n').map((line) => {
        const [pair, insertion] = line.split(' -> ')
        return [pair, insertion]
      }),
    ),
  }
}

/**
 * @param {string} element1
 * @param {string} element2
 * @param {Map<string, Map<string, string>>} pairs
 * @param {number} depth
 * @param {Map<string, number>} countsByElement
 */
function traverse(element1, element2, pairs, depth, countsByElement) {
  if (depth === 0) {
    return
  }
  const insertion = pairs.get(element1).get(element2)
  countsByElement.set(insertion, (countsByElement.get(insertion) ?? 0) + 1)
  traverse(element1, insertion, pairs, depth - 1, countsByElement)
  traverse(insertion, element2, pairs, depth - 1, countsByElement)
}

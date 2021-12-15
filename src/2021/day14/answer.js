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
  const countsByElement = new Map()
  for (const element of template) {
    countsByElement.set(element, (countsByElement.get(element) ?? 0) + 1)
  }
  let polymer = new Map([...pairs.keys()].map((pair) => [pair, 0]))
  for (let i = 1; i < template.length; i++) {
    const pair = template.substr(i - 1, 2)
    polymer.set(pair, polymer.get(pair) + 1)
  }
  for (let i = 0; i < 40; i++) {
    const nextPolymer = new Map(polymer)
    for (const [pair, count] of polymer) {
      const element = pairs.get(pair)
      countsByElement.set(element, (countsByElement.get(element) ?? 0) + count)
      const pair1 = `${pair[0]}${element}`
      const pair2 = `${element}${pair[1]}`
      nextPolymer.set(pair1, nextPolymer.get(pair1) + count)
      nextPolymer.set(pair2, nextPolymer.get(pair2) + count)
      nextPolymer.set(pair, nextPolymer.get(pair) - count)
    }
    polymer = nextPolymer
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

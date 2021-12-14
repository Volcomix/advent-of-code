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
    const char = polymer[i]
    countsByElement.set(char, (countsByElement.get(char) ?? 0) + 1)
  }
  const counts = [...countsByElement.values()].sort((a, b) => a - b)
  console.log('Part 1:', counts[counts.length - 1] - counts[0])
}

async function part2() {}

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

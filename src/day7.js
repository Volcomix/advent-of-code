import fs from 'fs/promises'

async function readBags() {
  const input = await fs.readFile('./day7-input.txt')
  return input
    .toString()
    .split('\n')
    .filter((line) => line)
    .map((line) => line.slice(0, -1))
    .map((line) => line.split(' contain '))
    .map(([parent, children]) => ({
      parent: parent.match(/^(.*) bags$/)[1],
      children:
        children === 'no other bags'
          ? []
          : children
              .split(', ')
              .map((bag) => bag.match(/^([0-9+]) (.*) bags?$/)[2]),
    }))
}

async function part1() {
  const rawBags = await readBags()

  /** @type {Map<string, Set<string>>} */
  const bags = new Map(rawBags.map(({ parent }) => [parent, new Set()]))
  for (const { parent, children } of rawBags) {
    for (const child of children) {
      bags.get(child).add(parent)
    }
  }

  let start = 'shiny gold'
  const queue = [start]
  const discovered = new Set([start])

  let result = -1

  while (queue.length) {
    const bag = queue.shift()
    result++
    for (const parent of bags.get(bag)) {
      if (discovered.has(parent)) {
        continue
      }
      discovered.add(parent)
      queue.push(parent)
    }
  }

  console.log('Part 1:', result)
}

part1()

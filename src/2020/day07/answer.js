import fs from 'fs/promises'

async function readBags() {
  const input = await fs.readFile('./input.txt')
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
          : children.split(', ').map((bag) => {
              const match = bag.match(/^([0-9+]) (.*) bags?$/)
              return { count: Number(match[1]), name: match[2] }
            }),
    }))
}

async function part1() {
  const rawBags = await readBags()

  /** @type {Map<string, Set<string>>} */
  const bags = new Map(rawBags.map(({ parent }) => [parent, new Set()]))
  for (const { parent, children } of rawBags) {
    for (const child of children) {
      bags.get(child.name).add(parent)
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

async function part2() {
  let bags = await readBags()
  bags = new Map(bags.map(({ parent, children }) => [parent, children]))
  console.log('Part 2:', traverseBag(bags, 'shiny gold') - 1)
}

function traverseBag(bags, bag) {
  return bags
    .get(bag)
    .reduce(
      (acc, child) => acc + child.count * traverseBag(bags, child.name),
      1,
    )
}

part1()
part2()

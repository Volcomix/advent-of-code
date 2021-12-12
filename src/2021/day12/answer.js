import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const caveSystem = await readInput()
  console.log('Part 1:', traversePart1(caveSystem, 'start', new Set()))
}

async function part2() {
  const caveSystem = await readInput()
  const visits = new Map([...caveSystem.keys()].map((cave) => [cave, 0]))
  console.log('Part 2:', traversePart2(caveSystem, 'start', visits, false))
}

/**
 * @returns {Promise<Map<string, string[]>>}
 */
async function readInput() {
  const input = await readFile()
  return input.split('\n').reduce((caveSystem, connection) => {
    const [from, to] = connection.split('-')
    if (from !== 'end' && to !== 'start') {
      caveSystem.set(from, [...(caveSystem.get(from) ?? []), to])
    }
    if (from !== 'start' && to !== 'end') {
      caveSystem.set(to, [...(caveSystem.get(to) ?? []), from])
    }
    return caveSystem
  }, new Map())
}

/**
 * @param {Map<string, string[]>} caveSystem
 * @param {string} cave
 * @param {Set<string>} visitedCaves
 * @returns {number}
 */
function traversePart1(caveSystem, cave, visitedCaves) {
  if (cave === 'end') {
    return 1
  }
  if (/^[a-z]/.test(cave)) {
    if (visitedCaves.has(cave)) {
      return 0
    }
    visitedCaves.add(cave)
  }
  const pathCount = caveSystem
    .get(cave)
    .reduce(
      (acc, nextCave) =>
        acc + traversePart1(caveSystem, nextCave, visitedCaves),
      0,
    )
  visitedCaves.delete(cave)
  return pathCount
}

/**
 * @param {Map<string, string[]>} caveSystem
 * @param {string} cave
 * @param {Map<string, number>} visits
 * @param {boolean} isVisitedTwice
 * @returns {number}
 */
function traversePart2(caveSystem, cave, visits, isVisitedTwice) {
  if (cave === 'end') {
    return 1
  }
  const visitCount = visits.get(cave)
  const isSmallCave = /^[a-z]/.test(cave)
  if (isSmallCave) {
    if (isVisitedTwice && visitCount > 0) {
      return 0
    }
    if (!isVisitedTwice && visitCount > 1) {
      return 0
    }
    if (visitCount > 0) {
      isVisitedTwice = true
    }
    visits.set(cave, visitCount + 1)
  }
  const pathCount = caveSystem
    .get(cave)
    .reduce(
      (acc, nextCave) =>
        acc + traversePart2(caveSystem, nextCave, visits, isVisitedTwice),
      0,
    )
  if (isSmallCave) {
    visits.set(cave, visitCount)
  }
  return pathCount
}

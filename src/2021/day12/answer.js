import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const caveSystem = await readInput()
  console.log('Part 1:', traverse(caveSystem))
}

async function part2() {}

/**
 * @returns {Promise<Map<string, string[]>>}
 */
async function readInput() {
  const input = await readFile()
  return input.split('\n').reduce((caveSystem, connection) => {
    const [from, to] = connection.split('-')
    caveSystem.set(from, [...(caveSystem.get(from) ?? []), to])
    caveSystem.set(to, [...(caveSystem.get(to) ?? []), from])
    return caveSystem
  }, new Map())
}

/**
 * @param {Map<string, string[]>} caveSystem
 * @param {string} cave
 * @param {Set<string>} visitedCaves
 * @returns {number}
 */
function traverse(caveSystem, cave = 'start', visitedCaves = new Set()) {
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
      (acc, nextCave) => acc + traverse(caveSystem, nextCave, visitedCaves),
      0,
    )
  visitedCaves.delete(cave)
  return pathCount
}

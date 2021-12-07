import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const positions = await readInput()
  const maxPosition = Math.max(...positions)
  let lowestDifferenceSum = Infinity
  for (let i = 0; i <= maxPosition; i++) {
    const differenceSum = sumDifferences(positions, i)
    if (differenceSum < lowestDifferenceSum) {
      lowestDifferenceSum = differenceSum
    }
  }
  console.log('Part 1:', lowestDifferenceSum)
}

async function part2() {
  const positions = await readInput()
  const maxPosition = Math.max(...positions)
  const costs = [0]
  for (let i = 1; i <= maxPosition; i++) {
    costs[i] = costs[i - 1] + i
  }
  let lowestCostSum = Infinity
  for (let i = 0; i <= maxPosition; i++) {
    const costSum = sumCosts(positions, i, costs)
    if (costSum < lowestCostSum) {
      lowestCostSum = costSum
    }
  }
  console.log('Part 2:', lowestCostSum)
}

async function readInput() {
  const input = await readFile()
  return input.split(',').map(Number)
}

/**
 * @param {number[]} positions
 * @param {number} position
 */
function sumDifferences(positions, position) {
  return positions.reduce((acc, curr) => acc + Math.abs(curr - position), 0)
}

/**
 * @param {number[]} positions
 * @param {number} position
 * @param {number[]} costs
 */
function sumCosts(positions, position, costs) {
  return positions.reduce(
    (acc, curr) => acc + costs[Math.abs(curr - position)],
    0,
  )
}

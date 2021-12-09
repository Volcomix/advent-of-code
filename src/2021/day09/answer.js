import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const heightMap = await readInput()
  const lowPoints = getLowPoints(heightMap)

  console.log(
    'Part 1:',
    lowPoints.reduce((acc, curr) => acc + curr.height + 1, 0),
  )
}

async function part2() {
  const heightMap = await readInput()
  const lowPoints = getLowPoints(heightMap)

  const bassinSizes = lowPoints
    .map((lowPoint) => getBassinSize(heightMap, lowPoint))
    .sort((a, b) => b - a)
    .slice(0, 3)

  console.log(
    'Part 2:',
    bassinSizes.reduce((acc, curr) => acc * curr, 1),
  )
}

async function readInput() {
  const input = await readFile()
  return input.split('\n').map((line) => [...line].map(Number))
}

/**
 * @param {number[][]} heightMap
 */
function getLowPoints(heightMap) {
  const lowPoints = []
  for (let x = 0; x < heightMap[0].length; x++) {
    for (let y = 0; y < heightMap.length; y++) {
      const height = getHeight(heightMap, x, y)
      const neighbors = getNeighbors(heightMap, x, y)
      if (neighbors.every((neighbor) => neighbor.height > height)) {
        lowPoints.push({ id: x * heightMap.length + y, x, y, height })
      }
    }
  }
  return lowPoints
}

/**
 * @param {number[][]} heightMap
 * @param {{ id: number; x: number; y: number; height: number; }} lowPoint
 */
function getBassinSize(heightMap, lowPoint) {
  let bassinSize = 0
  const queue = [lowPoint]
  const explored = new Set([lowPoint.id])
  while (queue.length) {
    const current = queue.shift()
    bassinSize++
    for (const neighbor of getNeighbors(heightMap, current.x, current.y)) {
      if (neighbor.height === 9) {
        continue
      }
      if (explored.has(neighbor.id)) {
        continue
      }
      explored.add(neighbor.id)
      queue.push(neighbor)
    }
  }
  return bassinSize
}

/**
 * @param {number[][]} heightMap
 * @param {number} x
 * @param {number} y
 */
function getNeighbors(heightMap, x, y) {
  const neighbors = []
  if (y > 0) {
    neighbors.push({ x, y: y - 1, height: getHeight(heightMap, x, y - 1) })
  }
  if (x < heightMap[0].length - 1) {
    neighbors.push({ x: x + 1, y, height: getHeight(heightMap, x + 1, y) })
  }
  if (y < heightMap.length - 1) {
    neighbors.push({ x, y: y + 1, height: getHeight(heightMap, x, y + 1) })
  }
  if (x > 0) {
    neighbors.push({ x: x - 1, y, height: getHeight(heightMap, x - 1, y) })
  }
  return neighbors.map((neighbor) => ({
    ...neighbor,
    id: neighbor.x * heightMap.length + neighbor.y,
  }))
}

/**
 * @param {number[][]} heightMap
 * @param {number} x
 * @param {number} y
 */
function getHeight(heightMap, x, y) {
  return heightMap[y][x]
}

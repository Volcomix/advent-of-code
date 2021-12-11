import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const octopuses = await readInput()
  let flashCount = 0
  for (let i = 0; i < 100; i++) {
    flashCount += step(octopuses)
  }
  console.log('Part 1:', flashCount)
}

async function part2() {
  const octopuses = await readInput()
  for (let stepNumber = 1; ; stepNumber++) {
    const flashCount = step(octopuses)
    if (flashCount === 100) {
      console.log('Part 2:', stepNumber)
      return
    }
  }
}

async function readInput() {
  const input = await readFile()
  const lines = input.split('\n')
  return Array.from({ length: 10 }, (_, x) =>
    Array.from({ length: 10 }, (_, y) => +lines[y][x]),
  )
}

/**
 * @param {number[][]} octopuses
 */
function step(octopuses) {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      octopuses[x][y]++
    }
  }
  const flashCount = flash(octopuses)
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (octopuses[x][y] < 10) {
        continue
      }
      octopuses[x][y] = 0
    }
  }
  return flashCount
}

/**
 * @param {number[][]} octopuses
 */
function flash(octopuses) {
  let flashCount = 0
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (octopuses[x][y] !== 10) {
        continue
      }
      flashCount++
      octopuses[x][y]++
      for (const neighbor of getNeighbors(x, y)) {
        if (octopuses[neighbor.x][neighbor.y] > 9) {
          continue
        }
        octopuses[neighbor.x][neighbor.y]++
      }
    }
  }
  if (flashCount > 0) {
    flashCount += flash(octopuses)
  }
  return flashCount
}

/**
 * @param {number} x
 * @param {number} y
 */
function getNeighbors(x, y) {
  const neighbors = []
  for (let offsetX = -1; offsetX <= 1; offsetX++) {
    for (let offsetY = -1; offsetY <= 1; offsetY++) {
      if (offsetX === 0 && offsetY === 0) {
        continue
      }
      const neighborX = x + offsetX
      const neighborY = y + offsetY
      if (
        neighborX < 0 ||
        neighborX >= 10 ||
        neighborY < 0 ||
        neighborY >= 10
      ) {
        continue
      }
      neighbors.push({ x: neighborX, y: neighborY })
    }
  }
  return neighbors
}

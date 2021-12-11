import { readFile } from '../../file-helper.js'

await answer()

async function answer() {
  const octopuses = await readInput()

  print(octopuses, { init: true })
  console.log()
  console.log('Part 1:', 0)
  console.log('Part 2:', 0)

  let totalFlashCount = 0
  for (let stepNumber = 1; ; stepNumber++) {
    const flashCount = step(octopuses)
    if (stepNumber <= 100) {
      totalFlashCount += flashCount
    }
    print(octopuses)
    console.log()
    console.log('Part 1:', totalFlashCount)
    console.log('Part 2:', stepNumber)
    if (flashCount === 100) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
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
 * @param {{ init?: boolean }} [options]
 */
function print(octopuses, options) {
  if (options?.init) {
    console.log()
  } else {
    console.log('\x1b[14A\x1b[0J')
  }
  for (let y = 0; y < 10; y++) {
    const energies = []
    for (let x = 0; x < 10; x++) {
      energies.push(octopuses[x][y])
    }
    console.log(
      energies
        .map((energy) => {
          let color = 226
          if (energy > 0) {
            color = Math.ceil(232 + (energy * (255 - 232)) / 10) + 1
          }
          return `\x1b[38;5;${color}m%s\x1b[0m`
        })
        .join(' '),
      ...energies,
    )
  }
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

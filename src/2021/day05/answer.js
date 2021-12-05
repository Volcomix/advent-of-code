import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const lines = await readInput()
  const map = Array.from({ length: 1000 }, () =>
    Array.from({ length: 1000 }, () => 0),
  )
  for (const line of lines) {
    if (isHorizontal(line)) {
      markHorizontal(line, map)
    }
    if (isVertical(line)) {
      markVertical(line, map)
    }
  }
  console.log('Part 1:', map.flat().filter((v) => v > 1).length)
}

async function part2() {
  const lines = await readInput()
  const map = Array.from({ length: 1000 }, () =>
    Array.from({ length: 1000 }, () => 0),
  )
  for (const line of lines) {
    const xSign = Math.sign(line[1][0] - line[0][0])
    const ySign = Math.sign(line[1][1] - line[0][1])
    let x = line[0][0]
    let y = line[0][1]
    while (x !== line[1][0] || y !== line[1][1]) {
      map[x][y]++
      x += xSign
      y += ySign
    }
    map[x][y]++
  }
  console.log('Part 2:', map.flat().filter((v) => v > 1).length)
}

async function readInput() {
  const input = await readFile()
  return input
    .split('\n')
    .map((line) =>
      line.split(' -> ').map((coord) => coord.split(',').map(Number)),
    )
}

/**
 * @param {number[][]} line
 */
function isHorizontal(line) {
  return line[0][1] === line[1][1]
}

/**
 * @param {number[][]} line
 */
function isVertical(line) {
  return line[0][0] === line[1][0]
}

/**
 * @param {number[][]} line
 * @param {number[][]} map
 */
function markHorizontal(line, map) {
  const y = line[0][1]
  const xStart = Math.min(line[0][0], line[1][0])
  const xEnd = Math.max(line[0][0], line[1][0])
  for (let x = xStart; x <= xEnd; x++) {
    map[x][y]++
  }
}

/**
 * @param {number[][]} line
 * @param {number[][]} map
 */
function markVertical(line, map) {
  const x = line[0][0]
  const yStart = Math.min(line[0][1], line[1][1])
  const yEnd = Math.max(line[0][1], line[1][1])
  for (let y = yStart; y <= yEnd; y++) {
    map[x][y]++
  }
}

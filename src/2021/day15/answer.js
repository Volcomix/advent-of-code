import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const map = await readInput()
  /** @type {Set<number>} */ const queue = new Set()
  const risks = new Map()
  map.forEach((row, y) => {
    row.forEach((_, x) => {
      const cell = y * map[0].length + x
      queue.add(cell)
      risks.set(cell, Infinity)
    })
  })
  risks.set(0, 0)
  const prev = new Map()
  while (queue.size > 0) {
    let current = -1
    let lowestRisk = Infinity
    for (const cell of queue) {
      if (risks.get(cell) < lowestRisk) {
        current = cell
        lowestRisk = risks.get(cell)
      }
    }
    queue.delete(current)
    const currentRisk = risks.get(current)
    if (current === map[0].length * map.length - 1) {
      const path = new Set()
      path.add(current)
      while (current !== 0) {
        current = prev.get(current)
        path.add(current)
      }
      console.log('Part 1:', currentRisk)
      return
    }
    for (const [neighbor, neighborRisk] of getNeighbors(current, map)) {
      if (currentRisk + neighborRisk < risks.get(neighbor)) {
        risks.set(neighbor, currentRisk + neighborRisk)
        prev.set(neighbor, current)
      }
    }
  }
}

async function part2() {
  let map = await readInput()

  map = map.map((row) => {
    const nextRow = []
    for (let i = 0; i < 5; i++) {
      nextRow.push(row.map((cell) => ((cell + i - 1) % 9) + 1))
    }
    return nextRow.flat()
  })

  const nextMap = []
  for (let i = 0; i < 5; i++) {
    nextMap.push(map.map((row) => row.map((cell) => ((cell + i - 1) % 9) + 1)))
  }
  map = nextMap.flat()

  /** @type {Set<number>} */ const queue = new Set()
  const risks = new Map()
  map.forEach((row, y) => {
    row.forEach((_, x) => {
      const cell = y * map[0].length + x
      queue.add(cell)
      risks.set(cell, Infinity)
    })
  })
  risks.set(0, 0)
  const prev = new Map()
  while (queue.size > 0) {
    let current = -1
    let lowestRisk = Infinity
    for (const cell of queue) {
      if (risks.get(cell) < lowestRisk) {
        current = cell
        lowestRisk = risks.get(cell)
      }
    }
    queue.delete(current)
    const currentRisk = risks.get(current)
    if (current === map[0].length * map.length - 1) {
      const path = new Set()
      path.add(current)
      while (current !== 0) {
        current = prev.get(current)
        path.add(current)
      }
      console.log('Part 2:', currentRisk)
      return
    }
    for (const [neighbor, neighborRisk] of getNeighbors(current, map)) {
      if (currentRisk + neighborRisk < risks.get(neighbor)) {
        risks.set(neighbor, currentRisk + neighborRisk)
        prev.set(neighbor, current)
      }
    }
  }
}

async function readInput() {
  const input = await readFile()
  return input.split('\n').map((line) => [...line].map(Number))
}

/**
 * @param {number} cell
 * @param {number[][]} map
 */
function* getNeighbors(cell, map) {
  const x = cell % map[0].length
  const y = Math.floor(cell / map[0].length)
  if (y > 0) {
    yield [(y - 1) * map[0].length + x, map[y - 1][x]]
  }
  if (x < map[0].length - 1) {
    yield [y * map[0].length + x + 1, map[y][x + 1]]
  }
  if (y < map.length - 1) {
    yield [(y + 1) * map[0].length + x, map[y + 1][x]]
  }
  if (x > 0) {
    yield [y * map[0].length + x - 1, map[y][x - 1]]
  }
}

import fs from 'fs/promises'

async function readBoardingPasses() {
  const input = await fs.readFile('day5-input.txt')
  return input
    .toString()
    .split('\n')
    .filter((line) => !!line)
}

/**
 * @param {string} boardingPass
 */
function decodeRow(boardingPass) {
  let min = 0
  let max = 127
  for (let i = 0; i < 7; i++) {
    const char = boardingPass[i]
    switch (char) {
      case 'F':
        max = Math.floor((max - min) / 2) + min
        break
      case 'B':
        min = Math.ceil((max - min) / 2) + min
        break
      default:
        throw new Error(
          'Wrong character in the first 7 characters of the boarding pass:',
          char,
        )
    }
  }
  if (min !== max) {
    throw new Error(`min (${min}) != max (${max})`)
  }
  return min
}

/**
 * @param {string} boardingPass
 */
function decodeColumn(boardingPass) {
  let min = 0
  let max = 7
  for (let i = 7; i < 10; i++) {
    const char = boardingPass[i]
    switch (char) {
      case 'L':
        max = Math.floor((max - min) / 2) + min
        break
      case 'R':
        min = Math.ceil((max - min) / 2) + min
        break
      default:
        throw new Error(
          'Wrong character in the last 3 characters of the boarding pass:',
          char,
        )
    }
  }
  if (min !== max) {
    throw new Error(`min (${min}) != max (${max})`)
  }
  return min
}

/**
 * @param {string} boardingPass
 */
function decodeId(boardingPass) {
  return decodeRow(boardingPass) * 8 + decodeColumn(boardingPass)
}

async function part1() {
  const boardingPasses = await readBoardingPasses()
  console.log('Part 1:', Math.max(...boardingPasses.map(decodeId)))
}

async function part2() {
  const boardingPasses = await readBoardingPasses()
  const ids = boardingPasses.map(decodeId)
  const minId = Math.min(...ids)
  const maxId = Math.max(...ids)
  const remainingIds = new Set(
    Array.from({ length: maxId - minId + 1 }, (_, id) => minId + id),
  )
  for (const id of ids) {
    remainingIds.delete(id)
  }
  if (remainingIds.size !== 1) {
    throw new Error('More than 1 remaining id:', remainingIds)
  }
  for (const id of remainingIds) {
    console.log('Part 2:', id)
  }
}

part1()
part2()

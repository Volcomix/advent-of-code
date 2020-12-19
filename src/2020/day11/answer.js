import { readFile } from '../../file-helper.js'

/**
 * @typedef {object} Position
 * @property {number} x
 * @property {number} y
 */

async function readSeats() {
  const input = await readFile()
  return input.split('\n').map((line) => line.split(''))
}

/** @type {Position[]} */
const adjacentDirections = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
]

/**
 * @param {string[][]} seats
 * @param {Position} position
 */
function isInGrid(seats, position) {
  return (
    position.x >= 0 &&
    position.x < seats[0].length &&
    position.y >= 0 &&
    position.y < seats.length
  )
}

/**
 * @param {string[][]} seats
 * @param {Position} position
 */
function adjacentsPart1(seats, position) {
  return adjacentDirections
    .map((direction) => ({
      x: position.x + direction.x,
      y: position.y + direction.y,
    }))
    .filter(
      (adjacent) =>
        isInGrid(seats, adjacent) && seats[adjacent.y][adjacent.x] !== '.',
    )
}

/**
 * @param {string[][]} seats
 */
function updatePart1(seats) {
  let hasChanged = false
  const nextSeats = seats.map((line, y) =>
    line.map((seat, x) => {
      const occupiedSeats = adjacentsPart1(seats, { x, y }).filter(
        (adjacent) => seats[adjacent.y][adjacent.x] === '#',
      )
      if (seat === 'L' && occupiedSeats.length === 0) {
        hasChanged = true
        return '#'
      } else if (seat === '#' && occupiedSeats.length >= 4) {
        hasChanged = true
        return 'L'
      } else {
        return seat
      }
    }),
  )
  return { hasChanged, nextSeats }
}

async function part1() {
  let seats = await readSeats()
  let hasChanged = true
  while (hasChanged) {
    const result = updatePart1(seats)
    seats = result.nextSeats
    hasChanged = result.hasChanged
  }
  const occupiedCount = seats
    .flat()
    .reduce((count, seat) => (seat === '#' ? count + 1 : count), 0)

  console.log('Part 1:', occupiedCount)
}

/**
 * @param {string[][]} seats
 * @param {Position} position
 */
function adjacentsPart2(seats, position) {
  return adjacentDirections
    .map((direction) => {
      let adjacent = {
        x: position.x + direction.x,
        y: position.y + direction.y,
      }
      while (isInGrid(seats, adjacent)) {
        if (seats[adjacent.y][adjacent.x] !== '.') {
          return adjacent
        }
        adjacent.x += direction.x
        adjacent.y += direction.y
      }
      return null
    })
    .filter((adjacent) => adjacent)
}

/**
 * @param {string[][]} seats
 */
function updatePart2(seats) {
  let hasChanged = false
  const nextSeats = seats.map((line, y) =>
    line.map((seat, x) => {
      const occupiedSeats = adjacentsPart2(seats, { x, y }).filter(
        (adjacent) => seats[adjacent.y][adjacent.x] === '#',
      )
      if (seat === 'L' && occupiedSeats.length === 0) {
        hasChanged = true
        return '#'
      } else if (seat === '#' && occupiedSeats.length >= 5) {
        hasChanged = true
        return 'L'
      } else {
        return seat
      }
    }),
  )
  return { hasChanged, nextSeats }
}

async function part2() {
  let seats = await readSeats()
  let hasChanged = true
  while (hasChanged) {
    const result = updatePart2(seats)
    seats = result.nextSeats
    hasChanged = result.hasChanged
  }
  const occupiedCount = seats
    .flat()
    .reduce((count, seat) => (seat === '#' ? count + 1 : count), 0)

  console.log('Part 2:', occupiedCount)
}

part1()
part2()

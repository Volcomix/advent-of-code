import { readFile } from './file-helper.js'

/**
 * @typedef {object} Position
 * @property {number} x
 * @property {number} y
 */

async function readSeats() {
  const input = await readFile(11)
  return input.split('\n').map((line) => line.split(''))
}

/**
 * @param {string[][]} seats
 */
function logSeats(seats) {
  seats.forEach((line) => console.log(line.join('')))
  console.log()
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
function adjacents(seats, position) {
  return adjacentDirections
    .map((direction) => ({
      x: position.x + direction.x,
      y: position.y + direction.y,
    }))
    .filter(
      (adjacent) =>
        adjacent.x >= 0 &&
        adjacent.x < seats[0].length &&
        adjacent.y >= 0 &&
        adjacent.y < seats.length &&
        seats[adjacent.y][adjacent.x] !== '.',
    )
}

/**
 * @param {string[][]} seats
 */
function update(seats) {
  let hasChanged = false
  const nextSeats = seats.map((line, y) =>
    line.map((seat, x) => {
      const occupiedSeats = adjacents(seats, { x, y }).filter(
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
    const result = update(seats)
    seats = result.nextSeats
    hasChanged = result.hasChanged
  }
  const occupiedCount = seats
    .flat()
    .reduce((count, seat) => (seat === '#' ? count + 1 : count), 0)

  console.log('Part 1:', occupiedCount)
}

part1()

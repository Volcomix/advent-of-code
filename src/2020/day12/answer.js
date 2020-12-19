import { readFile } from '../../file-helper.js'

const orientations = ['N', 'E', 'S', 'W']

/**
 * @typedef {object} Ship
 * @property {number} orientation
 * @property {number} east
 * @property {number} north
 *
 * @typedef {object} Waypoint
 * @property {number} east
 * @property {number} north
 *
 * @typedef {object} State
 * @property {Ship} ship
 * @property {Waypoint} waypoint
 *
 * @typedef {object} Instruction
 * @property {string} action
 * @property {number} value
 */

async function readInstructions() {
  const instructions = await readFile()
  return instructions.split('\n').map((instruction) => ({
    action: instruction.substring(0, 1),
    value: Number(instruction.substring(1)),
  }))
}

/**
 * @param {Ship} ship
 * @param {Instruction} instruction
 * @returns {Ship}
 */
function updateShip(ship, instruction) {
  switch (instruction.action) {
    case 'N':
      return { ...ship, north: ship.north + instruction.value }
    case 'S':
      return { ...ship, north: ship.north - instruction.value }
    case 'E':
      return { ...ship, east: ship.east + instruction.value }
    case 'W':
      return { ...ship, east: ship.east - instruction.value }
    case 'L':
      return {
        ...ship,
        orientation: (ship.orientation - instruction.value / 90 + 4) % 4,
      }
    case 'R':
      return {
        ...ship,
        orientation: (ship.orientation + instruction.value / 90) % 4,
      }
    case 'F':
      return updateShip(ship, {
        action: orientations[ship.orientation],
        value: instruction.value,
      })
  }
}

/**
 *
 * @param {State} state
 * @param {Instruction} instruction
 * @returns {State}
 */
function updateState(state, instruction) {
  switch (instruction.action) {
    case 'N':
      return {
        ...state,
        waypoint: {
          ...state.waypoint,
          north: state.waypoint.north + instruction.value,
        },
      }
    case 'S':
      return {
        ...state,
        waypoint: {
          ...state.waypoint,
          north: state.waypoint.north - instruction.value,
        },
      }
    case 'E':
      return {
        ...state,
        waypoint: {
          ...state.waypoint,
          east: state.waypoint.east + instruction.value,
        },
      }
    case 'W':
      return {
        ...state,
        waypoint: {
          ...state.waypoint,
          east: state.waypoint.east - instruction.value,
        },
      }
    case 'L':
      const leftRotationCount = instruction.value / 90
      let leftRotationWaypoint = { ...state.waypoint }
      for (let i = 0; i < leftRotationCount; i++) {
        leftRotationWaypoint = {
          east: -leftRotationWaypoint.north,
          north: leftRotationWaypoint.east,
        }
      }
      return { ...state, waypoint: leftRotationWaypoint }
    case 'R':
      const rightRotationCount = instruction.value / 90
      let rightRotationWaypoint = { ...state.waypoint }
      for (let i = 0; i < rightRotationCount; i++) {
        rightRotationWaypoint = {
          east: rightRotationWaypoint.north,
          north: -rightRotationWaypoint.east,
        }
      }
      return { ...state, waypoint: rightRotationWaypoint }
    case 'F':
      return {
        ...state,
        ship: {
          ...state.ship,
          east: state.ship.east + state.waypoint.east * instruction.value,
          north: state.ship.north + state.waypoint.north * instruction.value,
        },
      }
  }
}

async function part1() {
  const instructions = await readInstructions()
  const finalShip = instructions.reduce(
    (ship, instruction) => updateShip(ship, instruction),
    { orientation: 1, east: 0, north: 0 },
  )
  console.log('Part 1:', Math.abs(finalShip.east) + Math.abs(finalShip.north))
}

async function part2() {
  const instructions = await readInstructions()
  const finalState = instructions.reduce(
    (state, instruction) => updateState(state, instruction),
    {
      ship: { orientation: 1, east: 0, north: 0 },
      waypoint: { east: 10, north: 1 },
    },
  )
  console.log(
    'Part 2:',
    Math.abs(finalState.ship.east) + Math.abs(finalState.ship.north),
  )
}

part1()
part2()

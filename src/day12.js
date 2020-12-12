import { readFile } from './file-helper.js'

const orientations = ['N', 'E', 'S', 'W']

/**
 * @typedef {object} State
 * @property {number} orientation
 * @property {number} east
 * @property {number} north
 *
 * @typedef {object} Instruction
 * @property {string} action
 * @property {number} value
 */

async function readInstructions() {
  const instructions = await readFile(12)
  return instructions.split('\n').map((instruction) => ({
    action: instruction.substring(0, 1),
    value: Number(instruction.substring(1)),
  }))
}

/**
 * @param {State} state
 * @param {Instruction} instruction
 * @returns {State}
 */
function execute(state, instruction) {
  switch (instruction.action) {
    case 'N':
      return { ...state, north: state.north + instruction.value }
    case 'S':
      return { ...state, north: state.north - instruction.value }
    case 'E':
      return { ...state, east: state.east + instruction.value }
    case 'W':
      return { ...state, east: state.east - instruction.value }
    case 'L':
      return {
        ...state,
        orientation: (state.orientation - instruction.value / 90 + 4) % 4,
      }
    case 'R':
      return {
        ...state,
        orientation: (state.orientation + instruction.value / 90) % 4,
      }
    case 'F':
      return execute(state, {
        action: orientations[state.orientation],
        value: instruction.value,
      })
  }
}

async function part1() {
  const instructions = await readInstructions()

  /** @type {State} */
  let state = { orientation: 1, east: 0, north: 0 }

  for (const instruction of instructions) {
    state = execute(state, instruction)
  }
  console.log('Part 1:', Math.abs(state.east) + Math.abs(state.north))
}

part1()

import { readFile } from './file-helper.js'

/**
 * @typedef {object} Instruction
 * @property {'mask' | 'mem'} type
 * @property {number} [index]
 * @property {string[] | bigint} value
 */

/**
 * @returns {Promise<Instruction[]>}
 */
async function readProgram() {
  const program = await readFile(14)
  return program
    .split('\n')
    .map((line) => line.split(' = '))
    .map(([instruction, value]) => {
      if (instruction === 'mask') {
        return { type: 'mask', value: value.split('').reverse() }
      } else {
        const match = instruction.match(/^mem\[(\d+)\]$/)
        return {
          type: 'mem',
          index: Number(match[1]),
          value: BigInt(value),
        }
      }
    })
}

async function part1() {
  const program = await readProgram()

  /** @type {bigint[]} */
  const mem = []

  /** @type {string[]} */
  let mask

  for (const { type, index, value } of program) {
    if (type === 'mask') {
      mask = /** @type {string[]} */ (value)
    } else {
      mem[index] = /** @type {bigint} */ (value)
      for (let i = 0n; i < mask.length; i++) {
        if (mask[i] === '0') {
          mem[index] &= ~(1n << i)
        } else if (mask[i] === '1') {
          mem[index] |= 1n << i
        }
      }
    }
  }
  const sum = mem.reduce((acc, value) => acc + value, 0n)
  console.log('Part 1:', sum)
}

part1()

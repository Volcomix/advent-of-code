import fs from 'fs/promises'
import { readFile } from '../../file-helper.js'

async function readNumbers() {
  const numbers = await readFile()
  return numbers.split(',').map(Number)
}

/**
 * @param {number} part
 * @param {number} maxNumber
 */
async function getResult(part, maxNumber) {
  const numbers = await readNumbers()

  /** @type {Map<number, number>} */
  const lastIndex = new Map()

  for (let index = 0; index < numbers.length - 1; index++) {
    lastIndex.set(numbers[index], index)
  }

  for (let index = numbers.length - 1; index < maxNumber - 1; index++) {
    const number = numbers[index]
    const nextNumber = lastIndex.has(number) ? index - lastIndex.get(number) : 0
    numbers.push(nextNumber)
    lastIndex.set(number, index)
  }

  console.log(`Part ${part}:`, numbers[numbers.length - 1])
}

/**
 * @param {number} part
 * @param {number} maxNumber
 */
async function getResultWasm(part, maxNumber) {
  const numbers = await readNumbers()
  const memory = new WebAssembly.Memory({
    initial: Math.ceil((maxNumber * 32) / 8 / 64 / 1024),
  })
  const { instance } = await WebAssembly.instantiate(
    await fs.readFile('answer.wasm'),
    { js: { memory } },
  )
  const memoryNumbers = new Uint32Array(memory.buffer, 0, numbers.length)
  for (let i = 0; i < numbers.length; i++) {
    memoryNumbers[i] = numbers[i]
  }
  console.log(
    `Part ${part}:`,
    instance.exports.getLastNumber(numbers.length, maxNumber),
  )
}

getResult(1, 2020)
// getResult(2, 30000000)
getResultWasm(2, 30000000)

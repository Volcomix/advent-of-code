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
async function getLastNumberMap(part, maxNumber) {
  const numbers = await readNumbers()
  const start = Date.now()

  /** @type {Map<number, number>} */
  const lastTurns = new Map()

  let turn = 1
  for (; turn <= numbers.length; turn++) {
    lastTurns.set(numbers[turn - 1], turn)
  }
  let lastNumber = 0
  for (; turn < maxNumber; turn++) {
    const lastTurn = lastTurns.get(lastNumber)
    lastTurns.set(lastNumber, turn)
    lastNumber = lastTurn ? turn - lastTurn : 0
  }
  const elapsed = Date.now() - start
  console.log(`Part ${part}: ${lastNumber} - ${elapsed}ms (Map)`)
}

/**
 * @param {number} part
 * @param {number} maxNumber
 */
async function getLastNumberTypedArray(part, maxNumber) {
  const numbers = await readNumbers()
  const start = Date.now()
  const lastTurns = new Uint32Array(maxNumber)
  let turn = 1
  for (; turn <= numbers.length; turn++) {
    lastTurns[numbers[turn - 1]] = turn
  }
  let lastNumber = 0
  for (; turn < maxNumber; turn++) {
    const lastTurn = lastTurns[lastNumber]
    lastTurns[lastNumber] = turn
    lastNumber = lastTurn ? turn - lastTurn : 0
  }
  const elapsed = Date.now() - start
  console.log(`Part ${part}: ${lastNumber} - ${elapsed}ms (TypedArray)`)
}

/**
 * @param {number} part
 * @param {number} maxNumber
 */
async function getLastNumberWasm(part, maxNumber) {
  const numbers = await readNumbers()
  const start = Date.now()
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
  const lastNumber = instance.exports.getLastNumber(numbers.length, maxNumber)
  const elapsed = Date.now() - start
  console.log(`Part ${part}: ${lastNumber} - ${elapsed}ms (WASM)`)
}

getLastNumberMap(1, 2020)
getLastNumberMap(2, 30000000)
getLastNumberTypedArray(2, 30000000)
getLastNumberWasm(2, 30000000)

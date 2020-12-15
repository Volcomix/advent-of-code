import { readFile } from './file-helper.js'

async function readNumbers() {
  const numbers = await readFile(15)
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

getResult(1, 2020)
getResult(2, 30000000)

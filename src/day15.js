import { readFile } from './file-helper.js'

async function readNumbers() {
  const numbers = await readFile(15)
  return numbers.split(',').map(Number)
}

async function part1() {
  const numbers = await readNumbers()

  /** @type {Map<number, number>} */
  const lastIndex = new Map()

  for (let index = 0; index < numbers.length - 1; index++) {
    lastIndex.set(numbers[index], index)
  }

  for (let index = numbers.length - 1; index < 2019; index++) {
    const number = numbers[index]
    const nextNumber = lastIndex.has(number) ? index - lastIndex.get(number) : 0
    numbers.push(nextNumber)
    lastIndex.set(number, index)
  }

  console.log('Part 1:', numbers[numbers.length - 1])
}

part1()

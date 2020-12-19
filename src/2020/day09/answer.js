import { readFile } from '../../file-helper.js'

async function readXmas() {
  const xmas = await readFile()
  return xmas.split('\n').map(Number)
}

/**
 * @param {number[]} xmas
 */
function findInvalidNumberIndex(xmas) {
  const preambleSize = 25
  for (let i = preambleSize; i < xmas.length; i++) {
    let isFound = false
    for (let j = i - preambleSize; !isFound && j < i; j++) {
      for (let k = j + 1; !isFound && k < i; k++) {
        if (xmas[j] + xmas[k] === xmas[i]) {
          isFound = true
        }
      }
    }
    if (!isFound) {
      return i
    }
  }
}

async function part1() {
  const xmas = await readXmas()
  console.log('Part 1:', xmas[findInvalidNumberIndex(xmas)])
}

async function part2() {
  const xmas = await readXmas()
  const invalidNumberIndex = findInvalidNumberIndex(xmas)
  const invalidNumber = xmas[invalidNumberIndex]
  for (let i = 0; i < xmas.length; i++) {
    if (i === invalidNumberIndex) {
      continue
    }
    let sum = 0
    let min = Infinity
    let max = -Infinity
    let j = i
    for (
      ;
      j < xmas.length && j !== invalidNumberIndex && sum < invalidNumber;
      j++
    ) {
      const value = xmas[j]
      sum += value
      if (value < min) {
        min = value
      }
      if (value > max) {
        max = value
      }
    }
    if (sum === invalidNumber) {
      console.log('Part 2:', min + max)
      break
    }
  }
}

part1()
part2()

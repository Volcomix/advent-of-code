import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const numbers = await readInput()
  let number = numbers[0]
  for (let i = 1; i < numbers.length; i++) {
    number = reduce(`[${number},${numbers[i]}]`)
  }
  console.log('Part 1:', getMagnitude(JSON.parse(number)))
}

async function part2() {
  const numbers = await readInput()
  let highestMagnitude = -Infinity
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i === j) {
        continue
      }
      const number = reduce(`[${numbers[i]},${numbers[j]}]`)
      const magnitude = getMagnitude(JSON.parse(number))
      if (magnitude > highestMagnitude) {
        highestMagnitude = magnitude
      }
    }
  }
  console.log('Part 2:', highestMagnitude)
}

async function readInput() {
  const input = await readFile()
  return input.split('\n')
}

/**
 * @param {string} number
 * @returns {string}
 */
function reduce(number) {
  while (true) {
    let nextNumber = explode(number)
    if (nextNumber === null) {
      nextNumber = split(number)
      if (nextNumber === null) {
        return number
      }
    }
    number = nextNumber
  }
}

/**
 * @param {any} number
 * @returns {number}
 */
function getMagnitude(number) {
  if (typeof number === 'number') {
    return number
  }
  return 3 * getMagnitude(number[0]) + 2 * getMagnitude(number[1])
}

/**
 * @param {string} number
 * @returns {string | null}
 */
function explode(number) {
  const explodeIndex = findExplodeIndex(number)

  if (explodeIndex === -1) {
    return null
  }

  const pair = number
    .slice(explodeIndex)
    .match(/\[(\d+),(\d+)\]/)
    .slice(1)
    .map(Number)

  return `${number
    .slice(0, explodeIndex)
    .replace(
      /(.*\D)(\d+)/,
      (_, p1, p2) => `${p1}${Number(p2) + pair[0]}`,
    )}0${number
    .slice(explodeIndex + pair.join('').length + 3)
    .replace(/\d+/, (match) => `${Number(match) + pair[1]}`)}`
}

/**
 * @param {string} number
 * @returns {string | null}
 */
function split(number) {
  if (!/\d{2}/.test(number)) {
    return null
  }

  return number.replace(
    /\d{2}/,
    (match) =>
      `[${Math.floor(Number(match) / 2)},${Math.ceil(Number(match) / 2)}]`,
  )
}

/**
 * @param {string} number
 */
function findExplodeIndex(number) {
  let openBracketCount = 0
  return [...number].findIndex((char) => {
    if (char === '[') {
      openBracketCount++
    }
    if (char === ']') {
      openBracketCount--
    }
    if (openBracketCount === 5) {
      return true
    }
    return false
  })
}

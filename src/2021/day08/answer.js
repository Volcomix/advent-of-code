import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const input = await readInput()
  const digitsBySegmentCount = new Map([
    [2, 1],
    [4, 4],
    [3, 7],
    [7, 8],
  ])
  let count = 0
  for (const [_, digits] of input) {
    for (const digit of digits) {
      if (digitsBySegmentCount.has(digit.length)) {
        count++
      }
    }
  }
  console.log('Part 1:', count)
}

async function part2() {
  const input = await readInput()
  let sum = 0
  for (const [patterns, digits] of input) {
    const one = patterns.find((digit) => digit.length === 2)
    const four = patterns.find((digit) => digit.length === 4)
    const seven = patterns.find((digit) => digit.length === 3)
    const eight = patterns.find((digit) => digit.length === 7)
    const five = patterns.find(
      (digit) =>
        digit.length === 5 &&
        [...digit].filter((segment) => four.includes(segment)).length === 3 &&
        [...digit].filter((segment) => one.includes(segment)).length === 1,
    )
    const two = patterns.find(
      (digit) =>
        digit.length === 5 &&
        [...digit].filter((segment) => four.includes(segment)).length === 2,
    )
    const three = patterns.find(
      (digit) =>
        digit.length === 5 &&
        [...seven].every((segment) => digit.includes(segment)),
    )
    const nine = patterns.find(
      (digit) =>
        digit.length === 6 &&
        [...three].every((segment) => digit.includes(segment)),
    )
    const six = patterns.find(
      (digit) =>
        digit.length === 6 &&
        [...digit].filter((segment) => one.includes(segment)).length === 1,
    )
    const mapping = [one, two, three, four, five, six, seven, eight, nine]
    const zero = patterns.find((digit) => !mapping.includes(digit))
    mapping.unshift(zero)

    sum += Number(digits.map((digit) => mapping.indexOf(digit)).join(''))
  }
  console.log('Part 2:', sum)
}

async function readInput() {
  const input = await readFile()
  return input
    .split('\n')
    .map((line) =>
      line
        .split(' | ')
        .map((digits) =>
          digits.split(' ').map((digit) => [...digit].sort().join('')),
        ),
    )
}

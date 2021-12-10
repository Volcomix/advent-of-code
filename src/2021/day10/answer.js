import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const lines = await readInput()
  const openingChars = new Set(['(', '[', '{', '<'])
  const openingCharsByClosingChar = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
    ['>', '<'],
  ])
  const illegalChars = []
  for (const line of lines) {
    const opened = []
    for (const char of line) {
      if (openingChars.has(char)) {
        opened.push(char)
      } else if (opened.pop() !== openingCharsByClosingChar.get(char)) {
        illegalChars.push(char)
        break
      }
    }
  }
  const scores = new Map([
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137],
  ])
  let score = 0
  for (const char of illegalChars) {
    score += scores.get(char)
  }
  console.log('Part 1:', score)
}

async function part2() {}

async function readInput() {
  const input = await readFile()
  return input.split('\n')
}

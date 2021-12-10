import { readFile } from '../../file-helper.js'

const openingChars = new Map([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
])

const closingChars = new Map(
  [...openingChars.entries()].map(([opening, closing]) => [closing, opening]),
)

await part1()
await part2()

async function part1() {
  const lines = await readInput()
  const illegalChars = []
  for (const line of lines) {
    const opened = []
    for (const char of line) {
      if (openingChars.has(char)) {
        opened.push(char)
      } else if (opened.pop() !== closingChars.get(char)) {
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

async function part2() {
  const lines = await readInput()
  const completions = []
  for (const line of lines) {
    const opened = []
    let corrupted = false
    for (const char of line) {
      if (openingChars.has(char)) {
        opened.push(char)
      } else if (opened.pop() !== closingChars.get(char)) {
        corrupted = true
        break
      }
    }
    if (corrupted) {
      continue
    }
    if (opened.length > 0) {
      completions.push(opened.reverse().map((char) => openingChars.get(char)))
    }
  }
  const scoresByChar = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
  ])
  const scores = []
  for (const completion of completions) {
    let score = 0
    for (const char of completion) {
      score = score * 5 + scoresByChar.get(char)
    }
    scores.push(score)
  }
  scores.sort((a, b) => a - b)
  console.log('Part 2:', scores[Math.floor(scores.length / 2)])
}

async function readInput() {
  const input = await readFile()
  return input.split('\n')
}

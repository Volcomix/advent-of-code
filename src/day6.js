import fs from 'fs/promises'

async function readAnswers() {
  const input = await fs.readFile('./day6-input.txt')
  return input
    .toString()
    .split('\n\n')
    .map((group) => group.split('\n').map((answer) => answer.split('')))
}

async function part1() {
  const answers = await readAnswers()
  console.log(
    'Part 1:',
    answers
      .map((group) => new Set(group.flat()).size)
      .reduce((sum, count) => sum + count, 0),
  )
}

part1()

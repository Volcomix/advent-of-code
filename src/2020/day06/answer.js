import fs from 'fs/promises'

async function readAnswers() {
  const input = await fs.readFile('./input.txt')
  return input
    .toString()
    .split('\n\n')
    .map((group) =>
      group
        .split('\n')
        .filter((line) => line)
        .map((answer) => answer.split('')),
    )
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

async function part2() {
  const answers = await readAnswers()
  console.log(
    'Part 2:',
    answers
      .map((group) => {
        const groupSize = group.length
        const answerCount = new Map()
        for (const answer of group.flat()) {
          answerCount.set(answer, (answerCount.get(answer) || 0) + 1)
        }
        return [...answerCount.values()].filter((count) => count === groupSize)
          .length
      })
      .reduce((sum, count) => sum + count, 0),
  )
}

part1()
part2()

import fs from 'fs/promises'

async function readPasswords() {
  const input = await fs.readFile('day2-input.txt')
  return input
    .toString()
    .split('\n')
    .map((line) => line.split(' '))
    .map(([counts, letter, password]) => {
      const [minCount, maxCount] = counts.split('-')
      return { minCount, maxCount, letter: letter[0], password }
    })
}

async function part1() {
  let validCount = 0
  const passwords = await readPasswords()
  for (const { minCount, maxCount, letter, password } of passwords) {
    const letterCount = password.match(new RegExp(letter, 'g'))?.length || 0
    if (letterCount >= minCount && letterCount <= maxCount) {
      validCount++
    }
  }
  console.log(validCount)
}

part1()

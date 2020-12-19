import fs from 'fs/promises'

async function readPasswords() {
  const input = await fs.readFile('input.txt')
  return input
    .toString()
    .split('\n')
    .map((line) => line.split(' '))
    .map(([counts, letter, password]) => {
      const [a, b] = counts.split('-')
      return { a, b, letter: letter[0], password }
    })
}

async function part1() {
  let validCount = 0
  const passwords = await readPasswords()
  for (const { a, b, letter, password } of passwords) {
    const letterCount = password.match(new RegExp(letter, 'g'))?.length || 0
    if (letterCount >= a && letterCount <= b) {
      validCount++
    }
  }
  console.log('Part 1:', validCount)
}

async function part2() {
  let validCount = 0
  const passwords = await readPasswords()
  for (let { a, b, letter, password } of passwords) {
    a--
    b--
    if (
      (password[a] === letter || password[b] === letter) &&
      (password[a] !== letter || password[b] !== letter)
    ) {
      validCount++
    }
  }
  console.log('Part 2:', validCount)
}

part1()
part2()

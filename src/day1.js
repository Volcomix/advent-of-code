import fs from 'fs/promises'

async function readNumbers() {
  const input = await fs.readFile('day1-input.txt')
  return input.toString().split('\n').map(Number)
}

async function part1() {
  const numbers = await readNumbers()
  for (let i = 0; i < numbers.length; i++) {
    const a = numbers[i]
    for (let j = i; j < numbers.length; j++) {
      const b = numbers[j]
      if (a + b === 2020) {
        console.log(a * b)
        return
      }
    }
  }
}

async function part2() {
  const numbers = await readNumbers()
  for (let i = 0; i < numbers.length; i++) {
    const a = numbers[i]
    for (let j = i; j < numbers.length; j++) {
      const b = numbers[j]
      for (let k = j; k < numbers.length; k++) {
        const c = numbers[k]
        if (a + b + c === 2020) {
          console.log(a * b * c)
          return
        }
      }
    }
  }
}

part1()
part2()

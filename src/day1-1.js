import fs from 'fs/promises'

async function main() {
  const input = await fs.readFile('day1-input.txt')
  const lines = input.toString().split('\n').map(Number)
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i]
    for (let j = i; j < lines.length; j++) {
      const b = lines[j]
      if (a + b === 2020) {
        console.log(a * b)
        return
      }
    }
  }
}

main()

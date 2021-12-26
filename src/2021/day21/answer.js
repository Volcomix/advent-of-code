import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const positions = await readInput()
  const scores = [0, 0]
  let rollCount = 0
  let die = 1
  while (true) {
    for (let player = 0; player < positions.length; player++) {
      let rolls = 0
      for (let i = 0; i < 3; i++) {
        rolls += die++
        rollCount++
        if (die === 101) {
          die = 1
        }
      }
      positions[player] = ((positions[player] + rolls - 1) % 10) + 1
      scores[player] += positions[player]
      if (scores[player] >= 1000) {
        console.log('Part 1:', scores[1 - player] * rollCount)
        return
      }
    }
  }
}

async function part2() {}

async function readInput() {
  const input = await readFile()
  return input
    .split('\n')
    .map((line) => line.split(': ').pop())
    .map(Number)
}

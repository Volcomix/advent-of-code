import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const positions = await readInput()
  const scores = [0, 0]
  let rollCount = 0
  let die = 1
  while (true) {
    for (let player = 0; player < 2; player++) {
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

async function part2() {
  const positions = await readInput()

  const universeCounts = new Map(
    Array.from({ length: 7 }, (_, i) => [i + 3, 0]),
  )
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        const die = i + j + k
        universeCounts.set(die, universeCounts.get(die) + 1)
      }
    }
  }

  const wins = dfs(0, 1, universeCounts, positions, [0, 0], [0, 0])
  console.log('Part 2:', Math.max(...wins))
}

async function readInput() {
  const input = await readFile()
  return input
    .split('\n')
    .map((line) => line.split(': ').pop())
    .map(Number)
}

/**
 * @param {number} player
 * @param {number} universeCount
 * @param {Map<number, number>} universeCounts
 * @param {number[]} positions
 * @param {number[]} scores
 * @param {number[]} wins
 */
function dfs(player, universeCount, universeCounts, positions, scores, wins) {
  if (scores[1 - player] >= 21) {
    wins[1 - player] += universeCount
    return wins
  }
  for (let moveCount = 3; moveCount <= 9; moveCount++) {
    const nextPositions = [...positions]
    const nextScores = [...scores]
    nextPositions[player] = ((nextPositions[player] + moveCount - 1) % 10) + 1
    nextScores[player] += nextPositions[player]
    dfs(
      1 - player,
      universeCount * universeCounts.get(moveCount),
      universeCounts,
      nextPositions,
      nextScores,
      wins,
    )
  }
  return wins
}

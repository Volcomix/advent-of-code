import fs from 'fs/promises'

async function readTrees() {
  const input = await fs.readFile('input.txt')
  return input
    .toString()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
}

function countTrees(trees, slope) {
  const width = trees[0].length
  const height = trees.length
  let treeCount = 0
  let x = 0
  let y = 0
  while (y < height) {
    if (trees[y][x % width] === '#') {
      treeCount++
    }
    x += slope.right
    y += slope.down
  }
  return treeCount
}

async function part1() {
  const trees = await readTrees()
  const slope = { right: 3, down: 1 }
  let treeCount = countTrees(trees, slope)
  console.log('Part 1:', treeCount)
}

async function part2() {
  const trees = await readTrees()
  const slopes = [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
  ]
  let answer = 1
  for (const slope of slopes) {
    answer *= countTrees(trees, slope)
  }
  console.log('Part 2:', answer)
}

part1()
part2()

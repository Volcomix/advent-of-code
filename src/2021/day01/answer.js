import { readFile } from '../../file-helper.js'

async function part1() {
  const input = await readFile()
  const depths = input.split('\n').map(Number)
  let count = 0
  for (let i = 1; i < depths.length; i++) {
    const depth = depths[i]
    const prevDepth = depths[i - 1]
    if (depth > prevDepth) {
      count++
    }
  }
  console.log(count)
}

async function part2() {
  const input = await readFile()
  const depths = input.split('\n').map(Number)
  let count = 0
  for (let i = 4; i < depths.length; i++) {
    const window1 = depths[i] + depths[i - 1] + depths[i - 2]
    const window2 = depths[i - 1] + depths[i - 2] + depths[i - 3]

    if (window1 > window2) {
      count++
    }
  }
  console.log(count)
}

part1()
part2()

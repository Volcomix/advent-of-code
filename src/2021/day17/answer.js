import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const { xMin, xMax, yMin, yMax } = await readInput()
  let maxValidY = 0
  for (let initialVx = 1; initialVx <= xMax; initialVx++) {
    for (let initialVy = yMin; initialVy <= -yMin; initialVy++) {
      let maxY = 0
      let vx = initialVx
      let vy = initialVy
      let x = 0
      let y = 0
      while (true) {
        x += vx
        y += vy
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          maxValidY = Math.max(maxValidY, maxY)
          break
        }
        if (x > xMax || y < yMin) {
          break
        }
        if (y > maxY) {
          maxY = Math.max(maxY, y)
        }
        vx = Math.max(vx - 1, 0)
        vy--
      }
    }
  }
  console.log('Part 1:', maxValidY)
}

async function part2() {
  const { xMin, xMax, yMin, yMax } = await readInput()
  let validLaunchCount = 0
  for (let initialVx = 1; initialVx <= xMax; initialVx++) {
    for (let initialVy = yMin; initialVy <= -yMin; initialVy++) {
      let vx = initialVx
      let vy = initialVy
      let x = 0
      let y = 0
      while (true) {
        x += vx
        y += vy
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          validLaunchCount++
          break
        }
        if (x > xMax || y < yMin) {
          break
        }
        vx = Math.max(vx - 1, 0)
        vy--
      }
    }
  }
  console.log('Part 2:', validLaunchCount)
}

async function readInput() {
  const input = await readFile()
  const [_, x, y] = input.split(/: x=|, y=/)
  const [xMin, xMax] = x.split('..').map(Number)
  const [yMin, yMax] = y.split('..').map(Number)
  return { xMin, xMax, yMin, yMax }
}

import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const steps = await readInput()
  const region = new Set()
  for (const step of steps) {
    if (
      step.x[0] < -50 ||
      step.x[1] > 50 ||
      step.y[0] < -50 ||
      step.y[1] > 50 ||
      step.z[0] < -50 ||
      step.z[1] > 50
    ) {
      continue
    }
    for (let x = step.x[0]; x <= step.x[1]; x++) {
      for (let y = step.y[0]; y <= step.y[1]; y++) {
        for (let z = step.z[0]; z <= step.z[1]; z++) {
          if (step.state === 'on') {
            region.add(`${x},${y},${z}`)
          } else {
            region.delete(`${x},${y},${z}`)
          }
        }
      }
    }
  }
  console.log('Part 1:', region.size)
}

async function part2() {}

async function readInput() {
  const input = await readFile()
  return input.split('\n').map((line) => {
    const [state, cuboid] = line.split(' ')
    const [x, y, z] = cuboid
      .split(',')
      .map((range) => range.split('=')[1].split('..').map(Number))
    return { state, x, y, z }
  })
}

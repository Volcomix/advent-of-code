import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const steps = await readInput()
  const region = new Set()
  for (const { state, cuboid } of steps.slice(0, 20)) {
    for (let x = cuboid.x[0]; x <= cuboid.x[1]; x++) {
      for (let y = cuboid.y[0]; y <= cuboid.y[1]; y++) {
        for (let z = cuboid.z[0]; z <= cuboid.z[1]; z++) {
          if (state === 'on') {
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

async function part2() {
  const steps = await readInput()
  /** @type {Cuboid[]} */
  let cuboids = []
  for (const step of steps) {
    if (step.state === 'on') {
      let newCuboids = [step.cuboid]
      for (const cuboid of cuboids) {
        newCuboids = newCuboids.flatMap((newCuboid) =>
          difference(newCuboid, cuboid),
        )
      }
      cuboids.push(...newCuboids)
    } else {
      cuboids = cuboids.flatMap((cuboid) => difference(cuboid, step.cuboid))
    }
  }
  console.log(
    'Part 2:',
    cuboids.reduce(
      (acc, cuboid) =>
        acc +
        (cuboid.x[1] - cuboid.x[0] + 1) *
          (cuboid.y[1] - cuboid.y[0] + 1) *
          (cuboid.z[1] - cuboid.z[0] + 1),
      0,
    ),
  )
}

async function readInput() {
  const input = await readFile()
  return input.split('\n').map((line) => {
    const [state, cuboid] = line.split(' ')
    const [x, y, z] = cuboid
      .split(',')
      .map((range) => range.split('=')[1].split('..').map(Number))
    return { state, cuboid: { x, y, z } }
  })
}

/**
 * @param {Cuboid} cuboid1
 * @param {Cuboid} cuboid2
 */
function difference(cuboid1, cuboid2) {
  if (cuboid1.x[1] < cuboid2.x[0] || cuboid1.x[0] > cuboid2.x[1]) {
    return [cuboid1]
  }
  if (cuboid1.y[1] < cuboid2.y[0] || cuboid1.y[0] > cuboid2.y[1]) {
    return [cuboid1]
  }
  if (cuboid1.z[1] < cuboid2.z[0] || cuboid1.z[0] > cuboid2.z[1]) {
    return [cuboid1]
  }

  cuboid1 = { ...cuboid1 }
  const cuboids = []
  if (cuboid1.z[1] > cuboid2.z[1]) {
    cuboids.push({
      x: cuboid1.x,
      y: cuboid1.y,
      z: [cuboid2.z[1] + 1, cuboid1.z[1]],
    })
    cuboid1.z = [cuboid1.z[0], cuboid2.z[1]]
  }
  if (cuboid1.z[0] < cuboid2.z[0]) {
    cuboids.push({
      x: cuboid1.x,
      y: cuboid1.y,
      z: [cuboid1.z[0], cuboid2.z[0] - 1],
    })
    cuboid1.z = [cuboid2.z[0], cuboid1.z[1]]
  }
  if (cuboid1.y[1] > cuboid2.y[1]) {
    cuboids.push({
      x: cuboid1.x,
      y: [cuboid2.y[1] + 1, cuboid1.y[1]],
      z: cuboid1.z,
    })
    cuboid1.y = [cuboid1.y[0], cuboid2.y[1]]
  }
  if (cuboid1.y[0] < cuboid2.y[0]) {
    cuboids.push({
      x: cuboid1.x,
      y: [cuboid1.y[0], cuboid2.y[0] - 1],
      z: cuboid1.z,
    })
    cuboid1.y = [cuboid2.y[0], cuboid1.y[1]]
  }
  if (cuboid1.x[1] > cuboid2.x[1]) {
    cuboids.push({
      x: [cuboid2.x[1] + 1, cuboid1.x[1]],
      y: cuboid1.y,
      z: cuboid1.z,
    })
    cuboid1.x = [cuboid1.x[0], cuboid2.x[1]]
  }
  if (cuboid1.x[0] < cuboid2.x[0]) {
    cuboids.push({
      x: [cuboid1.x[0], cuboid2.x[0] - 1],
      y: cuboid1.y,
      z: cuboid1.z,
    })
    cuboid1.x = [cuboid2.x[0], cuboid1.x[1]]
  }
  return cuboids
}

/**
 * @typedef {{x: number[]; y: number[]; z: number[]}} Cuboid
 */

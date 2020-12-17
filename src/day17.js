import { readFile } from './file-helper.js'

async function readCubes() {
  const cubes = await readFile(17)
  return [
    cubes
      .split('\n')
      .map((line) =>
        line.split('').map((cube) => (cube === '#' ? true : false)),
      ),
  ]
}

/**
 * @param {boolean[][][]} cubes
 */
function augmentRegion(cubes) {
  const depth = cubes.length
  const height = cubes[0].length
  const width = cubes[0][0].length
  cubes.unshift(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false),
    ),
  )
  cubes.push(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false),
    ),
  )
  cubes.forEach((layer) => {
    layer.unshift(Array.from({ length: width }, () => false))
    layer.push(Array.from({ length: width }, () => false))
    layer.forEach((row) => {
      row.unshift(false)
      row.push(false)
    })
  })
}

/**
 * @param {boolean[][][]} cubes
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {boolean[]}
 */
function getNeighbors(cubes, x, y, z) {
  const neighbors = []
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) {
          continue
        }
        const layer = cubes[z + dz]
        if (layer === undefined) {
          continue
        }
        const row = layer[y + dy]
        if (row === undefined) {
          continue
        }
        const cube = row[x + dx]
        if (cube === undefined) {
          continue
        }
        neighbors.push(cube)
      }
    }
  }
  return neighbors
}

/**
 * @param {boolean[][][]} cubes
 * @returns {boolean[][][]}
 */
function computeNextState(cubes) {
  return cubes.map((layer, z) =>
    layer.map((row, y) =>
      row.map((cube, x) => {
        const neighborCount = getNeighbors(cubes, x, y, z).filter(
          (cube) => cube,
        ).length
        if ((cube && neighborCount === 2) || neighborCount === 3) {
          return true
        } else if (!cube && neighborCount === 3) {
          return true
        } else {
          return false
        }
      }),
    ),
  )
}

async function part1() {
  let cubes = await readCubes()
  for (let i = 0; i < 6; i++) {
    augmentRegion(cubes)
    cubes = computeNextState(cubes)
  }
  console.log('Part 1:', cubes.flat(3).filter((cube) => cube).length)
}

part1()

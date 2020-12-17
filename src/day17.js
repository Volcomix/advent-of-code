import { readFile } from './file-helper.js'

async function readCubes() {
  const cubes = await readFile(17)
  return cubes
    .split('\n')
    .map((line) => line.split('').map((cube) => (cube === '#' ? true : false)))
}

/**
 * @param {boolean[][][]} cubes
 */
function augmentRegion3d(cubes) {
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
 * @param {boolean[][][][]} cubes
 */
function augmentRegion4d(cubes) {
  const depth = cubes[0].length
  const height = cubes[0][0].length
  const width = cubes[0][0][0].length
  cubes.unshift(
    Array.from({ length: depth }, () =>
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false),
      ),
    ),
  )
  cubes.push(
    Array.from({ length: depth }, () =>
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false),
      ),
    ),
  )
  cubes.forEach((time) => {
    time.unshift(
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false),
      ),
    )
    time.push(
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false),
      ),
    )
    time.forEach((layer) => {
      layer.unshift(Array.from({ length: width }, () => false))
      layer.push(Array.from({ length: width }, () => false))
      layer.forEach((row) => {
        row.unshift(false)
        row.push(false)
      })
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
function getNeighbors3d(cubes, x, y, z) {
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
 * @param {boolean[][][][]} cubes
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} t
 * @returns {boolean[]}
 */
function getNeighbors4d(cubes, x, y, z, t) {
  const neighbors = []
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        for (let dt = -1; dt <= 1; dt++) {
          if (dx === 0 && dy === 0 && dz === 0 && dt === 0) {
            continue
          }
          const time = cubes[t + dt]
          if (time === undefined) {
            continue
          }
          const layer = time[z + dz]
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
  }
  return neighbors
}

/**
 * @param {boolean[][][]} cubes
 * @returns {boolean[][][]}
 */
function computeNextState3d(cubes) {
  return cubes.map((layer, z) =>
    layer.map((row, y) =>
      row.map((cube, x) => {
        const neighborCount = getNeighbors3d(cubes, x, y, z).filter(
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

/**
 * @param {boolean[][][][]} cubes
 * @returns {boolean[][][][]}
 */
function computeNextState4d(cubes) {
  return cubes.map((time, t) =>
    time.map((layer, z) =>
      layer.map((row, y) =>
        row.map((cube, x) => {
          const neighborCount = getNeighbors4d(cubes, x, y, z, t).filter(
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
    ),
  )
}

async function part1() {
  let cubes = [await readCubes()]
  for (let i = 0; i < 6; i++) {
    augmentRegion3d(cubes)
    cubes = computeNextState3d(cubes)
  }
  console.log('Part 1:', cubes.flat(3).filter((cube) => cube).length)
}

async function part2() {
  let cubes = [[await readCubes()]]
  for (let i = 0; i < 6; i++) {
    augmentRegion4d(cubes)
    cubes = computeNextState4d(cubes)
  }
  console.log('Part 2:', cubes.flat(4).filter((cube) => cube).length)
}

part1()
part2()

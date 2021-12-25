import { readFile } from '../../file-helper.js'

const scanners = await readInput()

/** @type {Map<number, [number, number][]>[]} */
const squaredDists = scanners.map((beacons) =>
  beacons.reduce((acc, [x1, y1, z1], beacon1) => {
    beacons.slice(beacon1 + 1).forEach(([x2, y2, z2], beacon2) => {
      const squaredDist =
        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
      const pairs = acc.get(squaredDist) ?? []
      pairs.push([beacon1, beacon1 + beacon2 + 1])
      acc.set(squaredDist, pairs)
    })
    return acc
  }, new Map()),
)

const commonDists = squaredDists.map((scanner1Dists, scanner1) => {
  const scanner1DistsSet = new Set(scanner1Dists.keys())
  return squaredDists
    .slice(scanner1 + 1)
    .map((scanner2Dists) =>
      [...scanner2Dists.keys()].filter((squaredDist) =>
        scanner1DistsSet.has(squaredDist),
      ),
    )
})

/** @type {Map<number, Set<number>>} */
const tree = new Map()
commonDists.forEach((scannerDists, scanner) =>
  scannerDists
    .map((dists, matchingScanner) => [dists, matchingScanner])
    .filter((/** @type {[number[], number]} */ [dists]) => dists.length >= 66)
    .map(
      (/** @type {[number[], number]} */ [_, matchingScanner]) =>
        scanner + matchingScanner + 1,
    )
    .forEach((matchingScanner) => {
      tree.set(scanner, tree.get(scanner) ?? new Set())
      tree.set(matchingScanner, tree.get(matchingScanner) ?? new Set())
      tree.get(scanner).add(matchingScanner)
      tree.get(matchingScanner).add(scanner)
    }),
)

const beacons = new Map()
/** @type {number[][]} */
const scannerCoordinates = []
dfs(0, beacons, scannerCoordinates, (x, y, z) => [x, y, z], new Set())

console.log(
  'Part 1:',
  [...beacons.values()].flatMap((y) =>
    [...y.values()].flatMap((z) => [...z.values()]),
  ).length,
)

console.log(
  'Part 2:',
  Math.max(
    ...scannerCoordinates.flatMap(([x1, y1, z1], i) =>
      scannerCoordinates
        .slice(i + 1)
        .map(
          ([x2, y2, z2]) =>
            Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2),
        ),
    ),
  ),
)

async function readInput() {
  const input = await readFile()
  return input.split('\n\n').map((lines) =>
    lines
      .split('\n')
      .slice(1)
      .map((line) => line.split(',').map(Number)),
  )
}

/**
 * @param {number} scanner
 * @param {Map<number, Map<number, Map<number, number[]>>>} beacons
 * @param {number[][]} scannerCoordinates
 * @param {(x: number, y: number, z: number) => number[]} transform
 * @param {Set<number>} visitedScanners
 */
function dfs(scanner, beacons, scannerCoordinates, transform, visitedScanners) {
  if (visitedScanners.has(scanner)) {
    return
  }
  for (const [x, y, z] of scanners[scanner].map(([x, y, z]) =>
    transform(x, y, z),
  )) {
    beacons.set(x, beacons.get(x) ?? new Map())
    beacons.get(x).set(y, beacons.get(x).get(y) ?? new Map())
    beacons.get(x).get(y).set(z, [x, y, z])
  }
  scannerCoordinates.push(transform(0, 0, 0))
  visitedScanners.add(scanner)
  for (const matchingScanner of tree.get(scanner).values()) {
    const nextTransform = getTransformation(scanner, matchingScanner)
    dfs(
      matchingScanner,
      beacons,
      scannerCoordinates,
      pipe(nextTransform, transform),
      visitedScanners,
    )
  }
  return
}

/**
 * @param {number} scanner
 * @param {number} matchingScanner
 */
function getTransformation(scanner, matchingScanner) {
  const [scanner1, scanner2] = [scanner, matchingScanner].sort((a, b) => a - b)

  const commonDist = commonDists[scanner1][scanner2 - scanner1 - 1].find(
    (dist) =>
      (squaredDists[scanner].get(dist).length === 1 &&
        squaredDists[matchingScanner].get(dist).length) === 1,
  )

  const scannerPair = squaredDists[scanner]
    .get(commonDist)[0]
    .map((beacon) => scanners[scanner][beacon])
  const matchingScannerPair = squaredDists[matchingScanner]
    .get(commonDist)[0]
    .map((beacon) => scanners[matchingScanner][beacon])

  for (const rotate of getAllRotations()) {
    for (let i = 0; i < 2; i++) {
      const [x1, y1, z1] = rotate(...matchingScannerPair[i])
      const dx1 = x1 - scannerPair[0][0]
      const dy1 = y1 - scannerPair[0][1]
      const dz1 = z1 - scannerPair[0][2]

      const [x2, y2, z2] = rotate(...matchingScannerPair[1 - i])
      const dx2 = x2 - scannerPair[1][0]
      const dy2 = y2 - scannerPair[1][1]
      const dz2 = z2 - scannerPair[1][2]

      if (dx1 === dx2 && dy1 === dy2 && dz1 === dz2) {
        const transform = pipe(rotate, (x, y, z) => [x - dx1, y - dy1, z - dz1])
        return transform
      }
    }
  }

  throw new Error('No transformation found')
}

function* getAllRotations() {
  yield* get4UpRotations((x, y, z) => [x, y, z])
  yield* get4UpRotations((x, y, z) => [z, y, -x])
  yield* get4UpRotations((x, y, z) => [-x, y, -z])
  yield* get4UpRotations((x, y, z) => [-z, y, x])
  yield* get4UpRotations((x, y, z) => [x, -z, y])
  yield* get4UpRotations((x, y, z) => [x, z, -y])
}

/**
 * @param {(x: number, y: number, z: number) => number[]} transform
 */
function* get4UpRotations(transform) {
  yield pipe(transform, (x, y, z) => [x, y, z])
  yield pipe(transform, (x, y, z) => [-y, x, z])
  yield pipe(transform, (x, y, z) => [-x, -y, z])
  yield pipe(transform, (x, y, z) => [y, -x, z])
}

/**
 * @param {((x: number, y: number, z: number) => number[])[]} transforms
 */
function pipe(...transforms) {
  return (
    /** @type {number} */ x,
    /** @type {number} */ y,
    /** @type {number} */ z,
  ) => {
    for (const transform of transforms) {
      const [nextX, nextY, nextZ] = transform(x, y, z)
      x = nextX
      y = nextY
      z = nextZ
    }
    return [x, y, z]
  }
}

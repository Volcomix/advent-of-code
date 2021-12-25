import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const scanners = await readInput()
  // console.log(scanners)

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
  // console.log(squaredDists)

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
  // console.log(commonDists)

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
  // console.log(tree)
  // console.log([...tree.keys()].sort((a, b) => a - b))

  const beacons = [
    ...dfs(
      0,
      [],
      (x, y, z) => [x, y, z],
      new Set(),
      tree,
      scanners,
      squaredDists,
      commonDists,
    )
      .reduce((acc, [x, y, z]) => {
        acc.set(x, acc.get(x) ?? new Map())
        acc.get(x).set(y, acc.get(x).get(y) ?? new Map())
        acc.get(x).get(y).set(z, [x, y, z])
        return acc
      }, new Map())
      .values(),
  ].flatMap((y) => [...y.values()].flatMap((z) => [...z.values()]))

  console.log('Part 1:', beacons.length)
}

async function part2() {}

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
 * @param {number[][]} beacons
 * @param {(x: number, y: number, z: number) => number[]} transform
 * @param {Set<number>} visitedScanners
 * @param {Map<number, Set<number>>} tree
 * @param {number[][][]} scanners
 * @param {Map<number, [number, number][]>[]} squaredDists
 * @param {number[][][]} commonDists
 */
function dfs(
  scanner,
  beacons,
  transform,
  visitedScanners,
  tree,
  scanners,
  squaredDists,
  commonDists,
) {
  if (visitedScanners.has(scanner)) {
    return beacons
  }
  beacons.push(...scanners[scanner].map(([x, y, z]) => transform(x, y, z)))
  visitedScanners.add(scanner)
  for (const matchingScanner of tree.get(scanner).values()) {
    // console.log(scanner, matchingScanner)
    const nextTransform = getTransformation(
      scanner,
      matchingScanner,
      scanners,
      squaredDists,
      commonDists,
    )
    dfs(
      matchingScanner,
      beacons,
      pipe(nextTransform, transform),
      visitedScanners,
      tree,
      scanners,
      squaredDists,
      commonDists,
    )
  }
  return beacons
}

/**
 * @param {number} scanner
 * @param {number} matchingScanner
 * @param {number[][][]} scanners
 * @param {Map<number, [number, number][]>[]} squaredDists
 * @param {number[][][]} commonDists
 */
function getTransformation(
  scanner,
  matchingScanner,
  scanners,
  squaredDists,
  commonDists,
) {
  const [scanner1, scanner2] = [scanner, matchingScanner].sort((a, b) => a - b)

  const commonDist = commonDists[scanner1][scanner2 - scanner1 - 1].find(
    (dist) =>
      (squaredDists[scanner].get(dist).length === 1 &&
        squaredDists[matchingScanner].get(dist).length) === 1,
  )
  // console.log(commonDist)

  const scannerPair = squaredDists[scanner]
    .get(commonDist)[0]
    .map((beacon) => scanners[scanner][beacon])
  const matchingScannerPair = squaredDists[matchingScanner]
    .get(commonDist)[0]
    .map((beacon) => scanners[matchingScanner][beacon])
  // console.log(scannerPair, matchingScannerPair)

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
        // console.log(matchingScannerPair.map(([x, y, z]) => transform(x, y, z)))
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

// for (const rotate of getAllRotations()) {
//   console.log(rotate(1, 2, 3))
// }

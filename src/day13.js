import { readFile } from './file-helper.js'

async function readInput() {
  const input = await readFile(13)
  const [minTimestamp, buses] = input.split('\n')
  return {
    minTimestamp: BigInt(minTimestamp),
    buses: buses.split(',').map((bus) => (bus === 'x' ? null : BigInt(bus))),
  }
}

async function part1() {
  const { minTimestamp, buses } = await readInput()
  const [bus, timestamp] = buses
    .filter((bus) => bus !== null)
    .map((bus) => {
      for (let timestamp = 0n; ; timestamp += bus) {
        if (timestamp >= minTimestamp) {
          return [bus, timestamp]
        }
      }
    })
    .reduce(
      (min, [bus, timestamp]) => {
        if (timestamp < min[1]) {
          return [bus, timestamp]
        } else {
          return min
        }
      },
      [null, Infinity],
    )
  console.log('Part 1:', bus * (timestamp - minTimestamp))
}

/**
 * @param {bigint} a
 * @param {bigint} b
 */
function gcdTwoNumbers(a, b) {
  while (b) {
    var t = b
    b = a % b
    a = t
  }
  return a
}

/**
 * @param {bigint} a
 * @param {bigint} b
 */
function extendedGcdTwoNumbers(a, b) {
  let s = 0n
  let oldS = 1n
  let r = b
  let oldR = a

  while (r) {
    const quotient = oldR / r
    const provR = r
    r = oldR - quotient * r
    oldR = provR
    const provS = s
    s = oldS - quotient * s
    oldS = provS
  }
  const bezoutT = b === 0n ? 0n : (oldR - oldS * a) / b
  return {
    bezoutCoeffs: [oldS, bezoutT],
    gcd: oldR,
  }
}

/**
 * @param {bigint[]} numbers
 */
function extendedGcdMoreThanTwoNumbers(numbers) {
  if (numbers.length === 2) {
    return extendedGcdTwoNumbers(numbers[0], numbers[1])
  }
  const { bezoutCoeffs, gcd } = extendedGcdMoreThanTwoNumbers(numbers.slice(1))
  const {
    bezoutCoeffs: [x, y],
    gcd: g,
  } = extendedGcdTwoNumbers(numbers[0], gcd)
  return {
    bezoutCoeffs: [x, ...bezoutCoeffs.map((/** @type {bigint} */ n) => n * y)],
    gcd: g,
  }
}

/**
 * @param {bigint[]} numbers
 */
function gcdMoreThanTwoNumbers(numbers) {
  let a = numbers[0]
  for (let i = 1; i < numbers.length; i++) {
    const b = numbers[i]
    a = gcdTwoNumbers(a, b)
  }
  return a
}

/**
 * @param {bigint[]} numbers
 */
function lcm(numbers) {
  return (
    numbers.reduce((multiple, x) => multiple * x, 1n) /
    gcdMoreThanTwoNumbers(numbers)
  )
}

async function part2() {
  const { buses } = await readInput()
  const busWithDelays = buses
    .map((bus, delay) => [bus, BigInt(delay)])
    .filter(([bus]) => bus !== null)
    .sort((a, b) => (b[0] === a[0] ? 0 : b[0] > a[0] ? 1 : -1))
  console.log(busWithDelays)
  console.log(extendedGcdMoreThanTwoNumbers(busWithDelays.map(([bus]) => bus)))
  console.log(lcm(busWithDelays.map(([bus]) => bus)))
  return
  const [firstBus, firstDelay] = busWithDelays[0]
  let timestamp = 0n
  let isAnswer = false
  while (!isAnswer) {
    timestamp += firstBus
    isAnswer = true
    for (let i = 1; isAnswer && i < busWithDelays.length; i++) {
      const [bus, delay] = busWithDelays[i]
      if ((timestamp - firstDelay + delay) % bus !== 0n) {
        isAnswer = false
      }
    }
  }
  console.log('Part 2:', timestamp - firstDelay)
}

// part1()
part2()

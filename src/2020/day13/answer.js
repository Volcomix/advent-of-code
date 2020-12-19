import { readFile } from '../../file-helper.js'

async function readInput() {
  const input = await readFile()
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

/**
 * @param {bigint[]} a
 * @param {bigint[]} b
 */
function trySomething(a, b) {
  const { bezoutCoeffs, gcd } = extendedGcdTwoNumbers(a[0], b[0])
  const r = lcm([a[0], b[0]])
  const x = b[1] - a[1]
  console.log(
    a,
    b,
    bezoutCoeffs,
    gcd,
    r,
    (r + ((x * bezoutCoeffs[0] * a[0]) % r)) % r,
    (r + ((-x * bezoutCoeffs[1] * b[0]) % r)) % r,
  )
}

async function part2() {
  if (false) {
    trySomething([7n, 0n], [13n, 1n])
    trySomething([7n, 0n], [59n, 4n])
    console.log(lcm([91n, 413n]))
    // trySomething([13n, 1n], [59n, 4n])
    // trySomething([7n, 0n], [19n, 7n])
    return
  }

  const { buses } = await readInput()
  const busWithDelays = buses
    .map((bus, delay) => [bus, BigInt(delay)])
    .filter(([bus]) => bus !== null)
    .sort((a, b) => (b[0] === a[0] ? 0 : b[0] > a[0] ? 1 : -1))
  console.log(busWithDelays)
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

/**
 * @param {bigint} a1
 * @param {bigint} n1
 * @param {bigint} a2
 * @param {bigint} n2
 */
function test(a1, n1, a2, n2) {
  const { bezoutCoeffs, gcd } = extendedGcdTwoNumbers(n1, n2)
  console.log(bezoutCoeffs, gcd)
  let offset = a1 + bezoutCoeffs[0] * n1 * a2
  if (offset < 0n) {
    offset *= -1n
  }
  return offset
}

/**
 * @param {bigint} a
 * @param {bigint} modulus
 */
function modularMultiplicativeInverse(a, modulus) {
  // Calculate current value of a mod modulus
  const b = BigInt(a % modulus)

  // We brute force the search for the smaller hipothesis, as we know that the number must exist between the current given modulus and 1
  for (let hipothesis = 1n; hipothesis <= modulus; hipothesis++) {
    if ((b * hipothesis) % modulus == 1n) return hipothesis
  }
  // If we do not find it, we return 1
  return 1n
}

/**
 *
 * @param {bigint[]} remainders
 * @param {bigint[]} modules
 */
function solveCRT(remainders, modules) {
  // Multiply all the modulus
  const prod = modules.reduce((acc, val) => acc * val, 1n)

  return (
    modules.reduce((sum, mod, index) => {
      // Find the modular multiplicative inverse and calculate the sum
      // SUM( remainder * productOfAllModulus/modulus * MMI ) (mod productOfAllModulus)
      const p = prod / mod
      return sum + remainders[index] * modularMultiplicativeInverse(p, mod) * p
    }, 0n) % prod
  )
}

async function part2Reloaded() {
  const { buses } = await readInput()
  const busesWithDelays = buses
    .map((bus, delay) => [bus, BigInt(delay)])
    .filter(([bus]) => bus !== null)
    .map(([bus, delay]) => [bus, bus - delay])
  // .sort((a, b) => (b[0] === a[0] ? 0 : b[0] > a[0] ? 1 : -1))

  const remainders = busesWithDelays.map(([bus, delay]) => delay)
  const modules = busesWithDelays.map(([bus, delay]) => bus)
  console.log('Part 2:', solveCRT(remainders, modules))
}

part1()
// part2()
part2Reloaded()

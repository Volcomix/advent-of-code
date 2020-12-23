import { readFile } from '../../file-helper.js'

async function readCupNumbers() {
  const input = await readFile()
  return input.split('').map(Number)
}

const pickedUpCups = [0, 0, 0]

/**
 * @param {Map<number, number>} cups
 * @param {number} currentCup
 * @param {number} maxCup
 */
function playMove(cups, currentCup, maxCup) {
  let pickedUpCup = cups.get(currentCup)
  for (let i = 0; i < 3; i++) {
    pickedUpCups[i] = pickedUpCup
    pickedUpCup = cups.get(pickedUpCup)
    cups.delete(pickedUpCups[i])
  }
  cups.set(currentCup, pickedUpCup)
  let destinationCup = currentCup
  do {
    destinationCup = destinationCup - 1
    if (destinationCup === 0) {
      destinationCup = maxCup
    }
  } while (!cups.has(destinationCup))
  for (let i = 0; i < 3; i++) {
    const destinationClockwiseCup = cups.get(destinationCup)
    cups.set(destinationCup, pickedUpCups[i])
    cups.set(pickedUpCups[i], destinationClockwiseCup)
    destinationCup = pickedUpCups[i]
  }
}

async function part1() {
  const cupNumbers = await readCupNumbers()

  /** @type {Map<number, number>} */
  const cups = new Map()

  for (let i = 0; i < cupNumbers.length; i++) {
    if (i === cupNumbers.length - 1) {
      cups.set(cupNumbers[i], cupNumbers[0])
    } else {
      cups.set(cupNumbers[i], cupNumbers[i + 1])
    }
  }
  let currentCup = cupNumbers[0]
  for (let move = 0; move < 100; move++) {
    playMove(cups, currentCup, 9)
    currentCup = cups.get(currentCup)
  }
  const result = []
  let cup = cups.get(1)
  while (cup !== 1) {
    result.push(cup)
    cup = cups.get(cup)
  }
  console.log('Part 1:', result.join(''))
}

async function part2() {
  const cupNumbers = await readCupNumbers()

  /** @type {Map<number, number>} */
  const cups = new Map()

  for (let i = 0; i < cupNumbers.length - 1; i++) {
    cups.set(cupNumbers[i], cupNumbers[i + 1])
  }
  let previousCup = cupNumbers[cupNumbers.length - 1]
  for (let i = 10; i <= 1000000; i++) {
    cups.set(previousCup, i)
    previousCup = i
  }
  cups.set(previousCup, cupNumbers[0])
  let currentCup = cupNumbers[0]
  for (let move = 0; move < 10000000; move++) {
    playMove(cups, currentCup, 1000000)
    currentCup = cups.get(currentCup)
  }
  let star1Cup = cups.get(1)
  let star2Cup = cups.get(star1Cup)
  console.log('Part 2:', star1Cup * star2Cup)
}

part1()
part2()

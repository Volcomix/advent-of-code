import { readFile } from '../../file-helper.js'

async function main() {
  const input = await readFile()
  const cupNumbers = input.split('').map(Number)

  /** @type {Map<number, number>} */
  const cups = new Map()

  const pickedUpCups = [0, 0, 0]

  for (let i = 0; i < cupNumbers.length; i++) {
    if (i === cupNumbers.length - 1) {
      cups.set(cupNumbers[i], cupNumbers[0])
    } else {
      cups.set(cupNumbers[i], cupNumbers[i + 1])
    }
  }
  let currentCup = cupNumbers[0]
  for (let move = 0; move < 100; move++) {
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
        destinationCup = 9
      }
    } while (!cups.has(destinationCup))
    for (let i = 0; i < 3; i++) {
      const destinationClockwiseCup = cups.get(destinationCup)
      cups.set(destinationCup, pickedUpCups[i])
      cups.set(pickedUpCups[i], destinationClockwiseCup)
      destinationCup = pickedUpCups[i]
    }
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

main()

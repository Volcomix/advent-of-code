import { readFile } from '../../file-helper.js'

/**
 * @param {string[]} lines
 * @param {number} bit
 */
function bitValueCounts(lines, bit) {
  const counts = [0, 0]
  for (const line of lines) {
    counts[Number(line[bit])]++
  }
  return counts
}

/**
 * @param {string[]} lines
 * @param {number} bit
 */
function mostCommonBitValue(lines, bit) {
  const counts = bitValueCounts(lines, bit)
  return counts[0] > counts[1] ? 0 : 1
}

/**
 * @param {string[]} lines
 * @param {number} bit
 */
function leastCommonBitValue(lines, bit) {
  const counts = bitValueCounts(lines, bit)
  return counts[0] <= counts[1] ? 0 : 1
}

async function part1() {
  const input = await readFile()
  const lines = input.split('\n')

  const length = lines[0].length

  let gammaRateBin = ''
  for (let bit = 0; bit < length; bit++) {
    gammaRateBin += mostCommonBitValue(lines, bit)
  }
  const gammaRate = parseInt(gammaRateBin, 2)

  const epsilonRateBin = [...gammaRateBin]
    .map((c) => (c === '0' ? '1' : '0'))
    .join('')

  const epsilonRate = parseInt(epsilonRateBin, 2)

  console.log('Part 1:', gammaRate * epsilonRate)
}

async function part2() {
  const input = await readFile()
  const lines = input.split('\n')

  const length = lines[0].length

  let remainingLines = [...lines]
  for (let bit = 0; bit < length && remainingLines.length > 1; bit++) {
    const bitCriteria = mostCommonBitValue(remainingLines, bit).toString()
    remainingLines = remainingLines.filter((line) => line[bit] === bitCriteria)
  }
  const oxygenGeneratorRating = parseInt(remainingLines[0], 2)

  remainingLines = [...lines]
  for (let bit = 0; bit < length && remainingLines.length > 1; bit++) {
    const bitCriteria = leastCommonBitValue(remainingLines, bit).toString()
    remainingLines = remainingLines.filter((line) => line[bit] === bitCriteria)
  }
  const CO2ScrubberRating = parseInt(remainingLines[0], 2)

  console.log('Part 2:', oxygenGeneratorRating * CO2ScrubberRating)
}

part1()
part2()

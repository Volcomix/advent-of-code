import { readFile } from '../../file-helper.js'

async function part1() {
  const input = await readFile()
  const lines = input.split('\n')

  const length = lines[0].length

  let gammaRateBin = ''
  for (let bit = 0; bit < length; bit++) {
    let counts = [0, 0]
    for (const line of lines) {
      counts[Number(line[bit])]++
    }
    gammaRateBin += counts[0] > counts[1] ? '0' : '1'
  }
  const gammaRate = parseInt(gammaRateBin, 2)

  const epsilonRateBin = [...gammaRateBin]
    .map((c) => (c === '0' ? '1' : '0'))
    .join('')

  const epsilonRate = parseInt(epsilonRateBin, 2)

  console.log('Part 1:', gammaRate * epsilonRate)
}

part1()

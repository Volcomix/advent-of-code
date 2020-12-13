import { readFile } from './file-helper.js'

async function readInput() {
  const input = await readFile(13)
  const [minTimestamp, buses] = input.split('\n')
  return {
    minTimestamp: Number(minTimestamp),
    buses: buses
      .split(',')
      .filter((bus) => bus !== 'x')
      .map(Number),
  }
}

async function part1() {
  const { minTimestamp, buses } = await readInput()
  const [bus, timestamp] = buses
    .map((bus) => {
      for (let timestamp = 0; ; timestamp += bus) {
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

part1()

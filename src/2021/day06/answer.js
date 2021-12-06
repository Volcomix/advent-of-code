import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const timers = await readInput()
  for (let day = 0; day < 80; day++) {
    const timersLength = timers.length
    for (let i = 0; i < timersLength; i++) {
      const timer = timers[i]
      if (timer === 0) {
        timers[i] = 6
        timers.push(8)
      } else {
        timers[i] = timer - 1
      }
    }
  }
  console.log('Part 1:', timers.length)
}

async function part2() {
  const input = await readFile()
  let timers = input.split(',').map(Number)

  const timerCounts = Array.from({ length: 9 }, () => 0)

  for (const timer of timers) {
    timerCounts[timer]++
  }

  for (let day = 0; day < 256; day++) {
    const newTimerCount = timerCounts.shift()
    timerCounts[6] += newTimerCount
    timerCounts.push(newTimerCount)
  }

  console.log(
    'Part 2:',
    timerCounts.reduce((acc, timer) => acc + timer, 0),
  )
}

async function readInput() {
  const input = await readFile()
  return input.split(',').map(Number)
}

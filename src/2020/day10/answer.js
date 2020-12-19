import { readFile } from '../../file-helper.js'

async function readAdapters() {
  let adapters = await readFile()
  adapters = adapters.split('\n').map(Number)
  adapters.push(0)
  adapters.sort((a, b) => a - b)
  adapters.push(adapters[adapters.length - 1] + 3)
  return adapters
}

async function part1() {
  const adapters = await readAdapters()
  const diffs = new Map(Array.from({ length: 3 }, (_, k) => [k + 1, 0]))
  for (let i = 0; i < adapters.length - 1; i++) {
    const diff = adapters[i + 1] - adapters[i]
    diffs.set(diff, diffs.get(diff) + 1)
  }
  console.log('Part 1:', diffs.get(1) * diffs.get(3))
}

async function part2() {
  const adapters = await readAdapters()
  const counts = new Map([[adapters[adapters.length - 1], 1]])
  const previousAdapters = [adapters[adapters.length - 1], Infinity, Infinity]
  for (let i = adapters.length - 2; i >= 0; i--) {
    const adapter = adapters[i]
    counts.set(
      adapter,
      previousAdapters
        .filter((a) => a - adapter <= 3)
        .reduce((sum, a) => sum + counts.get(a), 0),
    )
    previousAdapters.pop()
    previousAdapters.unshift(adapter)
  }
  console.log('Part 2:', counts.get(0))
}

part1()
part2()

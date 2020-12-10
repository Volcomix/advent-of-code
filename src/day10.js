import { readFile } from './file-helper.js'

async function readAdapters() {
  let adapters = await readFile(10)
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

part1()

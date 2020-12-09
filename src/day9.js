import { readFile } from './file-helper.js'

async function readXmas() {
  const xmas = await readFile(9)
  return xmas.split('\n').map(Number)
}

async function part1() {
  const xmas = await readXmas()
  const preambleSize = 25
  for (let i = preambleSize; i < xmas.length; i++) {
    let isFound = false
    for (let j = i - preambleSize; !isFound && j < i; j++) {
      for (let k = j + 1; !isFound && k < i; k++) {
        if (xmas[j] + xmas[k] === xmas[i]) {
          isFound = true
        }
      }
    }
    if (!isFound) {
      console.log(xmas[i])
      break
    }
  }
}

part1()

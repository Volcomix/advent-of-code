import { readFile } from '../../file-helper.js'

await part1()

async function part1() {
  let map = await readInput()
  for (let i = 1; ; i++) {
    const { map: nextMap, isStuck } = step(map)
    if (isStuck) {
      console.log('Part 1:', i)
      break
    }
    map = nextMap
  }
}

async function readInput() {
  const input = await readFile()
  return input.split('\n').map((line) => line.split(''))
}

/**
 * @param {string[][]} map
 */
function step(map) {
  let isStuck = true
  map = map.map((row) =>
    row.map((cell, x) => {
      if (cell === '>' && row[(x + 1) % row.length] === '.') {
        isStuck = false
        return '.'
      }
      if (cell === '.' && row[(x - 1 + row.length) % row.length] === '>') {
        return '>'
      }
      return cell
    }),
  )
  map = map.map((row, y) =>
    row.map((cell, x) => {
      if (cell === 'v' && map[(y + 1) % map.length][x] === '.') {
        isStuck = false
        return '.'
      }
      if (cell === '.' && map[(y - 1 + map.length) % map.length][x] === 'v') {
        return 'v'
      }
      return cell
    }),
  )
  return { map, isStuck }
}

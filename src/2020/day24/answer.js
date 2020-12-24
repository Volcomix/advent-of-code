import { readFile } from '../../file-helper.js'

const moves = {
  e: [0, 1, -1],
  w: [0, -1, 1],
  se: [1, 0, -1],
  nw: [-1, 0, 1],
  ne: [-1, 1, 0],
  sw: [1, -1, 0],
}

async function readDirections() {
  const input = await readFile()
  return input.split('\n').map((tile) => {
    /** @type {Array<keyof moves>} */ const directions = []
    let i = 0
    while (i < tile.length) {
      if (tile[i] === 'e') {
        directions.push('e')
        i++
      } else if (tile[i] === 'w') {
        directions.push('w')
        i++
      } else if (tile.substring(i, i + 2) === 'se') {
        directions.push('se')
        i += 2
      } else if (tile.substring(i, i + 2) === 'nw') {
        directions.push('nw')
        i += 2
      } else if (tile.substring(i, i + 2) === 'ne') {
        directions.push('ne')
        i += 2
      } else if (tile.substring(i, i + 2) === 'sw') {
        directions.push('sw')
        i += 2
      }
    }
    return directions
  })
}

async function main() {
  const directions = await readDirections()
  /** @type {Set<string>} */ const blackTiles = new Set()
  for (const tile of directions) {
    const position = [0, 0, 0]
    for (const direction of tile) {
      for (let i = 0; i < 3; i++) {
        position[i] += moves[direction][i]
      }
    }
    const positionKey = position.join(',')
    if (blackTiles.has(positionKey)) {
      blackTiles.delete(positionKey)
    } else {
      blackTiles.add(positionKey)
    }
  }
  console.log('Part 1:', blackTiles.size)
}

main()

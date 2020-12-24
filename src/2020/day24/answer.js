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

/**
 * @param {string} tile
 */
function getNeihbors(tile) {
  const coordinates = tile.split(',').map(Number)
  return Object.values(moves)
    .map((move) => coordinates.map((coordinate, i) => coordinate + move[i]))
    .map((neighbor) => neighbor.join(','))
}

/**
 * @param {string} tile
 * @param {Set<string>} blackTiles
 */
function getBlackNeighbors(tile, blackTiles) {
  return getNeihbors(tile).filter((neighbor) => blackTiles.has(neighbor))
}

/**
 * @param {string} tile
 * @param {Set<string>} blackTiles
 */
function getWhiteNeighbors(tile, blackTiles) {
  return getNeihbors(tile).filter((neighbor) => !blackTiles.has(neighbor))
}

/**
 * @param {Set<string>} blackTiles
 */
function getNextState(blackTiles) {
  /** @type {Set<string>} */ const whiteTiles = new Set(
    [...blackTiles].flatMap((tile) => getWhiteNeighbors(tile, blackTiles)),
  )
  /** @type {Set<string>} */ const nextBlackTiles = new Set()
  for (const tile of blackTiles) {
    const blackNeighbors = getBlackNeighbors(tile, blackTiles)
    if (blackNeighbors.length > 0 && blackNeighbors.length <= 2) {
      nextBlackTiles.add(tile)
    }
  }
  for (const tile of whiteTiles) {
    const blackNeighbors = getBlackNeighbors(tile, blackTiles)
    if (blackNeighbors.length === 2) {
      nextBlackTiles.add(tile)
    }
  }
  return nextBlackTiles
}

async function main() {
  const directions = await readDirections()
  /** @type {Set<string>} */ let blackTiles = new Set()
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

  for (let i = 0; i < 100; i++) {
    blackTiles = getNextState(blackTiles)
  }
  console.log('Part 2:', blackTiles.size)
}

main()

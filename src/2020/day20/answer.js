import { readFile } from '../../file-helper.js'

/**
 * @param {string} pixels
 * @returns {number}
 */
function encodeBorder(pixels) {
  const binary = [...pixels]
    .map((pixel) => (pixel === '#' ? '1' : '0'))
    .join('')

  const binaryFlipped = [...binary].reverse().join('')
  const encoded = parseInt(binary, 2)
  const encodedFlipped = parseInt(binaryFlipped, 2)
  return Math.min(encoded, encodedFlipped)
}

async function part1() {
  const tiles = await readFile()

  const encodedTiles = tiles
    .split('\n\n')
    .map((tile) => tile.split('\n'))
    .map(([id, ...pixels]) => {
      return {
        id: +id.match(/^Tile (\d+):$/)[1],
        borders: new Set([
          encodeBorder(pixels[0]),
          encodeBorder(pixels[pixels.length - 1]),
          encodeBorder(pixels.map((row) => row[0]).join('')),
          encodeBorder(pixels.map((row) => row[row.length - 1]).join('')),
        ]),
      }
    })

  const indexedTiles = encodedTiles.reduce((acc, tile) => {
    for (const border of tile.borders) {
      if (acc.has(border)) {
        acc.get(border).add(tile.id)
      } else {
        acc.set(border, new Set([tile.id]))
      }
    }
    return acc
  }, new Map())

  const counts = new Map(encodedTiles.map((tile) => [tile.id, 0]))

  for (const [_, tileIds] of indexedTiles) {
    if (tileIds.size === 2) {
      for (const tileId of tileIds) {
        counts.set(tileId, counts.get(tileId) + 1)
      }
    } else if (tileIds.size !== 1) {
      throw new Error('Encoding does not allow to answer the puzze')
    }
  }

  const answer = [...counts]
    .filter(([_, count]) => count === 2)
    .reduce((acc, [tileId]) => acc * tileId, 1)

  console.log('Part 1:', answer)
}

part1()

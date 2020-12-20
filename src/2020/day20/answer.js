import { readFile } from '../../file-helper.js'

async function readTiles() {
  const tiles = await readFile()
  return new Map(
    tiles
      .split('\n\n')
      .map((tile) => tile.split('\n'))
      .map(([id, ...pixels]) => [+id.match(/^Tile (\d+):$/)[1], pixels]),
  )
}

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

/**
 * @param {string[]} pixels
 */
function rotate(pixels) {
  return Array.from({ length: pixels[0].length }, (_, i) =>
    pixels.map((row) => row[row.length - i - 1]).join(''),
  )
}

/**
 * @param {string[]} pixels
 */
function flipY(pixels) {
  return pixels.reverse()
}

/**
 * @param {string[]} pixels
 */
function flipX(pixels) {
  return pixels.map((row) => [...row].reverse().join(''))
}

const monster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `
  .split('\n')
  .map((row) => row.replace(/ /g, '.'))

/**
 * @param {string[]} pixels
 */
function countMonsters(pixels) {
  let count = 0
  for (let y = 0; y < pixels.length - monster.length; y++) {
    for (let x = 0; x < pixels.length - monster[0].length; x++) {
      if (
        new RegExp(monster[0]).test(pixels[y].substr(x, monster[0].length)) &&
        new RegExp(monster[1]).test(
          pixels[y + 1].substr(x, monster[1].length),
        ) &&
        new RegExp(monster[2]).test(pixels[y + 2].substr(x, monster[2].length))
      ) {
        count++
      }
    }
  }
  return count
}

/**
 * @param {string[]} pixels
 */
function countHashes(pixels) {
  return pixels.reduce(
    (count, row) => count + [...row].filter((char) => char === '#').length,
    0,
  )
}

async function main() {
  const tiles = await readTiles()
  const encodedTiles = new Map(
    [...tiles].map(([id, pixels]) => [
      id,
      [
        encodeBorder(pixels[0]),
        encodeBorder(pixels.map((row) => row[row.length - 1]).join('')),
        encodeBorder(pixels[pixels.length - 1]),
        encodeBorder(pixels.map((row) => row[0]).join('')),
      ],
    ]),
  )

  /** @type {Map<number, number[]>} */
  const indexedTiles = [...encodedTiles].reduce((acc, [id, borders]) => {
    for (const border of borders) {
      if (acc.has(border)) {
        acc.get(border).push(id)
      } else {
        acc.set(border, [id])
      }
    }
    return acc
  }, new Map())

  const counts = new Map([...tiles.keys()].map((id) => [id, 0]))

  for (const [_, tileIds] of indexedTiles) {
    if (tileIds.length === 2) {
      for (const tileId of tileIds) {
        counts.set(tileId, counts.get(tileId) + 1)
      }
    } else if (tileIds.length !== 1) {
      throw new Error('Encoding does not allow to answer the puzze')
    }
  }

  const corners = [...counts]
    .filter(([_, count]) => count === 2)
    .map(([tileId]) => tileId)
  const answer = corners.reduce((acc, tileId) => acc * tileId, 1)

  console.log('Part 1:', answer)

  const orderedTiles = []

  let leftTileId = corners[0]
  let leftPixels = tiles.get(leftTileId)
  let topBorder = encodeBorder(leftPixels[0])
  let leftBorder = encodeBorder(leftPixels.map((row) => row[0]).join(''))
  while (
    indexedTiles.get(topBorder).length !== 1 ||
    indexedTiles.get(leftBorder).length !== 1
  ) {
    leftPixels = rotate(leftPixels)
    topBorder = encodeBorder(leftPixels[0])
    leftBorder = encodeBorder(leftPixels.map((row) => row[0]).join(''))
  }

  while (leftPixels) {
    orderedTiles.push([leftPixels.slice(1, -1).map((row) => row.slice(1, -1))])

    let rightBorder = leftPixels.map((row) => row[row.length - 1]).join('')

    let tileId = indexedTiles
      .get(encodeBorder(rightBorder))
      .find((id) => id !== leftTileId)

    let pixels = tiles.get(tileId)

    while (pixels) {
      while (true) {
        let leftBorder = pixels.map((row) => row[0]).join('')
        if (leftBorder === rightBorder) {
          break
        }
        pixels = flipY(pixels)
        leftBorder = pixels.map((row) => row[0]).join('')
        if (leftBorder === rightBorder) {
          break
        }
        pixels = rotate(flipY(pixels))
      }

      orderedTiles[orderedTiles.length - 1].push(
        pixels.slice(1, -1).map((row) => row.slice(1, -1)),
      )

      rightBorder = pixels.map((row) => row[row.length - 1]).join('')
      tileId = indexedTiles
        .get(encodeBorder(rightBorder))
        .find((id) => id !== tileId)
      if (tileId === undefined) {
        pixels = null
      } else {
        pixels = tiles.get(tileId)
      }
    }

    let bottomBorder = leftPixels[leftPixels.length - 1]

    leftTileId = indexedTiles
      .get(encodeBorder(bottomBorder))
      .find((id) => id !== leftTileId)

    if (leftTileId === undefined) {
      break
    }

    leftPixels = tiles.get(leftTileId)

    while (true) {
      let topBorder = leftPixels[0]
      if (topBorder === bottomBorder) {
        break
      }
      leftPixels = flipX(leftPixels)
      topBorder = leftPixels[0]
      if (topBorder === bottomBorder) {
        break
      }
      leftPixels = rotate(flipX(leftPixels))
    }
  }

  let image = orderedTiles.flatMap((row) =>
    Array.from({ length: row[0].length }, (_, i) =>
      row.map((subrow) => subrow[i]).join(''),
    ),
  )

  let count = 0
  while (true) {
    count = countMonsters(image)
    if (count) {
      break
    }
    image = flipY(image)
    count = countMonsters(image)
    if (count) {
      break
    }
    image = rotate(flipY(image))
  }

  console.log('Part 2:', countHashes(image) - count * countHashes(monster))
}

main()

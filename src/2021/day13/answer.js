import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  let { dots, folds } = await readInput()
  dots = applyFold(folds[0], dots)
  console.log(
    'Part 1:',
    dots.reduce(
      (dotCount, column) => dotCount + column.filter(Boolean).length,
      0,
    ),
  )
}

async function part2() {
  let { dots, folds } = await readInput()
  dots = folds.reduce((acc, fold) => applyFold(fold, acc), dots)

  console.log()
  console.log('Part 2:')
  console.log()

  for (let y = 0; y < dots[0].length; y++) {
    const row = []
    for (let x = 0; x < dots.length; x++) {
      row.push(dots[x][y] ? '#' : ' ')
    }
    console.log(row.join(''))
  }
  console.log()
}

async function readInput() {
  const input = await readFile()
  const [dotLines, foldLines] = input.split('\n\n')

  const dotPositions = dotLines
    .split('\n')
    .map((line) => line.split(',').map(Number))

  const folds = foldLines.split('\n').map((line) => {
    const [axis, position] = line.split('=')
    return { axis: axis.slice(-1), position: Number(position) }
  })

  const { position: firstXFold } = folds.find((fold) => fold.axis === 'x')
  const { position: firstYFold } = folds.find((fold) => fold.axis === 'y')
  const width = firstXFold * 2 + 1
  const height = firstYFold * 2 + 1

  const dots = dotPositions.reduce(
    (acc, [x, y]) => {
      acc[x][y] = true
      return acc
    },
    Array.from({ length: width }, () =>
      Array.from({ length: height }, () => false),
    ),
  )

  return { dots, folds }
}

/**
 * @param {{ axis: string; position: number; }} fold
 * @param {boolean[][]} dots
 */
function applyFold(fold, dots) {
  if (fold.axis === 'x') {
    dots = foldX(dots, fold)
  } else if (fold.axis === 'y') {
    foldY(dots, fold)
  }
  return dots
}

/**
 * @param {boolean[][]} dots
 * @param {{ axis: string; position: number; }} fold
 */
function foldX(dots, fold) {
  const half = dots.slice(fold.position + 1).reverse()
  dots = dots.slice(0, fold.position)
  for (let x = 0; x < dots.length; x++) {
    const column = dots[x]
    for (let y = 0; y < column.length; y++) {
      column[y] ||= half[x][y]
    }
  }
  return dots
}

/**
 * @param {boolean[][]} dots
 * @param {{ axis: string; position: number; }} fold
 */
function foldY(dots, fold) {
  for (let x = 0; x < dots.length; x++) {
    const half = dots[x].slice(fold.position + 1).reverse()
    dots[x] = dots[x].slice(0, fold.position)
    for (let y = 0; y < dots[x].length; y++) {
      dots[x][y] ||= half[y]
    }
  }
}

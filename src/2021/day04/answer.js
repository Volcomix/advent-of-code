import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const { randomNumbers, boards } = await readInput()
  for (const randomNumber of randomNumbers) {
    for (const board of boards) {
      mark(board, randomNumber)
      if (hasWon(board)) {
        console.log('Part 1:', score(board) * randomNumber)
        return
      }
    }
  }
}

async function part2() {
  const { randomNumbers, boards } = await readInput()
  for (const randomNumber of randomNumbers) {
    for (const board of boards) {
      mark(board, randomNumber)
      if (hasWon(board)) {
        boards.delete(board)
        if (boards.size === 0) {
          console.log('Part 2:', score(board) * randomNumber)
          return
        }
      }
    }
  }
}

async function readInput() {
  const input = await readFile()
  const [randomNumbersInput, ...boardsInput] = input.split('\n\n')
  const randomNumbers = randomNumbersInput.split(',').map(Number)
  const boards = boardsInput.map((boardInput) =>
    boardInput.split('\n').map((row) => row.split(/\s+/).map(Number)),
  )
  return { randomNumbers, boards: new Set(boards) }
}

/**
 * @param {number[][]} board
 * @param {number} value
 */
function mark(board, value) {
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
      if (board[rowIndex][columnIndex] === value) {
        board[rowIndex][columnIndex] = -1
      }
    }
  }
}

/**
 * @param {number[][]} board
 * @returns {boolean}
 */
function hasWon(board) {
  return hasWonRow(board) || hasWonColumn(board)
}

/**
 * @param {number[][]} board
 * @returns {number}
 */
function score(board) {
  return board
    .flat()
    .filter((value) => value > -1)
    .reduce((sum, value) => sum + value, 0)
}

/**
 * @param {number[][]} board
 * @returns {boolean}
 */
function hasWonRow(board) {
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    if (sumRow(board, rowIndex) === -5) {
      return true
    }
  }
  return false
}

/**
 * @param {number[][]} board
 * @returns {boolean}
 */
function hasWonColumn(board) {
  for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
    if (sumColumn(board, columnIndex) === -5) {
      return true
    }
  }
  return false
}

/**
 * @param {number[][]} board
 * @param {number} rowIndex
 * @returns {number}
 */
function sumRow(board, rowIndex) {
  return board[rowIndex].reduce((sum, value) => sum + value, 0)
}

/**
 * @param {number[][]} board
 * @param {number} columnIndex
 * @returns {number}
 */
function sumColumn(board, columnIndex) {
  return board.reduce((sum, row) => sum + row[columnIndex], 0)
}

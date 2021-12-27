import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const a1 = 7 + 3
  const a2 = 7 + 3
  const b1 = 2 + 3
  const b2 = 5
  const c1 = 5
  const c2 = 5
  const d1 = 9
  const d2 = 7
  console.log(
    'Part 1:',
    (a1 + a2) * 1 + (b1 + b2) * 10 + (c1 + c2) * 100 + (d1 + d2) * 1000,
  )
}

async function part2() {
  const { hallway, rooms } = await readInput()
  const start = Date.now()
  console.log('Part 2:', dfs(hallway, rooms), `(${Date.now() - start}ms)`)
}

async function readInput() {
  const input = await readFile()
  const lines = input.split('\n')
  /** @type {Map<string, Cell>} */ const cells = new Map()
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let x = 0; x < line.length; x++) {
      if (!isOpen(x, y, lines)) {
        continue
      }
      const amhipodType =
        lines[y][x] === '.' ? null : /** @type {AmphipodType} */ (lines[y][x])
      /** @type {Cell} */ const cell = {
        type: getCellType(x, y),
        content: amhipodType && { type: amhipodType, state: 'init' },
        neighbors: [],
      }
      cells.set(`${x},${y}`, cell)
    }
  }
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let x = 0; x < line.length; x++) {
      if (!isOpen(x, y, lines)) {
        continue
      }
      for (const neighbor of getNeighbors(x, y, lines, cells)) {
        cells.get(`${x},${y}`).neighbors.push(neighbor)
      }
    }
  }
  const hallway = [...cells.values()].filter(isHallway)
  const rooms = new Map([
    ['A', getRoom(3, cells)],
    ['B', getRoom(5, cells)],
    ['C', getRoom(7, cells)],
    ['D', getRoom(9, cells)],
  ])
  return { hallway, rooms }
}

/**
 * @param {Cell[]} hallway
 * @param {Map<string, Cell[]>} rooms
 * @param {number} cost
 * @param {number} limit
 */
function dfs(hallway, rooms, cost = 0, limit = Infinity) {
  if (cost >= limit) {
    return Infinity
  }
  const candidateAmphipods = [
    ...hallway.filter((cell) => cell.content),
    ...[...rooms.values()]
      .map((room) => room.find((cell) => cell.content?.state === 'init'))
      .filter(Boolean),
  ]
  let isDone = true
  let lowestCost = Infinity
  for (const amphipodCell of candidateAmphipods) {
    const candidateRoom = rooms.get(amphipodCell.content.type)
    /** @type {Cell | undefined} */ let candidateRoomCell
    for (let i = 3; i >= 0; i--) {
      if (candidateRoom[i].content?.state === 'init') {
        break
      }
      if (!candidateRoom[i].content) {
        candidateRoomCell = candidateRoom[i]
        break
      }
    }
    const candidates = findCandidates(amphipodCell, candidateRoomCell)
    if (candidates.length > 0) {
      isDone = false
    }
    for (const { cell: candidate, dist } of candidates) {
      const amphipodState = amphipodCell.content.state
      candidate.content = amphipodCell.content
      if (isHallway(candidate)) {
        candidate.content.state = 'hallway'
      } else {
        candidate.content.state = 'done'
      }
      amphipodCell.content = null
      lowestCost = Math.min(
        lowestCost,
        dfs(hallway, rooms, cost + dist * getCost(candidate.content), limit),
      )
      limit = Math.min(limit, lowestCost)
      amphipodCell.content = { ...candidate.content, state: amphipodState }
      candidate.content = null
    }
  }
  if (isDone && hallway.every((cell) => !cell.content)) {
    return cost
  }
  return lowestCost
}

/**
 * @param {Cell} amphipodCell
 * @param {Cell | undefined} candidateRoomCell
 * @param {Cell} cell
 * @param {WeakSet<Cell>} discovered
 * @param {number} dist
 * @param {{ cell:Cell; dist: number; }[]} candidates
 */
function findCandidates(
  amphipodCell,
  candidateRoomCell,
  cell = amphipodCell,
  discovered = new WeakSet(),
  dist = 0,
  candidates = [],
) {
  discovered.add(cell)
  if (cell === candidateRoomCell) {
    candidates.push({ cell, dist })
  }
  if (amphipodCell.content.state === 'init' && isHallway(cell)) {
    candidates.push({ cell, dist })
  }
  for (const neighbor of cell.neighbors) {
    if (discovered.has(neighbor)) {
      continue
    }
    if (neighbor.content) {
      continue
    }
    findCandidates(
      amphipodCell,
      candidateRoomCell,
      neighbor,
      discovered,
      dist + 1,
      candidates,
    )
  }
  return candidates
}

/**
 * @param {number} x
 * @param {number} y
 * @param {string[]} lines
 */
function isOpen(x, y, lines) {
  return lines[y][x] !== '#' && lines[y][x] !== ' '
}

/**
 * @param {number} x
 * @param {number} y
 */
function getCellType(x, y) {
  if (y < 2) {
    return null
  }
  switch (x) {
    case 3:
      return 'A'
    case 5:
      return 'B'
    case 7:
      return 'C'
    case 9:
      return 'D'
    default:
      return null
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {string[]} lines
 * @param {Map<string, Cell>} cells
 * @returns {Generator<Cell>}
 */
function* getNeighbors(x, y, lines, cells) {
  if (lines[y - 1][x] !== '#') {
    yield cells.get(`${x},${y - 1}`)
  }
  if (lines[y][x + 1] !== '#') {
    yield cells.get(`${x + 1},${y}`)
  }
  if (lines[y + 1][x] !== '#') {
    yield cells.get(`${x},${y + 1}`)
  }
  if (lines[y][x - 1] !== '#') {
    yield cells.get(`${x - 1},${y}`)
  }
}

/**
 * @param {Cell} cell
 */
function isHallway(cell) {
  return !cell.type && cell.neighbors.length < 3
}

/**
 * @param {number} x
 * @param {Map<string, Cell>} cells
 */
function getRoom(x, cells) {
  return Array.from({ length: 4 }, (_, i) => cells.get(`${x},${i + 2}`))
}

/**
 * @param {Amphipod} amphipod
 */
function getCost(amphipod) {
  return { A: 1, B: 10, C: 100, D: 1000 }[amphipod.type]
}

/**
 * @typedef {Cell[]} Hallway
 * @typedef {Map<AmphipodType, Cell[]>} Rooms
 * @typedef {{ type: AmphipodType; state: AmphipodState; }} Amphipod
 * @typedef {{ type: AmphipodType | null; content: Amphipod | null; neighbors: Cell[]; }} Cell
 * @typedef {'A' | 'B' | 'C' | 'D'} AmphipodType
 * @typedef {'init' | 'hallway' | 'done'} AmphipodState
 */

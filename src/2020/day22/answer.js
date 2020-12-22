import { readFile } from '../../file-helper.js'

async function readPlayersDecks() {
  const input = await readFile()
  return input
    .split('\n\n')
    .map((player) => player.split('\n').slice(1).map(Number))
}

/**
 * @param {number[][]} players
 * @returns {string}
 */
function encodeRound(players) {
  return players.map((player) => String.fromCharCode(...player)).join('|')
}

/**
 * @param {number[][]} players
 * @returns {number}
 */
function playRecursive(players) {
  /** @type {Set<string>} */
  const previousRounds = new Set()

  while (players.every((player) => player.length)) {
    const encodedRound = encodeRound(players)
    if (previousRounds.has(encodedRound)) {
      return 0
    }
    previousRounds.add(encodedRound)

    const drawnCards = [players[0].shift(), players[1].shift()]
    if (players.every((player, i) => player.length >= drawnCards[i])) {
      if (
        playRecursive(
          players.map((player, i) => player.slice(0, drawnCards[i])),
        ) === 0
      ) {
        players[0].push(drawnCards[0], drawnCards[1])
      } else {
        players[1].push(drawnCards[1], drawnCards[0])
      }
    } else {
      if (drawnCards[0] > drawnCards[1]) {
        players[0].push(drawnCards[0], drawnCards[1])
      } else {
        players[1].push(drawnCards[1], drawnCards[0])
      }
    }
  }
  return players.findIndex((player) => player.length)
}

async function part1() {
  const players = await readPlayersDecks()
  while (players.every((player) => player.length)) {
    const drawnCards = [players[0].shift(), players[1].shift()]
    if (drawnCards[0] > drawnCards[1]) {
      players[0].push(drawnCards[0], drawnCards[1])
    } else {
      players[1].push(drawnCards[1], drawnCards[0])
    }
  }
  const winner = players.find((player) => player.length)
  const score = winner.reduce(
    (acc, card, i) => acc + card * (winner.length - i),
    0,
  )
  console.log('Part 1:', score)
}

async function part2() {
  const players = await readPlayersDecks()
  const winner = playRecursive(players)
  const score = players[winner].reduce(
    (acc, card, i) => acc + card * (players[winner].length - i),
    0,
  )
  console.log('Part 2:', score)
}

part1()
part2()

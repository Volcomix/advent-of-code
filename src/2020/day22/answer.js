import { readFile } from '../../file-helper.js'

async function main() {
  const input = await readFile()
  const players = input
    .split('\n\n')
    .map((player) => player.split('\n').slice(1).map(Number))

  while (players.every((player) => player.length)) {
    const cards = [players[0].shift(), players[1].shift()]
    if (cards[0] > cards[1]) {
      players[0].push(cards[0], cards[1])
    } else {
      players[1].push(cards[1], cards[0])
    }
  }
  const winner = players.find((player) => player.length)
  const score = winner.reduce(
    (acc, card, i) => acc + card * (winner.length - i),
    0,
  )
  console.log('Part 1:', score)
}

main()

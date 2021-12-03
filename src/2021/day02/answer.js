import { readFile } from '../../file-helper.js'

/**
 * @returns {Promise<[string, number][]>}
 */
async function readCommands() {
  const input = await readFile()
  return input
    .split('\n')
    .map((line) => line.split(' '))
    .map(([command, value]) => [command, Number(value)])
}

async function part1() {
  const commands = await readCommands()
  let depth = 0
  let horizontalPosition = 0
  for (const [command, value] of commands) {
    switch (command) {
      case 'up':
        depth -= value
        break

      case 'down':
        depth += value
        break

      default:
        horizontalPosition += value
    }
  }
  console.log('Part 1:', depth * horizontalPosition)
}

async function part2() {
  const commands = await readCommands()
  let depth = 0
  let horizontalPosition = 0
  let aim = 0
  for (const [command, value] of commands) {
    switch (command) {
      case 'up':
        aim -= value
        break

      case 'down':
        aim += value
        break

      default:
        horizontalPosition += value
        depth += aim * value
    }
  }
  console.log('Part 2:', depth * horizontalPosition)
}

part1()
part2()

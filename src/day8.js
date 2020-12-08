import fs from 'fs/promises'

async function readInstructions() {
  const input = await fs.readFile('./day8-input.txt')
  return input
    .toString()
    .split('\n')
    .map((line) => line.split(' '))
    .map(([operation, argument]) => ({ operation, argument: Number(argument) }))
}

async function part1() {
  const instructions = await readInstructions()
  const executedInstructions = new Set()
  let nextInstructionIndex = 0
  let accumulator = 0

  while (true) {
    const instruction = instructions[nextInstructionIndex]
    if (executedInstructions.has(instruction)) {
      console.log('Part 1:', accumulator)
      break
    }
    switch (instruction.operation) {
      case 'jmp':
        nextInstructionIndex += instruction.argument
        break
      case 'acc':
        accumulator += instruction.argument
      default:
        nextInstructionIndex++
    }
    executedInstructions.add(instruction)
  }
}

part1()

import fs from 'fs/promises'

async function readInstructions() {
  const input = await fs.readFile('./day8-input.txt')
  return input
    .toString()
    .split('\n')
    .map((line) => line.split(' '))
    .map(([operation, argument]) => ({ operation, argument: Number(argument) }))
}

function runProgram(instructions) {
  const executedInstructions = new Set()
  let nextInstructionIndex = 0
  let accumulator = 0

  while (true) {
    if (
      nextInstructionIndex < 0 ||
      nextInstructionIndex >= instructions.length
    ) {
      return { nextInstructionIndex, accumulator }
    }
    const instruction = instructions[nextInstructionIndex]
    if (executedInstructions.has(instruction)) {
      return { nextInstructionIndex, accumulator }
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

async function part1() {
  const instructions = await readInstructions()
  const { accumulator } = runProgram(instructions)
  console.log('Part 1:', accumulator)
}

async function part2() {
  const instructions = await readInstructions()
  for (let fixedIndex = 0; fixedIndex < instructions.length; fixedIndex++) {
    const instruction = instructions[fixedIndex]
    if (instruction.operation === 'acc') {
      continue
    }
    const fixedInstructions = instructions.map((instruction, i) => {
      if (i === fixedIndex) {
        return {
          operation: instruction.operation === 'jmp' ? 'nop' : 'jmp',
          argument: instruction.argument,
        }
      } else {
        return instruction
      }
    })
    const { nextInstructionIndex, accumulator } = runProgram(fixedInstructions)
    if (nextInstructionIndex === instructions.length) {
      console.log('Part 2:', accumulator)
      break
    }
  }
}

part1()
part2()

import { readFile } from '../../file-helper.js'

async function readProgram() {
  const program = await readFile()
  return program
    .split('\n')
    .map((line) => line.split(' = '))
    .map(([instruction, value]) => {
      if (instruction === 'mask') {
        return { type: 'mask', value: value.split('').reverse() }
      } else {
        const match = instruction.match(/^mem\[(\d+)\]$/)
        return {
          type: 'mem',
          index: BigInt(match[1]),
          value: BigInt(value),
        }
      }
    })
}

async function part1() {
  const program = await readProgram()
  const mem = []
  let mask
  for (const { type, index, value } of program) {
    if (type === 'mask') {
      mask = value
    } else {
      mem[index] = value
      for (let i = 0n; i < mask.length; i++) {
        if (mask[i] === '0') {
          mem[index] &= ~(1n << i)
        } else if (mask[i] === '1') {
          mem[index] |= 1n << i
        }
      }
    }
  }
  const sum = mem.reduce((acc, value) => acc + value, 0n)
  console.log('Part 1:', sum)
}

async function part2() {
  let program = await readProgram()

  program = program.map((instruction) => {
    if (instruction.type === 'mem') {
      return instruction
    } else {
      let addressMask = 0n
      const floatingIndexes = instruction.value.reduce(
        (acc, valueAsString, index) => {
          if (valueAsString === 'X') {
            acc.push(BigInt(index))
          } else if (valueAsString === '1') {
            addressMask |= 1n << BigInt(index)
          }
          return acc
        },
        [],
      )
      return { type: instruction.type, addressMask, floatingIndexes }
    }
  })

  const mem = {}
  let mask

  for (const instruction of program) {
    if (instruction.type === 'mask') {
      mask = instruction
    } else {
      let address = instruction.index | mask.addressMask
      for (const floatingIndex of mask.floatingIndexes) {
        address &= ~(1n << floatingIndex)
      }
      const addresses = [address]
      for (const floatingIndex of mask.floatingIndexes) {
        const n = addresses.length
        for (let i = 0; i < n; i++) {
          addresses.push(addresses[i] | (1n << floatingIndex))
        }
      }
      for (const dest of addresses) {
        mem[dest] = instruction.value
      }
    }
  }
  const sum = Object.values(mem).reduce((acc, value) => acc + value, 0n)
  console.log('Part 2:', sum)
}

part1()
part2()

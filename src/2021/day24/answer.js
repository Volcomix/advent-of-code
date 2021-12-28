import { readFile } from '../../file-helper.js'

const isDebugEnabled = false

await part1()
await part2()

async function part1() {
  const instructions = await readInput()
  const start = Date.now()
  if (isDebugEnabled) {
    for (let i = 0; i < 100; i++) {
      console.log()
    }
  }
  for (let number = 9999999; number >= 1111111; number--) {
    const inputs = [...`${number}`].map(Number)
    if (inputs.includes(0)) {
      continue
    }
    /** @type {number[]} */ const modelNumber = []
    const variables = new Map([
      ['w', 0],
      ['x', 0],
      ['y', 0],
      ['z', 0],
    ])
    const isValid = instructions.every(([instruction, variable, arg], i) => {
      const value =
        arg === undefined
          ? undefined
          : /\d/.test(arg)
          ? Number(arg)
          : variables.get(arg)
      switch (instruction) {
        case 'inp':
          const input = inputs.shift()
          variables.set(variable, input)
          if (isDebugEnabled) {
            console.log(''.padEnd(50, '-'))
          }
          modelNumber.push(input)
          debug(i, `${variable} = input(${input})`, modelNumber, variables)
          break
        case 'add':
          variables.set(variable, variables.get(variable) + value)
          if (variable === 'x' && /\d/.test(arg) && value < 0) {
            if (variables.get('x') < 1 || variables.get('x') > 9) {
              return false
            }
            inputs.unshift(modelNumber.pop())
            variables.set('w', variables.get('x'))
            modelNumber.push(variables.get('w'))
          }
          debug(i, `${variable} += ${arg}`, modelNumber, variables)
          break
        case 'mul':
          variables.set(variable, variables.get(variable) * value)
          debug(i, `${variable} *= ${arg}`, modelNumber, variables)
          break
        case 'div':
          variables.set(variable, Math.floor(variables.get(variable) / value))
          debug(
            i,
            `${variable} = Math.floor(${variable} / ${arg})`,
            modelNumber,
            variables,
          )
          break
        case 'mod':
          variables.set(variable, variables.get(variable) % value)
          debug(i, `${variable} %= ${arg}`, modelNumber, variables)
          break
        case 'eql':
          variables.set(variable, variables.get(variable) === value ? 1 : 0)
          debug(
            i,
            `${variable} = ${variable} === ${arg} ? 1 : 0`,
            modelNumber,
            variables,
          )
          break
      }
      return true
    })
    if (isValid && variables.get('z') === 0) {
      console.log('Part 1:', +modelNumber.join(''), `(${Date.now() - start}ms)`)
      return
    }
  }
}

async function part2() {
  const instructions = await readInput()
  const start = Date.now()
  if (isDebugEnabled) {
    for (let i = 0; i < 100; i++) {
      console.log()
    }
  }
  for (let number = 1111111; number <= 9999999; number++) {
    const inputs = [...`${number}`].map(Number)
    if (inputs.includes(0)) {
      continue
    }
    /** @type {number[]} */ const modelNumber = []
    const variables = new Map([
      ['w', 0],
      ['x', 0],
      ['y', 0],
      ['z', 0],
    ])
    const isValid = instructions.every(([instruction, variable, arg], i) => {
      const value =
        arg === undefined
          ? undefined
          : /\d/.test(arg)
          ? Number(arg)
          : variables.get(arg)
      switch (instruction) {
        case 'inp':
          const input = inputs.shift()
          variables.set(variable, input)
          if (isDebugEnabled) {
            console.log(''.padEnd(50, '-'))
          }
          modelNumber.push(input)
          debug(i, `${variable} = input(${input})`, modelNumber, variables)
          break
        case 'add':
          variables.set(variable, variables.get(variable) + value)
          if (variable === 'x' && /\d/.test(arg) && value < 0) {
            if (variables.get('x') < 1 || variables.get('x') > 9) {
              return false
            }
            inputs.unshift(modelNumber.pop())
            variables.set('w', variables.get('x'))
            modelNumber.push(variables.get('w'))
          }
          debug(i, `${variable} += ${arg}`, modelNumber, variables)
          break
        case 'mul':
          variables.set(variable, variables.get(variable) * value)
          debug(i, `${variable} *= ${arg}`, modelNumber, variables)
          break
        case 'div':
          variables.set(variable, Math.floor(variables.get(variable) / value))
          debug(
            i,
            `${variable} = Math.floor(${variable} / ${arg})`,
            modelNumber,
            variables,
          )
          break
        case 'mod':
          variables.set(variable, variables.get(variable) % value)
          debug(i, `${variable} %= ${arg}`, modelNumber, variables)
          break
        case 'eql':
          variables.set(variable, variables.get(variable) === value ? 1 : 0)
          debug(
            i,
            `${variable} = ${variable} === ${arg} ? 1 : 0`,
            modelNumber,
            variables,
          )
          break
      }
      return true
    })
    if (isValid && variables.get('z') === 0) {
      console.log('Part 2:', +modelNumber.join(''), `(${Date.now() - start}ms)`)
      return
    }
  }
}

async function readInput() {
  const input = await readFile()
  return input.split('\n').map((line) => line.split(' '))
}

/**
 * @param {number} instructionIndex
 * @param {string} string
 * @param {number[]} modelNumber
 * @param {Map<string, number>} variables
 */
function debug(instructionIndex, string, modelNumber, variables) {
  if (!isDebugEnabled) {
    return
  }
  console.log(
    `${instructionIndex}:`.padEnd(4),
    string.padEnd(30),
    '//',
    +modelNumber.join(''),
    variables,
  )
}

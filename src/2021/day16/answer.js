import { readFile } from '../../file-helper.js'

await part1()
await part2()

async function part1() {
  const transmission = await readInput()
  const decodedTransmission = decode(transmission)
  console.log('Part 1:', sumVersion(decodedTransmission))
}

async function part2() {
  const transmission = await readInput()
  const decodedTransmission = decode(transmission)
  console.log('Part 2:', evaluate(decodedTransmission))
}

async function readInput() {
  const input = await readFile()
  return [...input]
    .map((hex) => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('')
}

/**
 * @param {string} transmission
 * @returns {{ typeId: number; version: number; value: any | any[]; length: number}}
 */
function decode(transmission) {
  const version = parseInt(transmission.substr(0, 3), 2)
  const typeId = parseInt(transmission.substr(3, 3), 2)

  switch (typeId) {
    case 4:
      const decodedLiteralValue = decodeLiteralValue(transmission.substr(6))
      return {
        version,
        typeId,
        value: decodedLiteralValue.value,
        length: decodedLiteralValue.length + 6,
      }

    default:
      const decodedOperator = decodeOperator(transmission.substr(6))
      return {
        version,
        typeId,
        value: decodedOperator.value,
        length: decodedOperator.length + 6,
      }
  }
}

/**
 * @param {string} transmission
 */
function decodeLiteralValue(transmission) {
  let bitPosition = 0
  let groupType = ''
  let nextGroupType = transmission[bitPosition]
  let value = []
  do {
    groupType = nextGroupType
    value.push(transmission.substr(bitPosition + 1, 4))
    bitPosition += 5
    nextGroupType = transmission[bitPosition]
  } while (groupType !== '0')
  return { value: parseInt(value.join(''), 2), length: bitPosition }
}

/**
 * @param {string} transmission
 */
function decodeOperator(transmission) {
  const lengthTypeId = transmission[0]
  let bitPosition = 0
  const value = []
  switch (lengthTypeId) {
    case '0':
      let length = parseInt(transmission.substr(1, 15), 2)
      bitPosition = 16
      while (length > 0) {
        const decodedPacket = decode(transmission.substr(bitPosition))
        value.push(decodedPacket)
        bitPosition += decodedPacket.length
        length -= decodedPacket.length
      }
      return { value, length: bitPosition }

    case '1':
      let subPacketCount = parseInt(transmission.substr(1, 11), 2)
      bitPosition = 12
      for (let i = 0; i < subPacketCount; i++) {
        const decodedPacket = decode(transmission.substr(bitPosition))
        value.push(decodedPacket)
        bitPosition += decodedPacket.length
      }
      return { value, length: bitPosition }

    default:
      throw new Error(`Unknown length type id: ${lengthTypeId}`)
  }
}

/**
 * @param {{ typeId: number; version: number; value: any | any[]; }} transmission
 */
function sumVersion(transmission) {
  if (transmission.typeId === 4) {
    return transmission.version
  }
  return transmission.value.reduce(
    (/** @type {number} */ sum, /** @type {any} */ value) =>
      sum + sumVersion(value),
    transmission.version,
  )
}

/**
 * @param {{ typeId: number; value: any | any[]; }} transmission
 */
function evaluate(transmission) {
  switch (transmission.typeId) {
    case 0:
      return evaluateSum(transmission.value)
    case 1:
      return evaluateProduct(transmission.value)
    case 2:
      return evaluateMin(transmission.value)
    case 3:
      return evaluateMax(transmission.value)
    case 4:
      return transmission.value
    case 5:
      return evaluateGreaterThan(transmission.value)
    case 6:
      return evaluateLessThan(transmission.value)
    case 7:
      return evaluateEqual(transmission.value)
  }
}

/**
 * @param {{ typeId: number; value: any | any[]; }[]} values
 * @returns {number}
 */
function evaluateSum(values) {
  return values.reduce((sum, value) => sum + evaluate(value), 0)
}

/**
 * @param {{ typeId: number; value: any | any[]; }[]} values
 * @returns {number}
 */
function evaluateProduct(values) {
  return values.reduce((product, value) => product * evaluate(value), 1)
}

/**
 * @param {{ typeId: number; value: any | any[]; }[]} values
 * @returns {number}
 */
function evaluateMin(values) {
  return values.reduce((min, value) => Math.min(min, evaluate(value)), Infinity)
}

/**
 * @param {{ typeId: number; value: any | any[]; }[]} values
 * @returns {number}
 */
function evaluateMax(values) {
  return values.reduce(
    (max, value) => Math.max(max, evaluate(value)),
    -Infinity,
  )
}

/**
 * @param {{ typeId: number; value: any | any[]; }[]} values
 * @returns {number}
 */
function evaluateGreaterThan(values) {
  const [a, b] = values
  if (evaluate(a) > evaluate(b)) {
    return 1
  }
  return 0
}

/**
 * @param {{ typeId: number; value: any | any[]; }[]} values
 * @returns {number}
 */
function evaluateLessThan(values) {
  const [a, b] = values
  if (evaluate(a) < evaluate(b)) {
    return 1
  }
  return 0
}

/**
 * @param {{ typeId: number; value: any | any[]; }[]} values
 * @returns {number}
 */
function evaluateEqual(values) {
  const [a, b] = values
  if (evaluate(a) === evaluate(b)) {
    return 1
  }
  return 0
}

import { readFile } from './file-helper.js'

/**
 * @typedef {object} Rule
 * @property {string} name
 * @property {Set<number>} validValues
 *
 * @typedef {object} Tickets
 * @property {Rule[]} rules
 * @property {number[]} myTicket
 * @property {number[][]} nearbyTickets
 */

/**
 * @returns {Promise<Tickets>}
 */
async function readTickets() {
  const tickets = await readFile(16)
  const [rulesSection, myTicketSection, nearbyTicketsSection] = tickets.split(
    '\n\n',
  )
  const rules = rulesSection.split('\n').map((rule) => {
    let [_, name, min1, max1, min2, max2] = rule.match(
      /^(.*): (\d+)-(\d+) or (\d+)-(\d+)$/,
    )
    min1 = Number(min1)
    max1 = Number(max1)
    min2 = Number(min2)
    max2 = Number(max2)
    const validValues = new Set()
    for (let i = min1; i <= max1; i++) {
      validValues.add(i)
    }
    for (let i = min2; i <= max2; i++) {
      validValues.add(i)
    }
    return { name, validValues }
  })
  return {
    rules,
    myTicket: myTicketSection.split('\n')[1].split(',').map(Number),
    nearbyTickets: nearbyTicketsSection
      .split('\n')
      .slice(1)
      .map((line) => line.split(',').map(Number)),
  }
}

async function part1() {
  const tickets = await readTickets()
  const invalidValues = tickets.nearbyTickets
    .flat()
    .filter((value) =>
      tickets.rules.every((rule) => !rule.validValues.has(value)),
    )
  console.log(
    'Part 1:',
    invalidValues.reduce((acc, value) => acc + value, 0),
  )
}

async function part2() {
  const tickets = await readTickets()
  const validTickets = tickets.nearbyTickets.filter((values) =>
    values.every((value) =>
      tickets.rules.some((rule) => rule.validValues.has(value)),
    ),
  )
  const positions = Array.from(
    { length: validTickets[0].length },
    () => tickets.rules,
  )
  for (const values of validTickets) {
    for (let i = 0; i < values.length; i++) {
      positions[i] = positions[i].filter((rule) =>
        rule.validValues.has(values[i]),
      )
    }
  }
  const positionSet = new Set()
  while (positionSet.size < positions.length) {
    const position = positions.findIndex((rules, p) => {
      return !positionSet.has(p) && rules.length === 1
    })
    const positionRule = positions[position][0]
    positionSet.add(position)
    for (let i = 0; i < positions.length; i++) {
      positions[i] = positions[i].filter(
        (rule) => i === position || rule.name !== positionRule.name,
      )
    }
  }
  const result = tickets.myTicket
    .filter((_, i) => positions[i][0].name.startsWith('departure'))
    .reduce((acc, value) => acc * value, 1)
  console.log('Part 2:', result)
}

part1()
part2()

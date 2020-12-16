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

part1()

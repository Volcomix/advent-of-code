import { readFile } from '../../file-helper.js'

/**
 * @typedef {Array<Array<number | string>>} Rule
 * @typedef {Object<number, Rule>} Rules
 */

async function readInput() {
  const input = await readFile()
  const [rules, messages] = input.split('\n\n')
  return {
    rules: rules.split('\n').reduce((acc, line) => {
      const [ruleId, rule] = line.split(': ')
      return Object.assign(acc, {
        [ruleId]: rule
          .split(' | ')
          .map((subrule) => subrule.split(' ').map(eval)),
      })
    }, /** @type {Rules} */ ({})),
    messages: messages.split('\n'),
  }
}

/**
 * @param {string} message
 * @param {number} index
 * @param {number} ruleId
 * @param {Rules} rules
 * @returns {number[]}
 */
function matches(message, index, ruleId, rules) {
  return rules[ruleId]
    .flatMap((subRuleOr) => {
      let matchingLengths = [0]
      for (const subRuleAnd of subRuleOr) {
        matchingLengths = matchingLengths.flatMap((matchingLength) => {
          if (
            typeof subRuleAnd === 'string' &&
            message[index + matchingLength] === subRuleAnd
          ) {
            return [matchingLength + 1]
          } else if (typeof subRuleAnd === 'number') {
            const subMatchingLengths = matches(
              message,
              index + matchingLength,
              subRuleAnd,
              rules,
            )
            if (subMatchingLengths.length === 0) {
              return []
            }
            return subMatchingLengths.map(
              (subMatchingLength) => matchingLength + subMatchingLength,
            )
          } else {
            return []
          }
        })
        if (matchingLengths.length === 0) {
          break
        }
      }
      return matchingLengths
    })
    .filter((matchingLength) => matchingLength)
}

async function part1() {
  const { rules, messages } = await readInput()
  const matchCount = messages.reduce(
    (count, message) =>
      matches(message, 0, 0, rules).find(
        (matchingLength) => matchingLength === message.length,
      )
        ? count + 1
        : count,
    0,
  )
  console.log('Part 1:', matchCount)
}

async function part2() {
  const { rules, messages } = await readInput()
  rules[8] = [[42], [42, 8]]
  rules[11] = [
    [42, 31],
    [42, 11, 31],
  ]
  const matchCount = messages.reduce(
    (count, message) =>
      matches(message, 0, 0, rules).find(
        (matchingLength) => matchingLength === message.length,
      )
        ? count + 1
        : count,
    0,
  )
  console.log('Part 2:', matchCount)
}

part1()
part2()

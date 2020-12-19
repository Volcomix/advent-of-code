import { readFile } from './file-helper.js'

/**
 * @typedef {Array<Array<number | string>>} Rule
 * @typedef {Object<number, Rule>} Rules
 */

async function readInput() {
  const input = await readFile(19)
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
 * @returns {number}
 */
function matches(message, index, ruleId, rules) {
  for (const subRuleOr of rules[ruleId]) {
    let matchingLength = 0
    for (const subRuleAnd of subRuleOr) {
      if (
        typeof subRuleAnd === 'string' &&
        message[index + matchingLength] === subRuleAnd
      ) {
        matchingLength++
      } else if (typeof subRuleAnd === 'number') {
        const subMatchingLength = matches(
          message,
          index + matchingLength,
          subRuleAnd,
          rules,
        )
        if (subMatchingLength === 0) {
          matchingLength = 0
          break
        }
        matchingLength += subMatchingLength
      } else {
        matchingLength = 0
        break
      }
    }
    if (matchingLength > 0) {
      return matchingLength
    }
  }
  return 0
}

async function part1() {
  const { rules, messages } = await readInput()
  const matchCount = messages.reduce(
    (count, message) =>
      matches(message, 0, 0, rules) === message.length ? count + 1 : count,
    0,
  )
  console.log('Part 1:', matchCount)
}

part1()

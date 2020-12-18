import { readFile } from './file-helper.js'

async function readExpressions() {
  const expressions = await readFile(18)
  return expressions
    .split('\n')
    .map((expression) => expression.replace(/ /g, ''))
}

/**
 * @param {string} expression
 */
function resolve(expression) {
  if (/\(\d+\)/.test(expression)) {
    return resolve(expression.replace(/\((\d+)\)/, '$1'))
  }
  if (/[\+\*]/.test(expression)) {
    return resolve(
      expression.replace(
        /\((\d+[\+\*]\d+)([\d\+\*]*)\)/,
        (_, p1, p2) => `(${eval(p1)}${p2})`,
      ),
    )
  }
  return expression
}

async function part1() {
  let expressions = await readExpressions()
  expressions = expressions.map((expression) => `(${expression})`)
  console.log(
    'Part 1:',
    expressions.reduce(
      (sum, expression) => sum + Number(resolve(expression)),
      0,
    ),
  )
}

part1()

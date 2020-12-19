import { readFile } from '../../file-helper.js'

async function readExpressions() {
  const expressions = await readFile()
  return expressions
    .split('\n')
    .map((expression) => expression.replace(/ /g, ''))
}

/**
 * @param {string} expression
 */
function resolve1(expression) {
  if (/\(\d+\)/.test(expression)) {
    return resolve1(expression.replace(/\((\d+)\)/, '$1'))
  }
  if (/[\+\*]/.test(expression)) {
    return resolve1(
      expression.replace(
        /\((\d+[\+\*]\d+)([\d\+\*]*)\)/,
        (_, p1, p2) => `(${eval(p1)}${p2})`,
      ),
    )
  }
  return expression
}

/**
 * @param {string} expression
 */
function resolve2(expression) {
  if (/\(\d+\)/.test(expression)) {
    return resolve2(expression.replace(/\((\d+)\)/, '$1'))
  }
  if (/\([\d\+\*]+\)/.test(expression)) {
    return resolve2(
      expression.replace(/\(([\d\+\*]+)\)/, (_, p1) => resolve2(p1)),
    )
  }
  if (/\d+\+\d+/.test(expression)) {
    return resolve2(expression.replace(/\d+\+\d+/, eval))
  }
  if (/\d+\*\d+/.test(expression)) {
    return resolve2(expression.replace(/\d+\*\d+/, eval))
  }
  return expression
}

async function part1() {
  let expressions = await readExpressions()
  expressions = expressions.map((expression) => `(${expression})`)
  console.log(
    'Part 1:',
    expressions.reduce(
      (sum, expression) => sum + Number(resolve1(expression)),
      0,
    ),
  )
}

async function part2() {
  const expressions = await readExpressions()
  console.log(
    'Part 2:',
    expressions.reduce(
      (sum, expression) => sum + Number(resolve2(expression)),
      0,
    ),
  )
}

part1()
part2()

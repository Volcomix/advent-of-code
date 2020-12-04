import fs from 'fs/promises'

/**
 * @param {string} value
 * @param {number} minDate
 * @param {number} maxDate
 */
function isValidDate(value, minDate, maxDate) {
  if (!/^[0-9]{4}$/.test(value)) {
    return false
  }
  const valueAsNumber = Number(value)
  return valueAsNumber >= minDate && valueAsNumber <= maxDate
}

const rules = {
  byr: (value) => isValidDate(value, 1920, 2002),
  iyr: (value) => isValidDate(value, 2010, 2020),
  eyr: (value) => isValidDate(value, 2020, 2030),
  hgt: (/** @type {string} */ value) => {
    const match = value.match(/^([0-9]+)(cm|in)$/)
    if (!match) {
      return false
    }
    const height = Number(match[1])
    switch (match[2]) {
      case 'cm':
        return height >= 150 && height <= 193
      case 'in':
        return height >= 59 && height <= 76
    }
  },
  hcl: (value) => /^#[0-9a-f]{6}$/.test(value),
  ecl: (value) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(value),
  pid: (value) => /^[0-9]{9}$/.test(value),
  // 'cid',
}

async function readPassports() {
  const input = await fs.readFile('day4-input.txt')
  return input
    .toString()
    .split('\n\n')
    .map((passport) => passport.split(/\s/))
    .map((fields) =>
      fields.reduce(
        (acc, field) =>
          Object.assign(acc, { [field.split(':')[0]]: field.split(':')[1] }),
        {},
      ),
    )
}

async function part1() {
  const passports = await readPassports()
  const validCount = passports.filter((passport) =>
    Object.keys(rules).every((field) => field in passport),
  ).length
  console.log('Part1:', validCount)
}

async function part2() {
  const passports = await readPassports()
  const validCount = passports.filter((passport) =>
    Object.entries(rules).every(
      ([field, rule]) => field in passport && rule(passport[field]),
    ),
  ).length
  console.log('Part2:', validCount)
}

part1()
part2()

import fs from 'fs/promises'

const requiredFields = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  // 'cid',
]

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

function isValid(passport) {
  return requiredFields.every((field) => field in passport)
}

async function part1() {
  const passports = await readPassports()
  console.log(passports.filter(isValid).length)
}

part1()

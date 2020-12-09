import fs from 'fs/promises'

/**
 * @param {number} day
 * @returns {Promise<string>}
 */
export async function readFile(day) {
  const input = await fs.readFile(`./day${day}-input.txt`)
  return input.toString()
}

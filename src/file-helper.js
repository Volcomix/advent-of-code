import fs from 'fs/promises'

/**
 * @returns {Promise<string>}
 */
export async function readFile() {
  const input = await fs.readFile('input.txt')
  return input.toString()
}

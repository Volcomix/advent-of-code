import { readFile } from '../../file-helper.js'

async function main() {
  const input = await readFile()
  const publicKeys = input.split('\n').map(Number)
  const loopSizes = publicKeys.map((publicKey) => {
    let loopSize = 0
    for (let value = 1; value !== publicKey; value = (value * 7) % 20201227) {
      loopSize++
    }
    return loopSize
  })
  const subjectNumber = publicKeys[0]
  const loopSize = loopSizes[1]
  let encryptionKey = 1
  for (let i = 0; i < loopSize; i++) {
    encryptionKey = (encryptionKey * subjectNumber) % 20201227
  }
  console.log('Part 1:', encryptionKey)
}

main()

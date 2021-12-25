import { readFile } from '../../file-helper.js'

let { enhancement, inputImage: image } = await readInput()
for (let i = 0; i < 60; i++) {
  image.unshift(Array.from({ length: image[0].length }, () => '.'))
  image.push(Array.from({ length: image[0].length }, () => '.'))
  image.forEach((line) => line.unshift('.'))
  image.forEach((line) => line.push('.'))
}
for (let i = 0; i < 2; i++) {
  image = enhance(image, enhancement)
}

console.log(
  'Part 1:',
  image.flatMap((line) => line.filter((pixel) => pixel === '#')).length,
)

for (let i = 0; i < 48; i++) {
  image = enhance(image, enhancement)
}

console.log(
  'Part 2:',
  image.flatMap((line) => line.filter((pixel) => pixel === '#')).length,
)

async function readInput() {
  const input = await readFile()
  const [enhancement, inputImage] = input.split('\n\n')
  return {
    enhancement,
    inputImage: inputImage.split('\n').map((line) => line.split('')),
  }
}

/**
 * @param {string[][]} inputImage
 * @param {string} enhancement
 */
function enhance(inputImage, enhancement) {
  const outputImage = inputImage.map((line) => line.map(() => '.'))
  for (let y = 1; y < inputImage.length - 1; y++) {
    for (let x = 1; x < inputImage[y].length - 1; x++) {
      const bin = []
      for (let ySquare = y - 1; ySquare <= y + 1; ySquare++) {
        for (let xSquare = x - 1; xSquare <= x + 1; xSquare++) {
          bin.push(inputImage[ySquare][xSquare] === '#' ? 1 : 0)
        }
      }
      const index = parseInt(bin.join(''), 2)
      outputImage[y][x] = enhancement[index]
    }
  }
  if (outputImage[1][1] === '#') {
    for (let x = 0; x < outputImage[0].length; x++) {
      outputImage[0][x] = '#'
      outputImage[outputImage.length - 1][x] = '#'
    }
    for (let y = 0; y < outputImage.length; y++) {
      outputImage[y][0] = '#'
      outputImage[y][outputImage[y].length - 1] = '#'
    }
  }
  return outputImage
}

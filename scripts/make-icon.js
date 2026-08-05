import { Jimp } from 'jimp'
import pngToIco from 'png-to-ico'
import fs from 'node:fs/promises'
import path from 'node:path'

const input = 'C:/Users/22771/OneDrive/图片/Screenshots/31368435_102336299107_2.jpg'
const outDir = 'build'

async function main() {
  await fs.mkdir(outDir, { recursive: true })

  const image = await Jimp.read(input)
  image.cover({ w: 256, h: 256 })

  const pngPath = path.join(outDir, 'icon.png')
  await image.write(pngPath)

  const icoBuf = await pngToIco(pngPath)
  await fs.writeFile(path.join(outDir, 'icon.ico'), icoBuf)

  const tray = image.clone().resize({ w: 16, h: 16 })
  await tray.write(path.join(outDir, 'tray-icon.png'))

  console.log('Icons created in', outDir)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

import * as fs from 'fs'
import Script from './script'

export default async function readScripts(source: string) {
  if (!fs.existsSync(source)) {
    fs.mkdirSync(source)
  }

  return new Promise<Script[]>((resolve, reject) => {
    fs.readdir(source, (error, fileNames) => {
      if (error) reject(error)
      const fileData: Script[] = []
      for (const fileName of fileNames) {
        if (!fileName.match(/^[0-9]{5,8}.js/)) continue

        const textNode = fs.readFileSync(`${source}/${fileName}`, 'utf8')
        fileData.push(
          new Script({
            fileName,
            textNode
          })
        )
      }

      resolve(fileData)
    })
  })
}

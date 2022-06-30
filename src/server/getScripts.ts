import * as fs from 'fs'
import { ScriptFile } from './types'

export default async function getScripts(source: string) {
    if (!fs.existsSync(source)) {
        fs.mkdirSync(source)
    }

    return new Promise<ScriptFile[]>((resolve, reject) => {
        fs.readdir(source, (error, fileNames) => {
            if (error) reject(error)
            const fileData: ScriptFile[] = []

            for (const fileName of fileNames) {
                if (!fileName.match(/^[0-9]{5,8}.js/)) continue

                const textNode = fs.readFileSync(`${source}/${fileNames}`, 'utf8')
                fileData.push({
                    fileName,
                    textNode
                })
            }

            resolve(fileData)
        })
    })
}

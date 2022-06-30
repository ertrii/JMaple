import { Request, Response, Express } from 'express'
import { getNpcImg, getNpcName } from '../api/npc'
import { ScriptFile, Version } from './types'

export default function createScriptRoute(
    app: Express,
    script: ScriptFile,
    version: Version = 'vs83'
) {
    const id = script.fileName.replace('.js', '')
    app.get(`/${id}`, async function (_: Request, res: Response) {
        const fileName = version === 'vs83' ? 'classic' : 'modern'
        const [image, name] = await Promise.all([getNpcImg(id), getNpcName(id)])
        res.render(fileName, {
            id,
            image,
            name
        })
    })
}

import { Request, Response, Express } from 'express'
import { getNpcImg, getNpcName } from '../api/npc'
import handler from '../browser/handler'
import Script from '../core/script'
import { Version } from './types'

export default function routingScript(app: Express, script: Script, version: Version = 'vs83') {
    app.get(`/${script.uid}`, async function (_: Request, res: Response) {
        const fileName = version === 'vs83' ? 'classic' : 'modern'
        const [image, name] = await Promise.all([getNpcImg(script.uid), getNpcName(script.uid)])
        const { windowType } = script.getResult()
        res.render(fileName, {
            uid: script.uid,
            image,
            name,
            windowType,
            handler
        })
    })
}

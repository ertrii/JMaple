import { Request, Response, Express } from 'express'
import { getNpcImg, getNpcName } from '../api/npc'
import handler from '../browser/handler'
import Script from '../core/script'
import { Version } from './types'

export default function routingScript(app: Express, script: Script, version: Version = 'vs83') {
    script.start()
    app.get(`/${script.id}`, async function (_: Request, res: Response) {
        const fileName = version === 'vs83' ? 'classic' : 'modern'
        const [image, name] = await Promise.all([getNpcImg(script.id), getNpcName(script.id)])
        const { html, cm } = script.getResult()
        res.render(fileName, {
            id: script.id,
            image,
            name,
            html,
            cm,
            handler
        })
    })
}

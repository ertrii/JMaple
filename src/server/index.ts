import express, { Request, Response, Express } from 'express'
import { ActionBody, Config } from './types'
import * as path from 'path'
import readScripts from '../core/readScripts'
import routingScript from './routingScript'
import Script from '../core/script'

export default async function server(initialConfig: Config) {
    const app: Express = express()
    app.use(express.json())
    const scripts = await readScripts(initialConfig.source)

    app.set('views', path.join(__dirname, '../../views'))
    app.set('view engine', 'pug')
    app.use(express.static(path.join(__dirname, '../../public')))
    app.listen(initialConfig.port, () => {
        console.log(`server started at http://localhost:${initialConfig.port}`)
    })

    app.get('/', function (_: Request, res: Response) {
        res.render('index', {
            ids: scripts.map((script) => script.uid)
        })
    })

    for (const script of scripts) {
        routingScript(app, script, initialConfig.version)
    }

    app.post('/start', function (req: Request, res: Response) {
        const body = req.body as { uid: string }
        const script = scripts.find((_script) => _script.uid === body.uid) as Script
        script.start()
        res.json(script.getResult())
    })

    app.post('/action', function (req: Request, res: Response) {
        const body = req.body as ActionBody
        const script = scripts.find((_script) => _script.uid === body.uid) as Script
        script.action(body.mode, body.type, body.selection)
        res.json(script.getResult())
    })
}

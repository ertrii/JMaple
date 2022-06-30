import express, { Request, Response, Express } from 'express'
import { Config } from './types'
import * as path from 'path'
import getScripts from './getScripts'
import createScriptRoute from './createScriptRoute'

export default async function server(initialConfig: Config) {
    const app: Express = express()
    const scripts = await getScripts(initialConfig.source)

    app.set('views', path.join(__dirname, '../../views'))
    app.set('view engine', 'pug')
    app.use(express.static(path.join(__dirname, '../../public')))
    app.listen(initialConfig.port, () => {
        console.log(`server started at http://localhost:${initialConfig.port}`)
    })

    app.get('/', function (_: Request, res: Response) {
        res.render('index', {
            ids: scripts.map((script) => script.fileName.replace('.js', ''))
        })
    })

    for (const script of scripts) {
        createScriptRoute(app, script, initialConfig.version)
    }
}

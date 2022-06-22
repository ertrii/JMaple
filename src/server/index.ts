import express, { Request, Response, Express } from 'express'
import * as fs from 'fs'
import { Config } from './types'
import * as path from 'path'

export default async function server(initialConfig: Config) {
    const app: Express = express()

    const dir = './scripts'
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    app.set('views', path.join(__dirname, '../../views'))
    app.set('view engine', 'pug')
    app.use(express.static(path.join(__dirname, '../../public')))

    return new Promise<Express>((resolve) => {
        app.listen(initialConfig.port, () => {
            console.log(`server started at http://localhost:${initialConfig.port}`)
            resolve(app)
        })

        app.get('/', function (_: Request, res: Response) {
            res.render('index', {
                ids: Object.keys(initialConfig.npcs)
            })
        })

        for (const id in initialConfig.npcs) {
            app.get(`/${id}`, function (_: Request, res: Response) {
                res.render(initialConfig.version === 'vs83' ? 'classic' : 'modern', {
                    id: id
                })
            })
        }
    })
}

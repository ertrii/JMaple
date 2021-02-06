import { Request, Response, Express } from 'express'
const express = require('express')

export interface NPCBase {
    source: string
    name: string
    image: string
}

export type NPCS = Record<number, NPCBase>

export default function server(port: number, npcs: NPCS) {
    const app: Express = express()
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`)
    })

    app.get('/', function (req: Request, res: Response) {
        res.send('Hello Maplers')
    })

    for (const key in npcs) {
        app.get(`/${key}`, function (req: Request, res: Response) {
            res.send(`${npcs[key].name}`)
        })
    }

    return app
}

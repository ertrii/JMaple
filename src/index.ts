import server, { NPCS } from './server'
export type Version = 'vs83' | 'vs92'

export interface Config {
    base?: string
    version?: Version
    port?: number
    npcs: NPCS
}

function initialize(config: Config) {
    const base = config.base || 'src'
    const version: Version = config.version || 'vs83'
    const port: number = config.port || 83

    return server(port, config.npcs)
}

const jmaple = {
    initialize
}

// // use example
// jmaple.initialize({
//     npcs: {
//         1002000: {
//             name: 'Phil',
//             source: 'scripts/1002000.js',
//             image: 'image.jpg'
//         }
//     },
//     port: 92
// })

export default jmaple

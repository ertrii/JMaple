import server from './server'
import { Config } from './server/types'

function initialize(config: Config) {
    return server({
        source: 'src',
        version: 'vs92',
        port: 83,
        ...config
    })
}

const jmaple = {
    initialize
}

jmaple.initialize({
    npcs: {
        1002000: {
            name: 'Phil',
            source: 'scripts/1002000.js',
            image: 'image.jpg'
        }
    },
    port: 92
})

export default jmaple

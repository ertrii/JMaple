import server from './server'
import { Config, Version } from './server/types'

export default class JMaple {
  static source = './scripts'
  static port = 83
  static version: Version = 'vs92'

  server(config: Partial<Config> = {}) {
    const source = config.source || JMaple.source
    const port = config.port || JMaple.port
    const version = config.version || JMaple.version

    server({
      source,
      port,
      version
    })
  }
}

const jmaple = new JMaple()

jmaple.server({
  port: 92
})

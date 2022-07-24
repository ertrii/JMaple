import { getWorldNames } from './map'
import { MapleMap } from './types'

export default class Preload {
    static mapNames: MapleMap[][] = []
    static woldNames: string[] = []

    static async load() {
        Preload.woldNames = await getWorldNames()
    }
}

import { MapleStoryIO } from '../types/MapleStoryIO'
import Wz from './wz'

export default class ItemWz extends Wz {
    constructor() {
        super('/Item')
    }
    dirsSpecial: MapleStoryIO.Directory[] = [
        this.createDir('0900.img', /^05[0-9]{2}$/),
        this.createDir('0910.img', /^05[0-9]{2}$/),
        this.createDir('0911.img', /^05[0-9]{2}$/),
        this.createDir('MaplePoint.img', /^[1-9]{1,3}00$/)
    ]
    dirs: MapleStoryIO.Directory[] = [
        this.createDir('Cash', /^05[0-9]{2}/),
        this.createDir('Consume', /^2[0-4][0-9]([0-9]){4}/),
        this.createDir('Etc', /^04[0-3][0-9]/),
        this.createDir('Install', /^03[0|9][0-9]/),
        this.createDir('Pet', /^5000[0-1][0-9]{2}/),
        this.createDir('Special', /(09[0-1]{2}|[1-9]{1,3}00$)/, this.dirsSpecial)
    ]
    getPathByUId(uid: string) {
        const result = this.match(this.dirs, uid)
        if (result) {
            const [match0, match1, path] = result
            if (match1) {
                return `${this.pathBase}/${path}/${uid}`
            } else {
                return `${this.pathBase}/${path}/${match0}.img/${uid}`
            }
        }
        return ''
    }
}

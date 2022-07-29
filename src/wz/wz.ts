import { MapleStoryIO } from '../types/MapleStoryIO'

export default class Wz {
    constructor(public pathBase: string) {}
    protected createDir(
        path: string,
        identifier: RegExp,
        children?: MapleStoryIO.Directory[]
    ): MapleStoryIO.Directory {
        return { path, identifier, children }
    }
    protected identify(dirs: MapleStoryIO.Directory[], uid: string) {
        let route = ''
        for (const dir of dirs) {
            if (dir.identifier.test(uid)) {
                if (dir.children) {
                    let isFinded = false
                    for (const dirChild of dir.children) {
                        if (dirChild.identifier.test(uid)) {
                            route = `${dir.path}/${dirChild.path}`
                            isFinded = true
                            break
                        }
                    }
                    if (isFinded) break
                } else {
                    route = dir.path
                    break
                }
            }
        }
        return route
    }
    protected match(dirs: MapleStoryIO.Directory[], uid: string): [string, string, string] | null {
        for (const { path, identifier, children } of dirs) {
            const match = uid.match(identifier)
            if (match && !children) {
                return [match[0], '', path]
            }
            if (match && children) {
                for (const dir of children) {
                    const nextMatch = uid.match(dir.identifier)
                    if (nextMatch) {
                        return [match[0], nextMatch[0], `${path}/${dir.path}`]
                    }
                }
            }
        }
        return null
    }
}

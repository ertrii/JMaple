import { Base64 } from '../constants'
import { MapleStoryIO } from '../types/MapleStoryIO'
import ItemWz from '../wz/item.wz'
import StringWz from '../wz/string.wz'
import Http from './http'

export async function getItemName(uid: string) {
    const stringWz = new StringWz()
    const route = stringWz.getPathByUId(uid)

    try {
        const data = await Http.get<MapleStoryIO.ParametersWithValue>(
            `https://maplestory.io/api/wz/GMS/83${route}/name`
        )
        return data.value
    } catch {
        return uid
    }
}

export async function getItemImg(uid: string) {
    const stringWz = new ItemWz()
    const route = stringWz.getPathByUId(uid)

    try {
        const data = await Http.get<MapleStoryIO.ParametersWithValue>(
            `https://maplestory.io/api/wz/GMS/83${route}/info/${Base64}iconRaw`
        )
        return data.value
    } catch {
        return uid
    }
}

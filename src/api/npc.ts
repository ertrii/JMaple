import { MapleStoryIO } from '../types/MapleStoryIO'
import { Base64 } from '../constants'
import Http from './http'

export async function getNpcImg(id: string | number) {
    const data = await Http.get<MapleStoryIO.ParametersWithValue>(
        `https://maplestory.io/api/wz/GMS/83/Npc/${id}.img/stand/0`
    )
    return `${Base64}${data.value}`
}

export async function getNpcName(id: string | number) {
    const data = await Http.get<MapleStoryIO.ParametersWithValue>(
        `https://maplestory.io/api/wz/GMS/83/String/Npc.img/${id}/name`
    )
    return data.value
}

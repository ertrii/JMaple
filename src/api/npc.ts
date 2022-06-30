import { MapleStoryIO } from '../types/MapleStoryIO'
import fetch from 'cross-fetch'
import { Base64 } from '../constants'

export async function getNpcImg(id: string | number) {
    const response = await fetch(`https://maplestory.io/api/wz/GMS/83/Npc/${id}.img/stand/0`)
    const data: MapleStoryIO.Parameters = await response.json()
    return `${Base64}${data.value}`
}

export async function getNpcName(id: string | number) {
    const response = await fetch(`https://maplestory.io/api/wz/GMS/83/String/Npc.img/${id}/name`)
    const data: MapleStoryIO.Parameters = await response.json()
    return data.value
}

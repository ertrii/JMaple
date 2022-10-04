import { MapleStoryIO } from '../types/MapleStoryIO'
import Http from './http'
import Preload from './preload'

export async function getWorldNames() {
  const data = await Http.get<MapleStoryIO.Parameters>(
    'https://maplestory.io/api/wz/GMS/83/String/Map.img'
  )
  return data.children
}

export async function getMapName(uid: string) {
  const resolved = await new Promise<MapleStoryIO.ParametersWithValue>((resolve, reject) => {
    const errors: any[] = []
    Preload.woldNames.forEach(async (worldName) => {
      try {
        const data = await Http.get<MapleStoryIO.ParametersWithValue>(
          `https://maplestory.io/api/wz/GMS/83/String/Map.img/${worldName}/${uid}/mapName`
        )
        resolve(data)
      } catch (error) {
        errors.push(error)
        if (errors.length === Preload.woldNames.length) {
          reject(errors[errors.length - 1])
        }
      }
    })
  })
  return resolved.value
}

export interface NPCBase {
    source: string
    name: string
    image: string
}

export type NPCS = Record<number, NPCBase>

export type Version = 'vs83' | 'vs92'

export interface Config {
    source?: string
    version?: Version
    port?: number
    npcs: NPCS
}

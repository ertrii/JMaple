export type Version = 'vs83' | 'vs92'

export interface Config {
    source: string
    version: Version
    port: number
}

export interface ScriptFile {
    fileName: string
    textNode: string
}

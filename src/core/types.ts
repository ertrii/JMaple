export type Color = 'blue' | 'purple' | 'bold' | 'green' | 'black' | 'red'
export type ColorTag = 'b' | 'd' | 'e' | 'g' | 'k' | 'r'
export type InputTag = 'm' | 'p' | 't' | 'z' | 'h' | 'v' | 'i' | 'c' | 'w' | 'n'
export type NewLineTag = 'w'
/**
 * L -> List open
 * l -> List close
 */
export type ListTag = 'L' | 'l'

export enum SendWindow {
    Ok, // type=0
    Next, // type=0
    Prev, // type=0?
    NextPrev, // type=0
    YesNo, // type=1
    AcceptDecline, // type=12
    Simple, // type=4
    GetNumber // type=3
}

export interface CmResult {
    sendWindow: SendWindow
    html: string
    parameters: Array<string | number>
    dispose: boolean
    sendWindowExecuted: boolean
}

export interface ScriptFile {
    fileName: string
    textNode: string
}

export interface ResultExecutedScript {
    type: number
    dispose: boolean
    htmls: [string, string, string]
}

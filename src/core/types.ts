export type Color = 'blue' | 'purple' | 'bold' | 'green' | 'black' | 'red'
export type ColorTag = 'b' | 'd' | 'e' | 'g' | 'k' | 'r'
export type InputTag = 'm' | 'p' | 't' | 'z' | 'h' | 'v' | 'i' | 'c' | 'w' | 'n'
export type NewLineTag = 'w'
/**
 * L -> List open
 * l -> List close
 */
export type ListTag = 'L' | 'l'

export enum Command {
    Ok,
    Next,
    Prev,
    NextPrev,
    YesNo,
    AcceptDecline,
    Simple,
    GetNumber,
    Dispose,
    Warp
}

export enum WindowType {
    Ok, // 0
    Next, // 0
    Prev, // 0?
    NextPrev, // 0
    YesNo, // 1
    AcceptDecline, // 12
    Simple, // 4
    GetNumber // 3
}

export interface CmResult {
    windowType: WindowType
    html: string
    parameters: Array<string | number>
    dispose: boolean
}

export interface ScriptFile {
    fileName: string
    textNode: string
}

export interface ResultExecutedScript {
    windowType: WindowType
    dispose: boolean
    htmls: [string, string, string]
}

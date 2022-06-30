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

export interface CmResult {
    cm: Command
    html: string
    parameters: Array<string | number>
}

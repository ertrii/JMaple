export interface ColorTag {
    color: Color
    code: ColorCode
}

export type ColorCode =
    | 'b' // Blue text
    | 'd' // Purple text
    | 'e' // Bold Text
    | 'g' // Green text
    | 'k' // Black text
    | 'r' // Red text
export type Color = 'blue' | 'purple' | 'bold' | 'green' | 'black' | 'red'

export type InputTag =
    | 'm'
    | 'p'
    | 't'
    | 'z'
    | 'h'
    | 'v'
    | 'i'
    | 'c'
    | 'w'
    | 'n' // Normal text (removes bold)
    | 'L' // List open close
    | 'l' // List open close

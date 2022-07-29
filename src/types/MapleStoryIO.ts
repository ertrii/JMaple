export namespace MapleStoryIO {
    export interface Parameters {
        children: string[]
        type: number
    }
    export interface ParametersWithValue {
        children: string[]
        type: number
        value: string
    }

    export interface Directory {
        path: string
        identifier: RegExp
        children?: Directory[]
    }
}

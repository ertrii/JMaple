import Reader from './reader'
import { CmResult, WindowType } from './types'

export default class Cm {
    constructor(private observer: (result: Partial<CmResult>) => void) {}

    sendOk(text: string) {
        this.observer({
            windowType: WindowType.Ok,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendNext(text: string) {
        this.observer({
            windowType: WindowType.Next,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendPrev(text: string) {
        this.observer({
            windowType: WindowType.Prev,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendNextPrev(text: string) {
        this.observer({
            windowType: WindowType.NextPrev,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendYesNo(text: string) {
        this.observer({
            windowType: WindowType.YesNo,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendAcceptDecline(text: string) {
        this.observer({
            windowType: WindowType.AcceptDecline,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendSimple(text: string) {
        this.observer({
            windowType: WindowType.Simple,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendGetNumber(text: string, valueDefault: string, min: number, max: number) {
        this.observer({
            windowType: WindowType.GetNumber,
            html: new Reader(text).interpret(),
            parameters: [valueDefault, min, max]
        })
    }
    dispose() {
        this.observer({
            dispose: true
        })
    }
    warp(idMap: string, portal: number) {
        this.observer({
            parameters: [idMap, portal]
        })
    }
}

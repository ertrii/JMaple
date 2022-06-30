import Reader from './reader'
import { CmResult, Command } from './types'

export default class Cm {
    constructor(private observer: (result: CmResult) => void) {}

    sendOk(text: string) {
        this.observer({
            cm: Command.Ok,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendNext(text: string) {
        this.observer({
            cm: Command.Next,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendPrev(text: string) {
        this.observer({
            cm: Command.Prev,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendNextPrev(text: string) {
        this.observer({
            cm: Command.NextPrev,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendYesNo(text: string) {
        this.observer({
            cm: Command.YesNo,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendAcceptDecline(text: string) {
        this.observer({
            cm: Command.AcceptDecline,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendSimple(text: string) {
        this.observer({
            cm: Command.Simple,
            html: new Reader(text).interpret(),
            parameters: []
        })
    }
    sendGetNumber(text: string, valueDefault: string, min: number, max: number) {
        this.observer({
            cm: Command.GetNumber,
            html: new Reader(text).interpret(),
            parameters: [valueDefault, min, max]
        })
    }
    dispose() {
        this.observer({
            cm: Command.Dispose,
            html: '',
            parameters: []
        })
    }
    warp(idMap: string, portal: number) {
        this.observer({
            cm: Command.Warp,
            html: '',
            parameters: [idMap, portal]
        })
    }
}

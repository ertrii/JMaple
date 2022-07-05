import Reader from './reader'
import { CmResult, SendWindow } from './types'

export default class Cm {
    constructor(private observer: (result: Partial<CmResult>) => void) {}

    sendOk(text: string) {
        this.observer({
            sendWindow: SendWindow.Ok,
            html: new Reader(text).interpret(),
            parameters: [],
            sendWindowExecuted: true
        })
    }
    sendNext(text: string) {
        this.observer({
            sendWindow: SendWindow.Next,
            html: new Reader(text).interpret(),
            parameters: [],
            sendWindowExecuted: true
        })
    }
    sendPrev(text: string) {
        this.observer({
            sendWindow: SendWindow.Prev,
            html: new Reader(text).interpret(),
            parameters: [],
            sendWindowExecuted: true
        })
    }
    sendNextPrev(text: string) {
        this.observer({
            sendWindow: SendWindow.NextPrev,
            html: new Reader(text).interpret(),
            parameters: [],
            sendWindowExecuted: true
        })
    }
    sendYesNo(text: string) {
        this.observer({
            sendWindow: SendWindow.YesNo,
            html: new Reader(text).interpret(),
            parameters: [],
            sendWindowExecuted: true
        })
    }
    sendAcceptDecline(text: string) {
        this.observer({
            sendWindow: SendWindow.AcceptDecline,
            html: new Reader(text).interpret(),
            parameters: [],
            sendWindowExecuted: true
        })
    }
    sendSimple(text: string) {
        this.observer({
            sendWindow: SendWindow.Simple,
            html: new Reader(text).interpret(),
            parameters: [],
            sendWindowExecuted: true
        })
    }
    sendGetNumber(text: string, valueDefault: string, min: number, max: number) {
        this.observer({
            sendWindow: SendWindow.GetNumber,
            html: new Reader(text).interpret(),
            parameters: [valueDefault, min, max],
            sendWindowExecuted: true
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
    getJobId() {
        return 0
    }
    getMeso() {
        return 100
    }
    gainMeso(mesos: number) {
        console.log(mesos)
    }
    openShop(shopid: string) {
        return shopid
    }
    haveItem(itemid: string) {
        return !!itemid
    }
    gainItem(itemid: string, amount = 1) {
        return [itemid, amount]
    }
    changeJob(jobid: number) {
        return jobid
    }
    getJob() {
        return ''
    }
    startQuest() {
        return true
    }
    completeQuest() {
        return true
    }
    forfeitQuest() {
        return true
    }
    gainExp(amount: number) {
        return amount
    }
    getLevel() {
        return 8
    }
    teachSkill(skillid: string, skilllevel: number, maxskilllevel: number) {
        // thinking
        return [skillid, skilllevel, maxskilllevel]
    }
    get(stat: string) {
        return stat
    }
    modifyNX(amount: number) {
        return amount
    }
    getPlayer() {
        return 0
    }
    getChar() {
        return {
            isDonator: () => false,
            getGendee: () => 1
        }
    }
}

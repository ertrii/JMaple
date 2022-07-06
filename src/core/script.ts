import { ScriptFile, CmResult, SendWindow, ResultExecutedScript } from './types'
import Cm from './cm'

export default class Script {
    readonly uid: string
    private cmResult: CmResult = {
        sendWindow: SendWindow.Simple,
        html: '',
        parameters: [],
        dispose: false,
        sendWindowExecuted: false
    }
    private scriptStart: null | (() => void) = null
    private scriptAction: null | ((number: number, type: number, selection: number) => void) = null

    constructor(private readonly scriptFile: ScriptFile) {
        this.uid = scriptFile.fileName.replace('.js', '')
        this.readScript()
    }

    static sendWindowToType(sendWindow: SendWindow) {
        let type = 0
        switch (sendWindow) {
            case SendWindow.Ok:
            case SendWindow.Next:
            case SendWindow.Prev:
            case SendWindow.NextPrev:
                // default type=0
                break
            case SendWindow.YesNo:
                type = 1
                break
            case SendWindow.AcceptDecline:
                type = 12
                break
            case SendWindow.Simple:
                type = 4
                break
            case SendWindow.GetNumber:
                type = 3
                break
        }
        return type
    }

    private readScript() {
        const hasStartFunc = this.scriptFile.textNode.search(/function start\(\)/) > -1
        const hasActionFunc = this.scriptFile.textNode.search(/function action\(/) > -1
        const scriptFunctions = new Function(
            'cm',
            `${this.scriptFile.textNode}; return [${hasStartFunc ? 'start' : 'null'}, ${
                hasActionFunc ? 'action' : 'null'
            }]`
        )
        const cm = new Cm(this.setCmResult)
        const [scriptStart, scriptAction] = scriptFunctions(cm)
        this.scriptStart = scriptStart
        this.scriptAction = scriptAction
    }

    private setCmResult = (result: Partial<CmResult>) => {
        this.cmResult = {
            ...this.cmResult,
            ...result
        }
    }

    start() {
        this.cmResult.html = ''
        this.cmResult.dispose = false
        this.cmResult.sendWindow = SendWindow.Simple
        this.readScript()
        if (this.scriptStart) {
            this.scriptStart()
        } else {
            this.action(1, Script.sendWindowToType(SendWindow.Simple), 0)
        }
    }

    action(mode: number, type: number, selection: number) {
        this.scriptAction && this.scriptAction(mode, type, selection)
        if (this.cmResult.dispose && !this.cmResult.sendWindowExecuted) {
            this.cmResult.html = ''
        }
    }

    getResult(): ResultExecutedScript {
        const htmls = [this.cmResult.html, '', ''] as [string, string, string]
        const sendWindow = this.cmResult.sendWindow

        switch (sendWindow) {
            case SendWindow.Ok:
                htmls[2] = `<button class="yes">OK</button>`
                break
            case SendWindow.Next:
                htmls[1] = `<button class="next">NEXT</button>`
                break
            case SendWindow.Prev:
                htmls[1] = `<button class="prev">PREV</button>`
                break
            case SendWindow.NextPrev:
                htmls[1] = `<button class="prev">PREV</button><button class="next">NEXT</button>`
                break
            case SendWindow.YesNo:
                htmls[2] = `<button class="yes">YES</button><button class="no">NO</button>`
                break
            case SendWindow.AcceptDecline:
                htmls[2] = `<button class="yes">ACCEPT</button><button class="no">DECLINE</button>`
                break
        }

        this.cmResult.sendWindowExecuted = false

        return {
            type: Script.sendWindowToType(this.cmResult.sendWindow),
            dispose: this.cmResult.dispose,
            htmls
        }
    }
}

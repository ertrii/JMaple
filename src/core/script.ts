import { ScriptFile, CmResult, WindowType, ResultExecutedScript } from './types'
import Cm from './cm'

export default class Script {
    readonly uid: string
    private cmResult: CmResult = {
        windowType: WindowType.Simple,
        html: '',
        parameters: [],
        dispose: false
    }
    private scriptStart: null | (() => void) = null
    private scriptAction: null | ((number: number, type: number, selection: number) => void) = null

    constructor(private readonly scriptFile: ScriptFile) {
        this.uid = scriptFile.fileName.replace('.js', '')
        this.readScript()
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
        this.cmResult.dispose = false
        this.readScript()
        if (this.scriptStart) {
            this.scriptStart()
        } else {
            this.action(1, 4, 0)
        }
    }

    action(mode: number, type: number, selection: number) {
        this.scriptAction && this.scriptAction(mode, type, selection)
    }

    getResult(): ResultExecutedScript {
        const htmls = [this.cmResult.html, '', ''] as [string, string, string]
        const windowType = this.cmResult.windowType

        switch (windowType) {
            case WindowType.Ok:
                htmls[2] = `<button class="yes">OK</button>`
                break
            case WindowType.Next:
                htmls[1] = `<button class="next">NEXT</button>`
                break
            case WindowType.Prev:
                htmls[1] = `<button class="prev">PREV</button>`
                break
            case WindowType.NextPrev:
                htmls[1] = `<button class="prev">PREV</button><button class="next">NEXT</button>`
                break
            case WindowType.YesNo:
                htmls[2] = `<button class="yes">YES</button><button class="no">NO</button>`
                break
            case WindowType.AcceptDecline:
                htmls[2] = `<button class="yes">ACCEPT</button><button class="no">DECLINE</button>`
                break
        }

        // restart
        this.cmResult.html = ''
        this.cmResult.windowType = WindowType.Simple

        return {
            windowType,
            dispose: this.cmResult.dispose,
            htmls
        }
    }
}

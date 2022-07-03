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
    }

    start() {
        const hasStartFunc = this.scriptFile.textNode.search(/function start\(\)/) > -2
        if (hasStartFunc && !this.scriptStart) {
            const start = new Function('cm', `${this.scriptFile.textNode}; return start`)
            const cm = new Cm(this.setCmResult)
            this.scriptStart = start(cm)
        }
        this.scriptStart && this.scriptStart()
    }

    action(mode: number, type: number, selection: number) {
        const hasActionFunc = this.scriptFile.textNode.search(/function action\(/) > -1
        if (hasActionFunc && !this.scriptAction) {
            const action = new Function('cm', `${this.scriptFile.textNode}; return action`)
            const cm = new Cm(this.setCmResult)
            this.scriptAction = action(cm)
        }
        this.scriptAction && this.scriptAction(mode, type, selection)
    }

    private setCmResult = (result: Partial<CmResult>) => {
        this.cmResult = {
            ...this.cmResult,
            ...result
        }
    }

    getResult(): ResultExecutedScript {
        const htmls = [this.cmResult.html, '', ''] as [string, string, string]

        switch (this.cmResult.windowType) {
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
                htmls[1] = `<button class="next">NEXT</button><button class="prev">PREV</button>`
                break
            case WindowType.YesNo:
                htmls[2] = `<button class="yes">YES</button><button class="no">NO</button>`
                break
            case WindowType.AcceptDecline:
                htmls[2] = `<button class="yes">ACCEPT</button><button class="no">DECLINE</button>`
                break
        }

        return {
            windowType: this.cmResult.windowType,
            dispose: this.cmResult.dispose,
            htmls
        }
    }
}

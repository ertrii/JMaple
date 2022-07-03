import { ScriptFile } from './types'
import Cm from './cm'
import { CmResult, Command } from './types'

export default class Script {
    readonly id: string
    private cmResult: CmResult = {
        cm: Command.Simple,
        html: '',
        parameters: []
    }

    constructor(private readonly scriptFile: ScriptFile) {
        this.id = scriptFile.fileName.replace('.js', '')
    }

    start() {
        const hasStartFunc = this.scriptFile.textNode.search(/function start\(\)/) > -1
        if (hasStartFunc) {
            const cm = new Cm(this.setCmResult)
            const start = new Function('cm', `${this.scriptFile.textNode}; return start`)
            start(cm)()
        }
    }

    action(mode: number, type: number, selection: number) {
        const hasActionFunc = this.scriptFile.textNode.search(/function action\(/) > -1
        if (hasActionFunc) {
            const cm = new Cm(this.setCmResult)
            const action = new Function('cm', `${this.scriptFile.textNode}; return action`)
            action(cm)(mode, type, selection)
        }
    }

    private setCmResult = (result: CmResult) => {
        this.cmResult = result
    }

    getResult() {
        return this.cmResult
    }
}

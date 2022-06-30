import Cm from './cm'
import { CmResult, Command } from './types'

export default class InterpreterScript {
    private cmResult: CmResult = {
        cm: Command.Simple,
        html: '',
        parameters: []
    }

    constructor(private readonly body: string) {}

    start() {
        const hasStartFunc = this.body.search(/function start\(\)/) > -1
        if (hasStartFunc) {
            const cm = new Cm(this.setCmResult)
            const start = new Function('cm', `${this.body}; return start`)
            start(cm)()
        }
    }

    action(mode: number, type: number, selection: number) {
        const hasActionFunc = this.body.search(/function action\(\)/) > -1
        if (hasActionFunc) {
            const cm = new Cm(this.setCmResult)
            const action = new Function('cm', `${this.body}; return action`)
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

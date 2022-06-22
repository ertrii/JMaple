import { InputTag, ColorTag, Color } from './types'

export default class Reader {
    private readonly inputText: string = ''
    private inputTags: InputTag[] = ['m', 'p', 't', 'z', 'h', 'v', 'i', 'c', 'w', 'n', 'L', 'l']
    private colorTags: ColorTag[] = ['b', 'd', 'e', 'g', 'k', 'r']

    constructor(inputText: string) {
        this.inputText = inputText
    }

    interpret(): string {
        let inputTagInterpreted = this.inputText
        let inputColored = ''
        const SKIP_HASH = 'SK|P_H@SH'

        for (const tag of this.inputTags) {
            const regex = new RegExp(tag === 'h' ? `#${tag} #` : `#${tag}[0-9]{2,7}#`)
            const getOpenIndex = () => inputTagInterpreted.search(regex)
            const replaceAt = (index: number, replacement: string) =>
                inputTagInterpreted.substring(0, index) +
                replacement +
                inputTagInterpreted.substring(index + replacement.length)

            while (getOpenIndex() > -1) {
                const openIndex = getOpenIndex()
                const closeIndex = inputTagInterpreted.slice(openIndex + 2).search('#') + 2
                if (closeIndex < 2) {
                    inputTagInterpreted = replaceAt(openIndex, SKIP_HASH)
                    break
                }
                const id = inputTagInterpreted.slice(openIndex + 2, closeIndex)
                const value = this.getValueByInputTag(tag, id)
                if (!value) {
                    inputTagInterpreted = replaceAt(openIndex, SKIP_HASH)
                    inputTagInterpreted = replaceAt(closeIndex, SKIP_HASH)
                    break
                }
                inputTagInterpreted = inputTagInterpreted.replace(regex, value)
            }
        }

        const inputTagInterpretedSplited = inputTagInterpreted.split('#')
        if (inputTagInterpretedSplited.length === 0) {
            return inputTagInterpreted.replaceAll(SKIP_HASH, '#')
        }

        for (const text of inputTagInterpretedSplited) {
            if (text === '') continue
            const tag = text[0]
            const colorTag = this.colorTags.find((_colorTag) => _colorTag === tag)
            if (colorTag) {
                inputColored =
                    inputColored +
                    `<span class="color-${this.getColor(colorTag)}">${text.slice(1)}</span>`
            } else {
                inputColored = inputColored + text
            }
        }

        return inputColored.replaceAll(SKIP_HASH, '#')
    }

    getValueByInputTag(tag: InputTag, id: string) {
        if (tag === 'h') return 'You'
        return tag + id // in progress...
    }

    getColor(tag: ColorTag): Color {
        if (tag === 'b') return 'blue'
        if (tag === 'd') return 'purple'
        if (tag === 'e') return 'bold'
        if (tag === 'g') return 'green'
        if (tag === 'k') return 'black'
        if (tag === 'r') return 'red'
        return tag
    }
}

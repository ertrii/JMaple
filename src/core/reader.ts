import { InputTag, ColorTag, Color, ListTag } from './types'

export default class Reader {
    private readonly inputText: string = ''
    private inputTags: InputTag[] = ['m', 'p', 't', 'z', 'h', 'v', 'i', 'c', 'w', 'n']
    private listTags: ListTag[] = ['L', 'l']
    private colorTags: ColorTag[] = ['b', 'd', 'e', 'g', 'k', 'r']

    constructor(inputText: string) {
        this.inputText = inputText
    }

    interpret(): string {
        let inputTagInterpreted = this.toList(this.inputText)
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

        return this.colorize(inputTagInterpreted).replaceAll(SKIP_HASH, '#')
    }

    private toList(inputText: string) {
        let inputListed = inputText
        const [L, l] = this.listTags
        const openIndex = inputText.search(new RegExp(`#${L}[0-9]{1,2}#.*#${l}`))
        let closeIndex = 0

        if (openIndex === -1) return inputText

        inputListed =
            inputListed.substring(0, openIndex) +
            '<ul class="list">' +
            inputListed.substring(openIndex)

        const regexItemOpen = new RegExp(`#${L}[0-9]{1,2}#`)
        const getIndexItemOpen = () => inputListed.search(regexItemOpen)
        while (getIndexItemOpen() > -1) {
            const index = getIndexItemOpen()
            const match = inputListed.match(regexItemOpen)
            const length = match ? match[0].length : 4
            const value = inputListed.substring(index + 2, index + length - 1)
            inputListed = inputListed.replace(regexItemOpen, `<li value="${value}">`)
        }

        const getCloseItemIndex = () => inputListed.search(new RegExp(`#${l}`))
        while (getCloseItemIndex() > -1) {
            closeIndex = getCloseItemIndex() + 5
            inputListed = inputListed.replace(new RegExp(`#${l}`), '</li>')
        }

        return inputListed.substring(0, closeIndex) + '</ul>' + inputListed.substring(closeIndex)
    }

    private colorize(inputText: string) {
        const inputSplited = inputText.split('#')
        let inputColored = ''

        if (inputSplited.length === 0) {
            return inputText
        }

        for (const text of inputSplited) {
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

        return inputColored
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

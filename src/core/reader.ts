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
        return this.colorize(this.resolveInput(this.toList(this.inputText)))
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

    private resolveInput(inputText: string) {
        let inputResolved = inputText
        for (const tag of this.inputTags) {
            const regex = new RegExp(tag === 'h' ? `#${tag} #` : `#${tag}[0-9]{2,7}#`)
            const getOpenIndex = () => inputResolved.search(regex)
            while (getOpenIndex() > -1) {
                const openIndex = getOpenIndex()
                const closeIndex = inputResolved.slice(openIndex + 2).search('#') + 2
                if (closeIndex < 2) break
                const id = inputResolved.slice(openIndex + 2, closeIndex)
                const value = this.getValueByInputTag(tag, id)
                if (!value) break
                inputResolved = inputResolved.replace(regex, value)
            }
        }
        return inputResolved
    }

    private colorize(inputText: string) {
        let inputColored = inputText
        const reg = new RegExp(`#[${this.colorTags.join('')}]`)
        let cursor = 0
        const tags: ColorTag[] = []

        const search = () => inputText.slice(cursor).search(reg)

        while (search() > -1) {
            const match = inputText.slice(cursor).match(reg) as RegExpMatchArray
            tags.push(match[0].slice(1) as ColorTag)
            cursor = cursor + search() + 2
        }

        tags.forEach((tag, i) => {
            const index = inputColored.search(`#${tag}`)
            const divClose = i === 0 ? '' : '</div>'
            let leftText = inputColored.slice(0, index)
            leftText =
                leftText.length > 0 && i === 0
                    ? `<div class="color color-${this.getColor('k')}">${leftText}</div>`
                    : leftText
            const rightText = inputColored.slice(index)
            inputColored =
                leftText +
                divClose +
                rightText.replace(`#${tag}`, `<div class="color color-${this.getColor(tag)}">`)
        })

        if (tags.length > 0) {
            inputColored = `${inputColored}</div>`
        } else {
            inputColored = `<div class="color color-${this.getColor('k')}">${inputColored}</div>`
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

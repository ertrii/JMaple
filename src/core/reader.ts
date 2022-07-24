import { getMapName } from '../api/map'
import { toResolveInputTag, Interpreted, InputTag, ColorTag, Color, ListTag } from './types'
import { generateId } from '../utilities/generateId'

export default class Reader {
    private readonly inputText: string = ''
    private inputTags: InputTag[] = ['m', 'p', 't', 'z', 'h', 'v', 'i', 'c', 'w', 'n']
    private listTags: ListTag[] = ['L', 'l']
    private colorTags: ColorTag[] = ['b', 'd', 'e', 'g', 'k', 'r']

    constructor(inputText: string) {
        this.inputText = inputText
    }

    interpret(): Interpreted {
        const inputResolved = this.resolveInput(this.toList(this.inputText))
        const html = this.colorize(inputResolved.text)
        return {
            toResolve: inputResolved.listDataForResolve,
            html
        }
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
        const listDataForResolve: toResolveInputTag[] = []
        let inputResolved = inputText
        for (const tag of this.inputTags) {
            const regex = new RegExp(tag === 'h' ? `#${tag} #` : `#${tag}[0-9]{2,9}#`)
            const getOpenIndex = () => inputResolved.search(regex)
            while (getOpenIndex() > -1) {
                const openIndex = getOpenIndex()
                const [math] = inputResolved.match(regex) as RegExpMatchArray
                const closeIndex = openIndex + math.length - 1
                if (closeIndex < 2) break
                const uid = inputResolved.slice(openIndex + 2, closeIndex)
                const value = this.getValueByInputTag(tag, uid, (dataForResolve) =>
                    listDataForResolve.push(dataForResolve)
                )
                if (!value) break
                inputResolved = inputResolved.replace(regex, value)
            }
        }
        return {
            listDataForResolve,
            text: inputResolved
        }
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
                    : leftText + divClose
            const rightText = inputColored.slice(index)
            inputColored =
                leftText +
                rightText.replace(`#${tag}`, `<div class="color color-${this.getColor(tag)}">`)
            const indexList = inputColored.search('<ul class="list">')
            if (indexList > -1) {
                inputColored = `${inputColored.slice(0, index)}</div>${inputColored.slice(
                    index
                )}<div class="color color-${this.getColor(tag)}">`
            }
        })

        if (tags.length > 0) {
            inputColored = `${inputColored}</div>`
        } else {
            inputColored = `<div class="color color-${this.getColor('k')}">${inputColored}</div>`
        }

        return inputColored
    }

    getValueByInputTag(
        tag: InputTag,
        uid: string,
        forResolve: (forResolveData: toResolveInputTag) => void
    ) {
        if (tag === 'h') return 'You'
        if (tag === 'm') {
            const key = generateId()
            const promise = getMapName(uid)
            forResolve({
                key,
                promise
            })
            return key
        }
        return `${tag}${uid}` // in progress...
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

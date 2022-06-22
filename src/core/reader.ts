import { InputTag, ColorTag } from './types'

export default class Reader {
    private readonly inputText: string = ''
    private tagColors: ColorTag[] = [
        {
            color: 'blue',
            code: 'b'
        },
        {
            color: 'purple',
            code: 'd'
        },
        {
            color: 'bold',
            code: 'e'
        },
        {
            color: 'green',
            code: 'g'
        },
        {
            color: 'black',
            code: 'k'
        },
        {
            color: 'red',
            code: 'r'
        }
    ]
    private tags: InputTag[] = ['m', 'p', 't', 'z', 'h', 'v', 'i', 'c', 'w', 'n', 'L', 'l']

    constructor(inputText: string) {
        this.inputText = inputText
    }

    interpret(): string {
        let inputTagInterpreted = this.inputText
        let inputColored = ''
        const SKIP_HASH = 'SK|P_H@SH'

        for (const tag of this.tags) {
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
                const value = this.getValue(tag, id)
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
            const code = text[0]
            const tagColor = this.tagColors.find((_tagColor) => _tagColor.code === code)
            if (tagColor) {
                const { color } = tagColor
                inputColored = inputColored + `<span class="color-${color}">${text.slice(1)}</span>`
            } else {
                inputColored = inputColored + text
            }
        }

        return inputColored.replaceAll(SKIP_HASH, '#')
    }

    private getValue(tag: InputTag, id: string) {
        if (tag === 'h') return 'You'
        return tag + id // in progress...
    }
}

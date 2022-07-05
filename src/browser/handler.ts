import { ResultExecutedScript } from '../core/types'

export default function handler(mapleWindowElement: HTMLDivElement) {
    const prev: HTMLButtonElement | null = document.querySelector('button.prev')
    const next: HTMLButtonElement | null = document.querySelector('button.next')
    const exit: HTMLButtonElement | null = document.querySelector('button.exit')
    const yes: HTMLButtonElement | null = document.querySelector('button.yes')
    const no: HTMLButtonElement | null = document.querySelector('button.no')
    const content: HTMLDivElement | null = document.querySelector('div.info')
    const list: NodeListOf<HTMLLIElement> = document.querySelectorAll('ul.list li')
    const dialogBtns: HTMLDivElement | null = document.querySelector('div.dialog div.btns')
    const footerBtns: HTMLDivElement | null = document.querySelector('div.footer div:nth-child(2)')

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const type = Number(mapleWindowElement.getAttribute('type'))
    const uid = mapleWindowElement.getAttribute('npc-uid')

    async function start() {
        const response = await fetch('/start', {
            method: 'POST',
            headers,
            body: JSON.stringify({ uid })
        })
        processResponse(response)
    }

    async function action(mode: number, selection: number) {
        const isDispose = mapleWindowElement.hasAttribute('dispose')
        if (isDispose) {
            close()
            return
        }
        const body = JSON.stringify({
            uid,
            mode,
            type,
            selection
        })

        const response = await fetch('/action', {
            method: 'POST',
            headers,
            body
        })
        processResponse(response)
    }

    async function processResponse(response: Response) {
        const data: ResultExecutedScript = await response.json()
        if (data.htmls[0] === '' && data.dispose) {
            close()
            return
        }

        if (content && dialogBtns && footerBtns) {
            content.innerHTML = data.htmls[0]
            dialogBtns.innerHTML = data.htmls[1]
            footerBtns.innerHTML = data.htmls[2]
            mapleWindowElement.setAttribute('type', data.type.toString())
            if (data.dispose) {
                mapleWindowElement.setAttribute('dispose', '')
            } else {
                mapleWindowElement.removeAttribute('dispose')
            }
            handler(mapleWindowElement)
        } else {
            console.log('error template')
        }
    }

    if (prev) {
        prev.onclick = function () {
            action(0, 0)
        }
    }

    if (next) {
        next.onclick = function () {
            action(1, 0)
        }
    }

    if (exit) {
        exit.onclick = function () {
            action(type === 4 ? 0 : -1, 0)
        }
    }

    if (yes) {
        yes.onclick = function () {
            action(1, 0)
        }
    }

    if (no) {
        no.onclick = function () {
            action(0, 0)
        }
    }

    list.forEach(function (li) {
        li.onclick = function () {
            const value = parseInt(li.getAttribute('value') || '0')
            action(1, value)
        }
    })

    function close() {
        mapleWindowElement.classList.add('hidden')
    }

    async function open() {
        await start()
        mapleWindowElement.classList.remove('hidden')
    }

    return {
        open,
        close
    }
}

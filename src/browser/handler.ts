export default function handler(mapleWindow: HTMLDivElement) {
    const prev: HTMLButtonElement | null = document.querySelector('button.prev')
    const next: HTMLButtonElement | null = document.querySelector('button.next')
    const exit: HTMLButtonElement | null = document.querySelector('button.exit')
    const yes: HTMLButtonElement | null = document.querySelector('button.yes')
    const no: HTMLButtonElement | null = document.querySelector('button.no')

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    if (prev) {
        prev.onclick = function () {
            console.log('prev')
        }
    }

    if (next) {
        next.onclick = async function () {
            fetch('/action', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    id: '1002000',
                    mode: 1,
                    type: 0,
                    selection: 0
                })
            })
        }
    }

    if (exit) {
        exit.onclick = function () {
            console.log('exit')
        }
    }

    if (yes) {
        yes.onclick = function () {
            console.log('yes')
        }
    }

    if (no) {
        no.onclick = function () {
            console.log('no')
        }
    }

    function open() {
        mapleWindow.classList.add('open')
    }

    return {
        open
    }
}

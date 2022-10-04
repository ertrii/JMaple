/**
 * @param {HTMLDivElement} mapleWindowElement
 */
function handler(mapleWindowElement) {
  /** @type {HTMLButtonElement} */
  const prev = document.querySelector('button.prev')
  /** @type {HTMLButtonElement} */
  const next = document.querySelector('button.next')
  /** @type {HTMLButtonElement} */
  const exit = document.querySelector('button.exit')
  /** @type {HTMLButtonElement} */
  const yes = document.querySelector('button.yes')
  /** @type {HTMLButtonElement} */
  const no = document.querySelector('button.no')
  /** @type {HTMLDivElement} */
  const content = document.querySelector('div.info')
  /** @type {NodeListOf<HTMLLIElement>} */
  const list = document.querySelectorAll('ul.list li')
  /** @type {HTMLDivElement} */
  const dialogBtns = document.querySelector('div.dialog div.btns')
  /** @type {HTMLDivElement} */
  const footerBtns = document.querySelector('div.footer div:nth-child(2)')

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

  /**
   * @param {number} mode
   * @param {number} selection
   */
  async function action(mode, selection) {
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

  /**
   * @param {Response} response
   */
  async function processResponse(response) {
    /**
     * @type {import('../../core/types').ResultExecutedScript}
     */
    const data = await response.json()
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handler(mapleWindowElement)
    } else {
      console.log('error template')
    }
  }

  if (prev) prev.onclick = () => action(0, 0)
  if (next) next.onclick = () => action(1, 0)
  if (exit) exit.onclick = () => action(type === 4 ? 0 : -1, 0)
  if (yes) yes.onclick = () => action(1, 0)
  if (no) no.onclick = () => action(0, 0)

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

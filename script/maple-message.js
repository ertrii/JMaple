const MConfig = {
    DISPLACE        :       true,
    WRITING         :       true,
    IMG_DIRECTORY   :       'source/img/npc/'
}

class MapleMessage{
    constructor(el, npc = null){
        this.container = el;
        this.npc = {
            name: 'Maple Administratos',
            img: '9010000.png',
            typeDialog: 'yesNo',
            info: {
                text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores dolor molestiae voluptatum, at incidunt corporis doloribus temporibus ab obcaecati cum. Sint soluta amet accusamus odio consequatur veniam, labore magni earum.',
                title: 'QUESTION',
                alternatives: ['Answer1', 'Answer2']
            }
        }
    }

    /*===Creating Element===*/
    html(){
        //parent
        let parentElement = document.createElement('div')
        parentElement.setAttribute('class', 'm-msg')

        //head
        let head = document.createElement('div')
        head.setAttribute('class', 'm-msg__head')

        //body
        let body = document.createElement('div')
        body.setAttribute('class', 'm-msg__body')
            let npc = document.createElement('div')
            npc.setAttribute('class', 'm-msg__body__npc')
                let npcImg = document.createElement('div')
                npcImg.setAttribute('class', 'm-msg__body__npc__img')
                    let imgElem = document.createElement('img')
                    imgElem.setAttribute('src', MConfig.IMG_DIRECTORY + this.npc.img);
                npcImg.appendChild(imgElem);
            npc.appendChild(npcImg);
                let pNameElem = document.createElement('p')
                pNameElem.setAttribute('class', 'm-msg__body__npc__name')
                pNameElem.appendChild(document.createTextNode(this.npc.name))
            npc.appendChild(pNameElem)
        body.appendChild(npc)
            let dialog = document.createElement('div')
            dialog.setAttribute('class', 'm-msg__body__dialog')
                let info = document.createElement('div')
                info.setAttribute('class', 'm-msg__body__dialog__info')
                    let text = document.createElement('p')
                    text.setAttribute('class', 'm-msg__body__dialog__info--text')
                    text.appendChild(document.createTextNode(this.npc.info.text))
                info.appendChild(text)
                    let title = document.createElement('h3')
                    title.setAttribute('class', 'm-msg__body__dialog__info--title')
                    title.appendChild(document.createTextNode(this.npc.info.title))
                info.appendChild(title)
                    let alternatives = document.createElement('ul')
                    alternatives.setAttribute('class', 'm-msg__body__dialog__info--alternatives')
                        let li = document.createElement('li')
                        li.appendChild(document.createTextNode(this.npc.info.alternatives[0]))
                    alternatives.appendChild(li)                    
                info.appendChild(alternatives)
            dialog.appendChild(info)
                let diagBtn = document.createElement('div')
                diagBtn.setAttribute('class', 'm-msg__body__dialog__btn-interrogate')
                    let btnPrev = document.createElement('button')
                    btnPrev.setAttribute('class', 'm-msg__body__dialog__btn-interrogate--prev')
                    btnPrev.appendChild(document.createTextNode('PREV'))
                diagBtn.appendChild(btnPrev)
                    let btnNext = document.createElement('button')
                    btnNext.setAttribute('class', 'm-msg__body__dialog__btn-interrogate--next')
                    btnNext.appendChild(document.createTextNode('NEXT'))
                diagBtn.appendChild(btnNext)
            dialog.appendChild(diagBtn)
        body.appendChild(dialog)
        
        //footer
        let footer = document.createElement('div')
        footer.setAttribute('class', 'm-msg__footer')
            let exit = document.createElement('div')
            exit.setAttribute('class', 'm-msg__footer__btn-exit')
                let btnEndChat = document.createElement('button')
                btnEndChat.setAttribute('class', 'm-msg__footer__btn-exit--end-chat')
                btnEndChat.appendChild(document.createTextNode('END CHAT'))
            exit.appendChild(btnEndChat)
        footer.appendChild(exit)
            let btnsInterrogate = document.createElement('div')
            btnsInterrogate.setAttribute('class', 'm-msg__footer__btn-interrogate')
                let btnYes = document.createElement('button')
                btnYes.setAttribute('class', 'm-msg__footer__btn-interrogate--yes')
                btnYes.appendChild(document.createTextNode('YES'))
            btnsInterrogate.appendChild(btnYes)
                let btnNo = document.createElement('button')
                btnNo.setAttribute('class', 'm-msg__footer__btn-interrogate--no')
                btnNo.appendChild(document.createTextNode('NO'))
            btnsInterrogate.appendChild(btnNo)
        footer.appendChild(btnsInterrogate)

        //Adding children
        parentElement.appendChild(head)
        parentElement.appendChild(body)
        parentElement.appendChild(footer)
        return parentElement;
    }

    show(){
        this.container.appendChild(this.html())
    }
}

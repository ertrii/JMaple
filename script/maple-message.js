const MConfig = {
    DISPLACE        :       true,
    WRITING         :       true,
    IMG_DIRECTORY   :       'source/img/npc/'
}

class MapleMessage{
    constructor(el, NPC){
        this.container = el        
        this.npc = new NPC()
        this.npc.cm = this.cm()
        this.send = 'test'
    }

    /*===Creating Element===*/
    get html(){
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
                    imgElem.setAttribute('src', MConfig.IMG_DIRECTORY + this.npc.img)
                npcImg.appendChild(imgElem);
            npc.appendChild(npcImg);
                let pNameElem = document.createElement('p')
                pNameElem.setAttribute('class', 'm-msg__body__npc__name')
                pNameElem.appendChild(document.createTextNode(this.npc.name))
            npc.appendChild(pNameElem)
        body.appendChild(npc)
            this.dialog = document.createElement('div')
            this.dialog.setAttribute('class', 'm-msg__body__dialog')
                this.info = document.createElement('div')
                this.info.setAttribute('class', 'm-msg__body__dialog__info')
                    let text = document.createElement('p')
                    text.setAttribute('class', 'm-msg__body__dialog__info--text')
                    text.appendChild(document.createTextNode('this.npcdata.info.text'))
                this.info.appendChild(text)
                    let title = document.createElement('h3')
                    title.setAttribute('class', 'm-msg__body__dialog__info--title')
                    title.appendChild(document.createTextNode('TITLE'))//remember
                this.info.appendChild(title)
                    let alternatives = document.createElement('ul')
                    alternatives.setAttribute('class', 'm-msg__body__dialog__info--alternatives')
                        let li = document.createElement('li')
                        li.appendChild(document.createTextNode('Answer1'))//remember
                    alternatives.appendChild(li)                    
                this.info.appendChild(alternatives)
            this.dialog.appendChild(this.info)
                this.btnsInterrogate1 = document.createElement('div')
                this.btnsInterrogate1.setAttribute('class', 'm-msg__body__dialog__btn-interrogate')
                    this.btnPrev = document.createElement('button')
                    this.btnPrev.setAttribute('class', 'm-msg__body__dialog__btn-interrogate--prev')                    
                    this.btnPrev.appendChild(document.createTextNode('PREV'))
                if(this.send === 'test' || this.send === 'nextprev')
                this.btnsInterrogate1.appendChild(this.btnPrev)
                    this.btnNext = document.createElement('button')
                    this.btnNext.setAttribute('class', 'm-msg__body__dialog__btn-interrogate--next')
                    this.btnNext.appendChild(document.createTextNode('NEXT'))
                if(this.send === 'test' || this.send === 'next' || this.send === 'nextprev')
                this.btnsInterrogate1.appendChild(this.btnNext)
            this.dialog.appendChild(this.btnsInterrogate1)
        body.appendChild(this.dialog)
        
        //footer
        let footer = document.createElement('div')
        footer.setAttribute('class', 'm-msg__footer')
            let exit = document.createElement('div')
            exit.setAttribute('class', 'm-msg__footer__btn-exit')
                this.btnEndChat = document.createElement('button')
                this.btnEndChat.setAttribute('class', 'm-msg__footer__btn-exit--end-chat')
                this.btnEndChat.appendChild(document.createTextNode('END CHAT'))
            exit.appendChild(this.btnEndChat)
        footer.appendChild(exit)
            this.btnsInterrogate2 = document.createElement('div')
            this.btnsInterrogate2.setAttribute('class', 'm-msg__footer__btn-interrogate')
                this.btnYes = document.createElement('button')
                this.btnYes.setAttribute('class', 'm-msg__footer__btn-interrogate--yes')
                this.btnYes.appendChild(document.createTextNode((this.send === 'simple') ? 'OK' : 'YES'))//ok === yes
            if(this.send === 'test' || this.send === 'yesno' || this.send === 'simple')
            this.btnsInterrogate2.appendChild(this.btnYes)
                this.btnNo = document.createElement('button')
                this.btnNo.setAttribute('class', 'm-msg__footer__btn-interrogate--no')
                this.btnNo.appendChild(document.createTextNode('NO'))
            if(this.send === 'test' || this.send === 'yesno')
            this.btnsInterrogate2.appendChild(this.btnNo)
        footer.appendChild(this.btnsInterrogate2)

        //Adding children
        parentElement.appendChild(head)
        parentElement.appendChild(body)
        parentElement.appendChild(footer)
        return parentElement;
    }
    dispose(){
        this.npcdata = this.npc.data()        
        this.info.children[0].innerHTML = this.npcdata.info.text
    }

    cm(){
        this.info.children[0].innerHTML = text
        return {
            sendSimple      :   text => {                
                this.btnYes.innerHTML = 'OK'
                switch(this.send){
                    case 'yesno':
                        this.btnsInterrogate2.removeChild(this.btnNo)
                        break
                    case 'next':
                        this.btnsInterrogate1.removeChild(this.btnNext)                        
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'nextprev':
                        while(this.btnsInterrogate1.firstChild) this.btnsInterrogate1.removeChild(this.btnsInterrogate1.firstChild)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'test':
                        while(this.btnsInterrogate1.firstChild) this.btnsInterrogate1.removeChild(this.btnsInterrogate1.firstChild)
                        this.btnsInterrogate2.removeChild(this.btnNo)
                        break
                    default:
                        console.log('same')
                        break;
                }
                this.send = 'simple'
            },

            sendNext        :   text => {
                switch (this.send) {
                    case 'simple':
                        this.btnsInterrogate2.removeChild(this.btnYes)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        break
                    case 'yesno':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        break
                    case 'nextprev':
                        this.btnsInterrogate1.removeChild(this.btnPrev)
                        break
                    case 'test':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        this.btnsInterrogate1.removeChild(this.btnPrev)
                        break
                    default:
                        console.log('same')
                        break
                }
                this.send = 'next'
            },

            sendNextPrev    :   text => {                
                switch (this.send) {
                    case 'simple':
                        this.btnsInterrogate2.removeChild(this.btnYes)
                        break;
                    case 'yesno':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)                        
                        break
                    case 'next':
                        this.btnsInterrogate1.insertBefore(this.btnPrev, this.btnNext)
                        break
                    case 'test':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        break
                    default:
                        console.log('same')                        
                        break;
                }
                this.send = 'nextprev'
            },

            sendYesNo       :   text => {
                this.btnYes.innerHTML = 'YES'
                switch (this.send) {
                    case 'simple':
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'next':
                        this.btnsInterrogate1.removeChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'nextprev':
                        while(this.btnsInterrogate1.firstChild) this.btnsInterrogate1.removeChild(this.btnsInterrogate1.firstChild)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                    case 'test':
                        while(this.btnsInterrogate1.firstChild) this.btnsInterrogate1.removeChild(this.btnsInterrogate1.firstChild)
                        break
                    default:
                        console.log('same');                        
                        break;
                }
                this.send = 'yesno'
            },

            sendTest        :   text => {
                this.btnYes.innerHTML = 'YES'
                switch (this.send) {
                    case 'simple':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'yesno':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                    case 'next':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'nextprev':
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    default:
                        console.log('same')
                        break
                }
                this.send = 'test'
            },
            dispose         :   this.dispose
        }
    }

    events(){        
        //Button        
        this.btnEndChat.onclick     =   ()  =>  this.npc.action(-1)//endchat
        this.btnYes.onclick         =   ()  =>  this.npc.action(1)//yes
        this.btnNo.onclick          =   ()  =>  this.npc.action(0)//no
        this.btnPrev.onclick        =   ()  =>  this.npc.action(2)//prev
        this.btnNext.onclick        =   ()  =>  this.npc.action(1)//next
        
    }

    show(){        
        this.container.appendChild(this.html)
        this.events()
    }
}

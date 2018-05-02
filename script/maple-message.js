const MConfig = {
    DISPLACE        :       true,
    WRITING         :       true,
    IMG_DIRECTORY   :       'source/img/npc/',
    TRANSITION      :       'gross'              //ease, gross, step   
}

class MapleMessage{
    constructor(el, NPC){
        this.container      =       el
        this.getNPC         =       ()  =>  { this.npc = new NPC(); this.npc.cm = this.cm() }
        this.cmSend           =     'simple'        //simple
        this.dispose        =       false
        this.type           =       4               //defult
        this.selection      =       0
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
                //     let text = document.createElement('p')
                //     text.setAttribute('class', 'm-msg__body__dialog__info--text')
                //     text.appendChild(document.createTextNode('...'))
                // this.info.appendChild(text)
                //     let title = document.createElement('h3')
                //     title.setAttribute('class', 'm-msg__body__dialog__info--title')
                //     title.appendChild(document.createTextNode('TITLE'))//remember
                // this.info.appendChild(title)
                //     let alternatives = document.createElement('ul')
                //     alternatives.setAttribute('class', 'm-msg__body__dialog__info--alternatives')
                //         let li = document.createElement('li')
                //         li.appendChild(document.createTextNode('Answer1'))//remember
                //     alternatives.appendChild(li)                    
                // this.info.appendChild(alternatives)
            this.dialog.appendChild(this.info)
                this.btnsInterrogate1 = document.createElement('div')
                this.btnsInterrogate1.setAttribute('class', 'm-msg__body__dialog__btn-interrogate')
                    this.btnPrev = document.createElement('button')
                    this.btnPrev.setAttribute('class', 'm-msg__body__dialog__btn-interrogate--prev')                    
                    this.btnPrev.appendChild(document.createTextNode('PREV'))
                if(this.cmSend === 'test' || this.cmSend === 'nextprev')
                this.btnsInterrogate1.appendChild(this.btnPrev)
                    this.btnNext = document.createElement('button')
                    this.btnNext.setAttribute('class', 'm-msg__body__dialog__btn-interrogate--next')
                    this.btnNext.appendChild(document.createTextNode('NEXT'))
                if(this.cmSend === 'test' || this.cmSend === 'next' || this.cmSend === 'nextprev')
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
                this.btnYes.appendChild(document.createTextNode((this.cmSend === 'ok') ? 'OK' : (this.cmSend === 'acceptdecline') ? 'Accept' : 'YES'))//ok === yes === Accept
            if(this.cmSend === 'test' || this.cmSend === 'yesno' || this.cmSend === 'ok' || this.cmSend === 'acceptdecline')
            this.btnsInterrogate2.appendChild(this.btnYes)
                this.btnNo = document.createElement('button')
                this.btnNo.setAttribute('class', 'm-msg__footer__btn-interrogate--no')
                this.btnNo.appendChild(document.createTextNode((this.cmSend === 'acceptdecline') ? 'Decline' : 'NO'))
            if(this.cmSend === 'test' || this.cmSend === 'yesno' || this.cmSend === 'acceptdecline')
            this.btnsInterrogate2.appendChild(this.btnNo)
        footer.appendChild(this.btnsInterrogate2)

        //Adding children
        parentElement.appendChild(head)
        parentElement.appendChild(body)
        parentElement.appendChild(footer)
        return parentElement;
    }

    end(){
        while(this.container.firstChild) this.container.removeChild(this.container.firstChild)
        this.dispose = false        
    }

    set style(text){        
        let p = document.createElement('p')
        p.setAttribute('class', 'm-msg__body__dialog__info--text')

        let openSelection   =   false
        let ul = document.createElement('ul')
        ul.setAttribute('class', 'm-msg__body__dialog__info--alternatives')
        let nLi = new Array(), dataLi = 0

        let splitText   =   text.split('#')
        
        let nothing     =   (text.substr(0,1) === '#') ? false : true
                
        for (let t of splitText) {
            let cod         =   t.substr(0,1)            
            let cleanText    =   document.createTextNode(t.slice(1))
            
            
            if(cod === 'l') {openSelection = false; t = t.slice(1) }    //#l close selection
            if(cod === 'L') openSelection = true                        //#L <- Selection open            

            let textElem    =   document.createElement((cod === 'e') ? 'strong' : (openSelection) ? 'li' : 'span')

            if(!nothing)
                if(!openSelection){
                    switch (cod) {
                        //#b
                        case 'b':
                            textElem.setAttribute('class', 'm-msg__style--color-blue')
                            break
                        //#d
                        case 'd':
                            textElem.setAttribute('class', 'm-msg__style--color-purple')
                            break
                        //#e
                        case 'e':
                            textElem.setAttribute('class', 'm-msg__style--color-bold')
                            break
                        //#g
                        case 'g':
                            textElem.setAttribute('class', 'm-msg__style--color-green')
                            break
                        //#k
                        case 'k':
                            textElem.setAttribute('class', 'm-msg__style--color-black')
                            break
                        //#r
                        case 'r':
                            textElem.setAttribute('class', 'm-msg__style--color-red')
                            break                                        
                        default:
                            nothing = true
                            break;
                    }
                }

            if(!nothing && !openSelection){
                textElem.appendChild(cleanText)
                p.appendChild(textElem)                
            }else if(openSelection){                
                if(dataLi === 0){
                                        
                    let n = parseInt(cleanText.data)
                    if(isNaN(n)){
                        console.error('number Selection is ' + n);
                        return
                    }else{
                        nLi.push(n)                        
                    }
                    
                    dataLi++
                }else{
                    let li = document.createElement('li')
                    li.appendChild(cleanText)
                    ul.appendChild(li)
                    dataLi = 0
                }
                                
            }
            else{
                let OriginalText = document.createTextNode(t)
                p.appendChild(OriginalText)
                nothing = false
            }

        } 
        
        while(this.info.firstChild) this.info.removeChild(this.info.firstChild)
        
        let listLi = new Array(), i = 0
        for (const _li of ul.children) {
            listLi.push( { li : _li, num : nLi[i] } )            
            i++                       
        }

        for (const list of listLi) list.li.onclick = () => {
            if ( !this.dispose ) { this.selection = list.num; this.send = 1 }
            else this.end()
        }
        
        this.info.appendChild(p)
        this.info.appendChild(ul)
    }

    cm(){
        
        return {
            sendSimple  :   text => {
                this.type = 4
                this.style = text
                switch(this.cmSend){
                    case 'ok':
                        this.btnsInterrogate2.removeChild(this.btnYes)
                        break
                    case 'yesno':
                    case 'acceptdecline':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        break
                    case 'next':
                        this.btnsInterrogate1.removeChild(this.btnNext)                        
                        break
                    case 'prev':
                        this.btnsInterrogate1.removeChild(this.btnPrev)
                        this.btnsInterrogate2.removeChild(this.btnYes)
                        break
                    case 'nextprev':
                        while(this.btnsInterrogate1.firstChild) this.btnsInterrogate1.removeChild(this.btnsInterrogate1.firstChild)                        
                        break
                    case 'test':
                        while(this.btnsInterrogate1.firstChild) this.btnsInterrogate1.removeChild(this.btnsInterrogate1.firstChild)
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate1.removeChild(this.btnsInterrogate2.firstChild)                        
                        break
                    default:
                        console.log('same')
                        break;
                }
                this.cmSend = 'simple'
            },

            sendOk      :   text => {
                this.type = 0
                this.style = text
                this.btnYes.innerHTML = 'OK'
                switch(this.cmSend){
                    case 'simple':
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'yesno':
                    case 'acceptdecline':
                        this.btnsInterrogate2.removeChild(this.btnNo)
                        break
                    case 'next':
                        this.btnsInterrogate1.removeChild(this.btnNext)                        
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'prev':
                        this.btnsInterrogate1.removeChild(this.btnPrev)                        
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
                this.cmSend = 'ok'
            },

            sendNext        :   text => {
                this.type = 0
                this.style = text
                switch (this.cmSend) {
                    case 'simple':
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        break
                    case 'ok':
                        this.btnsInterrogate2.removeChild(this.btnYes)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        break
                    case 'yesno':
                    case 'acceptdecline':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        break
                    case 'prev':
                        this.btnsInterrogate1.removeChild(this.btnPrev)
                        this.btnsInterrogate2.removeChild(this.btnYes)
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
                this.cmSend = 'next'
            },

            sendPrev        :   text => {
                this.type = 5   //??????...
                this.style = text
                this.btnYes.innerHTML = 'OK'
                switch (this.cmSend) {
                    case 'simple':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'ok':                        
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        break
                    case 'yesno':
                    case 'acceptdecline':                                                
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate2.removeChild(this.btnNo)
                        break
                    case 'next':
                        this.btnsInterrogate1.removeChild(this.btnNext)
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'nextprev':
                        this.btnsInterrogate1.removeChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'test':
                        this.btnsInterrogate1.removeChild(this.next)
                        this.btnsInterrogate2.removeChild(this.btnNo)
                        break
                    default:
                        console.log('same')
                        break
                }
                this.cmSend = 'prev'
            },

            sendNextPrev    :   text => {
                this.type = 0
                this.style = text
                switch (this.cmSend) {
                    case 'simple':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        break
                    case 'ok':
                        this.btnsInterrogate2.removeChild(this.btnYes)
                        break;
                    case 'yesno':
                    case 'acceptdecline':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)                        
                        break
                    case 'next':
                        this.btnsInterrogate1.insertBefore(this.btnPrev, this.btnNext)
                        break
                    case 'prev':
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        this.btnsInterrogate2.removeChild(this.btnYes)
                        break
                    case 'test':
                        while(this.btnsInterrogate2.firstChild) this.btnsInterrogate2.removeChild(this.btnsInterrogate2.firstChild)
                        break
                    default:
                        console.log('same')                        
                        break;
                }
                this.cmSend = 'nextprev'
            },

            sendYesNo       :   text => {
                this.type = 1
                this.style = text
                this.btnYes.innerHTML   =   'YES'
                this.btnNo.innerHTML    =   'NO'
                switch (this.cmSend) {
                    case 'simple':
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'ok':
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'next':
                        this.btnsInterrogate1.removeChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'prev':
                        this.btnsInterrogate1.removeChild(this.btnPrev)
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
                this.cmSend = 'yesno'
            },

            sendAcceptDecline   :   text => {
                this.type = 12
                this.style = text
                this.btnYes.innerHTML   =   'Accept'
                this.btnNo.innerHTML    =   'Decline'
                switch (this.cmSend) {
                    case 'simple':
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'ok':
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'next':
                        this.btnsInterrogate1.removeChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'prev':
                        this.btnsInterrogate1.removeChild(this.btnPrev)
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
                this.cmSend = 'acceptdecline'
            },

            sendTest        :   text => {
                this.type = -1
                this.style = text
                this.btnYes.innerHTML = 'YES'
                switch (this.cmSend) {
                    case 'simple':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'ok':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break                    
                    case 'yesno':
                    case 'acceptdecline':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                    case 'next':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'prev':
                        this.btnsInterrogate1.insertBefore(this.btnNext, btn.btnPrev)
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
                this.cmSend = 'test'
            },

            dispose         :   () => this.dispose = true
        }
    }

    set send(m){
        if(MConfig.TRANSITION !== 'step'){ 
            this.container.style.opacity = 0

            setTimeout( () => {
                if(MConfig.TRANSITION === 'ease') this.container.style.transition = '0.1s ease'
                this.npc.action(m, this.type, this.selection)
                this.selection = 0 //reset
                this.container.style.opacity = 1
            }, 100)

            if(MConfig.TRANSITION === 'ease') this.container.style.transition = '0s'            
            return
        }        
        this.npc.action(m, this.type, this.selection)        
        this.selection = 0 //reset
    }

    events(){        
        //Button        
        this.btnEndChat.onclick     =   ()    =>    { this.npc.action(-1, this.type, 0); this.end() }            //endchat
        this.btnYes.onclick         =   ()    =>    { if ( !this.dispose ) this.send = 1; else { this.end() } }  //yes
        this.btnNo.onclick          =   ()    =>    { if ( !this.dispose ) this.send = 0; else { this.end() } }  //no
        this.btnPrev.onclick        =   ()    =>    { if ( !this.dispose ) this.send = 0; else { this.end() } }  //prev
        this.btnNext.onclick        =   ()    =>    { if ( !this.dispose ) this.send = 1; else { this.end() } }  //next
        
    }

    show(){
        this.getNPC()
        this.container.appendChild(this.html)        
        this.npc.start()
        this.events()
    }
}

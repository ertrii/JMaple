'use strict';
class JMaple{
    constructor(data, Character = false){
        this.config         =       {
            displace        :       true,
            writing         :       true,            
            transition      :       'ease',          //ease, gross, step <- later check, reason: writing
            dev             :       false,
            key             :       'm',
            zIndex          :       100
        }
        //Map
        this.listnpc        =       new Map()
        this.maps           =       new Map()        
        //getting
        this.container      =       document.getElementById(data.el)
        this.npc            =       data.hasOwnProperty('npc') ? data.npc : false
        if(this.npc) this.setnpc(this.npc)
        if(data.hasOwnProperty('map'))
        data.map.forEach(m => {                
                if(!m.hasOwnProperty('action')) m.action = null
                if(!m.hasOwnProperty('warp')) m.warp = true                
                let data    = {
                    id : m.id,
                    link : m.link,
                    action: m.action,
                    warp : m.warp,                    
                }
                this.maps.set(m.id, data)
            })
        //preparing
        this.prepareScript  =       ()  =>  {
            this.script     =       new data.script();
            this.script.cm  =       this.cm()
        }
        this.container.style.display = 'none'
        this.cmSend         =       'simple'
        this.dispose        =       false
        this.type           =       4               //default
        this.selection      =       0
        //extensions
        this.character      =       (!Character) ? false : Character
    }

    registered(list){
        let keys = []
        switch(list){
            case 'npc':
                this.listnpc.forEach((value, key) => keys.push(key))
                break
            case 'map':
                this.maps.forEach((value, key) => keys.push(key))
                break
            case 'item':
                if(this.character)
                    keys = this.character.listItem
                else
                    console.error('Extension character is requerid.');
                break
            default:
                console.error('null, just type this["npc", "map", "item"]')
                break
        }
        if(keys.length <= 0)
            return null
        else
            return keys
    }

    setnpc(npc){
        const isnpc = obj => {            
            let prop = ['id', 'name', 'img']
            for (let key of prop) {                
                if (!obj.hasOwnProperty(key)) {
                    console.error('An npc requires as properties: {id, name, img}')
                    return false
                }
            }
            return true
        }
        
        if(Array.isArray(npc))
            for (let _npc of npc) {
                if(!isnpc(_npc)) return
                if(this.listnpc.get(_npc.id) === undefined)
                    this.listnpc.set(_npc.id, _npc)
            }      
        else{
            if(!isnpc(npc)) return
            if(this.listnpc.get(npc.id) === undefined)
                this.listnpc.set(npc.id, npc)
        }            
    }

    /*===Creating Element===*/
    get html(){
        //parent
        let parentElement = document.createElement('div')
        parentElement.setAttribute('class', this.config.key)

        //head
        this.head = document.createElement('div')
        this.head.setAttribute('class', this.config.key + '__head')

        //body
        let body = document.createElement('div')
        body.setAttribute('class', this.config.key + '__body')
            let npc = document.createElement('div')
            npc.setAttribute('class', this.config.key + '__body__npc')
                let npcImg = document.createElement('div')
                npcImg.setAttribute('class', this.config.key + '__body__npc__img')
                    let imgElem = document.createElement('img')
                    if(this.npc) imgElem.setAttribute('src', this.npc.img)
                npcImg.appendChild(imgElem);
            npc.appendChild(npcImg);
                let pNameElem = document.createElement('p')
                pNameElem.setAttribute('class', this.config.key + '__body__npc__name')
                if(this.npc) pNameElem.appendChild(document.createTextNode(this.npc.name))
            npc.appendChild(pNameElem)
        if(this.npc)
        body.appendChild(npc)
            this.dialog = document.createElement('div')
            this.dialog.setAttribute('class', this.config.key + '__body__dialog')
                this.info = document.createElement('div')
                this.info.setAttribute('class', this.config.key + '__body__dialog__info')                
            this.dialog.appendChild(this.info)
                this.btnsInterrogate1 = document.createElement('div')
                this.btnsInterrogate1.setAttribute('class', this.config.key + '__body__dialog__btn-interrogate')
                    this.btnPrev = document.createElement('button')
                    this.btnPrev.setAttribute('class', this.config.key + '__body__dialog__btn-interrogate--prev')                    
                    this.btnPrev.appendChild(document.createTextNode('PREV'))
                if(this.cmSend === 'test' || this.cmSend === 'nextprev')
                this.btnsInterrogate1.appendChild(this.btnPrev)
                    this.btnNext = document.createElement('button')
                    this.btnNext.setAttribute('class', this.config.key + '__body__dialog__btn-interrogate--next')
                    this.btnNext.appendChild(document.createTextNode('NEXT'))
                if(this.cmSend === 'test' || this.cmSend === 'next' || this.cmSend === 'nextprev')
                this.btnsInterrogate1.appendChild(this.btnNext)
            this.dialog.appendChild(this.btnsInterrogate1)
        body.appendChild(this.dialog)
        
        //footer
        let footer = document.createElement('div')
        footer.setAttribute('class', this.config.key + '__footer')
            let exit = document.createElement('div')
            exit.setAttribute('class', this.config.key + '__footer__btn-exit')
                this.btnEndChat = document.createElement('button')
                this.btnEndChat.setAttribute('class', this.config.key + '__footer__btn-exit--end-chat')
                this.btnEndChat.appendChild(document.createTextNode('END CHAT'))
            exit.appendChild(this.btnEndChat)
        footer.appendChild(exit)
            this.btnsInterrogate2 = document.createElement('div')
            this.btnsInterrogate2.setAttribute('class', this.config.key + '__footer__btn-interrogate')
                this.btnYes = document.createElement('button')
                this.btnYes.setAttribute('class', this.config.key + '__footer__btn-interrogate--yes')
                this.btnYes.appendChild(document.createTextNode((this.cmSend === 'ok') ? 'OK' : (this.cmSend === 'acceptdecline') ? 'Accept' : 'YES'))//ok === yes === Accept
            if(this.cmSend === 'test' || this.cmSend === 'yesno' || this.cmSend === 'ok' || this.cmSend === 'acceptdecline')
            this.btnsInterrogate2.appendChild(this.btnYes)
                this.btnNo = document.createElement('button')
                this.btnNo.setAttribute('class', this.config.key + '__footer__btn-interrogate--no')
                this.btnNo.appendChild(document.createTextNode((this.cmSend === 'acceptdecline') ? 'Decline' : 'NO'))
            if(this.cmSend === 'test' || this.cmSend === 'yesno' || this.cmSend === 'acceptdecline')
            this.btnsInterrogate2.appendChild(this.btnNo)
        footer.appendChild(this.btnsInterrogate2)

        //Adding children
        parentElement.appendChild(this.head)
        parentElement.appendChild(body)
        parentElement.appendChild(footer)
        return parentElement;
    }

    end(){
        while(this.container.firstChild) this.container.removeChild(this.container.firstChild)
        this.container.style.display = 'none'
        this.dispose = false
        this.cmExecuted = false
    }

    set style(text){        
        let p = document.createElement('p')
        p.setAttribute('class', this.config.key + '__body__dialog__info--text')
        let h3 = document.createElement('h3')
        let openSelection   =   false
        let ul = document.createElement('ul')
        ul.setAttribute('class', this.config.key + '__body__dialog__info--alternatives')
        let nLi = new Array(), dataLi = 0

        let splitText   =   text.split('#')
        
        let nothing     =   (text.substr(0,1) === '#') ? false : true
        let title = false    
        for (let t of splitText) {
            let cod         =   t.substr(0,1)            
            let cleanText    =   document.createTextNode(t.slice(1))
            
            
            if(cod === 'l') {openSelection = false; t = t.slice(1) }    //#l <- close selection
            if(cod === 'L') openSelection = true                        //#L <- open selection

            let textElem    =   document.createElement((openSelection) ? 'li' : 'span')
            
            let findCode = c => {
                switch (c) {
                    //#b
                    case 'b':
                        textElem.setAttribute('class', this.config.key + '__color--blue')
                        break
                    //#d
                    case 'd':
                        textElem.setAttribute('class', this.config.key + '__color--purple')
                        break
                    //#e
                    case 'e':
                        textElem.setAttribute('class', this.config.key + '__color--bold')
                        break
                    //#g
                    case 'g':
                        textElem.setAttribute('class', this.config.key + '__color--green')
                        break
                    //#k
                    case 'k':
                        textElem.setAttribute('class', this.config.key + '__color--black')
                        break
                    //#r
                    case 'r':
                        textElem.setAttribute('class', this.config.key + '__color--red')
                        break
                    //#H
                    case 'H': //This is not exists in the game
                        h3.setAttribute('class', this.config.key + '__body__dialog__info--title')                        
                        title = true                        
                        break
                    //#p
                    case 'p':
                        let idnpc = parseInt(cleanText.data.trim())
                        if(isNaN(idnpc)){
                            console.error(`This is id(${cleanText.data}) is not number`)
                        }else{
                            textElem.setAttribute('class', this.config.key + '__color--blue')
                            let _npc = this.listnpc.get(idnpc)
                            if(_npc === undefined){
                                console.error('NPC not found in the list.')
                            }else{
                                cleanText.data = new _npc().name                            
                                break
                            }
                        }                        
                        
                    default:
                        nothing = true
                        break;
                }
            }

            if(!nothing && !openSelection) findCode(cod)            

            if(!nothing && !openSelection && !title){
                textElem.appendChild(cleanText) //span
                p.appendChild(textElem)
            }else if(!nothing && !openSelection && title){
                h3.appendChild(cleanText)
            }
            else if(openSelection){
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
                if(t.search('\n') >= 0){                                        
                    let newSplitText = t.split('\n')

                    p.appendChild(document.createTextNode(newSplitText[0]))
                    p.appendChild(document.createElement('br'))
                    p.appendChild(document.createTextNode(newSplitText[1]))
                    
                }else{
                    let OriginalText = document.createTextNode(t)
                    p.appendChild(OriginalText)    
                }
                
                nothing = false
            }

        } 
        
        while(this.info.firstChild) this.info.removeChild(this.info.firstChild)
        
        let listLi = new Array(), i = 0
        for (const _li of ul.children) { //no support edge
            listLi.push( { li : _li, num : nLi[i] } )
            i++                       
        }

        for (const list of listLi) list.li.onclick = () => {
            if ( !this.dispose ) { this.selection = list.num; this.send = 1 }
            else this.end()
        }
        
        this.info.appendChild(p)
        if(title) {this.info.appendChild(h3); title = false}
        this.info.appendChild(ul)

        this.write = p
    }

    cm(){
        this.cmExecuted     =       false
        const update = (typeSend, txt) => {
            this.style = txt
            this.cmExecuted = true
            this.cmSend = typeSend

            switch (typeSend) {
                case 'simple'           :   this.type       = 4
                    break
                case 'ok'               :   this.type       = 0
                    break
                case 'next'             :   this.type       = 0
                    break
                case 'prev'             :   this.type       = 5 //???????????
                    break
                case 'nextprev'         :   this.type       = 0
                    break
                case 'yesno'            :   this.type       = 1
                    break
                case 'acceptdecline'    :   this.type       = 12
                    break
                case 'test'             :   this.type       = -1
                    break
                default                 :   this.cmExecuted = false
                    break
            }

            if(this.config.dev) console.log(`Type: ${typeSend}(${this.type})`);
            
        }

        let command = {
            sendSimple  :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break;
                }
                update('simple', text)
            },

            sendOk      :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break;
                }
                update('ok', text)         
            },

            sendNext        :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break
                }
                update('next', text)
            },

            sendPrev        :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break
                }
                update('prev', text)                
            },

            sendNextPrev    :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break;
                }                
                update('nextprev', text)
            },

            sendYesNo       :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break;
                }                
                update('yesno', text)
            },

            sendAcceptDecline   :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break;
                }                
                update('acceptdecline', text)
            },

            sendTest        :   text => {                
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
                        if(this.config.dev) console.info('The same type of message as the previous one')
                        break
                }                
                update('test', text)
            },

            warp            :   (mapid, portal = 0) => {                
                let data = this.maps.get(mapid)
                if(data.action !== null) data.action()
                if(data.warp) window.location.href = data.link
                if(this.config.dev) console.log(`warp(${data.id}): ${data.link}`)
            },

            dispose         :   () => this.dispose = true
        }
        
        if(this.character !== false){
            if(this.config.dev) console.info('Found Character, commands assigned to this library')
            return Object.assign(command, this.character.cm)
        }

        return command
    }

    set write(el) {
        this.progressWrite = this.config.writing

        let childText = new Array()

        for (const child of el.childNodes) {
            if(child.nodeName === '#text'){
                if(child.data == '' || child.data == ' '){
                    el.removeChild(child)
                }else{
                    childText.push([child.data, child.data.split('')])
                    child.data = ''
                }
                continue
            }

            childText.push([child.innerHTML, child.innerHTML.split('')])
            child.innerHTML = ''
                            
        }
        
        const writeNow = () => {
            for (let t = 0; t < childText.length; t++) {
                if(el.childNodes[t].nodeName === '#text'){
                    el.childNodes[t].data = childText[t][0]                    
                }else{
                    el.childNodes[t].innerHTML = childText[t][0]                    
                }                
            }
        }
                
        let i = 0
        const asyncWrite = () => {
             
            if(i >= childText.length) return

            let j = 0

            if (el.childNodes[i].nodeName === '#text') {
                let writing1 = setInterval(() => {                    
                    
                    if(!this.progressWrite) {                        
                        writeNow()
                        clearInterval(writing1)
                        return
                    }

                    if(j < childText[i][1].length){
                        if(childText[i][1][j] === ' '){
                            el.childNodes[i].data += (childText[i][1][j+1] === undefined) ? childText[i][1][j] : ' ' + childText[i][1][j+1]
                            j += 2
                        }else{
                            el.childNodes[i].data += childText[i][1][j]
                            j++
                        }                        
                    }else{
                        i++
                        asyncWrite()
                        clearInterval(writing1)                        
                    }
                }, 35)                
                
            }

            else{
                let writing2 = setInterval(() => {
                    
                    if(!this.progressWrite){
                        writeNow()
                        clearInterval(writing2)
                        return
                    }
                    
                    if(j < childText[i][1].length){
                        if(childText[i][1][j] === ' '){
                            el.childNodes[i].innerHTML += (childText[i][1][j++] === undefined) ? childText[i][1][j] : ' ' + childText[i][1][j++]
                            j += 2
                        }else{
                            el.childNodes[i].innerHTML += childText[i][1][j]
                            j++
                        }
                                                
                    }else{
                        i++
                        asyncWrite()
                        clearInterval(writing2)                        
                    }
                }, 35)
                
            }            
        }
        
        asyncWrite()
         
    }

    set send(m){        
        if(this.config.transition !== 'step'){ 
            this.container.style.opacity = 0

            setTimeout( () => {
                if(this.config.transition === 'ease') this.container.style.transition = '0.3s ease'                
                this.script.action(m, this.type, this.selection)
                this.selection = 0 //reset
                this.container.style.opacity = 1
                if(!this.cmExecuted && this.dispose) this.end()
            }, 150)

            if(this.config.transition === 'ease') this.container.style.transition = '0s'            
            this.cmExecuted = false
            return
        }        
        this.script.action(m, this.type, this.selection)        
        this.selection = 0 //reset
        if(!this.cmExecuted && this.dispose) this.end()
        this.cmExecuted = false
    }    

    events(){        
        //Button
        const evSend                =   n   =>  { if ( !this.dispose ) this.send = n; else this.end() }
        this.btnEndChat.onclick     =   ()  =>  { this.script.action(-1, this.type, 0); this.end() }        //endchat
        this.btnYes.onclick         =   ()  =>  evSend(1)                                                //yes
        this.btnNo.onclick          =   ()  =>  evSend(0)                                                //no
        this.btnPrev.onclick        =   ()  =>  evSend(0)                                                //prev
        this.btnNext.onclick        =   ()  =>  evSend(1)                                                //next

        //Dialog
        if(this.config.writing)
        this.dialog.onclick         =   ()  =>  this.progressWrite = false
        
        //Message
        let anchorPoint             =           { getted : false, x : 0, y : 0 },                             //Mag Anchor Point
            cssTranslate            =           { x : 0, y : 0 },
            x = 0, y = 0,
            stopMove                =   ()  =>  { this.container.onmousemove = null; anchorPoint.getted = false; cssTranslate.x = x; cssTranslate.y = y }
        this.head.onmouseup         =   ()  =>  stopMove()
        this.container.onmouseup    =   ()  =>  stopMove()        
        
        if(this.config.displace)
        this.head.onmousedown       =   ()  =>  this.container.onmousemove  =   ev  => {            
            
            if(!anchorPoint.getted) {                
                anchorPoint.x       =   ev.clientX
                anchorPoint.y       =   ev.clientY
                anchorPoint.getted  =   true                
            }            
            x = cssTranslate.x + ev.clientX - anchorPoint.x
            y = cssTranslate.y + ev.clientY - anchorPoint.y            
            
            this.container.firstChild.style.transform = `translate(${x}px, ${y}px)`

        }        
        
    }

    show(){
        this.prepareScript()        
        this.container.classList.add('jmaple')
        this.container.style.display = 'flex'
        this.container.style.position = 'fixed'
        this.container.style.zIndex = `${this.config.zIndex}`;
        this.container.appendChild(this.html)
        try{
            this.script.start()
        }
        catch(e){
            if(this.config.dev) console.info('the start function was not found, executing action function...')            
            this.script.action(1, this.type, this.selection)            
        }
        this.events()
        if(!this.cmExecuted && this.dispose) this.end()
    }
}

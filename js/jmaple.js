'use strict';
class JMaple{
    constructor(data, Character = false){
        this.config         =       {
            displace        :       true,
            writing         :       true,
            transition      :       'ease',          //ease, gross, step <- later check, reason: writing
            dev             :       false,
            key             :       'm',
            zIndex          :       100,
            color           :       {
                info        :       '#2264C8',
                success     :       '#22C85C',
                warning     :       '#FFD232',
                danger      :       '#FF0050',
                apply       :       true
            }
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
        this.codes           =      {

            color           :       [
                {
                    id      :       '__color--blue',
                    cod     :       '#b',   //  Blue text
                    el      :       'b'
                },
                {
                    id      :       '__color--purple',
                    cod     :       '#d',   //  Purple text
                    el      :       'span'
                },{
                    id      :       '__color--bold',
                    cod     :       '#e',   //  Bold text
                    el      :       'b'
                },
                {
                    id      :       '__color--green',
                    cod     :       '#g',   //  Green text
                    el      :       'span'
                },
                {
                    id      :       '__color--black',
                    cod     :       '#k',   //  Black text
                    el      :       'span'
                },
                {
                    id      :       '__color--red',
                    cod     :       '#r',   //  Red text
                    el      :       'span'
                }
            ],
            remove          :       '#n', // Normal text (removes bold)
            list            :       ['#L', '#l'] // open/close list(<li></li>)            

        }
        this.prepareScript  =       ()  =>  {
            this.script     =       new data.script();
            this.script.cm  =       this.cm()
        }
        this.container.style.display = 'none'
        this.cmSend         =       'simple'
        this.dispose        =       false
        this.type           =       4               //default
        this.selection      =       0
        this.input          =       {
            el              :       document.createElement('input'),
            defaultValue    :       0,
            min             :       0,
            max             :       null,
            restart         :       () => {
                this.input.defaultValue    = 0
                this.input.min          = 0
                this.input.max          = null
            }
        }

        this.input.el.setAttribute('class', this.config.key + '__input')
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
    
    structure(dialog){
        //preparing dialog
        let tempText = ''
        let tempCod = null
        let listDiag = []

        //preparing list
        let openLi = false, tempValueLi = ''
        let listLi = [], listDiagForLi = []


        function setListDiag(){
            if(tempText === '') return
            let label = {                
                cod : tempCod,
                text : tempText
            }
            if(openLi)
                listDiagForLi.push(label)
            else
                listDiag.push(label)                
            
            tempText = ''
        }
        
        function setListLi(){
            let li = {
                value : tempValueLi,
                content : listDiagForLi
            }
            listLi.push(li)
            tempValueLi = ''
            tempText = ''
            openLi = false
            listDiagForLi = []
        }

        const findCode = txt => {
            if(txt === this.codes.remove){
                setListDiag()
                tempCod = null                
            }
            else{                   
                for (const color of this.codes.color) {
                    if(txt === color.cod){
                        setListDiag()
                        tempCod = txt
                        return
                    }
                }
                tempText += txt                 
            }
        }

        let i = 0
        while (i < dialog.length) {
            let textSplit = dialog.substr(i, 1)
            if(textSplit === '#'){
                textSplit = dialog.substr(i, 2)                

                if(textSplit === this.codes.list[0] && !openLi){                    
                    let j = 1
                    while(j < 3){                        
                        if(dialog.substr(i + 2 + j, 1) === '#'){                            
                            tempValueLi = dialog.substr(i + 2, j)
                            break
                        }
                        j++
                    }
                    setListDiag()
                    if(tempValueLi !== ''){
                        openLi = true                        
                        i = i + 3 + j                        
                    }else{
                        i = i + 2 + j
                    }                    
                    tempCod = null
                    continue;
                }
    
                else if(openLi){
                    if(textSplit === this.codes.list[1]){
                        setListDiag()
                        setListLi()
                        tempCod = null
                    }else{
                        findCode(textSplit)                        
                    }                    
                }
                
                else findCode(textSplit)

                i+=2
            }
            else{
                tempText += textSplit
                i++
            } 
                
        }
        setListDiag()//ending...        
        this.write(listDiag, (listLi.length === 0) ? null : listLi)
    }

    write(dialogs, listLi = null){

        const getTextStyle = node => {
            for (const color of this.codes.color) {
                if (node.cod === color.cod) {
                    let elem = document.createElement(color.el)
                    elem.setAttribute('class', this.config.key + color.id)
                    elem.appendChild(document.createTextNode(node.text))                    
                    return elem
                }
            }
        }

        //text
        let p = document.createElement('p')
        p.setAttribute('class', this.config.key + '__body__dialog__info--text')        

        while(this.info.firstChild) this.info.removeChild(this.info.firstChild)
                
        dialogs.forEach(dialog =>{
            if(dialog.cod === null){
                let s = document.createElement('span')
                s.appendChild(document.createTextNode(dialog.text))
                p.appendChild(s)
            }else{                            
                p.appendChild(getTextStyle(dialog))
            }
        })
        this.info.appendChild(p)

        //animating text
        if(this.config.writing){
            let childText = []
            for (const child of p.children) {            
                childText.push(child.innerHTML)
                child.innerHTML = ''
            }        
            
            const charArray = i => childText[i].split('')
            let i = 0, j = 0, done = false
            const writeNow = () =>{
                let chars = charArray(i)
                let length = chars.length
                p.children[i].innerHTML += chars[j]
                j++
                if(j > length - 1){
                    j = 0
                    i++
                }
                if(i > p.children.length - 1){
                    i = 0
                    done = true
                    return false
                }
                return true
            }

            const interval = setInterval( () => {                
                if(!writeNow()){                    
                    clearInterval(interval)
                }
            }, 35)
            this.dialog.onclick = () => {
                if(done) return
                clearInterval(interval)
                while(true) {
                    if(!writeNow()) break
                }
            }
        }
        
        //list
        if(listLi !== null) {
            let ul = document.createElement('ul')
            ul.setAttribute('class', this.config.key + '__body__dialog__info--alternatives')            
            listLi.forEach( node => {
                let li = document.createElement('li')
                for (const content of node.content) {                    
                    if(content.cod === null){
                        li.appendChild(document.createTextNode(content.text))
                    }else{
                        li.appendChild(getTextStyle(content))
                    }
                }
                li.onclick = () => {
                    if ( !this.dispose ) {
                        let value = parseInt(node.value)
                        this.selection = (isNaN(value)) ? node.value : value
                        this.send = 1
                     }
                    else this.end()
                }
                ul.appendChild(li)
            })
            this.info.appendChild(ul)
        }

        //input
        if(this.cmSend === 'getnumber' || this.cmSend === 'test') {
            this.input.el.setAttribute('value', this.input.defaultValue)
            this.info.appendChild(this.input.el)
            this.input.el.focus()
            this.input.el.select()
        }
                
    }

    cm(){
        this.cmExecuted     =       false
        const update = (typeSend, txt) => {
            this.cmExecuted = true
            this.cmSend = typeSend
            this.structure(txt)

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
                case 'getnumber'        :   this.type       = 3
                    break
                case 'test'             :   this.type       = -1
                    break
                default                 :   this.cmExecuted = false
                    break
            }

            if(this.config.dev) console.log(`Type: ${typeSend}(${this.type})`);
            
        }

        const infoByConsole = () => {
            if(this.config.dev) console.info('The same cmSend of message as the previous one')
        }

        let command = {
            sendSimple  :   text => {                
                switch(this.cmSend){
                    case 'ok':
                    case 'getNumber':
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
                        infoByConsole()
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
                    case 'getnumber':
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
                        infoByConsole()
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
                    case 'getnumber':
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
                        infoByConsole()
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
                    case 'getnumber':
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
                        infoByConsole()
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
                    case 'getnumber':
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
                        infoByConsole()
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
                    case 'getnumber':
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'acceptdecline':
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
                        infoByConsole()
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
                    case 'getnumber':
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'yesno':
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
                        infoByConsole()
                        break;
                }                
                update('acceptdecline', text)
            },

            sendGetNumber   :   (text, defaultValue, min, max) => {
                this.btnYes.innerHTML = 'ok'
                this.input.defaultValue = defaultValue
                this.input.min = min
                this.input.max = max
                switch(this.cmSend){
                    case 'simple':
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        break
                    case 'ok':
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
                        infoByConsole()
                        break;
                }
                update('getnumber', text)
            },

            sendTest        :   text => {                
                this.btnYes.innerHTML = 'YES'
                this.input.defaultValue = 0
                this.input.min = 0
                this.input.max = null
                switch (this.cmSend) {
                    case 'simple':
                        this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnsInterrogate1.appendChild(this.btnNext)
                        this.btnsInterrogate2.appendChild(this.btnYes)
                        this.btnsInterrogate2.appendChild(this.btnNo)
                        break
                    case 'ok':
                    case 'getnumber':
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
                        infoByConsole()
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
        
        if(this.character !== false)
            return Object.assign(command, this.character.cm)

        return command
    }

    set send(mode){
        if(this.cmSend === 'getnumber' || this.cmSend === 'test'){
            let value = parseInt(this.input.el.value)
            if(value < this.input.min || value > this.input.max && this.input.max !== null || isNaN(value)) {
                this.input.el.style.color = this.config.color.danger
                setTimeout(()=>{
                    this.input.el.style.color = 'initial'
                }, 500)
                return
            }
            this.selection = value
            this.input.restart()
        }
        if(this.config.transition !== 'step'){ 
            this.container.style.opacity = 0

            setTimeout( () => {
                if(this.config.transition === 'ease') this.container.style.transition = '0.3s ease'                
                this.script.action(mode, this.type, this.selection)
                this.selection = 0 //reset
                this.container.style.opacity = 1
                if(!this.cmExecuted && this.dispose) this.end()
            }, 150)

            if(this.config.transition === 'ease') this.container.style.transition = '0s'            
            this.cmExecuted = false
            return
        }        
        this.script.action(mode, this.type, this.selection)
        this.selection = 0 //reset
        if(!this.cmExecuted && this.dispose) this.end()
        this.cmExecuted = false
    }    

    events(){        
        //Button
        const evSend                =   mode=>  { if ( !this.dispose ) this.send = mode; else this.end() }
        this.btnEndChat.onclick     =   ()  =>  { this.script.action(-1, this.type, 0); this.end() }        //endchat
        this.btnYes.onclick         =   ()  =>  evSend(1)                                                //yes
        this.btnNo.onclick          =   ()  =>  evSend(0)                                                //no
        this.btnPrev.onclick        =   ()  =>  evSend(0)                                                //prev
        this.btnNext.onclick        =   ()  =>  evSend(1)                                                //next
        
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

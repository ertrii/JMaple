'use strict';
(function(root){
    const config = {
        globalPath : 'dist/src/img/',
        dev : false
    }
    const Exp = [1, 15, 34, 57, 92, 135, 372, 560, 840, 1242, 1144, 1573, 2144, 2800, 3640, 4700, 5893, 7360, 9144, 11120, 13477, 16268, 19320, 22880, 27008, 31477, 36600, 42444, 48720, 55813, 63800, 86784, 98208, 110932, 124432, 139372, 155865, 173280, 192400, 213345];
    class Stat{
        constructor(stat = {}){
            this.str = (stat.hasOwnProperty('str')) ? stat.str : 4
            this.dex = (stat.hasOwnProperty('dex')) ? stat.dex : 4
            this.int = (stat.hasOwnProperty('int')) ? stat.int : 4
            this.luk = (stat.hasOwnProperty('luk')) ? stat.luk : 4
            this.hp = (stat.hasOwnProperty('hp')) ? stat.hp : 50
            this.mp = (stat.hasOwnProperty('mp')) ? stat.mp : 50

            this.lv = (stat.hasOwnProperty('lv')) ? stat.lv : 1
            this.exp = (stat.hasOwnProperty('exp')) ? stat.exp : 0
            this.def = (stat.hasOwnProperty('def')) ? stat.def : 0
            this.att = (stat.hasOwnProperty('att')) ? stat.att : 0
            this.attM = (stat.hasOwnProperty('attM')) ? stat.attM : 0
            this.fame = 0
            this.refresh()
        }
        refresh(){
            while (this.exp >= Exp[this.lv]){
                this.exp -= Exp[this.lv];
                this.lv++
            }
        }
    }
    class Item{
        constructor(id, name, inventory){
            this.id = id
            this.name = name
            this.inventory = inventory
            //this.type = null;
            this.lvRequerid = 1        
            this.icon = 'dist/src/img/default.png'
            this.trade = true
            this.cash = false
            this.desc = ''
            this.slotMax = 1
            this.description = ''        
        }
        static init(){        
            this.list = new Map()
            this.path = config.globalPath
            
            const create = (id, name, icon, item) => {
                if(icon === null)
                    Item.add(new item(id, name, `${id}.png`))
                else
                    Item.add(new item(id, name, icon))
            }
            
            this.equip = {
                create : (id, name, icon = null) => create(id, name, icon, Equip),
                list : this.list
            }
            this.use = {
                create : (id, name, icon = null) => create(id, name, icon, Use),
                list : this.list
            }
            this.setup = {
                create : (id, name, icon = null) => create(id, name, icon, Setup),
                list : this.list
            }
            this.etc = {
                create : (id, name, icon = null) => create(id, name, icon, Etc),
                list : this.list
            }
        }

        static add(item){        
            if(item instanceof Item){
                this.list.set(item.id, item)
                return true
            }            
            else{
                console.error('Its not Item')
                return false
            }
        }
        static get(iditem){        
            let item = this.list.get(iditem)
            return (item === undefined) ? false : item
        }
    }

    Item.init()

    class Equip extends Item{
        constructor(id, name, icon){
            super(id, name, 'Equip')
            super.icon          = icon
            //super.type          = type
            this.strRequerid    = 0
            this.dexRequerid    = 0
            this.intRequerid    = 0
            this.lukRequerid    = 0
            this.fameRequerid   = 0
            this.job            = {
                beginner        : true,
                warrior         : true,
                magician        : true,
                bowman          : true,
                tief            : true,
                pirate          : true
            }
            this.stat = new Stat({
                hp  : 0,
                mp  : 0
            })
        }
    }
    class Use extends Item{
        constructor(id, name, icon){
            super(id, name, 'Use')
            super.icon = icon
            this.stat = new Stat({
                str : 0,
                dex : 0,
                int : 0,
                luk : 0,
                hp  : 0,
                mp  : 0
            })
            //super.type = type
            this.warp = false
            super.slot = 100        
        }    
    }
    class Setup extends Item{
        constructor(id, name, icon){
            super(id, name, 'Setup')
            super.lvRequerid = 0
            super.icon = icon
            this.sec = 10
            this.stat = new Stat({
                str : 0,
                dex : 0,
                int : 0,
                luk : 0
            })
        }
    }
    class Etc extends Item{
        constructor(id, name, icon){
            super(id, name, 'Etc')
            super.slot = 200
            super.icon = Item.path + icon        
        }
    }

    class Quest{
        static init(){
            this.list = new Map()
            this.active = new Map()
            this.completed = new Map()
        }
        static create(id, name, min = false){
            let quest = {
                id : id,
                name : name,
                expires : (min) ? true : false,
                timer : {
                    start : null,
                    time : min,
                    finished : null,
                    leftoverTime : null,
                    interval : () => {
                        let timer = quest.timer
                        if(timer.start === null || !timer.time) return false
                        let date = new Date(timer.start)
                        date.setMinutes(date.getMinutes() + timer.time)
                        timer.leftoverTime = parseInt((date - timer.start) / 1000)
                        const timeStart = setInterval ( () =>{
                            if(quest.completed){
                                clearInterval(timeStart)
                                return
                            }
                            if(!quest.active && !quest.completed){
                                timer.leftoverTime = null
                                clearInterval(timeStart)
                                return
                            }
                            timer.leftoverTime--
                            if(timer.leftoverTime === 0){
                                this.forfeit(quest.id)
                                clearInterval(timeStart)
                            }
                        }, 1000)
                        return true
                    }
                },
                active : false,
                completed : false
            }
            if(this.list.get(id) === undefined)
                this.list.set(id, quest)
            else
                return false
            
            return true        
        }
        static start(idquest){
            let quest = this.list.get(idquest)
            if(quest === undefined || quest.active || quest.completed) return false

            quest.timer.start = new Date()        
            quest.active = true        
            quest.timer.interval()

            const obj = {
                id : quest.id,
                name : quest.name,
                expires : quest.expires
            }
            this.active.set(quest.id, obj)
            
            return true
        }
        static complete(idquest){
            let quest = this.list.get(idquest)
            if(quest === undefined || !quest.active || quest.completed) return false

            const finished = new Date()
            quest.timer.finished = finished
            quest.active = false
            quest.completed = true
            this.active.delete(idquest)
            
            const obj = {
                id : quest.id,
                name : quest.name,
                start : quest.timer.start,
                finished : finished,
                leftoverTime : quest.timer.leftoverTime
            }
            this.completed.set(idquest, obj)
            return true
        }
        static forfeit(idquest){
            let quest = this.list.get(idquest)
            if(quest === undefined || !quest.active || quest.completed) return false
            quest.active = false
            quest.timer.start = null
            quest.timer.finished = null
            this.active.delete(idquest)
            return true
        }
        static timer(idquest, callback){
            let quest = this.list.get(idquest)
            if(quest === undefined || !quest.active || quest.completed || quest.timer.leftoverTime === null){
                callback(0)
                return
            }

            const interval = setInterval(()=>{
                let time = this.list.get(idquest).timer.leftoverTime
                if(time <= 0 || quest.completed){
                    clearInterval(interval)
                    callback(0)
                }else
                    callback(time)
            }, 1000)
                    
        }
    }

    Quest.init()

    class Character{
        constructor(nick){
            this.nick   =   nick
            this.gender =   0 //male(0), female(1)
            this.job    =   0
            this.gm     =   false
            this.mesos  =   0
            this.nx     =   0        
            this.sp     =   0
            this.ap     =   0
            
            this.stat = new Stat()
            this.items  =   new Map()        
        }

        setItems(items){
            if(!Array.isArray(items)) {
                console.error('Is not a Array Items')
                return
            }
            items.forEach(item => {
                if(!item.hasOwnProperty('quantity')) item.quantity = 1
                this.setItem(item.id, item.quantity)
            })
        }

        setItem(itemid, quantity = 1){
            let item = Item.get(itemid)
            if(!item) {
                console.error(`This item(${itemid}) is not exists in the list Item`);
                return false;
            }
            if(this.items.get(item.id) === undefined){
                let preparedItem = {
                    item : item,
                    quantity : quantity
                }
                this.items.set(item.id, preparedItem);
            }else{
                this.items.get(itemid).quantity += quantity;
            }
            return true
        }

        get listItem(){
            let keys = []
            this.items.forEach((value, key) => keys.push(key))
            return keys;
        }

        removeItem(iditem, quantity = null){
            let item = this.items.get(iditem)
            if(item === undefined) return false        
            if(quantity === null || item.quantity <= quantity)
                this.items.delete(iditem)
            else
                this.items.get(iditem).quantity -= quantity        
            return true
        }

        quest(id){
            return {
                start:     ()  => Quest.start(id),
                complete:  ()  => Quest.complete(id),
                forfeit:   ()  => Quest.forfeit(id)            
            }
        }

        get cm(){
            let command = {
                openShop    :   shopid  => {
                    console.log(`openShop: ${shopid}`)
                },
                haveItem    :   itemid  => {
                    if(this.items.get(itemid) === undefined)
                        return false
                    else
                        return true
                },
                gainItem    :   (itemid, ammount = 1)   =>  {
                    if(ammount < 0){
                        return this.removeItem(itemid, -(ammount))
                    }else{
                        return this.setItem(itemid, ammount)
                    }
                },
                changeJob   :   jobid   => {
                    if(!isNaN(ammount))
                        this.job = jobid
                    else console.error('is not number')
                },
                getJob          :   ()   => this.job,
                startQuest      :   questid => this.quest(questid).start(),
                completeQuest   :   questid => this.quest(questid).complete(),
                forfeitQuest    :   questid => this.quest(questid).forfeit(),
                getMeso         :   () => this.meso,
                gainMeso    :   ammount => {
                    if(!isNaN(ammount))
                        this.meso += ammount
                    else console.error('is not number')
                },
                gainExp   :   ammount  => {
                    if(!isNaN(ammount)){
                        this.stat.exp += ammount
                        this.stat.refresh()
                    }
                    else console.error('is not number')
                },
                getLevel    :   ()  => this.stat.lv,
                teachSkill  :   (skillid, skilllevel, maxskilllevel) => {
                    //thinking...
                },
                get         :   stat    => {
                    switch (stat) {
                        case 'STR': return this.stat.str
                        case 'DEX': return this.stat.dex
                        case 'INT': return this.stat.int
                        case 'LUK': return this.stat.luk
                        case 'HP': return this.stat.hp
                        case 'MP': return this.stat.mp
                        default: return null                        
                    }
                },
                modifyNX    :   ammount => {
                    if(!isNaN(ammount))
                        this.nx = ammount
                    else console.error('is not number')
                },
                getPlayer   :   ()  => {
                    return {
                        isGM    :   ()  => this.gm,
                        getGender : ()  => this.gender,
                        getitemQuantity : itemid => {
                            let item = this.items.get(itemid)
                            if(item === undefined)
                                return 0
                            else
                                return item.quantity
                        }
                    }
                },
                getChar     :   ()  => {
                    return {
                        isDonator : () => false,
                        getGender : () => this.gender
                    }
                }

            }
            return command
        }
    }

    class Maps {
        static init(){
            this.list = new Map()
        }
        static create(m){
            if(!m.hasOwnProperty('action')) m.action = null
            if(!m.hasOwnProperty('warp')) m.warp = true
            let data = {
                id : m.id,
                name : m.name,
                link : m.link,
                action: m.action,
                warp : m.warp,
            }
            this.list.set(m.id, data)
        }
        static get(id){
            let map = this.list.get(parseInt(id))
            return (map === undefined) ? false : map
        }
    }
    Maps.init()

    class Portal {
        static init(){
            this.list = new Map()
        }
        static create(id, coord){
            let c = coord.split(';')
            let portal = {
                id : id,
                coord : {
                    x : parseFloat(c[0]),
                    y : parseFloat(c[1])
                },
                
                coordString : coord
            }
            if(!isNaN(portal.coord.x) && !isNaN(portal.coord.y))
                this.list.set(id, portal)
            else
                console.error(`The coord Portal(id: ${id}) is not number`)
        }
        static get(id){
            let portal = this.list.get(parseInt(id))
            return (portal === undefined) ? false : portal
        }
    }
    Portal.init()

    class NPC{
        static init(){
            this.list = new Map()
            this.path = config.globalPath
        }
        static create(id, name, img = null){
            let npc = {
                id : id,
                name : name,
                img : (img === null) ? `${this.path}${id}.png` : img
            }
            this.list.set(id, npc)
            return true
        }
        static get(id){
            let npc = this.list.get(parseInt(id))
            return (npc === undefined) ? false : npc
        }
    }
    NPC.init()

    class Talk{
        constructor(data){
            this.preference         =       {
                displace        :       true,
                writing         :       true,
                transition      :       'ease', // ease, gross, step <- later check, reason: writing
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
            //getting
            this.container      =       document.getElementById(data.el)
            this.npc            =       data.hasOwnProperty('npc') ? NPC.get(data.npc) : false
            //preparing
            this.tagCode        =       {

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
                        el      :       'b'
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
                identifier      :       ['#m', '#p', '#t', '#z', '#h', '#v', '#i', '#c', '#w'],
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
            this.mode           =       null
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

            this.input.el.setAttribute('class', this.preference.key + '__input')
            //extensions
            this.character      =       (data.hasOwnProperty('character')) ? data.character : false
        }
        /*===Creating Element===*/
        get html(){
            //parent
            let parentElement = document.createElement('div')
            parentElement.setAttribute('class', this.preference.key)

            //head
            this.head = document.createElement('div')
            this.head.setAttribute('class', this.preference.key + '__head')

            //body
            let body = document.createElement('div')
            body.setAttribute('class', this.preference.key + '__body')
                let npc = document.createElement('div')
                npc.setAttribute('class', this.preference.key + '__body__npc')
                    let npcImg = document.createElement('div')
                    npcImg.setAttribute('class', this.preference.key + '__body__npc__img')
                        let imgElem = document.createElement('img')
                        if(this.npc) imgElem.setAttribute('src', this.npc.img)
                    npcImg.appendChild(imgElem);
                npc.appendChild(npcImg);
                    let pNameElem = document.createElement('p')
                    pNameElem.setAttribute('class', this.preference.key + '__body__npc__name')
                    if(this.npc) pNameElem.appendChild(document.createTextNode(this.npc.name))
                npc.appendChild(pNameElem)
            if(this.npc)
            body.appendChild(npc)
                this.dialog = document.createElement('div')
                this.dialog.setAttribute('class', this.preference.key + '__body__dialog')
                    this.info = document.createElement('div')
                    this.info.setAttribute('class', this.preference.key + '__body__dialog__info')
                this.dialog.appendChild(this.info)
                    this.btnsInterrogate1 = document.createElement('div')
                    this.btnsInterrogate1.setAttribute('class', this.preference.key + '__body__dialog__btns')
                        this.btnPrev = document.createElement('button')
                        this.btnPrev.appendChild(document.createTextNode('PREV'))
                    if(this.cmSend === 'test' || this.cmSend === 'nextprev')
                    this.btnsInterrogate1.appendChild(this.btnPrev)
                        this.btnNext = document.createElement('button')
                        this.btnNext.appendChild(document.createTextNode('NEXT'))
                    if(this.cmSend === 'test' || this.cmSend === 'next' || this.cmSend === 'nextprev')
                    this.btnsInterrogate1.appendChild(this.btnNext)
                this.dialog.appendChild(this.btnsInterrogate1)
            body.appendChild(this.dialog)
            
            //footer
            let footer = document.createElement('div')
            footer.setAttribute('class', this.preference.key + '__footer')
                let exit = document.createElement('div')
                exit.setAttribute('class', this.preference.key + '__footer__btn-exit')
                    this.btnEndChat = document.createElement('button')
                    this.btnEndChat.appendChild(document.createTextNode('END CHAT'))
                exit.appendChild(this.btnEndChat)
            footer.appendChild(exit)
                this.btnsInterrogate2 = document.createElement('div')
                this.btnsInterrogate2.setAttribute('class', this.preference.key + '__footer__btns')
                    this.btnYes = document.createElement('button')
                    this.btnYes.appendChild(document.createTextNode((this.cmSend === 'ok') ? 'OK' : (this.cmSend === 'acceptdecline') ? 'Accept' : 'YES'))//ok === yes === Accept
                if(this.cmSend === 'test' || this.cmSend === 'yesno' || this.cmSend === 'ok' || this.cmSend === 'acceptdecline')
                this.btnsInterrogate2.appendChild(this.btnYes)
                    this.btnNo = document.createElement('button')
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
        
        structure(msg){
            //preparing message
            let temp = { cod : null, text : '', value   : '' }
            let paragraphs = [], parag = []
            function addParagraphs(){
                let newParag = [...parag]
                paragraphs.push(newParag)
                parag = []
            }
            //preparing list
            let openLi = false, valueLi = ''
            let ul = [], contentLi = []

            function save(){
                if(temp.text === '') return
                let newTemp = {                
                    cod : temp.cod,
                    text : temp.text,
                    value : temp.value
                }

                temp.text = ''
                temp.value = ''
                temp.cod = null

                if(openLi)
                    contentLi.push(newTemp)
                else{
                    parag.push(newTemp)
                }            
            }
            
            function closeLi(){
                let li = {
                    value : valueLi,
                    content : contentLi
                }
                ul.push(li)
                valueLi = ''
                temp.text = ''
                openLi = false
                contentLi = []
            }

            let i_char = 0
            const findCode = txt => {
                if(txt === this.tagCode.remove){
                    save()                
                    return
                }

                for (const color of this.tagCode.color) {
                    if(txt === color.cod){
                        save()
                        temp.cod = txt
                        return
                    }
                }

                const getData = cod => {
                    i_char +=2
                    let data = null
                    function check(value, property){
                        let getted = value()
                        if (!getted) return
                        if(property === 'name'){ data = getted.name; return}
                        if(property === 'icon') data = getted.icon
                    }
                    switch (cod) {
                        case '#m':
                            check( () => Maps.get(parseInt(getValue(10))), 'name')
                            break;
                        case '#p':
                            check( () => NPC.get(parseInt(getValue(10))), 'name')
                            break;
                        case '#t':
                        case '#z':
                            check( () => Item.get(parseInt(getValue(10))), 'name')
                            break;
                        case '#h':
                            if (getValue(2) === ' ') data = this.character.nick
                            else {
                                i_char++
                                data = txt
                            }
                            break
                        case '#i':
                        case '#v':
                            let savingTempCod = temp.cod
                            save()//closing tag code
                            let _item = Item.get(parseInt(getValue(10)))
                            if(!_item) break
                            temp.cod = cod//open tag code
                            temp.text = _item.name
                            temp.value = _item.icon
                            save()//closing tag code
                            temp.cod = savingTempCod
                            data = ''
                            break;
                        case '#c':
                            let item = this.character.items.get(parseInt(getValue(10)))
                            if(item === undefined) data = 0
                            else data = item.quantity
                            break
                        case '#w':
                            let savingTempCod2 = temp.cod
                            save()
                            addParagraphs()
                            temp.cod = savingTempCod2
                            data = ''
                            break
                    }
                    if(data === null) console.error(`Not found or the value is long`)
                    i_char -=2
                    return data
                }
                
                for (const identifier of this.tagCode.identifier) {
                    if(txt === identifier){
                        let data = getData(identifier)
                        temp.text += data
                        return
                    }
                }
                temp.text += txt
            }

            function getValue(max){
                let j = 0, value = ''
                while(j <= max){
                    if(msg.substr(i_char + j, 1) === '#'){                            
                        value = msg.substr(i_char, j)
                        if(value === '') i_char += j
                        else {
                            j++
                            i_char += j
                        }
                        break
                    }
                    j++
                }
                return value
            }
            while (i_char < msg.length) {
                let textSplit = msg.substr(i_char, 1)
                if(textSplit === '#'){
                    textSplit = msg.substr(i_char, 2)                
                    if(textSplit === '##'){
                        temp.text += '#'
                        i_char ++
                        continue
                    }
                    if(textSplit === '#L'){
                        i_char += 2//omiting code tag
                        valueLi = getValue(3)
                        
                        if(valueLi !== ''){
                            save()
                            if(openLi) closeLi()
                            temp.cod = null//it's just in case
                            openLi = true
                        }
                        else i_char ++                    
                        continue;
                    }
        
                    else if(openLi){
                        if(textSplit === '#l'){
                            save()
                            closeLi()
                        }else{
                            findCode(textSplit)                        
                        }                    
                    }
                    else findCode(textSplit)
                    i_char +=2
                }
                else{
                    temp.text += textSplit
                    i_char ++
                } 
                    
            }
            //console.log("\n" )
            save()//ending...
            if(openLi) closeLi()
            addParagraphs()
            this.write(paragraphs, (ul.length === 0) ? null : ul)
        }

        write(paragraphs, list = null){
            const getTextStyle = node => {
                for (const color of this.tagCode.color) {
                    if (node.cod === color.cod) {
                        let elem = document.createElement(color.el)
                        elem.setAttribute('class', this.preference.key + color.id)
                        elem.appendChild(document.createTextNode(node.text))                    
                        return elem
                    }
                }
                let div = document.createElement('div')
                div.setAttribute('class', this.preference.key + '__icon')
                let img = document.createElement('img')
                img.setAttribute('src', node.value)
                img.setAttribute('title', node.text)
                div.appendChild(img)
                return div
            }

            //text
            while(this.info.firstChild) this.info.removeChild(this.info.firstChild)
            paragraphs.forEach(parag => {
                let p = document.createElement('p')
                p.setAttribute('class', this.preference.key + '__body__dialog__info--text')
                    
                parag.forEach(dialog =>{
                    if(dialog.cod === null){
                        let s = document.createElement('span')
                        s.appendChild(document.createTextNode(dialog.text))
                        p.appendChild(s)
                    }
                    else{
                        p.appendChild(getTextStyle(dialog))
                    }
                })
                this.info.appendChild(p)
            })

            //animating text
            if(this.preference.writing){

                //removing text
                let tempElem = [], savingText = [], savingElements = []
                let numParag = 0
                for(let indexParag = 0; indexParag < paragraphs.length; indexParag++ ){
                    removeText(this.info.children[indexParag])
                }            
                function removeText(parag){
                    let positionChild = 0, foundDiv = false

                    for (const elem of parag.children) {

                        if(elem.tagName === 'DIV'){
                            tempElem.push([positionChild, elem.firstChild])
                            savingText.push('')
                            foundDiv = true
                        }

                        else{
                            savingText.push(elem.innerHTML)
                            elem.innerHTML = ''
                        }

                        positionChild++
                    }

                    if(foundDiv) {
                        savingElements.push({
                            index : numParag,
                            el : [...tempElem]
                        })
                        tempElem = []
                    }
                    numParag++
                }

                for (const elementsOfParag of savingElements) {
                    for (const elem of elementsOfParag.el) {
                        this.info.children[elementsOfParag.index].children[elem[0]].removeChild(elem[1])
                    }
                }

                //re-writirng
                let i = 0, j = 0, k = 0, countParag = 0
                const charArray = _i => savingText[_i].split('')            

                function writeNow(el){
                    if(i > el.children.length - 1){
                        i = 0
                        j = 0
                        return false
                    }
                    //this is crazy ._.
                    if(savingElements.length > 0){
                        for(let e = 0; e < savingElements.length; e++){
                            if(countParag === savingElements[e].index){
                                for(const elementsOfParag of savingElements[e].el){
                                    if(i === elementsOfParag[0]){
                                        el.children[i].appendChild(elementsOfParag[1])
                                        i++
                                        k++
                                        return true
                                    }
                                }
                            }
                        }
                    }
                    let chars = charArray(k)
                    el.children[i].innerHTML += chars[j]
                    j++
                    if(j > chars.length - 1){
                        j = 0
                        i++
                        k++
                    }
                    return true
                }
                
                let done = false
                const interval = setInterval( () => {
                    if(countParag >= paragraphs.length){
                        done = true
                        k = 0
                        clearInterval(interval)
                    }else{
                        if(!writeNow(this.info.children[countParag])){
                            countParag++
                        }
                    }
                    
                }, 35)

                this.dialog.onclick = () => {
                    if(done) return
                    clearInterval(interval)
                    while(true) {
                        if(countParag >= paragraphs.length){
                            done = true
                            k = 0
                            break
                        }else{
                            if(!writeNow(this.info.children[countParag]))
                                countParag++
                        }
                        
                    }
                }
            }
            
            //list
            if(list !== null) {
                let ul = document.createElement('ul')
                ul.setAttribute('class', this.preference.key + '__body__dialog__info--alternatives')            
                list.forEach( node => {
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
                            this.mode = 1
                            this.nextWindow()
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

                if(config.dev) console.log(`Mode: ${this.mode}, Type: ${typeSend}(${this.type}), Selection : ${this.selection}`);
                
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
                    }
                    update('test', text)
                },

                warp            :   (mapid, portalid = 0) => {
                    let data = Maps.get(mapid)
                    if(!data) {
                        console.warn(`map{mapid} not found`)
                        return
                    }
                    if(portalid > 0){                        
                        if(!Portal.get(portalid)){
                            console.error(`portal(${portalid}) not found`)
                        }else{
                            let coord = Portal.get(portalid).coord
                            const containerX = this.container.clientWidth
                            const containerY = this.container.clientHeight
                            let x = -(containerX / 2 - this.container.firstChild.clientWidth / 2)
                            let y = -(containerY / 2 - this.container.firstChild.clientHeight / 2)
                            this.cssTranslate.x = x + (coord.x * containerX) / 100
                            this.cssTranslate.y = y + (coord.y * containerY) / 100
                            this.container.firstChild.style.transform = `translate(${this.cssTranslate.x}px, ${this.cssTranslate.y}px)`
                        }
                    }
                    if(data.action !== null) data.action()
                    if(data.warp) window.location.href = data.link
                    if(config.dev) console.log(`warp(${data.id}): ${data.link}`)
                },

                dispose         :   () => this.dispose = true
            }
            
            if(this.character !== false)
                return Object.assign(command, this.character.cm)

            return command
        }

        nextWindow(){
            if(this.cmSend === 'getnumber' || this.cmSend === 'test'){
                let value = parseInt(this.input.el.value)
                if(value < this.input.min || value > this.input.max && this.input.max !== null || isNaN(value)) {
                    this.input.el.style.color = this.preference.color.danger
                    setTimeout(()=>{
                        this.input.el.style.color = 'initial'
                    }, 500)
                    return
                }
                this.selection = value
                this.input.restart()
            }
            if(this.preference.transition !== 'step'){ 
                this.container.style.opacity = 0

                setTimeout( () => {
                    if(this.preference.transition === 'ease') this.container.style.transition = '0.3s ease'                
                    this.script.action(this.mode, this.type, this.selection)
                    this.selection = 0 //reset
                    this.container.style.opacity = 1
                    if(!this.cmExecuted && this.dispose) this.end()
                }, 150)

                if(this.preference.transition === 'ease') this.container.style.transition = '0s'            
                this.cmExecuted = false
                return
            }        
            this.script.action(this.mode, this.type, this.selection)
            this.selection = 0 //reset
            if(!this.cmExecuted && this.dispose) this.end()
            this.cmExecuted = false
        }    

        events(){
            const sendEvent = mode => {
                this.mode = mode
                if(!this.dispose) this.nextWindow()
                else{
                    if(config.dev) console.log(`Mode: ${this.mode}, Type: ${this.type}, Selection : ${this.selection}`)
                    this.end()
                }
            }

            //Buttons:
            //endchat
            this.btnEndChat.onclick     =   ()  =>  {
                this.mode = -1
                if(this.script.hasOwnProperty('action'))
                    this.script.action(this.mode,this.type, 0)
                this.end()
            }        
            this.btnYes.onclick         =   ()  =>  sendEvent(1) //yes
            this.btnNo.onclick          =   ()  =>  sendEvent(0) //no
            this.btnPrev.onclick        =   ()  =>  sendEvent(0) //prev
            this.btnNext.onclick        =   ()  =>  sendEvent(1) //next
            
            //Window
            let anchorPoint             =           { getted : false, x : 0, y : 0 } //Mag Anchor Point
            this.cssTranslate            =          { x : 0, y : 0 }
            let x = 0, y = 0
            let stopMove                =   ()  =>  {
                this.container.onmousemove = null;
                anchorPoint.getted = false;
                this.cssTranslate.x = x;
                this.cssTranslate.y = y
            }
            this.head.onmouseup         =   ()  =>  stopMove()
            this.container.onmouseup    =   ()  =>  stopMove()        
            
            if(this.preference.displace)
            this.head.onmousedown       =   ()  =>  this.container.onmousemove  =   ev  => {            
                
                if(!anchorPoint.getted) {                
                    anchorPoint.x       =   ev.clientX
                    anchorPoint.y       =   ev.clientY
                    anchorPoint.getted  =   true                
                }            
                x = this.cssTranslate.x + ev.clientX - anchorPoint.x
                y = this.cssTranslate.y + ev.clientY - anchorPoint.y            
                
                this.container.firstChild.style.transform = `translate(${x}px, ${y}px)`

            }        
            
        }

        start(){
            this.prepareScript()        
            this.container.classList.add('jmaple')
            this.container.style.display = 'flex'        
            this.container.style.zIndex = `${this.preference.zIndex}`;
            this.container.appendChild(this.html)
            //this.script.start()
            try{
                this.script.start()
            }catch(e){
                if(config.dev) console.info('the start function was not found, executing action function...')
                try{
                    this.script.action(1, this.type, this.selection)
                }catch(er){
                    if(config.dev) console.error('action function was not found')
                }
            }
            this.events()
            if(!this.cmExecuted && this.dispose) this.end()
        }
    }

    class JMaple{
        constructor(){
            this.config = config
            this.Stat = Stat
            this.Item = Item
            this.Quest = Quest
            this.Character = Character
            this.NPC = NPC
            this.Maps = Maps
            this.Portal = Portal
            this.Talk = Talk
        }
    }
    
    root.JMaple = JMaple
    

})(typeof window !== "undefined" ? window : global)
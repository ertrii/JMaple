// Init: 04/25/2018
'use strict';
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
        this.type = null;
        this.lvRequerid = 1        
        //this.img = item.img
        this.trade = true
        this.cash = false
        this.desc = ''
    }
    static init(){        
        this.list = new Map()
    }
    static addList(items){        
        items.forEach(item => {
            if(!this.add(item)) return
        })
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
        return (item === undefined) ? null : item
    }
    get value(){
        return {
            id : this.id,
            name : this.name,            
            trade : this.trade,
            cash : this.cash,
            desc : this.desc
        }
    }
}

Item.init()

class Equip extends Item{
    constructor(id, name, type){
        super(id, name, 'Equip')
        super.type          = type        
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
    constructor(id, name, type = 'potion'){
        super(id, name, 'Use')
        this.stat = new Stat({
            str : 0,
            dex : 0,
            int : 0,
            luk : 0,
            hp  : 0,
            mp  : 0
        })
        super.type = type
        this.warp = false
    }    
}
class Setup extends Item{
    constructor(id, name, type){
        super(id, name, 'Setup')
        super.lvRequerid = 0
        this.sec = 10
        this.stat = new Stat({
            str : 0,
            dex : 0,
            int : 0,
            luk : 0
        })
        super.type = type
    }
}
class Etc extends Item{
    constructor(id, name, type){
        super(id, name, 'Etc')
        super.type = type
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
                    let timeStart = setInterval( () =>{
                        if(quest.completed){
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

        this.list.get(idquest).active = false
        this.list.get(idquest).timer.start = null
        this.list.get(idquest).timer.finished = null
        this.active.delete(idquest)
        return true
    }
    static timer(idquest){
        let quest = this.list.get(idquest)
        if(quest === undefined || !quest.active || quest.completed || !quest.timer.leftoverTime) return 0
        else return this.list.get(idquest).timer.leftoverTime
    }
}

Quest.init()

class JCharacter{
    constructor(nick, gender){
        this.nick   =   nick
        this.gender =   gender //male(0), female(1)
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

    setItem(iditem, quantity = 1){
        let item = Item.get(iditem)
        if(item === null) {
            console.error('This iditem not found in the list Item');
            return;
        }
        if(this.items.get(item.id) === undefined){
            let preparedItem = {
                item : item,
                quantity : quantity
            }
            this.items.set(item.id, preparedItem);
        }else{
            this.items.get(iditem).quantity += quantity;
        }
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
                let item = Item.get(itemid)                
                if(item !== null)
                    this.setItem(item, ammount)
                else
                    console.error(`This item(${itemid}) is not exists in the list Item`)
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
                        return 0//thinking...
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
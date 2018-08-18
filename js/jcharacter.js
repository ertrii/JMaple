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
    static prepareList(){
        if(!Item.hasOwnProperty('list'))
            this.list = new Map()
    }
    static addList(items){        
        items.forEach(item => {
            if(!this.add(item)) return
        })
    }
    static add(item){
        this.prepareList()
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
        this.prepareList()
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
class JCharacter{
    constructor(data){
        this.nick   =   data.nick
        this.gender =   data.gender
        this.job    =   (data.hasOwnProperty('job'))    ? data.job      : 0
        this.gm     =   (data.hasOwnProperty('gm'))     ? data.gm       : false        
        this.mesos  =   (data.hasOwnProperty('meso'))  ? data.meso      : 0
        this.nx     =   (data.hasOwnProperty('nx'))     ? data.nx       : 0        
        this.sp     =   (data.hasOwnProperty('sp'))     ? data.sp       : 0
        this.ap     =   (data.hasOwnProperty('ap'))     ? data.ap       : 0
        if(!data.hasOwnProperty('stat')) this.stat = new Stat()            
        else this.stat = data.stat
        this.items  =   new Map()
        if(data.hasOwnProperty('item')) this.setItem(data.item)
        if(data.hasOwnProperty('items')) this.setItems(data.items)
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
            start : () => {

            },
            complete : () => {

            },
            forfeit : () => {

            }
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
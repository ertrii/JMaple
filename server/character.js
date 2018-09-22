const Stat = require('./stat')
const Quest = require('./quest')
const Item = require('./item')

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
        let item = Item.list.get(itemid)
        if(item === undefined) {
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
                return this.setItem(itemid, ammount)
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

module.exports = Character
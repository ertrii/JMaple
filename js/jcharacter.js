// Init: 04/25/2018
'use strict';
class Stat{
    constructor(stat = { str : 4, dex : 4, int : 4, luk : 4, hp : 50, mp : 50} ){
        this.str = stat.str
        this.dex = stat.dex
        this.int = stat.int
        this.luk = stat.luk
        this.hp = stat.hp
        this.mp = stat.mp
    }    
}
class Item{
    constructor(item){        
        if(item.type === 'equip' || item.type === 'use' || item.type === 'setup' || item.type === 'etc'){
            this.type = item.type
            this.id = item.id
            this.name = item.name
            this.img = item.img
            this.trade = (item.hasOwnProperty('trade')) ? item.trade : true
            this.cash = (item.hasOwnProperty('cash')) ? item.cash : false        
            this.desc = (item.hasOwnProperty('desc')) ? item.desc : ''
            this.lv = (item.hasOwnProperty('level')) ? item.level : 0               
        }else{
            console.error('unknown item type ' + item.type)
            return;
        }
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
            img : this.img,
            lv: this.lv,
            type: this.type,
            trade : this.trade,
            cash : this.cash,
            desc : this.desc
        }
    }
}
class JCharacter{
    constructor(data, item = false){
        this.nick   =   data.nick
        this.gender =   data.gender
        this.job    =   (data.hasOwnProperty('job'))    ? data.job      : 0
        this.gm     =   (data.hasOwnProperty('gm'))     ? data.gm       : false
        this.lv     =   (data.hasOwnProperty('lv'))     ? data.lv       : 1
        this.exp    =   (data.hasOwnProperty('exp'))    ? data.exp      : 0
        this.mesos  =   (data.hasOwnProperty('mesos'))  ? data.mesos    : 0
        this.nx     =   (data.hasOwnProperty('nx'))     ? data.nx       : 0        
        this.sp     =   (data.hasOwnProperty('sp'))     ? data.sp       : 0
        this.ap     =   (data.hasOwnProperty('ap'))     ? data.ap       : 0
        if(!data.hasOwnProperty('stat')) this.stat = new Stat()            
        else this.stat = data.stat
        this.items  =   new Map()
        if(item) this.setItem(item)
        this.setExp()
    }
    setExp(){
        const Exp = [1, 15, 34, 57, 92, 135, 372, 560, 840, 1242, 1144, 1573, 2144, 2800, 3640, 4700, 5893, 7360, 9144, 11120, 13477, 16268, 19320, 22880, 27008, 31477, 36600, 42444, 48720, 55813, 63800, 86784, 98208, 110932, 124432, 139372, 155865, 173280, 192400, 213345];
        while (this.exp >= Exp[this.lv]){
			this.exp -= Exp[this.lv];
            this.lv++
		}
    }
    setItem(item, ammount = 1){
        if(item instanceof Item) {
            let dataPrepared = {
                item : item,
                ammount : ammount
            }
            this.items.set(item.id, dataPrepared)
        }
        else console.error("it's not Item Class")
        
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
                if(isNaN(ammount))
                    this.job = jobid
                else console.error('is not number')
            },
            getJob          :   ()   => this.job,
            startQuest      :   questid => this.quest(questid).start(),
            completeQuest   :   questid => this.quest(questid).complete(),
            forfeitQuest    :   questid => this.quest(questid).forfeit(),
            getMeso         :   () => this.mesos,
            gainMeso    :   ammount => {
                if(isNaN(ammount))
                    this.meso += ammount
                else console.error('is not number')
            },
            gainExp   :   ammount  => {
                if(isNaN(ammount)){
                    this.exp += ammount
                    this.setExp()
                }
                else console.error('is not number')
            },
            getLevel    :   ()  => this.lv,
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
                if(isNaN(ammount))
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
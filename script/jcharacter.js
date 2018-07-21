'use strict';

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
        if(!data.hasOwnProperty('stat'))
            data.stat = { str : 4, dex : 4, int : 4, luk : 4, hp : 50, mp : 50 }
        this.stat   =   {
            str : data.stat.str,
            dex : data.stat.dex,
            int : data.stat.int,
            luk : data.stat.luk,
            hp  : data.stat.hp,
            mp  : data.stat.mp
        }
        this.item  =   new Map()
        if(item) this.setItem(item)
    }
    setItem(item){
        item.forEach(i => {
            if(!i.hasOwnProperty('ammount')) i.ammount = 1
            const set = () => {
                let data = {
                    item : {
                        id : i.id,
                        name : i.name,
                        img : i.img                        
                    },
                    ammount : i.ammount,
                    type    : i.type                    
                }
                this.item.set(i.id, data)
            }                
            if(i.type !== 'equip' || i.type !== 'use' || i.type !== 'setup' || i.type !== 'etc' || i.type !== 'cash')
                console.error('unknown item type')
            else set()
        })
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
                console.log(shopid);                
            },
            haveItem    :   itemid  => {
                if(this.item.get(itemid) === undefined)
                    return false
                else
                    return true
            },
            gainItem    :   (itemid, ammount = 1)   => {
                
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
                    this.meso = ammount
                else console.error('is not number')
            },
            gainExp   :   ammount  => {
                if(isNaN(ammount))
                    this.exp = ammount
                else console.error('is not number')
            },
            getLevel    :   ()  => this.lv,
            teachSkill  :   (skillid, skilllevel, maxskilllevel) => {

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
                        return 0
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
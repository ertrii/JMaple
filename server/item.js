const config = require('./config')
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

module.exports = Item
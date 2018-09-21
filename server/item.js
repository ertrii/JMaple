class Item{
    constructor(id, name, inventory){
        this.id = id
        this.name = name
        this.inventory = inventory
        //this.type = null;
        this.lvRequerid = 1        
        this.icon = 'src/img/item/default.png'
        this.trade = true
        this.cash = false
        this.desc = ''
        this.slotMax = 1
        this.description = ''        
    }
    static init(){        
        this.list = new Map()
        this.path = 'src/img/item/'
        
        const create = (id, name, icon, item) => Item.add(new item(id, name, icon))
        
        this.equip = {
            create : (id, name, icon) => create(id, name, icon, Equip),
            list : this.list
        }
        this.use = {
            create : (id, name, icon) => create(id, name, icon, Use),
            list : this.list
        }
        this.setup = {
            create : (id, name, icon) => create(id, name, icon, Setup),
            list : this.list
        }
        this.etc = {
            create : (id, name, icon) => create(id, name, icon, Etc),
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
        return (item === undefined) ? null : item
    }
}

Item.init()

module.exports = Item
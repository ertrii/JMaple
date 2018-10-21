const config = require('./config')
class NPC{
    static init(){
        this.list = new Map()
        this.path = 'dist/src/img/'
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

module.exports = NPC
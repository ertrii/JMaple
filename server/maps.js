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

module.exports = Maps
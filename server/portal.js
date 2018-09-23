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

module.exports = Portal
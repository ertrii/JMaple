const Item = require('./item')
const Quest = require('./quest')
const Character = require('./character')
const config = require('./config')
const Portal = require('./portal')
const NPC = require('./npc')
class Talk{

}
class JMaple{
    constructor(){
        this.Item = Item
        this.Quest = Quest
        this.config = config
        this.Portal = Portal
        this.NPC = NPC
        this.Character = Character
        this.Talk = Talk
    }
}

module.exports = JMaple
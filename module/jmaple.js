const Item = require('./item')
const Quest = require('./quest')
const Character = require('./character')

class JMaple{
    constructor(){
        this.item = Item
        this.quest = Quest
        this.character = new Character()
    }
}

module.exports = JMaple
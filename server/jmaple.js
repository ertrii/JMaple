const Item = require('./item')
const Quest = require('./quest')
const Character = require('./character')

class Talk{

}
class JMaple{
    constructor(){
        this.Item = Item
        this.Quest = Quest
        this.Character = Character
        this.Talk = Talk
    }
}

module.exports = JMaple
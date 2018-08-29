////Read this -> http://forum.ragezone.com/f428/add-learning-npcs-start-finish-643364/

class N9010000 {    
    constructor(){        
        this.status =   0
    }
   start(){
        this.cm.gainItem(4000002,1)
        this.cm.sendNext("Thank you#n for install. #gTake a #i4000002# ^_^ ")
    }
    action(mode, type, selection){                    
        if(this.status === 0){
            this.cm.sendYesNo("This library is a version Alpha. #bDo you want to go read the documentation?")
            this.status++
            return
        }
        if(this.status === 1){
            if(mode === 1){
                this.cm.warp(456)                            
                this.cm.dispose()
            }else{
                this.cm.sendOk('Well... f3')
                this.cm.dispose()
            }
        }
    }
}

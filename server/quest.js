class Quest{
    static init(){
        this.list = new Map()
        this.active = new Map()
        this.completed = new Map()
    }
    static create(id, name, min = false){
        let quest = {
            id : id,
            name : name,
            expires : (min) ? true : false,
            timer : {
                start : null,
                time : min,
                finished : null,
                leftoverTime : null,
                interval : () => {
                    let timer = quest.timer
                    if(timer.start === null || !timer.time) return false
                    let date = new Date(timer.start)
                    date.setMinutes(date.getMinutes() + timer.time)
                    timer.leftoverTime = parseInt((date - timer.start) / 1000)
                    const timeStart = setInterval ( () =>{
                        if(quest.completed){
                            clearInterval(timeStart)
                            return
                        }
                        if(!quest.active && !quest.completed){
                            timer.leftoverTime = null
                            clearInterval(timeStart)
                            return
                        }
                        timer.leftoverTime--
                        if(timer.leftoverTime === 0){
                            this.forfeit(quest.id)
                            clearInterval(timeStart)
                        }
                    }, 1000)
                    return true
                }
            },
            active : false,
            completed : false
        }
        if(this.list.get(id) === undefined)
            this.list.set(id, quest)
        else
            return false
        
        return true        
    }
    static start(idquest){
        let quest = this.list.get(idquest)
        if(quest === undefined || quest.active || quest.completed) return false

        quest.timer.start = new Date()        
        quest.active = true        
        quest.timer.interval()

        const obj = {
            id : quest.id,
            name : quest.name,
            expires : quest.expires
        }
        this.active.set(quest.id, obj)
        
        return true
    }
    static complete(idquest){
        let quest = this.list.get(idquest)
        if(quest === undefined || !quest.active || quest.completed) return false

        const finished = new Date()
        quest.timer.finished = finished
        quest.active = false
        quest.completed = true
        this.active.delete(idquest)
        
        const obj = {
            id : quest.id,
            name : quest.name,
            start : quest.timer.start,
            finished : finished,
            leftoverTime : quest.timer.leftoverTime
        }
        this.completed.set(idquest, obj)
        return true
    }
    static forfeit(idquest){
        let quest = this.list.get(idquest)
        if(quest === undefined || !quest.active || quest.completed) return false
        quest.active = false
        quest.timer.start = null
        quest.timer.finished = null
        this.active.delete(idquest)
        return true
    }
    static timer(idquest, callback){
        let quest = this.list.get(idquest)
        if(quest === undefined || !quest.active || quest.completed || quest.timer.leftoverTime === null){
            callback(0)
            return
        }

        const interval = setInterval(()=>{
            let time = this.list.get(idquest).timer.leftoverTime
            if(time <= 0 || quest.completed){
                clearInterval(interval)
                callback(0)
            }else
                callback(time)
        }, 1000)
                
    }
}

Quest.init()

module.exports = Quest;
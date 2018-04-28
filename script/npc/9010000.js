class N9010000 {    
    constructor(){
        this.name   =   'Maple Administratos'
        this.img    =   '9010000.png'
        this.status =   0
    }
    start(){
        
    }
    action(mode){
        if(mode === 1){
            this.cm.sendNext('Hola, dale a siguiente' + mode)
            return
        }
        if(mode === 2)
            this.cm.sendSimple('genial...' + mode)
        
    }    
}

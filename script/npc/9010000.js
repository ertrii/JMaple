////Read this -> http://forum.ragezone.com/f428/add-learning-npcs-start-finish-643364/

class N9010000 {    
    constructor(){
        this.name   =   'Maple Administratos'
        this.img    =   '9010000.png'
        this.status =   0
    }
    start(){
        this.cm.sendYesNo('roger hola, bienvenido a este #bnpc# de #bprueba#, ¿usted desea proseguir? #Llista 1#l#Llista 2#l')
    }
    action(mode, type, selection){
        if(mode === 0 && this.status === 0){
            this.cm.sendOk('Entiendo..., espero volvernos a ver...')
            this.cm.dispose()
            return            
        }else if(mode === 1 && this.status === 0){
            this.status++;
        }

        if(this.status === 1){
            this.cm.sendNext('Gracias por aceptar. Para proseguir con esta prueba le recomendamos darle click en siguiente...')
            this.status++
            return
        }

        if(this.status === 4 && mode === 0) this.status = 2


        if(this.status === 2){
            this.cm.sendNext('Bien...!, vemos que esto está funcionando de maravilla, sigamos prosigando.')
            this.status++
            return            
        }
        
        if(mode === 1 && this.status === 3){
            this.cm.sendNextPrev('¡Esto es genial!, vez lo emocionante que esto... f2')
            this.status++
            return
        }

        if(this.status === 4){
            this.cm.sendOk(' Listo hemos terminado gracias por su participación')
            this.cm.dispose()            
        }



        
    }    
}

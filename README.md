JMaple(Alpha)
=======================

Una librería para crear ventanas de conversación al estilo maplestory usando el diseño clásico o actual entre otros. Programa tu npc usando una sintaxis cercana al script de los npc del juego.
![Alt Demo](http://img.fenixzone.net/i/2W6b9CG.png)
# Starting
### Include in your HTML file
#### Style
```html
<link rel="stylesheet" href="css/m--modern.css">
```

#### jmaple.js
```html
<script src="js/jmaple.js"></script>
```
```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: '9010000.png'
    },
    script : function(){//you cant use arrow function
        this.start = function(){//but here you can use arrow function
            this.cm.sendOk('This is my first conversation')
            this.cm.dispose()
        }
    }
}).show()
```

### There are many styles of conversation window
* m--classic.css
* m--modern.css
* m--flat.css
* m--future.css
## Config
Existen algunas propiedades de configuración que usted puede editar a su gusto, yo en mi caso lo dejaré por defecto:
* __displace(bool=true)__, desplazamiento de la ventana.
* __writing(bool=true)__, animación de escritura.
* __img_directory(string)__, ruta en donde se ubica las imagenes de los npc, por defecto es 'src/img/npc/'.
* __transition(string)__, tipo de transición de una ventana a otra:
    * __ease__, una transición suave.
    * __gross__, una transición de golpe.
    * __step__, no hay transición.
* __dev(bool=false)__, muestra por consola datos necesarios para el desarrollo.
#### Example:
```javascript
const jmaple = new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: '9010000.png'
    },
    script : function(){
        this.start = function(){
            this.cm.sendOk('This is my first conversation')
            this.cm.dispose()
        }
    }
})
jmaple.config.displace = false
jmaple.config.transition = 'gross'
jmaple.config.dev = true
jmaple.show()
```
## Conversation
Los script NPC están programado dentro de dos funciones principales:
* __start__, es el inicio del npc, la primera muestra.
    ```javascript
    this.start = function(){
        //code
    }
    ```
* __action__, es la siguiente acción que se mostrara, aquí será donde se programara todas las acciones del npc. Contiene tres parámetros, son opcionales:
    * __mode__, devuelve un valor(int) del boton pulsado.
    * __type__, devuelve un valor(int) del tipo de conversación.
    * __selection__, devuelve un valor(int) de una lista de selección.
    ```javascript
    this.action = function(mode, type, selection){
        //code
    }
    ```
#### Example:
```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: '9010000.png'
    },
    script : function(){
        this.start = function(){
            this.cm.sendOk('This is the first conversation')
        }
        this.action = function(mode, type, selection){
            this.cm.sendOk('This is the second conversation')
            this.cm.dispose()
        }
    }
}).show()
```
## Commands
Los commands(cm) son funciones que se ejecutarán dentro de las funciones principales, ```start()``` y ```action()```. Hablaremos primero de los comandos para tipos de ventana de conversación:
### Commands: Conversation Window:
| cm | Description |
| -- | ----------- |
| sendOk(string) | Shows a conversation window with an 'Ok' button |
| sendNext(string) | Shows a conversation window with a 'Next' button |
| sendPrev(string) | Shows a conversation window with a 'Prev' (previous) button |
| sendNextPrev(string) | Shows a conversation window with a 'Next' and 'Prev' button (see above) |
| sendYesNo(string) | Shows a conversation window with a 'Yes' and 'No' button |
| sendAcceptDecline(string) | Shows a conversation window with an 'Accept' and 'Decline' button |
| sendSimple(string) | Shows a conversation window with no buttons |
| sendTest(string) | Shows a conversation window with all button. This is cm does not exist in MapleStory, it was created for the development in the design |
###### Credits: Description by Shawn in Ragezone Forum, [here](http://forum.ragezone.com/f428/add-learning-npcs-start-finish-643364/)

#### Example:
```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: '9010000.png'
    },
    script : function(){
        this.start = function(){
            this.cm.sendNext('This is a conversation window with an Next button')
        }
        this.action = function(){
            this.cm.sendYesNo('This is a conversation window with an Yes and No button')
            this.cm.dispose()
        }
    }
}).show()
```
Dependiendo del tipo Ventana de Conversación, los parametros __type__ y __mode__ de ```action()``` devolveran un valor.
* __sendOk or sendNext__
    type = 0
    | Button | mode |
    | ------ | ---- |
    | end chat | -1 |
    | next / ok | 1 |
* __sendNextPrev__
    type = 0
    | Button | mode |
    | ------ | ---- |
    | end chat | -1 |
    | next | 1 |
    | back | 0 |
* __sendYesNo__
    type = 1
    | Button | mode |
    | ------ | ---- |
    | end chat | -1 |
    | yes | 1 |
    | no | 0 |
* __sendSimple__
    type = 4
    | Button | mode |
    | ------ | ---- |
    | end chat | 0 |
    | select | 1 |
* __sendAcceptDecline__
    type = 12
    | Button | mode |
    | ------ | ---- |
    | end chat | -1 |
    | accept | 1 |
    | decline | 0 |
* __sendTest__
    type = -1
    | Button | mode |
    | ------ | ---- |
    | end chat | -1 |
    | ok / accept / yes / next | 1 |
    | no / back | 0 |

El parametro __selection__ devolverá un valor ```0``` por defecto. Solo puede devolver otro valor cuando exista en el cuadro de dialogo una lista de selección, dependerá del índice.
### Commands: Actions
| cm | description |
| -- | ----------- |
| dispose() | Ends the conversation window. |
| warp(idMap, portal = 0) | Moves to a section page or other page, on MapleStory moves the player to a map. |
Con la función ```dispose()``` es recomendable ser ejecutada al final de cualquier comando al finalizar una conversación.
La función ```warp()``` requiere de dos valores:
* __idMap__, es un valor numerico(int) que identifica un map.
* __portal__, es un valor numerico(int) que identifica un portal, esto es opcional, por defecto será ```0```.

Antes de usar ```warp``` debemos registrar el mapa(map) en la lista.
#### Example:
```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: '9010000.png'
    },
    //register
    map: [
        {
            id : 123456,
            link : 'index.html#' //can be any link
        },
        {
            id : 456789,
            link : 'https://github.com/ertrii/JMaple'
        }
    ],
    //close register
    script : function(){
        this.start = function(){
            this.cm.sendOk('This is a test.')
        }
        this.action = function(){
            this.warp(456789)//the id of the registered map
            this.cm.sendOk('warp...')
            this.cm.dispose()
        }
    }
}).show()
```
Son dos propiedades requeridos y dos propiedades opcionales:
* __id(int)__, identificador del map.
* __link(string)__, link!.
* __warp(bool = true)__, evita mover al usuario. Opcional, por defecto es true.
* __action(function)__, ejecuta cualquier función. Opcional.
    ```javascript
    {
        id : 123456,
        link : 'index.html#',
        warp : false,
        action : myFunction
    }
    ```
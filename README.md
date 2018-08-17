JMaple(Alpha)
=======================

Una librería para crear ventanas de conversación al estilo maplestory usando el diseño clásico o actual entre otros. Programa tu npc usando una sintaxis cercana al script de los npc del juego.
![Alt Demo](http://img.fenixzone.net/i/2W6b9CG.png)
# Starting
```
# npm
npm install jmaple
```

#### Style
```html
<link rel="stylesheet" href="css/m--flat.css">
```

#### jmaple.js
```html
<script src="js/jmaple.js"></script>
```
```javascript
new JMaple({
    el:'element',
    script : function(){
        this.start = function(){
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
* __transition(string)__, tipo de transición de una ventana a otra:
    * __ease__, una transición suave.
    * __gross__, una transición de golpe.
    * __step__, no hay transición.
* __dev(bool=false)__, muestra por consola datos necesarios para el desarrollo.
* __key(string='m')__, clase de la ventana de conversación, un identificador en los css styles. En caso de ser cambiado usted tendría que editar el css con ese nombre que le ha asignado.
* __zIndex(int=100)__, posicionamiento ```z``` del contenedor principal.

```javascript
const jmaple = new JMaple({
    el:'element',
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

## NPC
Los npc representan un personaje:
* __id__, identificador.
* __name__.
* __img__, ruta de la imagen.

```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: 'src/img/npc/9010000.png'
    },
    script : function(){
        this.start = function(){
            this.cm.sendOk('This is my first conversation')
            this.cm.dispose()
        }
    }
}).show()
```

## Conversation
Los script NPC están programado dentro de dos funciones principales:
* __start__, es el inicio del npc, la primera muestra.
    ```javascript
    this.start = function(){
        //code
    }
    ```
* __action__, es la siguiente acción que se mostrara, aquí será donde se programara todas las acciones del npc. Contiene tres parámetros:
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
        img: 'src/img/npc/9010000.png'
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

```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: 'src/img/npc/9010000.png'
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
    ```type = 0```

    | Button    | mode |
    | --------- | ---- |
    | end chat  | -1   |
    | next / ok | 1    |
* __sendNextPrev__
    ```type = 0```

    | Button   | mode |
    | -------- | ---- |
    | end chat | -1   |
    | next     | 1    |
    | back     | 0    |
* __sendYesNo__
    ```type = 1```

    | Button   | mode |
    | -------- | ---- |
    | end chat | -1   |
    | yes      | 1    |
    | no       | 0    |
* __sendSimple__
    ```type = 4```

    | Button   | mode |
    | -------- | ---- |
    | end chat | 0    |
    | select   | 1    |
* __sendAcceptDecline__
    ```type = 12```

    | Button   | mode |
    | -------- | ---- |
    | end chat | -1   |
    | accept   | 1    |
    | decline  | 0    |
* __sendTest__
    ```type = -1```

    | Button                   | mode |
    | ------------------------ | ---- |
    | end chat                 | -1   |
    | ok / accept / yes / next | 1    |
    | no / back                | 0    |

El parametro __selection__ devolverá un valor ```0``` por defecto. Solo puede devolver otro valor cuando exista en el cuadro de dialogo una lista de selección, el valor dependerá de que item de la lista hayas selecionado. El valor tambien dependerá del valor que le hayas asignado al item.
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

```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: 'src/img/npc/9010000.png'
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
            this.cm.warp(456789)//the id of the registered map
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
Text Color
----------
Para dar color a los textos existen estas etiquetas:

| code | Description  |
| ---- | ------------ |
| #b   | Blue text.   |
| #d   | Purple text. |
| #e   | Bold text.   |
| #g   | Green text.  |
| #k   | Black text.  |
| #r   | Red text.    |

```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: 'src/img/npc/9010000.png'
    },
    script : function(){
        this.start = function(){
            this.cm.sendOk('This is #rRed Text# and this is #ePurple#')
            this.cm.dispose()
        }
    }
}).show()
```
List
----
Para crear una lista se requieren ciertas etiquetas.

| code     | Description |
| -------- | ----------- |
| #L[int]# | Open Item   |
| #l       | Close Item  |

```javascript
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: 'src/img/npc/9010000.png'
    },
    script : function(){
        this.start = function(){
            this.cm.sendOk('This is a List: #L1# item 1 #l #L2# item 2 #l #L3# item 3 #l')
            this.cm.dispose()
        }
    }
}).show()
```
El número asignado podrá ser el valor para el parámetro __selection__, eso dependerá a que item selecciones en el cuadro de diálogo. Es recomendable que le des un espacio entre la etiqueta y el texto.

JCharacter
==========
JCharacter es una extensión que amplia la lista de comandos(cm). JCharacter solo se penso para el desarrollo de NPC para dicho juego, muchos de ellos solo muestran un mensaje por consola. Tal vez mas adelante se piense darle funcionalidades para la web.
#### Import
```html
<script src="js/jcharacter.js"></script>
<script src="js/jmaple.js"></script>
```

#### Example:
```javascript
const character = new JCharacter({
    nick : 'myNameUser',
    gender : 0  //male(0), female(1)
})
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: 'src/img/npc/9010000.png'
    },
    script : function(){
        //code
    }

}, character).show()//added character to jmaple.
```
### Commands: Character
| cm | Description |
| -- | ----------- |
| openShop(shopid) | Show a message by console. In the game, opens a shop window. |
| haveItem(itemid) | Returns a boolean if the user/player has the item. |
| gainItem(itemid, ammount) | Gives the player an item/takes an item from a player. |
| changeJob(jobid) | Changes the job of the player. |
| getJob() | Returns the jobid of the user/player. |
| startQuest(questid) | Starts a quest (Developing). |
| completeQuest(questid) | Finishes a quest (Developing). |
| forfeitQuest(questid) | Forfeits a quest (Developing). |
| getMeso() | returns the number of mesos(money) it has. |
| gainMeso(int) | Gives a player mesos/takes mesos from a player. |
| gainExp(int) | Gives the user/player exp/takes exp of user/player. |
| getLevel() | level User/Player. |
| teachSkill(skillid, skilllevel, maxskilllevel) | not enabled. |
| get(string) | Returns the number of spicified stat(STR, DEX, INT, LUK, HP, MP). |
| modifyNX(int) | Gives/Takes the player nx/cash. |

### Properties:
* __nick(String)__, name User.
* __gender(int)__, male(0), female(1).
* __job(int=0)__, id job.
* __gm(bool=false)__, if gm.
* __meso(int=0)__, money.
* __nx(int=0)__, cash.
* __sp(int=0)__, stat point.
* __ap(int=0)__, skill point.
* __stat(Stat)__, stat.

```javascript
const character = new JCharacter({
    nick : 'myNameUser',
    gender : 0,
    job : 110,//fighter
    lv : 20,
    exp : 500,
    mesos : 95065012354//^^
})
```
### List Job: Beginner
| Job | id | level(old version) | level(current version) |
| --- | -- | ------------------ | ---------------------- |
| Beginner | 0 | 1 | 1 |

### List Job: Warrior
| Job | id | level(old version) | level(current version) |
| --- | -- | ------------------ | ---------------------- |
| Warrior | 100 | 10 | 10 |
| Fighter | 110 | 30 | 30 |
| Cruzader | 111 | 70 | 60 |
| Hero | 112 | 120 | 100 |
| Page | 120 | 30 | 30 |
| White Knight | 121 | 70 | 60 |
| Paladin | 122 | 120 | 100 |
| Spearman | 130 | 30 | 30 |
| Dragon Knight | 131 | 70 | 60 |
| Dark Knight | 132 | 120 | 100 |
| Dawn Warrior(1/2/3/4) | 1000/1010/1021/1022 | 10/30/70/120 | 10/30/60/100 |
| Aran(1/2/3/4) | 2100/2110/2111/2112 | 10/30/70/120 | 10/30/60/100 |

### List Job: Magician
| Job | id | level(old version) | level(current version) |
| --- | -- | ------------------ | ---------------------- |
| Magician | 200 | 8 | 10 |
| FP Wizard | 210 | 30 | 30 |
| FP Mage | 211 | 70 | 60 |
| FP Archmage | 212 | 120 | 100 |
| IL Wizard | 220 | 30 | 30 |
| IL Mage | 221 | 70 | 60 |
| IL Archmage | 222 | 120 | 100 |
| Cleric | 230 | 30 | 30 |
| Priest | 231 | 70 | 100 |
| Bishop | 232 | 120 | 100 |
| Blaze Wizard(1/2/3/4) | 1100/1110/1121/1122 | 10/30/70/120 | 10/30/60/100 |

### List Job: Bownman
| Job | id | level(old version) | level(current version) |
| --- | -- | ------------------ | ---------------------- |
| Bownman | 300 | 10 | 10 |
| Hunter | 310 | 30 | 30 |
| Ranger | 311 | 70 | 60 |
| Bow Master | 312 | 120 | 100 |
| Cross Master | 320 | 30 | 30 |
| Sniper | 321 | 70 | 60 |
| Crossbow Master | 322 | 120 | 100 |
| Wind Archer(1/2/3/4) | 1200/1210/1221/1222 | 10/30/70/120 | 10/30/60/100 |

### List Job: Tief
| Job | id | level(old version) | level(current version) |
| --- | -- | ------------------ | ---------------------- |
| Tief | 400 | 10 | 10 |
| Assassin | 410 | 30 | 30 |
| Hermit | 411 | 70 | 60 |
| Night Lord | 412 | 120 | 100 |
| Bandit | 420 | 30 | 30 |
| Chief Bandit | 421 | 70 | 60 |
| Shadower | 422 | 120 | 100 |
| Night Walker(1/2/3/4) | 1300/1310/1321/1322 | 10/30/70/120 | 10/30/60/100 |

### List Job: Pirate
| Job | id | level(old version) | level(current version) |
| --- | -- | ------------------ | ---------------------- |
| Pirate | 500 | 10 | 10 |
| Brawler | 510 | 30 | 30 |
| Marauder | 511 | 70 | 60 |
| Buccaneer | 512 | 120 | 100 |
| Gunslinger | 520 | 30 | 30 |
| Outlaw | 521 | 70 | 60 |
| Corsair | 522 | 120 | 100 |
| Thunder Breaker(1/2/3/4) | 1400/1410/1421/1422 | 10/30/70/120 | 10/30/60/100 |

Stat
----
Al crear un character se le asigna por defecto un __Stat__, str, dex, int, luk con valor 4, y hp, mp con valor 50. Podemos asignarle unos valores de manera personalizada.

```javascript
const character = new JCharacter({
    nick : 'myNameUser',
    gender : 0,
    stat : new Stat({str:30,dex:24, hp: 1235, mp:110})
})
```
### Properties: 
* __str(int=4)__.
* __dex(int=4)__.
* __int(int=4)__.
* __luk(int=4)__.
* __hp(int=50)__, life.
* __mp(int=50)__, manna.
* __lv(int=1)__, level.
* __exp(int=0)__, experiencie.

Item
----
Para asignar un item a un character debemos instanciar de la class Item.

```javascript
const character = new JCharacter({
    nick : 'myNameUser',
    gender : 0,
}, new Item({
    type : 'use',
    id : 1234,//I dont remember him id of this item.
    name : 'potion blue',
    img : 'potion.png'
}))
```
### Properties: 
* __type(string)__, tipo de item:
    * __equip__.
    * __use__.
    * __setup__.
    * __etc__.
* __id(int)__, identificador del item.
* __name(string)__, nombre del item(jeje).
* __img(string)__, nombre de la imagen del item.
* __trade(bool=true)__, si es tradeable(trueque).
* __cash(int=0)__.

Para asignar un item por medio de una Conversation Window se necesita registrar a la lista de items.

```javascript
//adding a item
Item.add(new Item({
    type : 'equip',
    id : 961,
    name : 'item1',
    img : 'item1.png'
}))
```
```javascript
//adding many items
Item.addList([
    new Item({
        type : 'use',
        id : 4556,
        name : 'item2',
        img : 'item2.png'
    }),
    new Item({
        type : 'etc',
        id : 156,
        name : 'item3',
        img : 'item3.png'
    })
])
```
```javascript
//creating my character
const character = new JCharacter({
    nick : 'myNameUser',
    gender : 0
})
//Convesation Window
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: 'src/img/npc/9010000.png'
    },
    script : function(){
        this.start = () => {
            this.cm.gainItem(4556, 2)//idItem, quantity
            this.cm.sendOk('Take two items...')
        }
        this.action = () => {
            this.cm.sendOk('Ready! ^_^')
            this.cm.dispose()
        }
    }

}, character).show()
```
En caso de que el item no exista en la lista le retornará por consola un error.

Si desea agregar un item al character que no sea por el medio ya visto, use la funcion ```setItem()```.

```javascript
//we will add the item of the List already created in the previous example.
character.setItem(961, 5)//idItem, quantity
```
Recuerde que debe agregar el item antes de instanciar ```JMaple()```.
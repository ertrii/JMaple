JMaple(Alpha)
=======================
version: 0.11.0

A library to create conversation windows in the maplestory style using the classic or current design among others.

![Image Demo](http://img.fenixzone.net/i/2W6b9CG.png)

## Table of contents
- [Starting](#starting)
- [NPC](#npc)
- [Commands](#commands)
- [Text Color](#text-color)
- [List](#list)
- [Character](#character)
- [Stat](#stat)
- [Item](#item)
- [Quest](#quest)


Starting
=============
```
# npm
npm install jmaple
```

#### Style
```html
<link rel="stylesheet" href="node_modules/jmaple/dist/css/flat.css">
```

#### jmaple.js
```html
<script src="node_modules/jmaple/dist/js/jmaple.js"></script>
```
## Config
* __dev__; bool, modo desarrollador. Default ```false```

```javascript
const jmaple = new JMaple()
jmaple.config.dev = true
new jmaple.Task('element').start()//will show you a welcome window
```
Task será donde se estructurará y mostrará la ventana de conversación.

### There are many styles of conversation window
* classic.css
* flat.css
* modern.css
## Preference
Existen algunas propiedades que usted puede editar a su gusto, yo en mi caso lo dejaré por defecto:
* __displace(bool=true)__, desplazamiento de la ventana.
* __writing(bool=true)__, animación de escritura.
* __transition(string)__, tipo de transición de una ventana a otra:
    * __ease__, una transición suave.
    * __gross__, una transición de golpe.
    * __step__, no hay transición.
* __key(string='m')__, clase de la ventana de conversación, un identificador en los css styles. En caso de ser cambiado usted tendría que editar el css con ese nombre que le ha asignado.
* __zIndex(int=100)__, posicionamiento ```z``` del contenedor principal.

```javascript
const jmaple = new JMaple()
const task = new jmaple.Task('element')
task.script = function(){
    this.start = function(){
        this.cm.sendOk('This is my first conversation')
        this.cm.dispose()
    }
}
task.preference.displace = false
task.preference.transition = 'gross'
task.start()
```

NPC
===============

Los npc representan un personaje:
* __id(int)__, identificador.
* __name(string)__.
* __img(string)__, nombre de la imagen. Este puede ser omitido y tomará por defecto la ruta ```NPC.path``` y el id como nombre con formato png.

```javascript
const jmaple = new JMaple()
console.log(jmaple.NPC.path)//'dist/src/img/'
jmaple.NPC.create(9010000,'Maple Administrator')
const task = new jmaple.Task(
    'element',
    9010000,//adding NPC id.
)
task.script = function(){
    this.start = function(){
        this.cm.sendOk('This is my first conversation')
        this.cm.dispose()
    }
}
task.start()
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
const jmaple = new JMaple()
jmaple.NPC.create(9010000, 'Maple Administrator')
const task = new jmaple.Task('element', 9010000)
task.script = function(){
    this.start = function(){
        this.cm.sendOk('This is the first conversation')
    }
    this.action = function(mode, type, selection){
        this.cm.sendOk('This is the second conversation')
        this.cm.dispose()
    }
}
task.start()
```
Commands
===========

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
| sendGetNumber(string, valueDefault, min, max) | Shows a conversation window with ok button and a input text. |
| sendTest(string) | Shows a conversation window with a input and all buttons. This is cm does not exist in MapleStory, it was created for the development in the design |
###### Credits: Description by Shawn in Ragezone Forum, [here](http://forum.ragezone.com/f428/add-learning-npcs-start-finish-643364/)

```javascript
const jmaple = new JMaple()
jmaple.NPC.create(9010000, 'Maple Administrator')
const task = new jmaple.Task('element', 9010000)
task.script : function(){
    this.start = function(){
        this.cm.sendNext('This is a conversation window with an Next button')
    }
    this.action = function(){
        this.cm.sendYesNo('This is a conversation window with an Yes and No button')
        this.cm.dispose()
    }
}
task.start()
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
* __sendGetNumber__
    ```type = 3```

    | Button   | mode |
    | -------- | ---- |
    | end chat | -1   |
    | ok       | 1    |
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
* __portal__, es un valor numerico(int) que identifica un portal, una posición de la ventana de conversación, esto es opcional.

Antes de usar ```warp``` debemos crear el mapa(map) en la lista. Si deseamos podemos crear portales. Los portales requerirán de dos parametros, ```id``` , identificador y  ```coord``` , coordenadas. Las cordenadas X y Y serán string separados por un punto y coma. Los valores se los tomará como porcentajes.

```javascript
const jmaple = new JMaple()
//creating portal
jmaple.Portal.create(12, '21.5;26')//id, coord
//creating map
jmaple.Maps.create({
    id : 123456,
    name : 'my map',
    link : 'index.html#' //can be any link
})
jmaple.Maps.create({
    id : 456789,
    name : 'Github',
    link : 'https://github.com/ertrii/JMaple'
})
jmaple.NPC.create( 9010000, 'Maple Administrator', 'src/img/npc/9010000.png')
const task = new jmaple.Task('element', 9010000)
task.script = function(){
    this.start = function(){
        this.cm.sendOk('This is a test.')
    }
    this.action = function(){
        this.cm.warp(456789, 12)//id map, id portal. Remember portal is optional
        this.cm.sendOk('warp...')
        this.cm.dispose()
    }
}
task.start()
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
| #n   | Normal text (removes bold) |

```javascript
const jmaple = new JMaple()
jmaple.NPC.create(9010000, 'Maple Administrator')
const task = new jmaple.Task('element', 9010000)
task.script = function(){
    this.start = function(){
        this.cm.sendOk('This is #rRed Text# and this is #ePurple#')
        this.cm.dispose()
    }
}
task.start()
```

Existen algunos codes que requieren de un valor entero(id):

| code | Description  |
| ---- | ------------ |
| #m[mapid]# | Shows the name of the map. |
| #p[npcid]# | Shows the name of the NPC. |
| #t[npcid]# / #z[npcid]# | Shows the name of the Item. |
| #h # | Shows the name of the Character. Don't forget that space. |
| #v[itemid]# / #i[itemid]# | Shows the image of the Item. |
| #c[itemid]# | Shows how many [itemid] the player has in their inventory. |

Recuerde, esto mostrará siempre y cuando existan en la lista de su respectiva clase.

List
----
Para crear una lista se requieren ciertas etiquetas.

| code     | Description |
| -------- | ----------- |
| #L[int]# | Open Item. You can close with this for the next item. |
| #l       | Close Item. |

Todos forman parte de un párrafo, si desea crear uno nuevo use la etiqueta ```#w```. In Maplestory is ```\n```.

```javascript
const jmaple = new JMaple()
jmaple.NPC.create( 9010000, 'Maple Administrator')
const task = new jmaple.Task('element', 9010000)
task.script : function(){
    this.start = function(){
        this.cm.sendOk('This is a List: #L1#item 1#l#L2#item2#l#L3#item3#l')
        this.cm.dispose()
    }
}
task.start()
```
El número asignado podrá ser el valor para el parámetro __selection__, eso dependerá a que item selecciones en el cuadro de diálogo. 

Character
==========
Character es una extensión que amplia la lista de comandos(cm). Character solo se penso para el desarrollo de NPC para dicho juego.

#### Example:
```javascript
const jmaple = new JMaple()
jmaple.NPC.create( 9010000, 'Maple Administrator')
const character = new jmaple.character('Erick')//nick
new jmaple.Task(
    'element',
    9010000,//npc
    character,//adding...    

).start()

```

Estos son los comandos que le pertenece y se usarán en el __script__.

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
| get(stat) | Returns the number of spicified stat(STR, DEX, INT, LUK, HP, MP). |
| modifyNX(int) | Gives/Takes the player nx/cash. |

### Properties:
* __nick(string)__, name User.
* __gender(int)__, male(0), female(1).
* __job(int)__, id job.
* __gm(bool)__, if gm.
* __meso(int)__, money.
* __nx(int)__, cash.
* __sp(int)__, stat point.
* __ap(int)__, skill point.
* __stat(Stat)__, stat.
* __item(int)__, item identifier(iditem)
* __items(Array(int))__, Array item identifier.
    * __id(int)__, identifier.
    * __quantity(int)__.

```javascript
//...
character.job = 110,//fighter
character.lv = 20,
character.exp = 500,
character.mesos = 95065012354//^^
//...
```

Stat
----
Character se le asigna por defecto un __Stat__. Podemos asignarle unos valores de manera personalizada.

```javascript
//...
character.stat = new jmaple.Stat({
    str : 30,
    dex : 24,
    hp  : 1235
})
//...
```
### Properties: 
* __str(int)__.
* __dex(int)__.
* __int(int)__.
* __luk(int)__.
* __hp(int)__, life.
* __mp(int)__, manna.
* __lv(int)__, level.
* __exp(int)__, experiencie.
* __def(int)__, defense.
* __att(int)__, attack.
* __attM(int)__, attack magic.
* __fame(int)__, fame.

Item
----
Para crear un Item debemos conocer los tipos que existen. Antes de eso verficaremos el directorio donde se ubicará la imagen de tu item. 

```javascript
console.log(jmaple.Item.path)//'src/img/item/'
```

```javascript
//creating and adding..
jmaple.Item.equip.create(123, 'un arma', 'un_arma.png')
jmaple.Item.use.create(540, 'potion blue')
```

### Type Items:
Existen varias clases de item dependiendo de lo que deseas crear:
* __equip__, armas, accesorios, capas, etc.
* __use__, elementos que su uso altera o mejora al Character.
* __setup__, chair, elementos que no quepan en las demas clases.
* __etc__, son elementos simples.

Estas clases necesitan como parametros:
* __id(int)__, identificador del item.
* __name(string)__, nombre del item.
* __icon(string)__, nombre de la imagen del item. Este puede ser omitida si tu imagen lleva como nombre igual al id con formato .png.

Ahora asignaremos un Item a un Character por medio de una Conversation Window:

```javascript
//adding items
jmaple.Item.equip.create(961, 'Eclipse')
jmaple.Item.use.create(4556, 'Potion Blue', 'My_image_with_other_name.png')
jmaple.Item.etc.create(156, 'leaf')
```
```javascript
const jmaple = new JMaple()
//creating npc
jmaple.NPC.create( 9010000, 'Maple Administrator')
//creating char
const character = new jmaple.Character('Erick')
//Convesation Window
const task = new jmaple.Task('element',9010000, character)
task.script : function(){
    this.start = () => {
        this.cm.gainItem(4556, 2)//idItem, quantity
        this.cm.sendOk('Take two items...')
    }
    this.action = () => {
        this.cm.sendOk('Ready! ^_^')
        this.cm.dispose()
    }
}
task.start()

```

En caso de que el item no exista en la lista le retornará por consola un error.

Si desea agregar un item al character que no sea por el medio ya visto, use la funcion ```setItem()``` o ```setItems()```.

```javascript
//we will add the item of the List already created in the previous example.
character.setItem(961, 5)//idItem, quantity
character.setItems([
    {id : 4556, quantity: 5},
    {id : 156, quantity: 2}
])
```
En caso de que el character ya tenga agregado aquel item entonces simplemente se le sumara la cantidad.

Si deseamos eliminar el item del Character usaremos la function ```removeItem()```.
```javascript
character.removeItem(961)//idItem. 
```
O si solo queremos reducir la cantidad pues le asignaremos otro parametro que sería la cantidad.
```javascript
character.removeItem(4556, 2)//idItem. 
```
Atento, si la cantidad es mayor o igual a la cantidad que contiene el Character de dicho item entonces se le removera definitivamente.


Quest
=======
Antes de iniciar un quest es necesario crear para que esto se registre. Todo nuevo quest requieren como parametro, id, name, min(minutos). Los minutos pueden ser nulos pues su función es simplemente dar una fecha de vencimiento desde que se inicie la Quest.

```javascript
const jmaple = new JMaple()
jmaple.Quest.create(1234, 'My firts Quest', 10)
```

```javascript
//Convesation Window
new jmaple.Task(
    'element',
    null, //if you do not need a NPC
    new jmaple.Character('Erick'),//requerid    
)
task.script : function(){
    this.start = () => {
        this.cm.startQuest(1234)//starting quest
        this.cm.sendOk('Start Quest...')
        //look at the top the cm for quest
    }
}
task.start()
```

Quest tiene una función llamada ```timer()``` en la cual le devolvera el tiempo concurrido en cada segundos; en caso de que un quest creado no tenga un tiempo de caducidad entonces la función le devolverá ```0```.


```javascript
jmaple.Quest.timer(1234, function(sec){
    console.log(sec)//...,56, 55, 54, 53,...
})
```
Recuerde, una quest con vencimiento debe ser cumplida antes de que el tiempo termine sino tendrá que volver a inicar la quest.
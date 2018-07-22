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

## Dialog
Los script NPC están programado dentro de dos funciones principales:
* __start__, es el inicio del npc al mostrase a la primera.
* __action__, será la siguiente acción que se mostrara, aquí será donde se programara todas las acciones del npc.
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
        this.action = function(){
            this.cm.sendOk('This is the second conversation')
            this.cm.dispose()
        }
    }
}).show()
```
## Commands
Los commands(cm) son funciones que se ejecutarán dentro de las funciones principales, start y action:
### List
| cm | Description |
| -- | ----------- |
| sendOk | Shows a conversation window with an 'Ok' button |
| sendNext | Shows a conversation window with a 'Next' button |
| sendPrev | Shows a conversation window with a 'Prev' (previous) button |
| sendNextPrev | Shows a conversation window with a 'Next' and 'Prev' button (see above) |
| sendYesNo | Shows a conversation window with a 'Yes' and 'No' button |
| sendAcceptDecline | Shows a conversation window with an 'Accept' and 'Decline' button |
| sendSimple | Shows a conversation window with no buttons |
| sendTest | Shows a conversation window with all button. This is cm does not exist in MapleStory, it was created for the development in the design |
| warp | Warps to a section page or other page |
###### Credits: Description by Shawn in Ragezone Forum, [here](http://forum.ragezone.com/f428/add-learning-npcs-start-finish-643364/)

__Example__:
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
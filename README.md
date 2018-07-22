JMaple(Alpha)
=======================

Una librería para crear ventanas de mensaje al estilo maplestory usando el diseño clásico o actual entre otros. Programa tu npc usando una sintaxis cercana al script de los npc del juego.

# Starting
### Include in your HTML file
#### Style
```sh
<link rel="stylesheet" href="css/m--future.css">
```

#### jmaple.js
```sh
<script src="js/jmaple.js"></script>
```
```sh
new JMaple({
    el:'element',
    npc: {
        id: 9010000,
        name: 'Maple Administrator',
        img: '9010000.png'
    },
    script : function(){ //you can use arrow function
        this.action = function(){
            this.cm.sendOk('This is my first message')
            this.cm.dispose()
        }
    }
}).show()
```

#### Date: 04/25/2018
